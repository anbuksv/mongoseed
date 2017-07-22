#!/usr/bin/env node
var Promise = require("bluebird")
var arg = require('minimist')(process.argv.slice(2))

var EJSON = require('mongodb-extended-json')
let path = require('path')
let fs = require('fs')


var {seed,seedJSON} = require('./seed')

var operations = () => {
	let seedsFromHost = (arg.fromHost || arg.sourceHost || arg.sfh || arg.sh || arg.host || 'localhost')
	let seedsFromPort = (arg.fromPort || arg.sourcePort || arg.sfp || arg.sp || arg.port || 27017)
	let seedsToHost = (arg.toHost || arg.dHost || arg.dh || 'localhost')
	let seedsToPort = (arg.toPort || arg.sourcePort || arg.sp || 6666)
	let db = (arg.db || false)
	let collection = (arg.collection || false)
	let query = (arg.query || false)
	let drop = (arg.drop || false)
	let skip = (arg.skip || false)
	let limit = (arg.limit || false)

	arg.seedsFromUrl = 'mongodb://' + seedsFromHost + ':' + seedsFromPort
	arg.seedsToUrl = 'mongodb://' + seedsToHost + ':' + seedsToPort
	console.log("Seed from : ",arg.seedsFromUrl)
	console.log("Seed to : ",arg.seedsToUrl)


	if(arg.jsonArray){
		if(db && collection){
			arg.seedsFromUrl = 'mongodb://' + seedsFromHost + ':' + seedsFromPort + "/" + db
			let fpath = (arg.jsonArray == "." || arg.jsonArray == true) ? './seed.json' : arg.jsonArray
			fs.readFile(path.resolve(process.cwd(),fpath),'utf8',(err,data) => {
				if(err) {
					if (err.code === 'ENOENT') {
				      console.error(`${path.resolve(process.cwd(),fpath)} file does not exist`)
				      return
				    }
				    console.log(err)
				}
				seedJSON(arg,EJSON.parse(data))
			})	
		}else{
			console.log("db name and collection name required to seed data")
		}
	}else{
		seed(arg)
	}
}

if(arg.config){
	let fpath = (arg.config == "." || arg.config == true) ? './config.json' : arg.config
	fs.readFile(path.resolve(process.cwd(),fpath),'utf8',(err,data) => {
		if(err) {
			if (err.code === 'ENOENT') {
		      console.error(`${path.resolve(process.cwd(),fpath)} file does not exist`)
		      return
		    }
		    console.log(err)
		}
		arg = EJSON.parse(data)
		arg.config = true
		operations()
	})
}else{
	operations()
}
