'use strict'

const objKeyHandler = require("./KeyHandler");
const { server, wss } = require("./Server");

objKeyHandler.startListener();
