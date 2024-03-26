from ariadne import gql, make_executable_schema, QueryType
from core.models import mongo
from core.query import stats_query, stats_by_username_query


type_defs = gql("""
    type Query {
        stats: [Stats]
        statsByUsername(username: String): [Stats]
    }

    type Stats {
        username: String!
        exercises: [Exercise!]      
    }

    type Exercise {
        exerciseType: ExerciseType!
        totalDuration: Int!
        totalDistance: Int
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
    pipeline = stats_query()

    stats = list(mongo.db.exercises.aggregate(pipeline))
    return stats


@query.field("statsByUsername")
def stats_by_username_resolver(*_, username=None):
    pipeline = stats_by_username_query(username)

    stats = list(mongo.db.exercises.aggregate(pipeline))
    return stats

schema = make_executable_schema(type_defs, query)
