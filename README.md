<h1>Fleet Tracking System</h1>

**Ref Video**: Fleet Tracking System Design & Tutorial<br>
https://www.youtube.com/watch?v=NeOUtFsjZW8<br>

**Please update**<br> 
IOT_ENDPOINT, TOPIC, REGION, IDENTITY_POOL_ID<br>
in following files: <br>
web/js/index.js<br>
web/js/simulator.js<br> 

The **FleetCognitoIAMRole** in the demo has policy with following permissions:

Allow Actions:<br> 
"cognito-identity:GetCredentialsForIdentity" <br> 
"iot:Publish"<br> 
"iot:Subscribe" <br> 
"geo:GetDevicePositionHistory" <br> 
"geo:ListDevicePositions"<br> 

on appropriate resources. 
