export const fetchAllDreams = async () => {
    console.log("fetchAllDreams called!"); // Debug log
    try {
        const response = await fetch('http://localhost:8000/userDreamsDB/getAllUserDreams');
        
        console.log("Response received:", response);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched all Dreams:", data);

        return Array.isArray(data.dreams) ? data.dreams : []; 
    } catch (error) {
        console.error("Error fetching dreams:", error);
        return [];
    }
};
