> Explain, generally, what is meant by a NoSQL database.

NoSQL database, also called `Not Only SQL`, is an approach to data management and database design that's useful for very large sets of distributed data.

NoSQL, which encompasses a wide range of technologies and architectures, seeks to solve the scalability and big data performance issues that relational databases weren’t designed to address. NoSQL is especially useful when an enterprise needs to access and analyze massive amounts of unstructured data or data that's stored remotely on multiple virtual servers in the cloud.

Generally schema-less.

> Explain Pros & Cons in using a NoSQL database like MongoDB as your data store, compared to a traditional Relational SQL Database like MySQL.

Pros
The main reasons to use NoSQL
- To improve programmer productivity by using a database that better matches an application's needs.
- To improve data access performance via some combination of handling larger data volumes, reducing latency, and improving throughput (nonrelational queries are much faster)
- Not normalizing data is simpler
- Easy "horizontal" scaling (Horizontal scaling means that you scale by adding more machines into your pool of resources whereas Vertical scaling means that you scale by adding more power (CPU, RAM) to an existing machine.)

Cons
- No ACID (Atomicity, Consistency, Isolation and Durability)
- No standardized interface
- Eventual consistency instead of immediate consistency

Instead it has `eventual consistency`. Eventually everything will be ok.
A bank would never use NoSQL since they want strict consistency.

Same data will have to be updated multiple places

> Explain how databases like MongoDB and redis would be classified in the NoSQL world

#### MongoDB

MongoDB is an open source, document-oriented database designed with both scalability and developer agility in mind. Instead of storing your data in tables and rows as you would with a relational database, in MongoDB you store JSON-like documents with dynamic schemas. The goal of MongoDB is to bridge the gap between key-value stores (which are fast and scalable) and relational databases (which have rich functionality).

Using BSON (binary JSON), developers can easily map to modern object-oriented languages without a complicated ORM layer. This new data model simplifies coding significantly, and also improves performance by grouping relevant data together internally.

#### redis

It's a "NoSQL" key-value data store. More precisely, it is a data structure server. 

Not like MongoDB (which is a disk-based document store), though MongoDB could be used for similar key/value use cases.
The closest analog is probably to think of Redis as Memcached, but with built-in persistence (snapshotting or journaling to disk) and more datatypes.

> Explain reasons to add a layer like Mongoose, on top on of a schema-less database like MongoDB

Mongoose is an object modeling tool for MongoDB like an ORM tool.
It adds schemas. We can for instance put restraints such as making an email unique.
Mongoose includes out of the box:
- Schemas
- Built-in type casting
- Validation
- Query building
- Business logic hooks (middleware)
Eg if we want to store a password as hashed, we could use some Mongoose middleware to take care of it.

```
var userSchema = new mongoose.Schema({
username: String,
email: {type: String, unique: true},
created: {type: Date, default: Date.now}, // not really necessary as the creationDate is also stored in the id, but then we don't need to parse it
modified: Date,
lastLogin: Date
});

// Build the User model
mongoose.mode('User', userSchema);
```

To use a model:
```
var mongoose = require('mongoose');
var User = mongoose.model("User");
```

Why mongoose?
- Real life data often has a structure and type. We want to be able to enforce a structure and type.
If we don't need a schema, then we don't need mongoose.

> Explain, and demonstrate, using relevant examples, the strategy for querying MongoDB (all CRUD operations)

##### Create

```
db.jokes.insertOne(
    {
     joke: "Can a kangaroo jump higher than a house? Of course, a house doesn’t jump at all.",
     number: "1"
    }
);
```

There is also an `insertMany`

```
db.jokes.insertMany([
    {
     joke: "Can a kangaroo jump higher than a house? Of course, a house doesn’t jump at all.",
     number: "1"
    },
    {
     name: "My dog used to chase people on a bike a lot. It got so bad, finally I had to take his bike away.",
     number: "2"
    }
]);
```

##### Read

In the curly braces we pass in the properties to filter by. This could be an ID, or a String for example.
```
db.jokes.find({_id: "12345678abcdef});
```

##### Update

```
db.jokes.update(
  { joke: "Can a kangaroo jump higher than a house? Of course, a house doesn’t jump at all.", number: "1" },
  { $set: { "number": "3" } }
);
```

This will update the first entry found. If we want to update all such entries, we would use `{multi: true}` such as:
```
db.jokes.update(
  { joke: "Can a kangaroo jump higher than a house? Of course, a house doesn’t jump at all.", number: "1" },
  { $set: { "number": "3" } },
  { multi: true }
);
```

##### Delete

Delete single:
```
db.jokes.deleteOne({joke: "Can a kangaroo jump higher than a house? Of course, a house doesn’t jump at all."});
```
Delete multiple:
```
db.jokes.deleteMany([{number: "1"}, {number: "2"}]);
```

Regarding `$set`
- If the field does not exist, $set will add a new field with the specified value, provided that the new field does not violate a type constraint. If you specify a dotted path for a non-existent field, $set will create the embedded documents as needed to fulfill the dotted path to the field.
- If you specify multiple field-value pairs, $set will update or create each field.
-

> Explain about indexes in MongoDB, how to create them, and demonstrate how you have used them.

Indexes support the efficient execution of queries in MongoDB. Without indexes, MongoDB must perform a collection scan, i.e. scan every document in a collection, to select those documents that match the query statement. If an appropriate index exists for a query, MongoDB can use the index to limit the number of documents it must inspect.

Indexes are special data structures that store a small portion of the collection’s data set in an easy to traverse form. The index stores the value of a specific field or set of fields, ordered by the value of the field. The ordering of the index entries supports efficient equality matches and range-based query operations. In addition, MongoDB can return sorted results by using the ordering in the index.

*To create an index, use db.collection.createIndex()*
```
db.collection.createIndex( <key and index type specification>, <options> )
```

> Explain, using your own code examples, how you have used some of MongoDB's "special" indexes like TTL and 2dsphere

We have not used any indexes.

##### Geospatial Index

To support efficient queries of geospatial coordinate data, MongoDB provides two special indexes: 2d indexes that uses planar geometry when returning results and 2dsphere indexes that use spherical geometry to return results.

##### TTL Indexes

TTL indexes are special indexes that MongoDB can use to automatically remove documents from a collection after a certain amount of time. This is ideal for certain types of information like machine generated event data, logs, and session information that only need to persist in a database for a finite amount of time.

> Demonstrate, using a REST-API you have designed, how to perform all CRUD operations on a MongoDB

##### Create

model/jokes.js
```
exports.addJoke = function (jokeToAdd, callback) {
	let db = connection.get();
	let collection = db.collection("jokes");

	collection.insertOne(jokeToAdd, function (err, msg) {
		callback(msg);
	})
}
```

api/jokeapi.js
```
router.post("/addjoke", function(req, res, next) {
    jokemodule.addJoke(req.body, (msg)=>{
        res.json(msg);
    })
})
```

##### Read

model/jokes.js
```
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
```

api/jokeapi.api
```
router.get("/findjoke/:id", function(req, res, next) {
    jokemodule.findJoke(req.params.id, (msg)=>{
        res.json(msg);
    });
})
```

##### Update
model/jokes.js
```
router.get("/findjoke/:id", function(req, res, next) {
    console.log("Lets find " + req.params.id);
    jokemodule.findJoke(req.params.id, (msg)=>{
        res.json(msg);
    });
})
```

api/jokeapi.api
```
router.put("/editjoke", function(req, res, next) {
    console.log("Let's edit ---");

    jokemodule.editJoke(req.body, (msg)=>{
        res.json(msg);
    })

})
```

##### Delete

model/jokeapi.js
```
router.delete("/delete/:id", function(req, res, next) {
    console.log("Let's delete " + req.params.id);

    jokemodule.deleteJoke(req.params.id, (msg)=>{
        res.json(msg);
    })

})
```

model/jokes.js
```
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
```

> Explain reasons to add a layer like Mongoose, on top on of a schema-less database like MongoDB

We can ensure that data is saved according to a certain scheme. We can also put restraints such as minimum length and uniqueness.

> Explain the benefits from using Mongoose, and provide an example involving all CRUD operations

Mongoose provides a straight-forward, schema-based solution to modeling your application data and includes, out of the box:

- Schemas
- built-in type casting
- Validation
- Query building
- Business logic hooks (middleware)

##### Example of schema

```
'use strict'

let mongoose = require("mongoose");
let Schema = mongoose.Schema;

var JokeSchema = new Schema(
    {
        joke: {
            type: String,
            required: true,
            notEmpty: true,
            minlength: 5
        },
        category: [String],
        reference: {
            author: String,
            link: String
        },
        lastEdited: {type: Date, default: Date.now}
    }
)


JokeSchema.pre('save', function(next){
    this.lastEdited = new Date();
    next();
});

let JokeModel = mongoose.model("Joke", JokeSchema);
module.exports = JokeModel;
```

CRUD example with mongoose: `mongooseExercise` project

> Explain the benefits from using Mongoose, and demonstrate, using your own code, an example involving all CRUD operations

The benefits are already explained in a previous question.

CRUD example with mongoose: `mongooseExercise` project

> Explain how redis "fits" into the NoSQL world, and provide an example of how you have used it.

We have not used `redis` at all. A previous question touches on this.

> Explain, using a relevant example, a full MEAN application (the A, can be an ionic application) including relevant test cases to test the REST-API (not on the production database)

CRUD example with mongoose: `mongooseExercise` project

- Mongo
- Express
- Angular
- Node