from core import create_app
import json


def test_config():
    from config import TestConfig
    assert create_app(TestConfig).testing


def test_index_route(client):
    response = client.get('/')
    assert response.status_code == 200


def test_index_route_response_empty_data(client):
    response = client.get('/')
    data = json.loads(response.text)
    # check that the data recieved is empty as mongo fixture is not used
    assert len(data) == 0


def test_index_route_response_data(client, mongo):
    response = client.get('/')
    data = json.loads(response.text)
    # check there are 100 records in the response
    assert len(data) == 100


def test_stats_route(client):
    response = client.get('/stats')
    assert response.status_code == 200


def test_stats_route_respnse_empty_data(client):
    response = client.get('/stats')
    data = json.loads(response.text)
    # check that the `stats` data recieved is empty as mongo fixture is not used
    assert len(data['stats']) == 0


def test_stats_route_response_data(client, mongo):
    response = client.get('/stats')
    data = json.loads(response.text)
    # check that the `stats` data recieved is not empty
    assert len(data['stats']) > 0


def test_stats_with_user_route(client):
    response = client.get('/stats/user1')
    assert response.status_code == 200


def test_stats_with_user_route_respnse_empty_data(client):
    response = client.get('/stats/user1')
    data = json.loads(response.text)
    # check that the `stats` data recieved is empty as mongo fixture is not used
    assert len(data['stats']) == 0


def test_stats_with_user_route_respnse_data(client, mongo):
    for i in range(1, 10):
        response = client.get(f'/stats/user{i}')
        data = json.loads(response.text)
        # check that the `stats` data recieved has one record per user
        assert len(data['stats']) == 1


def test_graphql_get_request(client):
    response = client.get('/stats/graphql')
    assert response.status_code == 200


def test_graphql_post_request_get_usernames(client, mongo):
    response = client.post(
        '/stats/graphql',
        json={"query": "query{stats{username}}"}
    )
    data = json.loads(response.data)
    assert len(data) == 1
    assert len(data['stats']) == 9
    assert response.status_code == 200


def test_graphql_post_request_get_exercises(client, mongo):
    response = client.post(
        '/stats/graphql',
        json={"query": "query{stats{ exercises {exerciseType totalDuration} }}"}
    )
    data = json.loads(response.data)
    assert len(data) == 1
    # testing there are exercises data
    assert len(data['stats'][0]['exercises']) >= 1
    assert response.status_code == 200


def test_graphql_post_request_get_filtered_exercises(client, mongo):
    for i in range(1, 10):
        response = client.post(
            '/stats/graphql',
            json={"query": "query{stats: statsByUsername(username:" +
                  f"\"user{i}\""+"){ exercises {exerciseType } }}"}
        )
        data = json.loads(response.data)
        assert len(data) == 1
        # testing there are exercises data
        assert len(data['stats'][0]['exercises']) >= 1
        assert response.status_code == 200
