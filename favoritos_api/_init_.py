from flask import Flask
from app.database import init_db
from app.routes import register_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    init_db(app)
    register_routes(app)

    return app
