export const fetchDreams = async (email) => {
    try {
      const response = await fetch(
        `https://dream-journal-backend.vercel.app/userDreamsDB/getUserDreams?userEmail=${encodeURIComponent(email)}`
      );

      const data = await response.json();
      console.log("Fetched user Dreams:", data);

      if (Array.isArray(data)) {
        return(data);
      } else {
        console.warn("Unexpected response format:", data);
      }
    } catch (error) {
      console.error("Error fetching dreams:", error);
    } 
  };