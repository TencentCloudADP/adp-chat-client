import pytest
from app_factory import create_app

@pytest.fixture
def app():
    app = create_app()
    return app
