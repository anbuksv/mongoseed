#!/bin/bash
echo The appid is : $1
mongoexport --db allsec --collection intentResponses --jsonArray --out "./mongo/intentResponses.json"
node app.js $1
mongoimport --db allsec --collection intentResponses --jsonArray --file "./mongo/intentResponses.json"
