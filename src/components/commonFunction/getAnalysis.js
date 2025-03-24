export const getAnalysis = async (dreamDesc) => {
    

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`, // Replace with your actual API key
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo-0613",
          messages: [
            {
              role: "user",
              content: `Give a dream analysis for the given dream description: ${dreamDesc}`,
            },
          ],
        }),
      });

      if (!res.ok) {
        throw new Error(`API error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error fetching dream analysis:", error);
      return "Failed to fetch dream analysis. Please try again later.";
    } 
  };