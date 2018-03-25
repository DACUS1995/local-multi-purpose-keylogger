"use strict"

const exec = require("child_process").exec;

class CMDRunner
{
    constructor(){}

    static execCommand(strCommand)
    {
        let strOutput = "";

        exec(strCommand, function(err, stdout, stderr) {
            strOutput = stdout;
        });

        return strOutput
    }
}

module.exports = CMDRunner;