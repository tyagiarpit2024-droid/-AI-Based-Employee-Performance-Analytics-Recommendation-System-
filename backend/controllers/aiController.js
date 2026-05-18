const axios = require('axios');

// @desc    Get AI recommendations for an employee
// @route   POST /api/ai/recommend
// @access  Private
const getAIRecommendations = async (req, res, next) => {
  try {
    const { name, department, skills, performanceScore, experience } = req.body;

    if (!name || !department || !skills || !performanceScore || !experience) {
      res.status(400);
      throw new Error('Please provide all employee details for recommendation');
    }

    const prompt = `
Analyze this employee:
Name: ${name}
Department: ${department}
Skills: ${Array.isArray(skills) ? skills.join(', ') : skills}
Performance Score: ${performanceScore}/100
Experience: ${experience} years

Give:
1. Promotion Recommendation
2. Training Suggestions
3. Feedback
4. Ranking Insight

Return a clean JSON response strictly in this format without markdown code blocks:
{
  "promotionRecommendation": "string",
  "trainingSuggestions": ["string", "string"],
  "feedback": "string",
  "rankingInsight": "string"
}
`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo', // You can change to a free model if needed like 'google/gemini-pro'
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiText = response.data.choices[0].message.content;
    
    // Parse the JSON string carefully
    let parsedData;
    try {
      // Remove any markdown JSON blocks if present
      const cleanedText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('AI Response Parsing Error:', parseError);
      console.log('Raw AI Text:', aiText);
      // Fallback response if AI doesn't return perfect JSON
      parsedData = {
        promotionRecommendation: "Could not generate specifically.",
        trainingSuggestions: ["General upskilling"],
        feedback: aiText,
        rankingInsight: "Data unavailable"
      };
    }

    res.status(200).json(parsedData);
  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    res.status(500);
    next(new Error('Failed to fetch AI recommendations'));
  }
};

module.exports = {
  getAIRecommendations,
};
