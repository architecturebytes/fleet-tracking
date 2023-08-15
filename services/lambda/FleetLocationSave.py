import json
import boto3

def lambda_handler(event, context):
    # Retrieve the location data from the IoT Core message
    iot_message = event['records'][0]
    location_data = iot_message; #json.loads(iot_message)
    
    # Extract necessary information from the location data
    tracker_name = 'FleetTracker'  # Replace with your actual tracker name
    device_id = location_data['deviceId']
    latitude = location_data['latitude']
    longitude = location_data['longitude']
    timestamp = location_data['timestamp']
    
    # Initialize the AWS Location Service client
    location_service = boto3.client('location')
    
    try:
        # Send the location data to AWS Location Service Tracker
        response = location_service.batch_update_device_position(
            TrackerName=tracker_name,
            Updates=[
                {
                    'DeviceId': device_id,
                    'Position': [longitude, latitude],
                    'SampleTime': timestamp
                }
            ]
        )
        print("Location data sent successfully:", response)
    except Exception as e:
        print("Error sending location data:", str(e))

    return {
        'statusCode': 200,
        'body': json.dumps('Location data processed successfully!')
    }
