"use strict"

const exec = require("child_process").exec;

class CMDRunner
{
    constructor()
    {}

    static async execCommand(strCommand)
    {
        const execPromise = new Promise((resolve, reject) => 
        {
            exec(strCommand, function(error, stdout, stderr) 
            {
                if (error) 
                {
                    console.error(`exec error: ${error}`);
                    reject(error);
                }

                resolve(stdout);
            });
        });

        return execPromise
    }
}

module.exports = CMDRunner;