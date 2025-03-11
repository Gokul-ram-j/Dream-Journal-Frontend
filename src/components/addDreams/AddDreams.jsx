import React, { useState } from "react";
import styles from "./AddDreams.module.css";
import { Typewriter } from "react-simple-typewriter";

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
      ...data, // Keep existing form data
      [e.target.name]: e.target.value, // Update the changed field
    }));
  };

  const getAnalysis = async (dreamDesc) => {
    setLoading(false);
    setAnalysing(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer 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`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Give a dream analysis for the given dream description ${dreamDesc}`,
            },
          ],
        }),
      });

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "No Analysis ";
    } catch (error) {
      console.error("Error fetching response:", error);
    } finally {
      setAnalysing(false);
      setLoading(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Convert formData to a JSON string and encode it
    const dreamDataString = encodeURIComponent(
      JSON.stringify({
        ...formData,
        dreamAnalysis: await getAnalysis(formData.dreamDesc),
      })
    );

    const url = `https://dream-journal-backend.vercel.app/userDreamsDB/addUserDream?userEmail=${userDetails.email}&dreamData=${dreamDataString}`;
    // for testing
    // const url = `http://localhost:8000/userDreamsDB/addUserDream?userEmail=${userDetails.email}&dreamData=${dreamDataString}`;
    try {
      setLoading(true);
      await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log(err));
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      setFormData({
        dreamTitle: "",
        dreamDesc: "",
        dreamEmotion: "",
      })
    }
  };

  // localhost:8000/userDreamsDB/addUserDream?userEmail=ram@gmail.com&dreamData={title:'sample',desc:'sample desc',category:'sample category'}
  return (
    <div className={styles.container}>
      <div
        style={{
          minHeight: "80px",
          maxHeight: "fit-content",
          width: "100%",
          height: "fit-content",
        }}
      >
        <h3 className={styles.header}>
          <Typewriter
            loop
            words={[
              "Save Your Dreams Here",
              "Unveil the Hidden Meanings of Your Nightly Adventures",
            ]}
          />
        </h3>
      </div>
      <form onSubmit={handleSubmit} className={styles.dreamForm}>
        <input
          className={styles.formInput}
          onChange={handleChange}
          name="dreamTitle"
          placeholder="Dream Title"
          type="text"
          required
          value={formData.dreamTitle}
        />
        <textarea
          className={styles.formInput}
          rows={25}
          onChange={handleChange}
          name="dreamDesc"
          placeholder="Dream Description"
          required
          value={formData.dreamDesc}
        />
        <select
          required
          className={styles.formInput}
          name="dreamEmotion"
          onChange={handleChange}
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

        <button
          disabled={loading || analysing}
          className={styles.AddBtn}
          type="submit"
        >
          {loading || analysing
            ? analysing
              ? "Analysing.."
              : "Submitting.."
            : "Add Dream"}
        </button>
      </form>
    </div>
  );
}

export default AddDreams;
