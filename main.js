"use strict"

const args = process.argv;
const runMode  = args[2];

if(runMode == "client")
{
    console.log(":: Running client mode");
    const Client = require("./client/Client.js");
    Client.sweep();
}
else
{
    console.log(":: Running sucker mode");    
    const { server, wss } = require("./remote/Server");
}

