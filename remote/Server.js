"use strict"

const express = require("express");
const bodyParser = require("body-parser");
const http = require("http");
const url = require("url");
const WebSocket = require("ws");
const HandleSocketMessage = require("./HandleSocketMessage");


function startServer(nPort)
{
	const app = express()
	
	app.use(function (req, res) {
		res.send({ msg: "hello" });
	});
	
	const server = http.createServer(app);
	const wsServer = new WebSocket.Server({ server });
	
	wsServer.on("connection", function (ws, req) {
		const objHandleSocketMessage = new HandleSocketMessage(ws, wsServer);
		const location = url.parse(req.url, true);
		
		ws.on("message", function (strMessage) {
			objHandleSocketMessage.handleMessage(strMessage);
			console.log(strMessage);
		});
	   
	});
	
	server.listen(nPort, function() {
		console.log(`Listening on ${server.address().port}`);
  	});

	return {
	  wss: wsServer,
	  server: server
	}
}

module.exports = startServer(666);