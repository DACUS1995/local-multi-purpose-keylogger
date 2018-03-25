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
	const wss = new WebSocket.Server({ server });
	
	wss.on('connection', function connection(ws, req) {
		const objHandleSocketMessage = new HandleSocketMessage(ws);
		const location = url.parse(req.url, true);
		
		ws.on('message', function (strMessage) {
			objHandleSocketMessage.handleMessage(strMessage);
		});
	   
	});
	
	server.listen(nPort, function listening() {
		console.log('Listening on %d', server.address().port);
  	});

	return {
	  wss: wss,
	  server: server
	}
}

module.exports = startServer(666);