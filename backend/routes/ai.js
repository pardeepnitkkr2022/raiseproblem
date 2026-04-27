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

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-latest"
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

        let commentsText = "";

        problem.comments.forEach((comment, index) => {
            commentsText += `
Comment ${index + 1}:
User: ${comment.user?.name || "Anonymous"}
Text: ${comment.comment || ""}
-------------------
`;
        });

        const prompt = `
Problem Title:
${problem.title}

Problem Description:
${problem.description}

Below are comments from users suggesting solutions:

${commentsText}

Select the BEST comment that provides the most useful solution.

Return only:
1. Best Comment
2. Why it is best (short explanation)

Keep it short and clear.
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const bestSolution = response.text();

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
