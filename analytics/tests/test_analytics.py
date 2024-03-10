from core import create_app


def test_config():
    from config import TestConfig
    assert create_app(TestConfig).testing


def test_index_route(client):
    response = client.get('/')
    assert response.status_code == 200


