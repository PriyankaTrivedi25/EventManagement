# Event Management



### Prerequisites

1. GIT
1. Node: install version 10.12 or greater
1. NPM: install version 6.13 or greater



### To test the API's

-   Install Postman [https://www.postman.com/]


### Project

Clone project on your machine and after run these commands

`$ npm install`

##### Update config in config/development.json
Go to the config.js files according to your database. Need to update following parameters:

db_url:  
Ex. 
For local mongodb : “mongodb://localhost:27017/<dbname>”
  
For atlas : “mongodb+srv://<username>:<password>@cluster0.bzgei.mongodb.net/KnowledgeBase?retryWrites=true&w=majority”

Here <username>: Name of the user and 
  
<dbname>: Name of your database
	
database:   Name of your database eg:sample
collection:  Name of your collection


##### Database setup
Create your database and one collection on mongodb Atlas or in local mongodb. 
For the local mongo setup use this link: https://docs.mongodb.com/guides/server/install/
For the atlas setup go through this link : https://docs.atlas.mongodb.com/

  
## Start Project
Go to the project folder.Open command line and run `node index.js` command.
If you got this Message  "Server started successfully on port 3000 " then it means server is started now you can call API for text translation.
  
  
## Test API:
*** API for create/add event*****
API Url : http://localhost:3000/api/add-event
API type : POST
Input type: raw (JSON)
Body parameters:
    event_name: ‘name of event’,
    start_time: “Write time in ISODate eg: 2022-03-07T20:47:29.155Z”,
    duration: e.g 90 (number data type)


*** API for Fetch live and upcoming event*****
API Url : http://localhost:3000/api/get-events

API Type: GET
