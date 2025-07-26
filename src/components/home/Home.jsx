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
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDreams: 0,
    mostCommonEmotion: '',
    streakDays: 0,
    avgDreamsPerWeek: 0
  });

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
          calculateStats(data.dreams);
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching all dreams:", error);
        setLoading(false);
      }
    };
    getAllDreams();
  }, []);

  const calculateStats = (dreams) => {
    if (!dreams || dreams.length === 0) return;
    
    const emotionCounts = dreams.reduce((acc, dream) => {
      acc[dream.dreamEmotion] = (acc[dream.dreamEmotion] || 0) + 1;
      return acc;
    }, {});
    
    const mostCommon = Object.entries(emotionCounts).reduce((a, b) => 
      emotionCounts[a[0]] > emotionCounts[b[0]] ? a : b
    )[0];
    
    const weekCount = Math.ceil(dreams.length / 7);
    
    setStats({
      totalDreams: dreams.length,
      mostCommonEmotion: mostCommon,
      streakDays: Math.min(dreams.length, 30), // Simplified streak calculation
      avgDreamsPerWeek: Math.round((dreams.length / weekCount) * 10) / 10
    });
  };

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

  const chartOptions = {
    backgroundColor: 'transparent',
    titleTextStyle: {
      color: '#2c3e50',
      fontSize: 18,
      fontName: 'Inter, sans-serif',
      bold: true
    },
    legend: {
      textStyle: {
        color: '#34495e',
        fontSize: 12,
        fontName: 'Inter, sans-serif'
      },
      position: 'bottom'
    },
    pieChart: {
      colors: ['#3498db', '#e74c3c', '#f39c12', '#2ecc71', '#9b59b6', '#1abc9c', '#e67e22'],
      pieSliceTextStyle: {
        color: 'white',
        fontSize: 12,
        fontName: 'Inter, sans-serif'
      }
    },
    hAxis: {
      textStyle: {
        color: '#7f8c8d',
        fontSize: 11,
        fontName: 'Inter, sans-serif'
      }
    },
    vAxis: {
      textStyle: {
        color: '#7f8c8d',
        fontSize: 11,
        fontName: 'Inter, sans-serif'
      }
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading your dream insights...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          Dream Journal Insights
        </h1>
        <p className={styles.heroSubtitle}>
          Discover patterns and uncover the mysteries within your dreams
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🌙</div>
          <div className={styles.statValue}>{stats.totalDreams}</div>
          <div className={styles.statLabel}>Total Dreams</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💭</div>
          <div className={styles.statValue}>{stats.mostCommonEmotion}</div>
          <div className={styles.statLabel}>Most Common Emotion</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔥</div>
          <div className={styles.statValue}>{stats.streakDays}</div>
          <div className={styles.statLabel}>Day Streak</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statValue}>{stats.avgDreamsPerWeek}</div>
          <div className={styles.statLabel}>Dreams/Week</div>
        </div>
      </div>

      <div className={styles.chartsSection}>
        <h2 className={styles.sectionTitle}>Visual Analytics</h2>
        
        <div className={styles.chartGrid}>
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Your Dream Emotions</h3>
              <span className={styles.chartBadge}>Personal</span>
            </div>
            <Chart
              chartType="PieChart"
              data={processData(dreamsData)}
              options={{
                ...chartOptions,
                colors: chartOptions.pieChart.colors,
                pieSliceTextStyle: chartOptions.pieChart.pieSliceTextStyle,
                title: ""
              }}
              width={"100%"}
              height={"350px"}
            />
          </div>
          
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Global Dream Patterns</h3>
              <span className={styles.chartBadge}>Community</span>
            </div>
            <Chart
              chartType="PieChart"
              data={processData(allDreams)}
              options={{
                ...chartOptions,
                colors: chartOptions.pieChart.colors,
                pieSliceTextStyle: chartOptions.pieChart.pieSliceTextStyle,
                title: ""
              }}
              width={"100%"}
              height={"350px"}
            />
          </div>
          
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Emotion Frequency</h3>
              <span className={styles.chartBadge}>Analysis</span>
            </div>
            <Chart
              chartType="BarChart"
              data={processData(dreamsData)}
              options={{
                ...chartOptions,
                colors: ['#3498db'],
                title: ""
              }}
              width={"100%"}
              height={"350px"}
            />
          </div>
          
          <div className={styles.chartCard}>
            <div className={styles.chartHeader}>
              <h3>Dream Logging Timeline</h3>
              <span className={styles.chartBadge}>Trends</span>
            </div>
            <Chart
              chartType="LineChart"
              data={processTimeData(dreamsData)}
              options={{
                ...chartOptions,
                colors: ['#e74c3c'],
                curveType: 'function',
                title: ""
              }}
              width={"100%"}
              height={"350px"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;