from bson import json_util
from ariadne import gql, make_executable_schema, QueryType
from flask import jsonify
from core.models import stats_aggregate_by_exercise_type


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
    return stats_aggregate_by_exercise_type()


schema = make_executable_schema(type_defs, query)
