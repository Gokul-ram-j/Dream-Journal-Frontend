import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./UserProfile.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faSave,
  faTimes,
  faUser,
  faBirthdayCake,
  faPhone,
  faMapMarkerAlt,
  faUserCircle,
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
      {/* Background elements */}
      <div className={styles.backgroundElements}>
        <motion.div
          className={`${styles.floatingOrb} ${styles.orb1}`}
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`${styles.floatingOrb} ${styles.orb2}`}
          animate={{
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`${styles.floatingOrb} ${styles.orb3}`}
          animate={{
            x: [0, 60, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className={styles.profileContainer}
      >
        {/* Header */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className={styles.header}
        >
          <div className={styles.avatarContainer}>
            <motion.div
              whileHover={{ scale: 1.1 }}
              className={styles.avatar}
            >
              <FontAwesomeIcon icon={faUserCircle} />
            </motion.div>
          </div>
          <h1 className={styles.title}>My Profile</h1>
          <p className={styles.subtitle}>Manage your personal information</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={styles.profileCard}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className={styles.fieldContainer}
          >
            <div className={styles.fieldIcon}>
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className={styles.fieldContent}>
              <label className={styles.fieldLabel}>Name</label>
              {isEditing ? (
                <motion.input
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  required
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your name"
                />
              ) : (
                <span className={styles.fieldValue}>{userInfo.userName}</span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={styles.fieldContainer}
          >
            <div className={styles.fieldIcon}>
              <FontAwesomeIcon icon={faBirthdayCake} />
            </div>
            <div className={styles.fieldContent}>
              <label className={styles.fieldLabel}>Age</label>
              {isEditing ? (
                <motion.input
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  required
                  type="number"
                  name="age"
                  value={formData.userDetail.age}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your age"
                />
              ) : (
                <span className={styles.fieldValue}>
                  {userInfo.userDetail.age !== "" ? userInfo.userDetail.age : "N/A"}
                </span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className={styles.fieldContainer}
          >
            <div className={styles.fieldIcon}>
              <FontAwesomeIcon icon={faPhone} />
            </div>
            <div className={styles.fieldContent}>
              <label className={styles.fieldLabel}>Phone Number</label>
              {isEditing ? (
                <motion.input
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  required
                  type="text"
                  name="phoneNumber"
                  value={formData.userDetail.phoneNumber}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your phone number"
                />
              ) : (
                <span className={styles.fieldValue}>{userInfo.userDetail.phoneNumber}</span>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className={styles.fieldContainer}
          >
            <div className={styles.fieldIcon}>
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </div>
            <div className={styles.fieldContent}>
              <label className={styles.fieldLabel}>Address</label>
              {isEditing ? (
                <motion.input
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  required
                  type="text"
                  name="address"
                  value={formData.userDetail.address}
                  onChange={handleInputChange}
                  className={styles.input}
                  placeholder="Enter your address"
                />
              ) : (
                <span className={styles.fieldValue}>{userInfo.userDetail.address}</span>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className={styles.actionContainer}
        >
          <AnimatePresence mode="wait">
            {isEditing ? (
              <motion.div
                key="editing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={styles.buttonGroup}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.saveButton}
                  onClick={handleSave}
                  disabled={loading}
                >
                  <FontAwesomeIcon icon={faSave} className={styles.btnIcon} />
                  {loading ? "Saving.." : "Save"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={styles.cancelButton}
                  onClick={handleCancel}
                >
                  <FontAwesomeIcon icon={faTimes} className={styles.btnIcon} />
                  Cancel
                </motion.button>
              </motion.div>
            ) : (
              <motion.button
                key="not-editing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={styles.editButton}
                onClick={() => setIsEditing(true)}
              >
                <FontAwesomeIcon icon={faEdit} className={styles.btnIcon} />
                Edit
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UserProfile;