import React, { useEffect, useState } from "react";
import { fetchDreams } from "../commonFunction/fetchUserDreams";
import styles from "./displaydreams.module.css";
import Loading from "../Loading/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTimes,
  faTrash,
  faChartBar,
  faEyeSlash,
  faCalendarAlt,
  faHeart,
  faMoon,
  faSearch,
  faFilter,
  faSortAmountDown,
} from "@fortawesome/free-solid-svg-icons";
import { motion, AnimatePresence } from "framer-motion";
import { getAnalysis } from "../commonFunction/getAnalysis";

function DisplayDreams({ userDetails }) {
  const [dreams, setDreams] = useState([]);
  const [filteredDreams, setFilteredDreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEmotion, setFilterEmotion] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const emotions = [
    "joy", "love", "relief", "curiosity", "empowerment",
    "fear", "sadness", "anger", "shame", "helplessness",
    "nostalgia", "confusion", "surprise", "guilt", "lucid-excitement"
  ];

  useEffect(() => {
    const getDreams = async () => {
      if (userDetails?.email) {
        setLoading(true);
        try {
          const dreamData = await fetchDreams(userDetails.email);
          setDreams(dreamData || []);
          setFilteredDreams(dreamData || []);
        } catch (error) {
          console.error("Error fetching user-specific dreams:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    getDreams();
  }, [userDetails]);

  // Filter and search functionality
  useEffect(() => {
    let filtered = dreams;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(dream =>
        dream.dreamTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dream.dreamDesc.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Emotion filter
    if (filterEmotion) {
      filtered = filtered.filter(dream => dream.dreamEmotion === filterEmotion);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.dateLogged) - new Date(a.dateLogged);
        case "oldest":
          return new Date(a.dateLogged) - new Date(b.dateLogged);
        case "title":
          return a.dreamTitle.localeCompare(b.dreamTitle);
        default:
          return 0;
      }
    });

    setFilteredDreams(filtered);
  }, [dreams, searchTerm, filterEmotion, sortBy]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterEmotion("");
    setSortBy("newest");
  };

  return (
    <div className={styles.container}>
      <div className={styles.heroSection}>
        <h1 className={styles.heroTitle}>
          <FontAwesomeIcon icon={faMoon} className={styles.heroIcon} />
          Your Dream Collection
        </h1>
        <p className={styles.heroSubtitle}>
          Explore and manage your personal dream journal entries
        </p>
        
        <div className={styles.statsBar}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{dreams.length}</span>
            <span className={styles.statLabel}>Total Dreams</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>
              {filteredDreams.length}
            </span>
            <span className={styles.statLabel}>Showing</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className={styles.loadingWrapper}>
          <Loading />
        </div>
      ) : dreams.length > 0 ? (
        <>
          <div className={styles.controlsSection}>
            <div className={styles.searchBar}>
              <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
              <input
                type="text"
                placeholder="Search dreams by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <FontAwesomeIcon icon={faFilter} className={styles.filterIcon} />
                <select
                  value={filterEmotion}
                  onChange={(e) => setFilterEmotion(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="">All Emotions</option>
                  {emotions.map(emotion => (
                    <option key={emotion} value={emotion}>
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.filterGroup}>
                <FontAwesomeIcon icon={faSortAmountDown} className={styles.filterIcon} />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className={styles.filterSelect}
                >
                  <option value="newest">Oldest First</option>
                  <option value="oldest">Newest First</option>
                  <option value="title">By Title</option>
                </select>
              </div>
              
              {(searchTerm || filterEmotion || sortBy !== "newest") && (
                <button onClick={clearFilters} className={styles.clearFilters}>
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          <div className={styles.dreamsGrid}>
            <AnimatePresence>
              {filteredDreams.map((data, index) => (
                <DreamsContainer
                  loading={loading}
                  setLoading={setLoading}
                  dreams={dreams}
                  setDreams={setDreams}
                  key={data._id}
                  data={data}
                  email={userDetails.email}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      ) : (
        <NoDreamData />
      )}
    </div>
  );
}

const DreamsContainer = ({
  data,
  email,
  dreams,
  setDreams,
  loading,
  setLoading,
  index,
}) => {
  const [editing, setEditing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [title, setTitle] = useState(data.dreamTitle);
  const [category, setCategory] = useState(data.dreamEmotion);
  const [description, setDescription] = useState(data.dreamDesc);
  const [analysis, setAnalysis] = useState(data.dreamAnalysis);

  const date = new Date(data.dateLogged);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const getEmotionColor = (emotion) => {
    const emotionColors = {
      joy: '#f39c12',
      love: '#e74c3c',
      relief: '#2ecc71',
      curiosity: '#9b59b6',
      empowerment: '#3498db',
      fear: '#34495e',
      sadness: '#5dade2',
      anger: '#e74c3c',
      shame: '#8e44ad',
      helplessness: '#95a5a6',
      nostalgia: '#f1c40f',
      confusion: '#e67e22',
      surprise: '#1abc9c',
      guilt: '#c0392b',
      'lucid-excitement': '#00bcd4'
    };
    return emotionColors[emotion] || '#667eea';
  };

  const handleCancelEditing = () => {
    setEditing(false);
    setTitle(data.dreamTitle);
    setCategory(data.dreamEmotion);
    setDescription(data.dreamDesc);
  };

  const handleSaveEditing = async () => {
    setEditing(false);
    setLoading(true);

    try {
      const updatedDreamDescAnalysis = await getAnalysis(description);
      const updatedDreamData = {
        title: title,
        category: category,
        description: description,
        analysis: updatedDreamDescAnalysis,
      };

      const response = await fetch(
        `https://dream-journal-backend.vercel.app/userDreamsDB/editUserDream`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            dreamDataId: data._id,
            updatedData: updatedDreamData,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update dream data");
      }

      const result = await response.json();
      setDreams((prevDreams) =>
        prevDreams.map((dream) =>
          dream._id === data._id
            ? {
                ...dream,
                dreamTitle: title,
                dreamEmotion: category,
                dreamDesc: description,
                analysis: updatedDreamDescAnalysis,
              }
            : dream
        )
      );

      setAnalysis(updatedDreamDescAnalysis);
    } catch (error) {
      console.error("Error updating dream:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDream = async () => {
    if (!window.confirm("Are you sure you want to delete this dream?")) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        "https://dream-journal-backend.vercel.app/userDreamsDB/deleteUserDream",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userEmail: email,
            dreamId: data._id,
          }),
        }
      );
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);

      setDreams((prevDreams) =>
        prevDreams.filter((dreams) => dreams._id !== data._id)
      );
    } catch (error) {
      console.error("Error deleting dream:", error);
    } finally {
      setLoading(false);
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: { 
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut" 
      }
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className={styles.dreamCard}
    >
      <div 
        className={styles.emotionBadge}
        style={{ backgroundColor: getEmotionColor(category) }}
      >
        <FontAwesomeIcon icon={faHeart} />
        {category}
      </div>

      <div className={styles.cardContent}>
        {editing ? (
          <div className={styles.editingForm}>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.editTitle}
              placeholder="Dream title..."
            />
            <select
              className={styles.editCategory}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select Emotion</option>
              <option value="joy">Joy / Happiness</option>
              <option value="love">Love / Affection</option>
              <option value="relief">Relief</option>
              <option value="curiosity">Curiosity / Wonder</option>
              <option value="empowerment">Empowerment / Confidence</option>
              <option value="fear">Fear / Anxiety</option>
              <option value="sadness">Sadness / Grief</option>
              <option value="anger">Anger / Frustration</option>
              <option value="shame">Shame / Embarrassment</option>
              <option value="helplessness">Helplessness / Powerlessness</option>
              <option value="nostalgia">Nostalgia</option>
              <option value="confusion">Confusion / Disorientation</option>
              <option value="surprise">Surprise / Shock</option>
              <option value="guilt">Guilt / Regret</option>
              <option value="lucid-excitement">Lucid Excitement</option>
            </select>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={styles.editDescription}
              rows={6}
              placeholder="Describe your dream..."
            />
          </div>
        ) : (
          <>
            {showAnalysis ? (
              <div className={styles.analysisView}>
                <h2 className={styles.dreamTitle}>{title}</h2>
                <div className={styles.analysisContent}>
                  <h4>Dream Analysis</h4>
                  <p className={styles.analysisText}>{analysis}</p>
                </div>
              </div>
            ) : (
              <div className={styles.dreamView}>
                <h2 className={styles.dreamTitle}>{title}</h2>
                <p className={styles.dreamDescription}>{description}</p>
              </div>
            )}
          </>
        )}
      </div>

      <div className={styles.cardFooter}>
        <div className={styles.dateInfo}>
          <FontAwesomeIcon icon={faCalendarAlt} className={styles.dateIcon} />
          <span className={styles.dateText}>{formattedDate}</span>
        </div>

        <div className={styles.actionButtons}>
          {!editing ? (
            <>
              {!showAnalysis ? (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className={`${styles.actionButton} ${styles.editButton}`}
                    title="Edit dream"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => setShowAnalysis(true)}
                    className={`${styles.actionButton} ${styles.analysisButton}`}
                    title="Show analysis"
                  >
                    <FontAwesomeIcon icon={faChartBar} />
                  </button>
                  <button
                    onClick={handleDeleteDream}
                    className={`${styles.actionButton} ${styles.deleteButton}`}
                    title="Delete dream"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowAnalysis(false)}
                  className={`${styles.actionButton} ${styles.backButton}`}
                  title="Back to dream"
                >
                  <FontAwesomeIcon icon={faEyeSlash} />
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleSaveEditing}
                className={`${styles.actionButton} ${styles.saveButton}`}
                title="Save changes"
              >
                <FontAwesomeIcon icon={faSave} />
              </button>
              <button
                onClick={handleCancelEditing}
                className={`${styles.actionButton} ${styles.cancelButton}`}
                title="Cancel editing"
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const NoDreamData = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={styles.noDreamData}
    >
      <div className={styles.emptyStateIcon}>🌙</div>
      <h3 className={styles.emptyStateTitle}>No Dreams Yet</h3>
      <p className={styles.emptyStateText}>
        Start your dream journey by adding your first dream entry
      </p>
    </motion.div>
  );
};

export default DisplayDreams;