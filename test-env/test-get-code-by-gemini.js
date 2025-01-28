const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env' })

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function sendConnexionOllamaRequest() {
    const prompt = `
    Ressources :
        const mineflayer = require('mineflayer')
        const mineflayerViewer = require('prismarine-viewer').mineflayer
        
        const bot = mineflayer.createBot({
          username: 'Bot'
        })
        
        bot.once('spawn', () => {
          mineflayerViewer(bot, { port: 3000 }) // Start the viewing server on port 3000
        
          // Draw the path followed by the bot
          const path = [bot.entity.position.clone()]
          bot.on('move', () => {
            if (path[path.length - 1].distanceTo(bot.entity.position) > 1) {
              path.push(bot.entity.position.clone())
              bot.viewer.drawLine('path', path)
            }
          })
        })

    Prompte :
    Écris un script Node.js utilisant Mineflayer pour :
    1. Créer un bot qui se connecte à un serveur Minecraft en 1.12.2 en localhost et qui s'appelle MLA.
    2. Affiche "Bot connecté" quand il rejoint le serveur.
    3. fait lui dire bonjour toutes les secondes pendant 10 secondes.
    4. Va casser une buche de bois une fois connecter.
    5. Fais tourner prismarin-viwer sur le port 3000.`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        const codeBlock = text.match(/```javascript\n([\s\S]*?)```/);
        if (codeBlock) {

            const timestamp = new Date().toISOString().replace(/[:.-]/g, '_');
            const fileName = `generated_code_${timestamp}.txt`;
            const filePath = path.join(__dirname + '/logs/', fileName);
            const logData = `Prompt envoyé :\n${prompt}\n\nCode généré :\n${codeBlock[1]}`;

            fs.writeFileSync(filePath, logData);
            console.log(codeBlock[1]);

            eval(codeBlock[1])
        } else {
            console.log("Aucun code trouvé dans la réponse.");
        }
    } catch (error) {
        console.error(error);
    }
};

sendConnexionOllamaRequest()