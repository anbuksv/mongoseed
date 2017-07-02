# mongoseed
	version : 0.0.3

> mongoseed is a simple command line interface tool to seed data from your local mongodb into server easily and you can also seed data from server to your local mongodb.

## Requirement
- You must have read and write access from server
- If you don't have access read this [blog](https://www.digitalocean.com/community/tutorials/how-to-securely-configure-a-production-mongodb-server) will help to get access to mongodb from server

## New Features
- Seed single collection based on query
- Run `$ mongoseed --db dbName --collection collectionName --query "{_id:ObjectId('59072e67413f91965809ce10')}"`
- Seed single collection also supported
- Run `$ mongoseed --db dbName --collection collectionName`

## Usage

- Run `$ npm install -g mongoseed`
- Run `$ mongoseed --fromHost 127.0.0.1 --fromPort 27017 --toHost 35.167.200.217 --toPort 27018`

# mongoseed

### Options
 **--fromHost or --fh**
  - >Default : localhost
  - Specifies a resolvable hostname for the mongod to which to connect. By default, the mongoseed attempts to connect to a MongoDB instance running on the localhost on port number 27017.

**--fromPort or --fp**
  - >Default : 27017
  - Specifies the TCP port on which the MongoDB instance listens for client connections.

**--toHost or --th**
  - >Default : localhost
  - Specifies a resolvable hostname for the mongod to which to connect. By default, the mongoseed attempts to connect to a MongoDB instance running on the localhost on port number 6666.

**--toPort or --tp**
  - >Default : 6666
  - Specifies the TCP port on which the MongoDB instance listens for client connections.

**--db**
  - If you want seed only one database then use this option to specifie database 

**--collection**
  - If you want seed only one  collection then use this option to specifie collection
  - **Note :** collection option must be followed by db 

**--query**
  - Seed collection data based on query
  - **Note :** $gt,$ls,$or are not supported

**--drop**
  - Use drop option to dorp existing collection and seed data to destination host(**--toHost**)

## Upcoming Feature
  - **seed data based on query** like {"age": {$gt:25}}
  
# LICENCE
[MIT](https://github.com/anbuksv/mongoseed/blob/master/LICENCE)

Enjoy!