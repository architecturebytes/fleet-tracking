import boto3

dynamodb = boto3.client('dynamodb')

def delete_connection_id(connection_id):
    table_name = 'WebSocketConnections'  # Replace with your DynamoDB table name
    
    try:
        response = dynamodb.delete_item(
            TableName=table_name,
            Key={
                'ConnectionId': {'S': connection_id}
            }
        )
        print("Connection ID deleted:", connection_id)
    except Exception as e:
        print("Error deleting connection ID:", str(e))

def lambda_handler(event, context):
    try:
        connection_id = event['requestContext']['connectionId']
        delete_connection_id(connection_id)
        
        return {
            'statusCode': 200,
            'body': 'Connection ID deleted successfully'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Error deleting connection ID: ' + str(e)
        }
