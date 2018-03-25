"use strict"

const WebSocket = require("ws");
const HandleClientSocketMessage = require("./HandleClientSocketMessage");

class Client
{
    constructor()
    {
        this._arrAddresses = Client.genAddresses();
    }

    sweep()
    {
        for(let i in this._arrAddresses)
        {
            this.connect(this._arrAddresses[i])
        }
    }

    connect(strAddres)
    {
        console.log(`Trying to connect to ${strAddres}:666`);

        const ws = new WebSocket(`ws://${strAddres}:666`);
        let bSucces = false;
        let objHandleClientSocketMessage = new HandleClientSocketMessage(ws);
 
        ws.on('open', function open() {
            console.log(`Found it at addres: ${strAddres}`);
            bSucces = true;
        });
 
        ws.on('message', function incoming(data) {
            objHandleClientSocketMessage.handleMessage(data);
        });
    }

    static genAddresses()
    {
        let arrAddresses = [];
        arrAddresses.push("127.0.0.1");

        return arrAddresses;
    }
}

module.exports = new Client();