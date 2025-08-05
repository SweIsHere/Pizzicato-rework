from flask import Blueprint, request, jsonify
from app.models import db, Favorite

bp = Blueprint('favorites', __name__, url_prefix='/favorites')

@bp.route('/', methods=['GET'])
def get_favorites():
    user_id = request.args.get('user_id')
    favorites = Favorite.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': fav.id,
        'track_id': fav.track_id,
        'track_name': fav.track_name,
        'artist_name': fav.artist_name,
        'added_at': fav.added_at
    } for fav in favorites])

@bp.route('/', methods=['POST'])
def add_favorite():
    data = request.json
    favorite = Favorite(
        user_id=data['user_id'],
        track_id=data['track_id'],
        track_name=data['track_name'],
        artist_name=data['artist_name']
    )
    db.session.add(favorite)
    db.session.commit()
    return jsonify({'message': 'Favorite added successfully', 'id': favorite.id}), 201

@bp.route('/<int:id>', methods=['DELETE'])
def delete_favorite(id):
    favorite = Favorite.query.get_or_404(id)
    db.session.delete(favorite)
    db.session.commit()
    return jsonify({'message': 'Favorite deleted successfully'})
