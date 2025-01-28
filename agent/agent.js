require('dotenv').config({ path: '../.env' })
const fs = require('fs');
const path = require('path');

const { GoogleGenerativeAI } = require("@google/generative-ai");

const mineflayer = require('mineflayer')
const mineflayerViewer = require('prismarine-viewer').mineflayer

class Agent {
    constructor() {
        this.model = 'gemini-1.5-flash';
        this.gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        this.bot = mineflayer.createBot({
            host: 'localhost',
            username: 'MLA',
            version: '1.12.2',
            auth: 'offline'
        })
        
        this.#registerEvent();
    }

    #registerEvent() {
        this.bot.once('spawn', () => {
            mineflayerViewer(this.bot, { port: 3000, firstPerson: false }) 
            this.getMetrique();
        })
    }

    getMetrique() {
        let output = [];

        console.log(JSON.stringify(this.bot));
        return output;
    }
}

module.exports = Agent;