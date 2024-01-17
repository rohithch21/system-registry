# To run the app locally

1. Start a local postgres db container in docker
docker run --rm --name test-postgres -p 5432:5432 -e POSTGRES_PASSWORD=pw -d postgres:14-alpine

- docker run = pulls the image from hub if it doesn't exist and creates a container
- db name = postgres
- container name = test-postgres
- port = 5432
- set environment variable POSTGRES_PASSWORD = pw
- docker image = postgres:14-alpine

2. Install all the dependencies
npm i

3. Start the server
node index.js

4. Debugging works out of the box on VS Code

# Project details

- View Engine ( Templating engine) used is Jade ( Deprecated ), the latest version is called pug. Default engine is jade. Jade - https://jade-lang.com/
- There are 2 views - add_system.jade and home.jade
    - Homepage for displaying all the systems - It consists of a simple HTML table. 
    - Add System page is a form to create a system - It consists of a HTML form. 

- Form details are sent to the backend by default with Content-Type application/x-www-form-urlencoded
- DB connection pool using node-postgres. Postgres server hosted on docker locally on port 5432.  
Ref - https://pages.github.tools.sap/cloud-curriculum/materials/persistence/nodejs/
- Data { result : data } from backend are sent with the key result, this is parsed using the jade templating engine

# Access the DB locally
1. Find the container image id
    - docker ps
2. Log into docker container CLI
    - docker exec -it container id bash
3. psql -U postgres
    - -U = user = postgres
4. \l - list all databases
5. \c database_name
6. \dt - list of all tables
7. Run SQL queries




