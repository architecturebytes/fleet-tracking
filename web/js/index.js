const TRACKER = 'FleetTracker'; //Tracker name
const REGION = "<AWS_REGION>";
const IDENTITY_POOL_ID = "<IDENTITY_POOL_ID>";
const WEBSOCKET_URL = "WEBSOCKET_API_GATEWAY_URL"; // This is of the form: wss://<id>.execute-api.<region>.amazonaws.com/<stage>

var map = L.map('map').setView([36.168110, -115.1191], 14);
var theMarker;
var trail;
var deviceMarkersMap = new Map();
var trailsMap = new Map();

// Add a tile layer to the map (you can use different tile layers from various providers)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var truckIcon = L.icon({
    iconUrl: 'https://i.postimg.cc/85G5wFdY/Truck.png',


    iconSize: [38, 95], // size of the icon
    shadowSize: [50, 64], // size of the shadow
    iconAnchor: [19, 60], // point of the icon which will correspond to marker's location
    shadowAnchor: [4, 62], // the same for the shadow
    popupAnchor: [-3, -42] // point from which the popup should open relative to the iconAnchor
});


//Set AWS Configuration
// Set the region
//AWS.config.update({ region: 'ap-south-1' });
AWS.config.update({ region: REGION });

// Initialize Amazon Cognito
//const identityPoolId = IDENTITY_POOL_ID;

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


// Function to add a marker to the map
function addDeviceMarker(deviceId, longitude, latitude, popupText) {
    

    deviceMarker = deviceMarkersMap.get(deviceId);
    trail = trailsMap.get(deviceId);

    //console.log("addMarker Invoked for deviceId: " + deviceId);
	//console.log("deviceMarkersMap: " + deviceMarkersMap)
    //console.log(theMarker);
    if (!(deviceMarker == null)) {
		//console.log("deviceMarker found");
        deviceMarker.setLatLng([latitude, longitude]);
        deviceMarker.bindPopup(popupText).openPopup();
        var newLatLng = L.latLng(latitude, longitude);
        trail.addLatLng(newLatLng); 
    } else {
		//console.log("deviceMarker undefined");
        trail = L.polyline([[latitude, longitude]], { color: 'blue', dashArray: '3, 6', weight: 2 }).addTo(map);
        deviceMarker = L.marker([latitude, longitude], {
            icon: truckIcon
        }).addTo(map);
        deviceMarker.bindPopup(popupText).openPopup();
        
      
    }
    deviceMarkersMap.set(deviceId, deviceMarker);
    trailsMap.set(deviceId, trail);

    //console.log("Marker Added");
}

// Connect to API Gateway over WebSocket - to receive location updates.
function websockConnect() {
	//const websocketUrl = WEBSOCKET_URL;
	const socket = new WebSocket(WEBSOCKET_URL);

	socket.onopen = (event) => {
	  console.log('WebSocket connection opened:', event);
	};
	
	socket.onmessage = (event) => {
	  const message = JSON.parse(event.data);
	  //console.log(message);
	  
	  if (message.type === 'message') {
		const deviceId = message.device_id;
		const latitude = Number(message.latitude.toFixed(5));
		const longitude = Number(message.longitude.toFixed(5));
		
		// Handle the location data as needed
		console.log('Received location update:', deviceId, latitude, longitude);
		addDeviceMarker(deviceId, longitude, latitude, "<div class='popup-content'><strong>" + deviceId + "</strong> [" + latitude + "," + longitude + "]</div>")
	  } else {
		console.log('Received message of unknown type:', message);
	  }
	};
}

//NOTE: Following methods are necessary only if you are fetching location data from Location Tracker directly 
//fetchLocationData(), startFetchingDataInterval(), displayLocationData()

//Fetch Location data from Tracker directly - we are not using this method, but it would work if invoked.
function fetchLocationData() {
    const locationService = new AWS.Location();

    const params = {
        TrackerName: TRACKER,
    };

    locationService.listDevicePositions(params, (err, data) => {
        if (err) {
            console.error('Error fetching location data:', err);
        } else {
            const locationData = data.Entries;
            console.log('Fetched location data:', locationData);
            displayLocationData(locationData);
        }
    });
}

//Fetch Location data by polling - we are not using this method, but it would work if invoked.
function startFetchingDataInterval() {
    fetchLocationData(); // Call the function immediately when the button is clicked

    // Call the function every 5 seconds using setInterval
    setInterval(() => {
        fetchLocationData();
    }, 5000);
}

//We are not using this method, but it would work if invoked.
function displayLocationData(locationData) {
    console.log("displayLocationData Invoked");
    for (const devicePosition of locationData) {
        //const { DeviceId, Position } = position;
        const DeviceIdRcvd = devicePosition.DeviceId;
        const latitude = devicePosition.Position[1];
        const longitude = devicePosition.Position[0];
        const time = devicePosition.SampleTime;

        console.log("DeviceIdRcvd, lng, lat: " + DeviceIdRcvd + "," + longitude + ", " + latitude);
        //if (DeviceIdRcvd == "device-id-4")
        //{
        //addMarker(longitude, latitude, "<h3>Location</h3> lng, lat: " + longitude + ", " + latitude);
        addDeviceMarker(DeviceIdRcvd, longitude, latitude, "<h3>Location</h3> lng, lat: " + longitude + ", " + latitude);
        //}
    }
}

// Invoke connection to WebSocket API Gateway automatically on page load. 
//websockConnect();

