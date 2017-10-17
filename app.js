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
		return("Server running");
	}
});

server.start(error => {
	if(error) {
		throw error;
	}
	console.log("Listening at " + server.info.uri);
});