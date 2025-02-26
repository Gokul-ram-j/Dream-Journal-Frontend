import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import styles from "./home.module.css";
import { fetchAllDreams } from "../commonFunction/fetchAllUserDreams";
import { fetchUserData } from "../commonFunction/fetchUserDetails";
function Home({ userDetails }) {
  const [userDetail,setUserDetail]=useState({})
  const [dreamsData, setDreamsData] = useState([]);
  const [allDreams, setAllDreams] = useState([]);
  // fetching user dreams data
  useEffect(() => {
    const getUserDetail = async () => {
      if (userDetails?.email) {
        try {
          const userDataResponse = await fetchUserData(userDetails.email);
          setUserDetail(userDataResponse.userData)
          setDreamsData(userDataResponse.userData.dreams)
        } catch (error) {
          console.error("Error fetching dreams:", error);
        }
      }
    };

    const getAllDreams = async () => {
      try {
        console.log("inside fetch all");
        const allDreamsData = await fetchAllDreams(); 
        setAllDreams(allDreamsData || []);
      } catch (error) {
        console.error("Error fetching all dreams:", error);
      }
    };
    getUserDetail();
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

      <h1 className={styles.greetHeader}>hello {userDetail.userName}</h1>
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
