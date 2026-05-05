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

const Groq = require("groq-sdk");

// Groq setup
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

router.get('/generate-solution/:id', async (req, res) => {
    const problemId = req.params.id;

    try {
    
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

  
        const commentsText = problem.comments
            .slice(0, 5)
            .map((comment, index) => `
Comment ${index + 1}:
User: ${comment.user?.name || "Anonymous"}
Text: ${comment.comment || ""}
-------------------
`).join("\n");

        // Prompt
        const prompt = `
Problem Title:
${problem.title}

Problem Description:
${problem.description}

Below are comments from users suggesting solutions:

${commentsText}

Your task:
1. Compare all comments carefully
2. Select the BEST comment
3. Return ONLY:
   Best Comment:
   Reason:

Keep it short.
`;

        // 🔥 GROQ API CALL
        const response = await groq.chat.completions.create({
            model: "llama3-8b-8192",
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            temperature: 0.5,
            max_tokens: 300
        });

        const bestSolution = response.choices[0]?.message?.content || "No solution generated";

        res.json({
            solution: bestSolution
        });

    } catch (error) {
        console.error("FULL ERROR:", error);

        res.status(500).json({
            error: error.message || "Failed to generate solution"
        });
    }
});

module.exports = router;
