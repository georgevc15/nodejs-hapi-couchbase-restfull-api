const Hapi = require("hapi");
const Couchbase = require('couchbase');
const UUID = require("uuid");
const Joi = require("joi");

const server = new Hapi.Server();
const N1qlQuery = Couchbase.N1qlQuery;

const cluster = new Couchbase.Cluster("http://localhost");
const bucket = cluster.openBucket("default", "");

server.connection ({ "host": "localhost", "port": 3000 });


server.route({
	method: "GET",
	path: "/",
	handler: (request, response) => {
		return("Index page");
	}
});


server.route({
	method: "GET",
	path: "/people",
	handler: (request, response) => {
		var statement = "SELECT `" + bucket._name + "`.* FROM `" + bucket._name + "` WHERE type = 'person'";
		var query = N1qlQuery.fromString(statement);
		bucket.query(query, (error, result) => {
			if(error) {
				return response(error).code(500);
			}
			return response(result);
		});
	}
});


server.route({
	method: "POST",
	path: "/person",
	config: {
		validate: {
			payload: {
				firstname: Joi.string().required(),
				lastname: Joi.string().required(),
				type: Joi.any().forbidden().default("person"),
				timestamp: Joi.any().forbidden().default((new Date()).getTime())
			}
		}
	},
	handler: (request, response) => {
		bucket.insert(UUID.v4(), request.payload, (error, result) => {
			if(error) {
				return response(error).code(500);
			}
			return response(request.payload);
		});
	}
});

server.start(error => {
	if(error) {
		throw error;
	}
	console.log("Listening at " + server.info.uri);
});