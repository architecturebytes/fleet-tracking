import boto3

dynamodb = boto3.client('dynamodb')

def store_connection_id(connection_id):
    table_name = 'WebSocketConnections'  # Replace with your DynamoDB table name
    
    try:
        response = dynamodb.put_item(
            TableName=table_name,
            Item={
                'ConnectionId': {'S': connection_id}
            }
        )
        print("Connection ID stored:", connection_id)
    except Exception as e:
        print("Error storing connection ID:", str(e))

def lambda_handler(event, context):
    try:
        connection_id = event['requestContext']['connectionId']
        store_connection_id(connection_id)
        
        return {
            'statusCode': 200,
            'body': 'Connection ID stored successfully'
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Error storing connection ID: ' + str(e)
        }
