"use strict"

const args = process.argv;
const strRunMode  = args[2];

process.on(
    "unhandledRejection",
    (reason, promise) => 
    {
        console.error(reason);
        process.exit(1);
    }
);

process.on(
    "uncaughtException",
    (error) => 
    {
        console.error("error");
        process.exit(1);
    }
);

class Main
{
    constructor(strRunMode)
    {
        this._strRunMode = strRunMode;
    }

    async run()
    {
        if(!Main.allowedArgumentsOptions.includes(strRunMode))
        {
            throw new Error("Wrong arguments passed to the application.");
        }

        switch(this._strRunMode)
        {
            case "client":
                this._startClientMode();
                break;
            case "tracker":
                this._startTrackerMode();
                break;
            default:
                throw new Error("Unhandled run mode.");
        }
    }

    _startClientMode()
    {
                    console.log(":: Running client mode");
            const client = require("./client/Client.js");
            client.sweep();
    }

    _startTrackerMode()
    {
            console.log(":: RunnistrRunModeng tracker mode");    
            const { server, wss } = require("./remote/Server");
    }

    static get allowedArgumentsOptions()
    {
        return [
            "client",
            "tracker" 
        ];
    }
}

(new Main(strRunMode))
    .run()
    .catch((error) => 
    {
        console.error(error);
        process.exit(1);
    });

