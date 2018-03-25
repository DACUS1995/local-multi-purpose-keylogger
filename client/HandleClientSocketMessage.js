"use strict"

class HandleClientSocketMessage
{
    constructor(ws)
    {
        this._ws = ws;
    }

    handleMessage(strMessage)
    {
        let objMessage = HandleClientSocketMessage.decodeMessage(strMessage);

        switch(objMessage.title)
        {
            case "log":
                console.log(objMessage.body);
                break;
            case "BufferFlush":
                console.log(objMessage.body.buffer)
                break;
            default:
                console.log("Message not configured!");
        }
    }

    static decodeMessage(strStringObject)
    {
        let objDecodedMessage = JSON.parse(strStringObject);
        return objDecodedMessage;
    }
}

module.exports = HandleClientSocketMessage;