export const getAnalysis = async (dreamDesc) => {
  console.log(import.meta.env.VITE_GROQ_API_KEY);
  try {
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-70b-versatile", // Free model with good performance
        messages: [
          {
            role: "system",
            content: "You are a professional dream analyst. Provide insightful, psychological interpretations of dreams. Focus on symbolism, emotions, and potential meanings. Keep responses between 150-300 words.",
          },
          {
            role: "user",
            content: `Please analyze this dream and provide insights about its potential meaning, symbolism, and psychological significance: ${dreamDesc}`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      throw new Error(`Groq API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching dream analysis from Groq:", error);
    return "Unable to analyze your dream at the moment. Please try again later.";
  }
};