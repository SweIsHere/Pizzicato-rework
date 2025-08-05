import boto3
import os
from boto3.dynamodb.conditions import Key


def lambda_handler(event, context):
    print(event)
    tenant_id = event['body'].get('tenant_id')

    if not tenant_id:
        return {
            'statusCode': 400,
            'message': 'Missing tenant_id.'
        }
    
    # verificar token

    table_name = os.environ['TABLE_NAME']
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(table_name)

    try: 
        response = table.query(
            KeyConditionExpression = Key('tenant_id').eq(tenant_id)
        )
        items = response['Items']
        count = response['Count']

        return {
            'statusCode': 200,
            'body': {
                'count': count,
                'items': items
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'message': 'Error agregando favorito. ' + str(e)
        }
    
