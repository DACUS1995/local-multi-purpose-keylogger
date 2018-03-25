"use strict"

const Utils = require("./Utils");
const ioHook = require("iohook");
const { server, wss } = require("./Server");
const WebSocket = require("ws");

class KeyHandler
{
	constructor()
	{
		this._arrBuffer = [];
	}

	handleKeyPressed(rawCode)
	{
		// The pressed keys must be buffered until "\n" char is inserted
		if(rawCode == dictRawCode["enter"])
		{
			let strBuffer = this._arrBuffer.join('').toLowerCase();
			this.sendBuffer(strBuffer);
			this._arrBuffer = [];

			console.log(strBuffer);
		}
		else
		{
			this._arrBuffer.push(Utils.convertToChar(rawCode));
		}

	}

	sendBuffer(strBuffer)
	{
		wss.clients.forEach(function each(client) 
		{
			if (client.readyState === WebSocket.OPEN) 
			{
				client.send(Utils.makeMessage(
					"BufferFlush", {buffer: strBuffer}
				));
			}
		});
	}

	startListener()
	{
		ioHook.on("keydown", event =>{
			this.handleKeyPressed(event.rawcode);
		});

		ioHook.start();
	}
}

const dictRawCode = {
	"enter": 13
};

module.exports = new KeyHandler();