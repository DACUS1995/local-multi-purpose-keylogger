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

module.export = HandleSocketMessage;