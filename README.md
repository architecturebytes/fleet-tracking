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

The Lambda function **FleetLocationSave.py** must have this role **LocationSaveRole** attached to it.<br>
This must have following permissions:<br>
LambdaBasicExecutionRole<br>
AND:<br>
Allow Actions:<br> 
"geo:BatchUpdateDevicePosition" <br> 
on appropriate resources. 

The Lambda function **FleetLocationSendToClient.py** must have this role **FleetLocationSendToClient-role** attached to it.<br>
This must have following permissions:<br>
LambdaBasicExecutionRole<br>
AND:<br>
Allow Actions:<br> 
"iot:*" <br> 
"execute-api: <br> 
"dynamodb:GetItem" <br>
"dynamodb:PutItem" <br>
"dynamodb:Scan" <br>
on appropriate resources. 

The Lambda function **FleetSaveWebsocketConnectionId.py** must have this role **FleetSaveWebsocketConnectionId-role** attached to it.<br>
This must have following permissions:<br>
LambdaBasicExecutionRole<br>
AND:<br>
Allow Actions:<br> 
"dynamodb:GetItem" <br>
"dynamodb:PutItem" <br>
"dynamodb:Scan" <br>
on appropriate resources. 

The Lambda function **FleetWebsocketConnectionDelete.py** must have this role **FleetWebsocketConnectionDelete-role** attached to it.<br>
This must have following permissions:<br>
LambdaBasicExecutionRole<br>
AND:<br>
Allow Actions:<br> 
"dynamodb:GetItem" <br>
"dynamodb:PutItem" <br>
"dynamodb:Scan" <br>
on appropriate resources. 
