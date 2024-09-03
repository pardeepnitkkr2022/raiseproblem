const express = require('express');
const router = express.Router();

const Problem = require('../models/Problem');
require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI( process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


router.get('/generate-solution/:id', async (req, res) => {
    const problemId = req.params.id;

    try {
      

        const problem = await Problem.findById(problemId);
        if (!problem) {
            return res.status(404).json({ error: 'Problem not found' });
        }
       

        const prompt = problem.description;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const aiSolution= response.text();
        res.json({ solution: aiSolution });

       
    } catch (error) {
        console.error('Error generating AI solution:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to generate AI solution' });
    }
});

module.exports = router;
