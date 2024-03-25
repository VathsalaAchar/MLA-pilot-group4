from ariadne import gql, make_executable_schema, QueryType
from core.models import mongo

type_defs = gql("""
    type Query {
        stats: [Stats]
    }

    type Stats {
        username: String!
        exercises: [Exercise!]      
    }

    type Exercise {
        exerciseType: ExerciseType!
        totalDuration: Int!
        totalDistance: Int!
        averagePace: Float
        averageSpeed: Float
        topSpeed: Float
    }

    enum ExerciseType {
        Running
        Cycling
        Swimming
        Gym
        Other
    }
""")

query = QueryType()

@query.field("stats")
def stats_resolver(*_):
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
    return stats

schema = make_executable_schema(type_defs, query)
