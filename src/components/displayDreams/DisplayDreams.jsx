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
} from "@fortawesome/free-solid-svg-icons";

function DisplayDreams({ userDetails }) {
  const [dreams, setDreams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDreams = async () => {
      if (userDetails?.email) {
        setLoading(true);
        try {
          const dreamData = await fetchDreams(userDetails.email);
          setDreams(dreamData || []);
        } catch (error) {
          console.error("Error fetching user-specific dreams:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    getDreams();
  }, [userDetails]); // Dependency array ensures it runs when `userDetails` changes

  return (
    <div>
      <h1 className={styles.displayDreamTitle}>Your Dreams</h1>

      {loading ? (
        <Loading />
      ) : dreams.length > 0 ? (
        <div className={styles.dreamsContainer}>
          {dreams.map((data, index) => (
            <DreamsContainer
              loading={loading}
              setLoading={setLoading}
              dreams={dreams}
              setDreams={setDreams}
              key={index}
              data={data}
              email={userDetails.email}
            />
          ))}
        </div>
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
}) => {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(data.dreamTitle);
  const [category, setCategory] = useState(data.dreamEmotion);
  const [description, setDescription] = useState(data.dreamDesc);

  // getting date of creation of the post
  const date = new Date(data.dateLogged);

  const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`;

  // handleCancelEditing
  const handleCancelEditing = () => {
    setEditing(false);
    setTitle(data.dreamTitle);
    setCategory(data.dreamEmotion);
    setDescription(data.dreamDesc);
  };

  // handleSaveEditing
  const handleSaveEditing = async () => {
    setEditing(false);
    setLoading(true);
    const updatedDreamData = {
      title: title,
      category: category,
      description: description,
    };
    console.log(title, category);
    console.log(description);

    try {
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
      ).catch((err) => console.log(err));
      const result = await response.json();
      console.log(result);

      if (!response.ok) {
        throw new Error("Failed to update dream data");
      }

      // Directly update the state with the new dream data
      setDreams((prevDreams) =>
        prevDreams.map((dream) =>
          dream._id === data._id
            ? {
                ...dream,
                dreamTitle: title,
                dreamEmotion: category,
                dreamDesc: description,
              }
            : dream
        )
      );

      console.log("Dream updated successfully:", result);
    } catch (error) {
      console.error("Error updating dream:", error);
    } finally {
      console.log(title, category);
      console.log(description);
      setTitle(title);
      setCategory(category);
      setDescription(description);
      setLoading(false);
    }
  };

  // delete userDream

  const handleDeleteDream = async () => {
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

      console.log("Dream deleted successfully:", result);
      // Update UI after deleting the dream
      setDreams((prevDreams) =>
        prevDreams.filter((dreams) => dreams._id !== data._id)
      );
    } catch (error) {
      console.error("Error deleting dream:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.dreamDataContainer}>
      {editing ? (
        <>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles.dreamTitle}
          />
          <select
            className={styles.dreamCategory}
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
            className={styles.dreamDesc}
            rows={8}
          />
        </>
      ) : (
        <>
          <h1 className={styles.dreamTitle}>{title}</h1>
          <p className={styles.dreamCategory}>Category: {category}</p>
          <p className={styles.dreamDesc}>{description}</p>
        </>
      )}

      <div className={styles.buttonContainer}>
        {!editing ? (
          <>
            <button
              onClick={() => setEditing(true)}
              className={styles.editButton}
            >
              <FontAwesomeIcon icon={faEdit} style={{ marginRight: "5px" }} />
              EDIT
            </button>
            <button onClick={handleDeleteDream} className={styles.deleteButton}>
              <FontAwesomeIcon icon={faTrash} style={{ marginRight: "5px" }} />
              DELETE
            </button>
          </>
        ) : (
          <>
            <button onClick={handleSaveEditing} className={styles.saveButton}>
              <FontAwesomeIcon icon={faSave} style={{ marginRight: "5px" }} />
              SAVE
            </button>
            <button
              onClick={handleCancelEditing}
              className={styles.cancelButton}
            >
              <FontAwesomeIcon icon={faTimes} style={{ marginRight: "5px" }} />
              CANCEL
            </button>
          </>
        )}
      </div>
      <p className={styles.dateOfPostContainer}>{formattedDate}</p>
    </div>
  );
};

const NoDreamData = () => {
  return <div className={styles.NoDreamData}></div>;
};

export default DisplayDreams;
