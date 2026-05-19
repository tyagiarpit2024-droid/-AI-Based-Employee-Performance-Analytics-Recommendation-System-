const axios = require('axios');

// @desc    Get AI recommendation
// @route   POST /api/ai/recommend
// @access  Private
const getRecommendation = async (req, res, next) => {
  try {
    const { title, description, category, location } = req.body;

    const prompt = `You are an AI assistant for a Smart Complaint Management System. Analyze the following complaint and return a precise JSON object with four keys: 'priority' (Low, Medium, High), 'department' (e.g. Water, Electricity, Roads, Sanitation, etc.), 'summary' (a brief 1-sentence summary), and 'response' (a polite auto-generated response to the citizen).

Complaint Title: ${title}
Category: ${category}
Location: ${location}
Description: ${description}

Respond ONLY with valid JSON. Do not include any other text or markdown formatting like \`\`\`json.`;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const aiMessage = response.data.choices[0].message.content;
    
    // Attempt to parse JSON. Sometimes AI returns markdown wrapped JSON
    let parsedData;
    try {
      const cleanJsonStr = aiMessage.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleanJsonStr);
    } catch (e) {
      // Fallback if parsing fails
      parsedData = {
        priority: "Medium",
        department: "General Administration",
        summary: "Complaint regarding " + category,
        response: "Your complaint has been received and will be reviewed shortly.",
        raw: aiMessage
      };
    }

    res.json(parsedData);
  } catch (err) {
    console.error('AI Error:', err.response ? err.response.data : err.message);
    res.status(500);
    next(new Error('Failed to generate AI analysis'));
  }
};

module.exports = {
  getRecommendation
};
