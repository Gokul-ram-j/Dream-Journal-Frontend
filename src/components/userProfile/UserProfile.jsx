import React, { useEffect, useState } from "react";
import styles from "./userProfile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTimes,
  faUser,
  faBirthdayCake,
  faPhone,
  faMapMarkerAlt,
} from "@fortawesome/free-solid-svg-icons";

function UserProfile({ userDetails }) {
  const [userInfo, setUserInfo] = useState({
    userEmail: "",
    userDetail: { age: "", phoneNumber: "", address: "" },
    userName: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userInfo });
  const [loading, setLoading] = useState(false);
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
          setUserInfo({
            userName: data.userName || "",
            userDetail: {
              age: data.userDetail?.age || "",
              phoneNumber: data.userDetail?.phoneNumber || "",
              address: data.userDetail?.address || "",
            },
          });
          setFormData({
            userName: data.userName || "",
            userDetail: {
              age: data.userDetail?.age || "",
              phoneNumber: data.userDetail?.phoneNumber || "",
              address: data.userDetail?.address || "",
            },
          });
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };
    getUserInfo();
  }, [userDetails.email]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name in formData.userDetail) {
      setFormData({
        ...formData,
        userDetail: { ...formData.userDetail, [name]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    await fetch("https://dream-journal-backend.vercel.app/userDreamsDB/editUserDetail", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        age: formData.userDetail.age,
        phoneNumber: formData.userDetail.phoneNumber,
        address: formData.userDetail.address,
        email: userDetails.email,
        userName: formData.userName,
      }),
    })
      .catch((err) => console.log(err))
      .finally(() => {
        setUserInfo(formData);
        setIsEditing(false);
        setLoading(false);
      });
  };

  const handleCancel = () => {
    setFormData(userInfo);
    setIsEditing(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.profileContainer}>
        <h1 className={styles.title}>My Profile</h1>
        <div className={styles.profileCard}>
          <p>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            {isEditing ? (
              <input
                required
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleInputChange}
                className={styles.input}
              />
            ) : (
              <span>Name: {userInfo.userName}</span>
            )}
          </p>
          <p>
            <FontAwesomeIcon icon={faBirthdayCake} className={styles.icon} />
            {isEditing ? (
              <input
                required
                type="number"
                name="age"
                value={formData.userDetail.age}
                onChange={handleInputChange}
                className={styles.input}
              />
            ) : (
              <span>
                Age:{" "}
                {userInfo.userDetail.age !== ""
                  ? userInfo.userDetail.age
                  : "N/A"}
              </span>
            )}
          </p>
          <p>
            <FontAwesomeIcon icon={faPhone} className={styles.icon} />
            {isEditing ? (
              <input
                required
                type="text"
                name="phoneNumber"
                value={formData.userDetail.phoneNumber}
                onChange={handleInputChange}
                className={styles.input}
              />
            ) : (
              <span>Phone Number: {userInfo.userDetail.phoneNumber}</span>
            )}
          </p>
          <p>
            <FontAwesomeIcon icon={faMapMarkerAlt} className={styles.icon} />
            {isEditing ? (
              <input
                required
                type="text"
                name="address"
                value={formData.userDetail.address}
                onChange={handleInputChange}
                className={styles.input}
              />
            ) : (
              <span>Address: {userInfo.userDetail.address}</span>
            )}
          </p>
        </div>
        {isEditing ? (
          <div className={styles.buttonGroup}>
            <button
              className={styles.saveButton}
              onClick={handleSave}
              disabled={loading}
            >
              <FontAwesomeIcon icon={faSave} className={styles.btnIcon} />{" "}
              {loading ? "Saving.." : "Save"}
            </button>
            <button className={styles.cancelButton} onClick={handleCancel}>
              <FontAwesomeIcon icon={faTimes} className={styles.btnIcon} /> Cancel
            </button>
          </div>
        ) : (
          <button
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            <FontAwesomeIcon icon={faEdit} className={styles.btnIcon} /> Edit
          </button>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
