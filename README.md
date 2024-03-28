Run server with command : node app.js

Test on PostMan
-Register a user:
Method: POST
URL: http://localhost:3000/auth/register
Body (raw JSON):
json
{
    "username": "user1",
    "password": "password"
}

-Login with the registered user:
Method: POST
URL: http://localhost:3000/auth/login
Body (raw JSON):
json
{
    "username": "user1",
    "password": "password"
}

-Retrieve public profiles:
Method: GET
URL: http://localhost:3000/profile/profiles

-Retrieve a specific profile (assuming profile ID is 1):
Method: GET
URL: http://localhost:3000/profile/profiles/1

-Update your profile :
Method: PUT
URL: http://localhost:3000/profile/profile
Body (raw JSON):
json
{
    "isPublic": false
}
