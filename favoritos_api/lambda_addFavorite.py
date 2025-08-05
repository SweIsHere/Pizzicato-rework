import boto3
import os
import datetime

def lambda_handler(event, context):
    print(event)

    # verificar token

    table_name = os.environ['TABLE_NAME']
    item = event['body']
    tenant_id = item.get('tenant_id')
    song_uuid = item.get('song_uuid')
    date_added = str(datetime.datetime.now()) # YYYY-MM-DD HH:mm:SS

    if not tenant_id or not song_uuid:
        return {
            'statusCode': 400,
            'message': 'Rellena todos los campos: tenant_id y song_uuid.'
        }

    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    favorite = {
        'tenant_id': tenant_id,
        'date_added': date_added,
        'song_uuid': song_uuid
    }


    try:
        # ver si ya se agregó a favoritos
        response = table.query(
            KeyConditionExpression='tenant_id = :tenant_id',
            FilterExpression='song_uuid = :song_uuid',
            ExpressionAttributeValues={
                ':tenant_id': tenant_id,
                ':song_uuid': song_uuid
            }
        )

        if len(response.get('Items', [])) > 0:
            return {
                'statusCode': 409,
                'message': 'Ya se encontró la canción en favoritos'
            }
        
        # insertar en tabla si pasó el filtro
        response = table.put_item(Item = favorite) 
        return {
            'statusCode': 200,
            'response': response
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'message': 'Error agregando favorito.' + str(e)
        }
