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
  // fetching user dreams data

  useEffect(() => {
    const  getUserInfo=async()=>  {
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
          setUserInfo({userName:data.userName,userDetail:{...data.userDetail}});
          setDreamsData(data.dreams)
        } catch (error) {
          console.error("Error fetching dreams:", error);
          return [];
        }
      }

    };
    getUserInfo();
  }, []);
  useEffect(() => {
    const getAllDreams = async () => {
      try {
        console.log("inside fetch all");
        const allDreamsData = await fetchAllDreams();
        setAllDreams(allDreamsData || []);
      } catch (error) {
        console.error("Error fetching all dreams:", error);
      }
    };
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
  let allData = [["Category", "Count"]];
  if (allDreams && allDreams != []) {
    // creating data for graph
    const allEmotionCounts = allDreams.reduce((acc, dream) => {
      acc[dream.dreamEmotion] = (acc[dream.dreamEmotion] || 0) + 1;
      return acc;
    }, {});

    allData = [["Category", "Count"], ...Object.entries(allEmotionCounts)];
  }

  return (
    <div>
      <h3 className={styles.header}>
        Dream Journal Insights: Analyze & Uncover Patterns in Your Dreams
      </h3>

      <div className={styles.graphContainer}>
        <Chart
          chartType="PieChart"
          data={data}
          options={{ title: "Your Dreams Insights" }}
          width={"100%"}
          height={"400px"}
          loader={
            <div className={styles.graphLoader}>
              <h1>Loading..</h1>
            </div>
          }
        />
        <Chart
          chartType="PieChart"
          data={allData}
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
