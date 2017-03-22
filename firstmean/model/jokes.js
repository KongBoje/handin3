/*
	Create a folder called model, and add a JavaScript-file jokes.js to the folder
	This will be our façade to the database. Implement the following methods, one by one and test.
*/

var connection = require("../db/db");
var ObjectId = require('mongodb').ObjectID;

exports.allJokes = function (callback) {
	let db = connection.get();  // Get it like this
	let collection = db.collection("jokes");

	collection.find({}).toArray(function (err, docs) {
		callback(docs);
	})
};

exports.findJoke = function (id, callback) {
	let db = connection.get();
	let collection = db.collection("jokes");

	collection.find(
		{
			"_id": ObjectId(id)
		}
	).toArray(function (err, docs) {
		callback(docs);
	})
}

exports.addJoke = function (jokeToAdd, callback) {
	let db = connection.get();
	let collection = db.collection("jokes");

	collection.insertOne(jokeToAdd, function (err, msg) {
		callback(msg);
	})
}

exports.editJoke = function (jokeToEdit, callback) {
	let db = connection.get();
	let collection = db.collection("jokes");

	callback(
		collection.update(
			{ _id: ObjectId(jokeToEdit._id) },
			{ $set: { "joke": jokeToEdit.joke } }
		)
	)
}

exports.deleteJoke = function (id, callback) {
	let db = connection.get();
	let collection = db.collection("jokes");

	callback(
		collection.deleteOne(
			{
				"_id": ObjectId(id)
			}
		)
	)
}

exports.randomJoke = function(callback) {
	let db = connection.get();
	let collection = db.collection("jokes");

	collection.find({}).toArray(function (err, docs) {
		callback(docs[Math.floor(Math.random() * docs.length)]);
	})
}

/*
exports.allJokes = function (callback) {..};
exports.findJoke = function (id, callback) {..};
exports.addJoke = function (jokeToAdd, callback) { .. };
exports.editJoke = function (jokeToEdit, callback) { .. };
exports.deleteJoke = function (id, callback) { .. };
exports.randomJoke = function randomJoke(callback) {..};
*/