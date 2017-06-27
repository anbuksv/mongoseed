const mongo = require("mongodb").MongoClient
const ObjectId = require('mongodb').ObjectID
var fs = require('fs')
var path = require('path')
var db = null

let appId = process.argv[2]

var init = () => {
	var intentResponses = JSON.parse(fs.readFileSync(path.resolve(__dirname,'./mongo/intentResponses.json'), 'utf8'))

	var backup = fs.renameSync(path.resolve(__dirname,'./mongo/intentResponses.json'),path.resolve(__dirname,'./mongo/intentResponses_Backup.json'))

	let intentResponsesOld = intentResponses;
	// console.log(intentResponses)
	intentResponses.forEach((obj) => {
		for(let key in obj){
				if(typeof obj[key] == "object") {
					if (obj[key].hasOwnProperty('$oid')) {
						// console.log("old",obj[key]['$oid'])
						obj[key]['$oid'] = ObjectId()
						// console.log("new",obj[key]['$oid'])
					}
				}

				if (key == 'response') {
					if (obj["response"] instanceof Array) {
						obj['response'].forEach((aObj)=> {
							if(aObj['_id'].hasOwnProperty('$oid')){
								// console.log("response old",aObj['_id']['$oid'])
								aObj['_id']['$oid'] = ObjectId()
								// console.log("response new",aObj['_id']['$oid'])
							}
						})
					}else{
						if(obj['response']['_id'].hasOwnProperty('$oid')){
								// console.log("response old",obj['response']['_id']['$oid'])
								obj['response']['_id']['$oid'] = ObjectId()
								// console.log("response new",obj['response']['_id']['$oid'])
						}
					}
				}

				if (key == 'responses') {
					if (obj["responses"] instanceof Array) {
						obj['responses'].forEach((aObj)=> {
							if(aObj['_id'].hasOwnProperty('$oid')){
								// console.log("responses old",aObj['_id']['$oid'])
								aObj['_id']['$oid'] = ObjectId()
								// console.log("responses new",aObj['_id']['$oid'])
							}
						})
					}else{
						if(obj['responses']['_id'].hasOwnProperty('$oid')){
								// console.log("responses old",obj['responses']['_id']['$oid'])
								obj['responses']['_id']['$oid'] = ObjectId()
								// console.log("responses new",obj['responses']['_id']['$oid'])
						}
					}
				}
		}
		obj['appId'] = {$oid:ObjectId(appId)}
	})

	// let response = intentResponsesOld.concat(intentResponses)
	let content = JSON.stringify(intentResponses)

	fs.writeFile(path.resolve(__dirname,'./mongo/intentResponses.json'),content,'utf8',(err) => {
		if(err) {
			console.log(err)
		}
		console.log('All ObjectId are updated succesfully')
	})
}

// process.argv.forEach((val,index,array) => {

// })
// init()

if(appId){
	if(appId.length == 24){
		console.log(appId)
		init()
	}else{
		console.log("Invalid appId")
	}
}else{
	console.log("Invalid appId")
}
