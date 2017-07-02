#!/usr/bin/env node
var Promise = require("bluebird")
var seedsFrom = Promise.promisifyAll(require("mongodb")).MongoClient
var seedsTo = Promise.promisifyAll(require("mongodb")).MongoClient
const ObjectId = require('mongodb').ObjectID
var arg = require('minimist')(process.argv.slice(2))
const exec = require("child_process").exec

var seedsFromDB = null
var seedsToDB = null

var seedsFromDbAdmin = null
var seedsToDbAdmin = null

let seedsFromHost = (arg.fromHost || arg.sourceHost || arg.sfh || arg.sh || 'localhost')
let seedsFromPort = (arg.fromPort || arg.sourcePort || arg.sfp || arg.sp || 27017)
let seedsToHost = (arg.toHost || arg.dHost || arg.dh || 'localhost')
let seedsToPort = (arg.toPort || arg.sourcePort || arg.sp || 6666)
let db = (arg.db || false)
let collection = (arg.collection || false)
let query = (arg.query || false)
let drop = (arg.drop || false)
let skip = (arg.skip || false)
let limit = (arg.limit || false)

const seedsFromUrl = 'mongodb://' + seedsFromHost + ':' + seedsFromPort
const seedsToUrl = 'mongodb://' + seedsToHost + ':' + seedsToPort
console.log("Seed from : ",seedsFromUrl)
console.log("Seed to : ",seedsToUrl)


seedsFrom.connectAsync(seedsFromUrl).then((_db)=>{
	seedsFromDB = _db
	seedsFromDbAdmin = _db.admin()
	seedsTo.connectAsync(seedsToUrl).then((_db) => {
		seedsToDB = _db
		seedsToDbAdmin = _db.admin()
		if(db){
			if(collection){
				let seedsFromDb = seedsFromDB.db(db)
				let seedsToDb = seedsToDB.db(db)
				if(drop){
					seedsToDb.dropCollectionAsync(collection).then(result=>{
						if(query){
							query = parseQuery(query)
							seedCollection(seedsFromDb,seedsToDb,collection,db,query).then(()=>{
								console.log(`${db}.${collection} data seed completed`)
								closeDbs()
							})
						}else{
							seedCollection(seedsFromDb,seedsToDb,collection,db).then(()=>{
								console.log(`${db}.${collection} data seed completed`)
								closeDbs()
							})
						}
					}).catch(e=>{
						console.log(e)
					})
				}else{
					if(query){
						query = parseQuery(query)
						seedCollection(seedsFromDb,seedsToDb,collection,db,query).then(()=>{
							console.log(`${db}.${collection} data seed completed`)
							closeDbs()
						})
					}else{
						seedCollection(seedsFromDb,seedsToDb,collection,db).then(()=>{
							console.log(`${db}.${collection} data seed completed`)
							closeDbs()
						})
					}
				}

			}else{
				seedDb(db).then(() => {
					console.log(`data seed completed`)
					closeDbs()
				})
			}
		}else{
			initSeedsFrom()			
		}
	}).catch(err => {
		console.log(err)
	})
})
.catch((e)=>{
	console.log(e)
})


var initSeedsFrom = () => {
	seedsFromDbAdmin.listDatabasesAsync().then(dbs => {
		let seeds = []
		dbs.databases.forEach(db => {
			if(db.name != "admin" && db.name != "local"){
				let seed = seedDb(db.name).then(()=>{})
				seeds.push(seed)
			}
			// console.log(db.name)
		})
		Promise.all(seeds).then(()=>{
			console.log(`data seed completed`)
			closeDbs()
		}).catch(err => {console.log(`seeds error ${err}`)})
	}).catch(er => {
		console.log("Seeds error",er)
	})
}


var seedDb = (dbName) => {
	return new Promise((resolve,rejected) => {
		// let connect to database based on databases name useing db.db(dbName)
		// after connected to that particular db you can perform curd opeartion easly
		let seedsFromDb = seedsFromDB.db(dbName)
		let seedsToDb = seedsToDB.db(dbName)
		// get all collection from db using db.listCollections()
		seedsFromDb.listCollections().toArray().then(collections => {
			let seeds = []
			collections.forEach(collection => {
				// console.log(collection)			
				let seed = seedCollection(seedsFromDb,seedsToDb,collection.name,dbName).then(()=>{})
				seeds.push(seed)
			})
			Promise.all(seeds).then(()=>{
				resolve()
			}).catch(err => {
				resolve()
				console.log("Promise seed err",err)
			})
		}).catch(err => {
			resolve()
			console.log(dbName,err)
		})
	})
}

var seedCollection = (fromDb,toDb,collectionName,dbName,query = {}) => {
	// console.log(dbName,collectionName)
	// let find all documents from collection using db.collection(collectionName).find({"query"})
	return new Promise((resolve,rejected) => {
		if(collectionName != "system.version" && collectionName != "startup_log"){
			fromDb.collection(collectionName).find(query).toArrayAsync().then(docs => {
				toDb.collection(collectionName).insertMany(docs).then(result => {
					console.log(`seed done for ${dbName}.${collectionName}`)
					resolve()
				}).catch(err => {
					resolve()
					console.log(`seed faild for collection ${dbName}.${collectionName} due to ${err}`)
				})
				// console.log(collectionName,docs)
			}).catch(err => {
				resolve()
				console.log(collectionName,err)
			})
		}
	})
}


var parseQuery = (query) => {
	// query = query.replace(/{/g,"")
	// query = query.replace(/}/,"")
	query = query.slice(1, -1)
	query = query.split(',')
	let jsonQuery = {}
	query.forEach((pro) => {
		let key = pro.split(':')[0]
		let value = pro.split(':')[1]
		jsonQuery[key] = eval(value)
	})
	return jsonQuery
}


var closeDbs = () => {
	seedsFromDB.close()
	seedsToDB.close()
}