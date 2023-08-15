// Replace these values with your actual AWS IoT Core endpoint, topic, and region
const IOT_ENDPOINT = '<IOT_ENDPOINT>'; 
const TOPIC = 'fleet/location'; // Topic Name
const REGION = '<AWS_REGION>';
const IDENTITY_POOL_ID = '<IDENTITY_POOL_ID>';
var iotData = null;

class Device {
    constructor(deviceId, lat, lng) {
        this.name = deviceId;
        this.lat = lat;
        this.lng = lng;
    }
}

// Three Trucks (devices) with initial locations
theDevice1 = new Device('Truck-1', 36.168110, -115.1191);
theDevice2 = new Device('Truck-2', 36.178110, -115.1391);
theDevice3 = new Device('Truck-3', 36.188110, -115.1591);

//Save them in a array
const deviceArray = [];
deviceArray.push(theDevice1, theDevice2, theDevice3);

// Configure AWS & IoT Core data client
function initialize() {
    AWS.config.update({ region: REGION });

    // Initialize Amazon Cognito
    // const identityPoolId = 'ap-south-1:c37830dd-b3e0-44d7-b7df-f42155c4aa4b';

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: IDENTITY_POOL_ID
    });

    // Call the refresh method to authenticate with Cognito
    AWS.config.credentials.get((err) => {
      if (err) {
        console.error('Error:', err);
      } else {
        console.log("AWS Configured!!");
      }
    })

    // Create an AWS IoT Core data client
    iotData = new AWS.IotData({
        endpoint: IOT_ENDPOINT
    });
}

// Send a random Truck's (device) location to AWS IoT Core
function sendLocationData() {
    //latitude = latitude + 0.0001;
    //longitude = longitude + 0.002;

    const randomIndex = Math.floor(Math.random() * deviceArray.length);

    // Retrieve the random Truck(device) object
    const device = deviceArray[randomIndex];

    //console.log("From Device Array: " + device.name + ", " + device.lat + ", " + device.lng);
    //Increment latitude/longitude of the Truck(device) - simulating movement
    device.lat = Number((device.lat + 0.0001).toFixed(5));
    device.lng = Number((device.lng + 0.001).toFixed(5));


    const locationData = {
        records: [{
            deviceId: device.name,
            latitude: device.lat, // Replace with the latitude of the device
            longitude: device.lng, // Replace with the longitude of the device
            timestamp: new Date().toISOString(), // Replace with the timestamp of the location update (in ISO 8601 format)
        }, ],
    }
    const params = {
        topic: TOPIC,
        payload: JSON.stringify(locationData),
        qos: 0, // Quality of Service: 0, 1, or 2
    };

    // Publish the location data to AWS IoT Core
    iotData.publish(params, (err, data) => {
        if (err) {
            console.error('Error sending location data:', err);
        } else {
            console.log('Sent location update: ', device.name, device.lat, device.lng);
            //console.log('Location data sent successfully:', locationData);
        }
    });
}

// Send Truck Location data repeatedly in intervals.
function sendLocnDataInIntervals() {
    sendLocationData(); // Call the function immediately when the button is clicked

    // Call the function every 2 seconds
    setInterval(() => {
        sendLocationData();
    }, 2000);
}

// Event listener for the "Send Location" button click
const sendLocationBtn = document.getElementById('sendLocationBtn');
const sendLocationEvery5SecBtn = document.getElementById('sendLocationEvery5SecBtn');

sendLocationBtn.addEventListener('click', sendLocationData);
sendLocationEvery5SecBtn.addEventListener('click', sendLocnDataInIntervals);

initialize();
