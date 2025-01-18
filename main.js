const mineflayer = require('mineflayer')
const { mineflayer: mineflayerViewer } = require('prismarine-viewer')

const bot = mineflayer.createBot({
    host: 'localhost',
    username: 'MLA',
    auth: 'offline',
    version: '1.21',
})

bot.on('chat', (username, message) => {
    if (username === bot.username) return
    bot.chat(message)
})

bot.on('spawn', () => {
    mineflayerViewer(bot, { port: 3000 })

    const path = [bot.entity.position.clone()]
    bot.on('move', () => {
        if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
            path.push(bot.entity.position.clone())
            bot.viewer.drawLine('path', path)
        }
    })
})