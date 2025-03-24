import React, { useState } from "react";
import { motion } from "framer-motion";
import styles from "./AddDreams.module.css";
import { Typewriter } from "react-simple-typewriter";
import { getAnalysis } from "../commonFunction/getAnalysis";
import { FaRegSmile, FaRegSadTear, FaRegMeh } from "react-icons/fa";

function AddDreams({ userDetails }) {
  const [formData, setFormData] = useState({
    dreamTitle: "",
    dreamDesc: "",
    dreamEmotion: "",
  });

  const [loading, setLoading] = useState(false);
  const [analysing, setAnalysing] = useState(false);

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
      const analysis = await getAnalysis(formData.dreamDesc);
      setAnalysing(false);
      setLoading(true);

      const dreamDataString = encodeURIComponent(
        JSON.stringify({ ...formData, dreamAnalysis: analysis })
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
      setFormData({ dreamTitle: "", dreamDesc: "", dreamEmotion: "" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} className={styles.container}>
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8 }} className={styles.headerWrapper}>
        <h3 className={styles.header}>
          <Typewriter loop words={["Save Your Dreams Here", "Unveil the Hidden Meanings of Your Nightly Adventures"]} />
        </h3>
      </motion.div>
      <motion.form initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.8 }} onSubmit={handleSubmit} className={styles.dreamForm}>
        <input className={styles.formInput} onChange={handleChange} name="dreamTitle" placeholder="Dream Title" type="text" required value={formData.dreamTitle} />
        <textarea className={styles.formInput} rows={5} onChange={handleChange} name="dreamDesc" placeholder="Dream Description" required value={formData.dreamDesc} />
        <select required className={styles.formInput} name="dreamEmotion" onChange={handleChange} value={formData.dreamEmotion}>
          <option value="">Select Emotion</option>
          <option value="joy">😀 Joy / Happiness</option>
          <option value="love">❤️ Love / Affection</option>
          <option value="relief">😌 Relief</option>
          <option value="curiosity">🤔 Curiosity / Wonder</option>
          <option value="empowerment">💪 Empowerment / Confidence</option>
          <option value="fear">😨 Fear / Anxiety</option>
          <option value="sadness">😢 Sadness / Grief</option>
          <option value="anger">😡 Anger / Frustration</option>
          <option value="shame">😳 Shame / Embarrassment</option>
          <option value="helplessness">😞 Helplessness / Powerlessness</option>
          <option value="nostalgia">🥹 Nostalgia</option>
          <option value="confusion">😵 Confusion / Disorientation</option>
          <option value="surprise">😲 Surprise / Shock</option>
          <option value="guilt">😔 Guilt / Regret</option>
          <option value="lucid-excitement">😃 Lucid Excitement</option>
        </select>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} disabled={loading || analysing} className={styles.AddBtn} type="submit">
          {analysing ? "Analysing.." : loading ? "Submitting.." : "Add Dream"}
        </motion.button>
      </motion.form>
    </motion.div>
  );
}

export default AddDreams;
