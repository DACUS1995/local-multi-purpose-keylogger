"use strict"

const CMDRunner = require("./CMDRunner");
const { server, wss } = require("./Server");
const Utils = require("./Utils");

class HandleSocketMessage
{
    constructor(ws)
    {
        this._ws = ws;
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
                this.caseExecCommand(strMessage.body)
                break;
            default:
                console.log("Message not configured!");
        }
    }

    caseExecCommand()
    {
        let strOutput = CMDRunner.execCommand(strMessage.body.command);

        wss.clients.forEach(function each(client) 
		{
			if (client.readyState === WebSocket.OPEN) 
			{
				client.send(Utils.makeMessage(
					"CommandOutput", {output: strOutput}
				));
			}
		});
    }

    static decodeMessage(strStringObject)
    {
        let objDecodedMessage = JSON.parse(strStringObject);
        return objDecodedMessage;
    }
}

module.exports = HandleSocketMessage;