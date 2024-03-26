def stats_query():
    return [
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


def stats_by_username_query(username):
    return [
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
