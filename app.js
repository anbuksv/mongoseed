const ObjectId = require('mongodb').ObjectID
var argv = require('minimist')(process.argv.slice(2))
const exec = require("child_process").exec

let host = '127.0.0.1'
let port = 27017
let db = 'allsec'
let collection = 'intentResponses'
let appId = ObjectId()
let restore = false

if(argv.host){
	host = argv.host
}
if (argv.port) {
	port = argv.port	
}
if (argv.db) {
	db = argv.db
}
if (argv.collection) {
	collection = argv.collection
}
if (argv.appId) {
	appId = argv.appId
}

if(argv.restore){
	restore = true
}


console.log({host,port,db,collection,appId,restore})

// console.log(cmd)
if(restore){
	let cmd = `mongorestore.bat ${host} ${port} ${db} ${collection}`
	exec(cmd, function(error, stdout, stderr) {
		// command output is in stdout
		console.log(stdout)
	});
}else{
	let cmd = `amongo.bat ${appId} ${host} ${port} ${db} ${collection}`
	exec(cmd, function(error, stdout, stderr) {
		// command output is in stdout
		console.log(stdout)
	});
}
