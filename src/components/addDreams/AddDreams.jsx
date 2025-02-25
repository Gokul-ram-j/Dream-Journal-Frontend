import React, { useState } from "react";
import styles from "./AddDreams.module.css";
import { Typewriter } from "react-simple-typewriter";
function AddDreams({ userDetails }) {
  const [formData, setFormData] = useState({
    dreamTitle: "",
    dreamDesc: "",
    dreamEmotion: "",
    dreamDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((data) => ({
      ...data, // Keep existing form data
      [e.target.name]: e.target.value, // Update the changed field
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Convert formData to a JSON string and encode it
    const dreamDataString = encodeURIComponent(JSON.stringify(formData));

    const url = `https://dream-journal-backend.vercel.app/userDreamsDB/addUserDream?userEmail=${userDetails.email}&dreamData=${dreamDataString}`;
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
        <input
          name="dreamDate"
          value={formData.dreamDate}
          required
          onChange={handleChange}
          className={styles.formInput}
          type="date"
        />
        <select
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

        <button disabled={loading} className={styles.AddBtn} type="submit">
          {loading ? "Submitting.." : "Add Dream"}
        </button>
      </form>
    </div>
  );
}

export default AddDreams;
