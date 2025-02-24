const dreamEmotions = [
    "joy",
    "love",
    "relief",
    "curiosity",
    "empowerment",
    "fear",
    "sadness",
    "anger",
    "shame",
    "helplessness",
    "nostalgia",
    "confusion",
    "surprise",
    "guilt",
    "lucid-excitement"
  ];
  
  const emotionColors = {
    joy: "#FFD700",
    love: "#FF69B4",
    relief: "#32CD32",
    curiosity: "#8A2BE2",
    empowerment: "#FF4500",
    fear: "#DC143C",
    sadness: "#4682B4",
    anger: "#8B0000",
    shame: "#A9A9A9",
    helplessness: "#708090",
    nostalgia: "#FF8C00",
    confusion: "#9370DB",
    surprise: "#FF6347",
    guilt: "#696969",
    "lucid-excitement": "#00FFFF"
  };
  
  // Function to process dream data and count emotions
 export const processDreamData = (dreams) => {
    const emotionCount = dreams.reduce((acc, dream) => {
      acc[dream.dreamEmotion] = (acc[dream.dreamEmotion] || 0) + 1;
      return acc;
    }, {});
  
    // Convert to required format
    const processedData = [
      ["Dream Emotion", "Count", { role: "style" }], // Header row
      ...dreamEmotions.map(emotion => [
        emotion, 
        emotionCount[emotion] || 0, 
        emotionColors[emotion] || "#808080" // Default gray color if missing
      ])
    ];
    console.log(processedData)
    return processedData;
  };
  
  // Example usage
  // const sdata = processDreamData(dreams);
  // console.log(sdata);
  