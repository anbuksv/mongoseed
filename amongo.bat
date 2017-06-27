@echo off
echo The app id is : %1
rem echo "Are you sure do you want execute the operation ? (Y|N) "
rem pause
rem %1 appId %2 host %3 port %4 db %5 collection
mongoexport --host %2 --port %3 --db %4 --collection %5 --jsonArray --out "./mongo/intentResponsesBackup.json"
rem echo mongoexport --host %2 --port %3 --db %4 --collection %5 --jsonArray --query %6 --out "./mongo/intentResponses.json"
mongoexport --host %2 --port %3 --db %4 --collection %5 --jsonArray --query %6 --out "./mongo/intentResponses.json"
node mongo.js %1
rem echo mongoimport --host %2 --port %3 --db %4 --collection %5 --jsonArray --file "./mongo/intentResponses.json"
mongoimport --host %2 --port %3 --db %4 --collection %5 --jsonArray --file "./mongo/intentResponses.json"