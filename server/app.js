const express = require('express');
const app = express();
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Import OpenAI SDK
// const { OpenAI } = require('openai');
// import OpenAI from "openai";
const OpenAI = require('openai');

// Initialize OpenAI client with your API key
const openai = new OpenAI(process.env.OPENAI_API_KEY);

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

const getClientJson = (clientId) => {
    const defaultJson = {
        system: [],
        assistant: []
    }
    let jsonContext = defaultJson;
    const jsonFolderPath = path.join(__dirname, 'clientJsons');
    const jsonFileName = `${clientId}.json`;
    const jsonFilePath = path.join(jsonFolderPath, jsonFileName);

    if (fs.existsSync(jsonFilePath)) {
        jsonContext = require(jsonFilePath)
    } else {
        console.error('JSON file not found');
    }
    return jsonContext
}

app.post('/api/openai', async (req, res) => {
    try {
        const jsonContext = getClientJson(req.body.clientId)
        const completionResponse = await openai.chat.completions.create({
            messages: [
                ...jsonContext.system.map(content => ({ role: "system", content })),
                ...jsonContext.assistant.map(content => ({ role: "assistant", content })),
                { role: "user", content: req.body.prompt }
            ],
            model: "gpt-3.5-turbo",
        });
        console.log(completionResponse.choices[0]);
        res.json(completionResponse);
    } catch (error) {
        console.error('Error processing OpenAI request:', error);
        res.status(500).send('Error processing OpenAI request');
    }
});

app.get('/api/data', (req, res) => {
    res.json({ message: 'Select text or type in a more fine tuned your question.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

