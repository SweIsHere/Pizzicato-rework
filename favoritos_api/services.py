def validate_favorite_data(data):
    required_fields = ['user_id', 'track_id', 'track_name', 'artist_name']
    return all(field in data for field in required_fields)
