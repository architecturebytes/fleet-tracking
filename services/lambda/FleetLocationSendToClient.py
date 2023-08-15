import boto3
import json

dynamodb = boto3.client('dynamodb')
apigatewaymanagementapi = boto3.client('apigatewaymanagementapi', endpoint_url='<API_GATEWAY_ENDPOINT_URL>')
# The endpoint_url is of the form: https://<id>.execute-api.<region>.amazonaws.com/<stage>

def retrieve_all_connection_ids():
    
    print("retrieve_all_connection_ids() invoked")
    table_name = 'WebSocketConnections'  # Replace with your DynamoDB table name
    
    try:
        response = dynamodb.scan(
            TableName=table_name,
            ProjectionExpression='ConnectionId'
        )
        connection_ids = [item['ConnectionId']['S'] for item in response.get('Items', [])]
        print(connection_ids)
        return connection_ids
    except Exception as e:
        print("Error retrieving connection IDs:", str(e))
        return []

def send_message_to_websockets(connection_ids, message):
    for connection_id in connection_ids:
        try:
            print("Ready to send message to connection_id " + connection_id)
            response = apigatewaymanagementapi.post_to_connection(
                ConnectionId=connection_id,
                Data=json.dumps(message).encode('utf-8')
            )
            print("Message sent to connection:", connection_id)
        except Exception as e:
            print("Error sending message to connection ", connection_id, ": ", str(e))
            # TODO: failing/stale connection id should be removed from the websockets table in dynamodb


def lambda_handler(event, context):
    print("Lambda fun invoked")
    try:
        # Extract message data from the EventBridge event
        message_data = event['detail']
        print("Recvd message from eventbridge")
        print(message_data)
        
        device_id = message_data['DeviceId']
        sample_time = message_data['SampleTime']
        longitude, latitude = message_data['Position']
        
        # Construct message content
        message_content = {
            'type': 'message',
            'device_id': device_id,
            'sample_time': sample_time,
            'latitude': latitude,
            'longitude': longitude
        }
        
        # Retrieve all connection IDs from DynamoDB
        connection_ids = retrieve_all_connection_ids()
        
        if connection_ids:
            #message = {
            #    'type': 'message',
            #    'content': message_data.get('message', 'Default message')
            #}
            
            # Send the message to all WebSocket clients
            send_message_to_websockets(connection_ids, message_content)
            
            return {
                'statusCode': 200,
                'body': 'Message sent to all WebSocket clients'
            }
        else:
            return {
                'statusCode': 404,
                'body': 'No WebSocket connections found'
            }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': 'Error sending broadcast message: ' + str(e)
        }
