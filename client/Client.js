"use strict"

const WebSocket = require("ws");
const HandleClientSocketMessage = require("./HandleClientSocketMessage");
const HandleClientCommands = require("./HandleClientCommands");

class Client
{
    constructor()
    {
        this._arrAddresses = Client.generateAddresses();
        this._bConnectSucces = false;
        this._objHandleClientSocketMessage = null;
        this._objHandleClientCommands = null;
    }

    /**
     *  Use this function to search for an existing server to connect
     */
    sweep()
    {
        for(let i in this._arrAddresses)
        {
            if(this._bConnectSucces != false) //Check if connection already succeded
            {
                try
                {
                    this.connect(this._arrAddresses[i])
                }
                catch(error)
                {
                    // Probabily just failed connect atept because the addres was wrong
                    console.log(`[Error: ${error.stack}]`);
                }
            }
        }
    }

    connect(strAddress)
    {
        console.log(`Trying to connect to ${strAddres}:666`);

        const ws = new WebSocket(`ws://${strAddres}:666`);
        
        ws.on('open', function open() {
            console.log(`Found it at addres: ${strAddress}`);
            this._objHandleClientSocketMessage = new HandleClientSocketMessage(ws);
            this._objHandleClientCommands = new HandleClientCommands(ws);
            this._bConnectSucces = true;
        });
 
        ws.on('message', function incoming(data) {
            this._objHandleClientSocketMessage.handleMessage(data);
        });
    }

    static generateAddresses()
    {
        let arrAddresses = [];
        arrAddresses.push("127.0.0.1");

        return arrAddresses;
    }
}

module.exports = new Client();