from flask import current_app as app
from core.gql_schema import schema
from core.models import mongo
from flask import Blueprint, jsonify, request
from bson import json_util
import traceback
import logging
from datetime import datetime, timedelta

from ariadne.explorer import ExplorerGraphiQL
from ariadne import graphql_sync

stats_page = Blueprint('stats_page', __name__)

@stats_page.route('/')
def index():
    exercises = mongo.db.exercises.find()
    exercises_list = list(exercises)
    return json_util.dumps(exercises_list)

@stats_page.route('/stats')
def stats():
    pipeline = [
        {
            "$group": {
                "_id": {
                    "username": "$username",
                    "exerciseType": "$exerciseType"
                },
                "totalDuration": {"$sum": "$duration"},
                "totalDistance": {"$sum": "$distance"},
                "averagePace": {"$avg": "$pace"},
                "averageSpeed": {"$avg": "$speed"},
                "topSpeed": {"$max": "$speed"}
            }
        },
        {
            "$group": {
                "_id": "$_id.username",
                "exercises": {
                    "$push": {
                        "exerciseType": "$_id.exerciseType",
                        "totalDuration": "$totalDuration",
                        "totalDistance": "$totalDistance",
                        "averagePace": "$averagePace",
                        "averageSpeed": "$averageSpeed",
                        "topSpeed": "$topSpeed"
                    }
                }
            }
        },
        {
            "$project": {
                "username": "$_id",
                "exercises": 1,
                "_id": 0
            }
        }
    ]

    stats = list(mongo.db.exercises.aggregate(pipeline))
    return jsonify(stats=stats)

@stats_page.route('/stats/<username>', methods=['GET'])
def user_stats(username):
    pipeline = [
        {
            "$match": {"username": username}
        },
        {
            "$group": {
                "_id": {
                    "username": "$username",
                    "exerciseType": "$exerciseType"
                },
                "totalDuration": {"$sum": "$duration"},
                "totalDistance": {"$sum": "$distance"},
                "averagePace": {"$avg": "$pace"},
                "averageSpeed": {"$avg": "$speed"},
                "topSpeed": {"$max": "$speed"}
            }
        },
        {
            "$group": {
                "_id": "$_id.username",
                "exercises": {
                    "$push": {
                        "exerciseType": "$_id.exerciseType",
                        "totalDuration": "$totalDuration",
                        "totalDistance": "$totalDistance",
                        "averagePace": "$averagePace",
                        "averageSpeed": "$averageSpeed",
                        "topSpeed": "$topSpeed"
                    }
                }
            }
        },
        {
            "$project": {
                "username": "$_id",
                "exercises": 1,
                "_id": 0
            }
        }
    ]

    stats = list(mongo.db.exercises.aggregate(pipeline))
    return jsonify(stats=stats)

@stats_page.route('/stats/weekly/', methods=['GET'])
def weekly_user_stats():
    username = request.args.get('user')
    start_date_str = request.args.get('start')
    end_date_str = request.args.get('end')

    date_format = "%Y-%m-%d"
    try:
        start_date = datetime.strptime(start_date_str, date_format)
        # Include the whole end day
        end_date = datetime.strptime(
            end_date_str, date_format) + timedelta(days=1)

        logging.info(
            f"Fetching weekly stats for user: {username} from {start_date} to {end_date}")
    except Exception as e:
        logging.error(f"Error parsing dates: {e}")
        return jsonify(error="Invalid date format"), 400

    pipeline = [
        {
            "$match": {
                "username": username,
                "date": {
                    "$gte": start_date,
                    "$lt": end_date
                }
            }
        },
        {
            "$group": {
                "_id": {
                    "exerciseType": "$exerciseType"
                },
                "totalDuration": {"$sum": "$duration"},
                "totalDistance": {"$sum": "$distance"},
                "averagePace": {"$avg": "$pace"},
                "averageSpeed": {"$avg": "$speed"},
                "topSpeed": {"$max": "$speed"}
            }
        },
        {
            "$project": {
                "exerciseType": "$_id.exerciseType",
                "totalDuration": 1,
                "totalDistance": 1,
                "averagePace": 1,
                "averageSpeed": 1,
                "topSpeed": 1,
                "_id": 0
            }
        }
    ]

    try:
        stats = list(mongo.db.exercises.aggregate(pipeline))
        return jsonify(stats=stats)
    except Exception as e:
        app.logger.error(
            f"An error occurred while querying MongoDB: {e}")
        traceback.print_exc()
        return jsonify(error="An internal error occurred"), 500

explorer_html = ExplorerGraphiQL().html(None)

@stats_page.route('/stats/graphql', methods=["GET"])
def graphql_explorer():
    return explorer_html, 200

@stats_page.route("/stats/graphql", methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema, data, context_value={"request": request}, debug=app.debug
    )
    status_code = 200 if success else 400
    return jsonify(result), status_code