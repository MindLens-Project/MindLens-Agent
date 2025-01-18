const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '../.env' })

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function sendConnexionOllamaRequest() {
    const prompt = `Écris un script Node.js utilisant Mineflayer pour :
    1. Créer un bot qui se connecte à un serveur Minecraft en localhost et qui s'appelle MLA.
    2. Affiche "Bot connecté" quand il rejoint le serveur.
    3. fait lui dire bonjour toutes les secondes pendant 10 secondes.
    4. Déconnecte le une fois que toutes les action est fini`;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log("Code généré :\n");
        console.log(text);

        const codeBlock = text.match(/```javascript\n([\s\S]*?)```/);
        if (codeBlock) {
            console.log("Code extrait :", codeBlock[1]);

            const timestamp = new Date().toISOString().replace(/[:.-]/g, '_'); // Remplacer les caractères invalides pour un nom de fichier
            const fileName = `generated_code_${timestamp}.txt`;
            const filePath = path.join(__dirname + '/logs/', fileName);
            
            // Sauvegarder le code généré et le prompt dans un fichier
            const logData = `Prompt envoyé :\n${prompt}\n\nCode généré :\n${codeBlock[1]}`;
            
            fs.writeFileSync(filePath, logData);

            eval(codeBlock[1])
        } else {
            console.log("Aucun code trouvé dans la réponse.");
        }
    } catch (error) {
        console.error(error);
    }
};

sendConnexionOllamaRequest()