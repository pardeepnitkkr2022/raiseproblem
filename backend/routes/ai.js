// const express = require('express');
// const router = express.Router();

// const Problem = require('../models/Problem');
// require('dotenv').config();
// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI( process.env.API_KEY);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});


// router.get('/generate-solution/:id', async (req, res) => {
//     const problemId = req.params.id;

//     try {
      

//         const problem = await Problem.findById(problemId);
//         if (!problem) {
//             return res.status(404).json({ error: 'Problem not found' });
//         }
       

//         const prompt = problem.description;

//         const result = await model.generateContent("generate only 5 main points(short and breif points) about :"+prompt);
//         const response = await result.response;
//         const aiSolution= response.text();
//         res.json({ solution: aiSolution });

       
//     } catch (error) {
       
//         console.error('Error generating AI solution:', error.response ? error.response.data : error.message);
//         res.status(500).json({ error: 'Failed to generate AI solution' });
//     }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();

const Problem = require('../models/Problem');
require('dotenv').config();

const { GoogleGenAI } = require("@google/genai");

// New Gemini SDK setup
const ai = new GoogleGenAI({
    apiKey: process.env.API_KEY
});

router.get('/generate-solution/:id', async (req, res) => {
    const problemId = req.params.id;

    try {
        // Fetch problem and populate comment users
        const problem = await Problem.findById(problemId)
            .populate("comments.user", "name");

        if (!problem) {
            return res.status(404).json({
                error: "Problem not found"
            });
        }

        if (!problem.comments || problem.comments.length === 0) {
            return res.status(404).json({
                error: "No comments found for this problem"
            });
        }

        // Convert comments into text for AI
        let commentsText = "";

        problem.comments.forEach((comment, index) => {
            commentsText += `
Comment ${index + 1}:
User: ${comment.user?.name || "Anonymous"}
Text: ${comment.comment || ""}
-------------------
`;
        });

        // Prompt for Gemini
        const prompt = `
Problem Title:
${problem.title}

Problem Description:
${problem.description}

Below are comments from users suggesting solutions:

${commentsText}

Your task:
1. Compare all comments carefully
2. Select the BEST comment that gives the most useful solution
3. Return only:
   - Best Comment
   - Why it is best (short explanation)

Keep the answer short, clear, and useful.
`;

        // New Gemini API call
        const result = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt
        });

        const bestSolution = result.text;

        res.json({
            solution: bestSolution
        });

    } catch (error) {
        console.error("FULL ERROR:", error);

        res.status(500).json({
            error: error.message || "Failed to find best solution from comments"
        });
    }
});

module.exports = router;
