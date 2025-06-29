import pytest
from backend.app import app

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

def test_home(client):
    response = client.get('/patients')  # Only this route supports GET
    assert response.status_code == 200

def test_predict(client):
    response = client.post('/predict', json={
        "name": "Rani",
        "age": 25,
        "diastolic": 80,
        "bs": 0.9,
        "temp": 98.6,
        "pulse": 85
    })
    assert response.status_code == 200
    assert "risk" in response.get_json()
