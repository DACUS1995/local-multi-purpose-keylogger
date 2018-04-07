"use strict"

const WebSocket = require("ws");
const HandleClientSocketMessage = require("./HandleClientSocketMessage");
const HandleClientCommands = require("./HandleClientCommands");
const os = require("os");

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
        console.log(":: Client::Starting Sweeping");
        for(let i in this._arrAddresses)
        {
            if(this._bConnectSucces != true) //Check if connection already succeded
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
        console.log(`--> Trying to connect to ${strAddress}:666`);

        const ws = new WebSocket(`ws://${strAddress}:666`);
        
        ws.on('open', function open() {
            console.log(`:: Found it at addres: ${strAddress}`);
            this._objHandleClientSocketMessage = new HandleClientSocketMessage(ws);
            this._objHandleClientCommands = new HandleClientCommands(ws);

            this._objHandleClientCommands.menu();

            this._bConnectSucces = true;
        });
 
        ws.on('message', function incoming(data) {
            this._objHandleClientSocketMessage.handleMessage(data);
        });

        ws.on("error", (err) => {console.log(err);});
    }

    /**
     * To dev reasons first include the loopback address
     * Due to the fact that this app is meant to be used in a small LAN
     * there is no reason to search more than +/- 5 IP ranges of addresses
     */
    static generateAddresses()
    {
        let arrAddresses = [];
        arrAddresses.push("127.0.0.1");

        const objInterfaces = os.networkInterfaces();

        arrAddresses = [
            ...arrAddresses,
            ...this.ethernetLANPlugin(objInterfaces)
        ];

        return arrAddresses;
    }

    static ethernetLANPlugin(objInterfaces)
    {
        const Ethernet = objInterfaces.Ethernet;
        
        for(let objIndex of Ethernet)
        {
            if(objIndex.family == "IPv4")
            {
                return this.rangeIPGen(objIndex.address, 10);
            }
        }
    }

    static rangeIPGen(foundAddress, nRange)
    {
        const arrAddresses = [];
        const arrSplitAddress = foundAddress.split(".");
        
        let nLastComponent = parseInt(arrSplitAddress[3]);

        for(let i=1; i<nRange; i++)
        {
            let current = nLastComponent + i;
            arrSplitAddress[3] = current.toString();

            arrAddresses.push(arrSplitAddress.join("."));

            if(current != i && nLastComponent >= i)
            {
                current = nLastComponent - i;
                arrSplitAddress[3] = current.toString();
                arrAddresses.push(arrSplitAddress.join("."));                
            }
        }

        return arrAddresses;
    }
}

module.exports = new Client();