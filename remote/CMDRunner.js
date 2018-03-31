"use strict"

const exec = require("child_process").exec;

class CMDRunner
{
    constructor(){}

    // TODO Make test case for CMDRunner
    static execCommand(strCommand)
    {
        let strOutput = "";

        exec(strCommand, function(error, stdout, stderr) {
            if (error) {
                console.error(`exec error: ${error}`);
                return;
            }

            strOutput = stdout;
            console.log(error);
        });

        return strOutput
    }
}

module.exports = CMDRunner;