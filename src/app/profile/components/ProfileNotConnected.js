import React from "react";
import styles from "../[slug]/profile.module.css";

const ProfileNotConnected = () => (
  <div className={styles.NotConnectedPlaceholder}>
    <h1>Connect your wallet first.</h1>
  </div>
);

export default ProfileNotConnected;
