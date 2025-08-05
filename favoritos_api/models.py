from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Favorite(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(50), nullable=False)
    track_id = db.Column(db.String(50), nullable=False)
    track_name = db.Column(db.String(100), nullable=False)
    artist_name = db.Column(db.String(100), nullable=False)
    added_at = db.Column(db.DateTime, default=db.func.now())
