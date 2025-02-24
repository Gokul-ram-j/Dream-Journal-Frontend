import React, { useEffect, useState } from "react";
import { fetchDreams } from "../commonFunction/fetchUserDreams";
import { Chart } from "react-google-charts";
import styles from "./home.module.css";
import { fetchAllDreams } from "../commonFunction/fetchAllUserDreams";
import { processDreamData } from "../displayDreams/allUserGraphData";
function Home({ userDetails }) {
  const [dreamsData, setDreamsData] = useState([]);
  const [allDreams, setAllDreams] = useState([]);
  // fetching user dreams data
  useEffect(() => {
    const getDreams = async () => {
      if (userDetails?.email) {
        try {
          const dreamData = await fetchDreams(userDetails.email);
          setDreamsData(dreamData);
        } catch (error) {
          console.error("Error fetching dreams:", error);
        }
      }
    };

    const getAllDreams = async () => {
      try {
        console.log("inside fetch all");
        const allDreamsData = await fetchAllDreams(); // Await the async function
        setAllDreams(allDreamsData || []);
      } catch (error) {
        console.error("Error fetching all dreams:", error);
      }
    };

    getDreams();
    getAllDreams();
  }, [userDetails]);

  let data = [["Category", "Count"]];
  if (dreamsData && dreamsData != []) {
    // creating data for graph
    const emotionCounts = dreamsData.reduce((acc, dream) => {
      acc[dream.dreamEmotion] = (acc[dream.dreamEmotion] || 0) + 1;
      return acc;
    }, {});

    data = [["Category", "Count"], ...Object.entries(emotionCounts)];
  }

  return (
    <div>
      <h2 className={styles.header}>
        Dream Journal Insights: Analyze & Uncover Patterns in Your Dreams
      </h2>
      <div className={styles.graphContainer}>
        <Chart
          chartType="PieChart"
          data={data}
          options={{ title: "Your Dreams Insights" }}
          width={"100%"}
          height={"400px"}
          loader={<div className={styles.graphLoader}>
            <h1>Loading..</h1>
          </div>}
        />
        <Chart
          chartType="ColumnChart"
          data={processDreamData(allDreams)}
          options={{ title: "Global User Insights" }}
          width={"100%"}
          height={"400px"}
          loader={<h1>loading..</h1>}
        />
      </div>

    </div>
  );
}

export default Home;
