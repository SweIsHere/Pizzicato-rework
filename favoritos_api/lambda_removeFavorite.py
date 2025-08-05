import boto3
import os

def lambda_handler(event, context):
    tenant_id = event['body'].get('tenant_id')
    song_uuid = event['body'].get('song_uuid')
    table_name = os.environ['TABLE_NAME']
    
    print(song_uuid)
    print(tenant_id)

    if not (tenant_id and song_uuid):
        return {
            'statusCode': 400,
            'message': 'Rellena todos los campos: tenant_id y song_uuid.'
        }
    
    # verificar token

    dynamodb = boto3.resource("dynamodb")
    table = dynamodb.Table(table_name)

    try:

        # buscar si existe el item
        response = table.query(
            KeyConditionExpression='tenant_id = :tenant_id',
            FilterExpression='song_uuid = :song_uuid',
            ExpressionAttributeValues={
                ':tenant_id': tenant_id,
                ':song_uuid': song_uuid
            }
        )

        items = response.get('Items', [])
        if len(items) == 0:
            return {
                'statusCode': 404,
                'message': 'No se encontró la canción dentro de los favoritos.'
            }

        # eliminar de tabla si pasó el filtro
        item_to_delete = items[0]
        date_added = item_to_delete['date_added']
        print(date_added)

        response = table.delete_item(
            Key={
                "tenant_id": tenant_id,
                "date_added": date_added
            }
        ) 
        
        return {
            'statusCode': 200,
            'message': 'Favorito eliminado exitosamente.'
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'message': 'Error eliminando favorito. ' + str(e)
        }
    
