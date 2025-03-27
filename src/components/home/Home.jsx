import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import styles from "./home.module.css";
import { fetchAllDreams } from "../commonFunction/fetchAllUserDreams";

function Home({ userDetails }) {
  const [userInfo, setUserInfo] = useState({
    userName: "",
    userDetail: {},
  });
  const [dreamsData, setDreamsData] = useState([]);
  const [allDreams, setAllDreams] = useState([]);

  useEffect(() => {
    const getUserInfo = async () => {
      if (userDetails.email) {
        try {
          const response = await fetch(
            `https://dream-journal-backend.vercel.app/userDreamsDB/userDetails?userEmail=${userDetails.email}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          setUserInfo({ userName: data.userName, userDetail: { ...data.userDetail } });
          setDreamsData(data.dreams);
        } catch (error) {
          console.error("Error fetching dreams:", error);
        }
      }
    };
    getUserInfo();
  }, [userDetails]);

  useEffect(() => {
    const getAllDreams = async () => {
      try {
        const allDreamsData = await fetchAllDreams();
        setAllDreams(allDreamsData || []);
      } catch (error) {
        console.error("Error fetching all dreams:", error);
      }
    };
    getAllDreams();
  }, []);

  const processData = (dreams) => {
    if (!dreams || dreams.length === 0) {
      return [["Category", "Count"], ["No Data", 0]];
    }
    const emotionCounts = dreams.reduce((acc, dream) => {
      acc[dream.dreamEmotion] = (acc[dream.dreamEmotion] || 0) + 1;
      return acc;
    }, {});
    return [["Category", "Count"], ...Object.entries(emotionCounts)];
  };
  
  const processTimeData = (dreams) => {
    if (!dreams || dreams.length === 0) {
      return [["Date", "Dreams Logged"], ["No Data", 0]];
    }
    const dateCounts = dreams.reduce((acc, dream) => {
      const date = dream.dateLogged.split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});
    return [["Date", "Dreams Logged"], ...Object.entries(dateCounts)];
  };
  


  return (
    <div>
      <h3 className={styles.header}>
        Dream Journal Insights: Analyze & Uncover Patterns in Your Dreams
      </h3>

      <div className={styles.graphContainer}>
        <Chart
          chartType="PieChart"
          data={processData(dreamsData)}
          options={{ title: "Your Dreams Insights" }}
          width={"100%"}
          height={"400px"}
        />
        <Chart
          chartType="PieChart"
          data={processData(allDreams)}
          options={{ title: "Global User Insights" }}
          width={"100%"}
          height={"400px"}
        />
        <Chart
          chartType="BarChart"
          data={processData(dreamsData)}
          options={{ title: "Your Dream Emotion Frequency" }}
          width={"100%"}
          height={"400px"}
        />
        <Chart
          chartType="LineChart"
          data={processTimeData(dreamsData)}
          options={{ title: "Dream Logging Trends Over Time" }}
          width={"100%"}
          height={"400px"}
        />
      </div>
    </div>
  );
}

export default Home;
