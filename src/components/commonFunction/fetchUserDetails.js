export const fetchUserData=async(userEmail)=>{
    try {
        const response = await fetch(`https://dream-journal-backend.vercel.app/userDreamsDB/userDetails?userEmail=${userEmail}`,{
            headers: {
                "Content-Type": "application/json" 
            },
        });
        const data = await response.json();
        console.log("Fetched user Details:", data);

        return data;
    } catch (error) {
        console.error("Error fetching dreams:", error);
        return [];
    }
}