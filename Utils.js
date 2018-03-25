class Utils 
{
    constructor()
    {
        // throw new Error("This class must not be instatiated");
    }

    static convertToChar(key)
    {
        return String.fromCharCode((96 <= key && key <= 105) ? key-48 : key);
    }

    static makeMessage(strTitle, strBody)
    {
        return JSON.stringify({
            title: strTitle,
            body: strBody
        });
    }
}

module.exports = Utils;