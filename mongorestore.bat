@echo off
mongoimport --host %1 --port %2 --db %3 --collection %4 --drop --jsonArray --file "./mongo/intentResponsesBackup.json"
echo "collection successfully restored"