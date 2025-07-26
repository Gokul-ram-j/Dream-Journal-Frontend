import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AddDreams.module.css";
import { getAnalysis } from "../commonFunction/getAnalysis"; 
function AddDreams({ userDetails = { email: "user@example.com" } }) {
  const [formData, setFormData] = useState({
    dreamTitle: "",
    dreamDesc: "",
    dreamEmotion: "",
  });

  const [loading, setLoading] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);

  const typewriterWords = ["Save Your Dreams Here", "Unveil the Hidden Meanings", "Explore Your Subconscious"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % typewriterWords.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setFormData((data) => ({
      ...data,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAnalysing(true);

    try {
      // const analysis = await getAnalysis(formData.dreamDesc);
      setAnalysing(false);
      setLoading(true);

      const dreamDataString = encodeURIComponent(
        // JSON.stringify({ ...formData, dreamAnalysis: analysis })
        JSON.stringify({ ...formData, dreamAnalysis: "Unlock AI Dream Analysis by $199/month" }) // Placeholder for analysis
      );

      const url = `https://dream-journal-backend.vercel.app/userDreamsDB/addUserDream?userEmail=${userDetails.email}&dreamData=${dreamDataString}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Response:", await response.json());
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      setAnalysing(false);
      setFormData({ dreamTitle: "", dreamDesc: "", dreamEmotion: "" });
    }
  };

  const emotionOptions = [
    { value: "joy", label: "😀 Joy / Happiness" },
    { value: "love", label: "❤️ Love / Affection" },
    { value: "relief", label: "😌 Relief" },
    { value: "curiosity", label: "🤔 Curiosity / Wonder" },
    { value: "empowerment", label: "💪 Empowerment / Confidence" },
    { value: "fear", label: "😨 Fear / Anxiety" },
    { value: "sadness", label: "😢 Sadness / Grief" },
    { value: "anger", label: "😡 Anger / Frustration" },
    { value: "shame", label: "😳 Shame / Embarrassment" },
    { value: "helplessness", label: "😞 Helplessness / Powerlessness" },
    { value: "nostalgia", label: "🥹 Nostalgia" },
    { value: "confusion", label: "😵 Confusion / Disorientation" },
    { value: "surprise", label: "😲 Surprise / Shock" },
    { value: "guilt", label: "😔 Guilt / Regret" },
    { value: "lucid-excitement", label: "😃 Lucid Excitement" },
  ];

  const floatingStars = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      className={styles.star}
      style={{
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }}
      animate={{
        opacity: [0.3, 1, 0.3],
        scale: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 2 + Math.random() * 3,
        repeat: Infinity,
        delay: Math.random() * 2,
      }}
    />
  ));

  return (
    <div className={styles.container}>
      {/* Animated background elements */}
      <div className={styles.backgroundElements}>
        {floatingStars}
        <motion.div
          className={`${styles.floatingBlob} ${styles.blob1}`}
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`${styles.floatingBlob} ${styles.blob2}`}
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1 }}
        className={styles.contentWrapper}
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.8 }}
          className={styles.headerWrapper}
        >
          <motion.div className={styles.headerContainer}>
            <h1 className={styles.mainTitle}>Dream Journal</h1>
            <div className={styles.subtitleContainer}>
              <AnimatePresence mode="wait">
                <motion.h3
                  key={currentWord}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className={styles.subtitle}
                >
                  {typewriterWords[currentWord]}
                </motion.h3>
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>

        {/* Form */}
        <motion.form 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ duration: 0.8 }}
          onSubmit={handleSubmit} 
          className={styles.dreamForm}
        >
          <div className={styles.formContainer}>
            {/* Dream Title */}
            <motion.div className={styles.inputGroup}>
              <label className={styles.label}>Dream Title</label>
              <motion.input
                className={styles.formInput}
                onChange={handleChange}
                name="dreamTitle"
                placeholder="Give your dream a title..."
                type="text"
                required
                value={formData.dreamTitle}
              />
            </motion.div>

            {/* Dream Description */}
            <motion.div className={styles.inputGroup}>
              <label className={styles.label}>Dream Description</label>
              <motion.textarea
                className={`${styles.formInput} ${styles.textarea}`}
                rows={5}
                onChange={handleChange}
                name="dreamDesc"
                placeholder="Describe your dream in detail..."
                required
                value={formData.dreamDesc}
              />
            </motion.div>

            {/* Emotion Selection */}
            <motion.div className={styles.inputGroup}>
              <label className={styles.label}>Emotion</label>
              <motion.select
                required
                className={styles.formInput}
                name="dreamEmotion"
                onChange={handleChange}
                value={formData.dreamEmotion}
              >
                <option value="">Select the dominant emotion...</option>
                {emotionOptions.map((emotion) => (
                  <option key={emotion.value} value={emotion.value}>
                    {emotion.label}
                  </option>
                ))}
              </motion.select>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={loading || analysing}
              className={styles.submitButton}
              type="submit"
            >
              <AnimatePresence mode="wait">
                {analysing ? (
                  <motion.div
                    key="analysing"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.buttonContent}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className={styles.spinner}
                    />
                    <span>Analyzing Dream...</span>
                  </motion.div>
                ) : loading ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.buttonContent}
                  >
                    <div className={styles.loadingDots}>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity }}
                        className={styles.dot}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                        className={styles.dot}
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                        className={styles.dot}
                      />
                    </div>
                    <span>Submitting...</span>
                  </motion.div>
                ) : (
                  <motion.span
                    key="submit"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={styles.buttonContent}
                  >
                    <span>✨ Add Dream</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </motion.form>

        {/* Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className={styles.footer}
        >
          Your dreams hold the keys to understanding yourself
        </motion.p>
      </motion.div>
    </div>
  );
}

export default AddDreams;