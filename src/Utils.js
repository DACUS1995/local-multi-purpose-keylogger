"use strict"

class Utils 
{
    constructor()
    {
    }

    /**
     * Convert key code to char
     * 
     * @param {number} nKey 
     */
    static convertKeyToChar(nKey)
    {
        return String.fromCharCode((96 <= nKey && nKey <= 105) ? nKey-48 : nKey);
    }

    /**
     * Transforms the basic components of a message in JSON format, ready to be sent through WS
     * 
     * @param {string} strTitle 
     * @param {string} strBody 
     */
    static makeMessage(strTitle, strBody)
    {
        return JSON.stringify({
            title: strTitle,
            body: strBody
        });
    }
}

module.exports = Utils;