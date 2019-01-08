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
        this._bConnectSuccess = false;
        this._objHandleClientSocketMessage = null;
        this._objHandleClientCommands = null;

        this._objPromisesToReject = {}; // TODO search the address in parallel and reject all other running promises
    }

    /**
     *  Use this function to search for an existing server to connect
     */
    async sweep()
    {
        console.log(":: Client::Starting Sweeping");
        for(let i in this._arrAddresses)
        {
            if(this._bConnectSuccess != true) //Check if connection already succeded
            {
                try
                {
                    await this.connect(this._arrAddresses[i])
                }
                catch(error)
                {
                    // Probabily just failed connect atempt because the address was wrong
                    console.log(`[Error: ${error.stack}]`);
                }
            }
        }
    }

    connect(strAddress)
    {
        console.log(`--> Trying to connect to ${strAddress}:666`);

        const ws = new WebSocket(`ws://${strAddress}:666`);
        
        return new Promise((resolve, reject) => {
            ws.on('open', () => {
                console.log(`:: Found tracker at address: ${strAddress}`);
                this._objHandleClientSocketMessage = new HandleClientSocketMessage(ws);
                this._objHandleClientCommands = new HandleClientCommands(ws);
    
                this._objHandleClientCommands.menu();
    
                this._bConnectSuccess = true;

                ws.on('message', (data) => {
                    this._objHandleClientSocketMessage.handleMessage(data);
                });
                
                resolve(null);
            });
     
    
            ws.on("error", (err) => {
                console.error(err);
                reject(err);
            });
        });
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