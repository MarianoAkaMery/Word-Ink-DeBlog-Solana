import React from "react";
import styles from "../[slug]/profile.module.css";

const ProfileNoAccount = ({ initializeUser }) => (
  <div className={styles.NoAccountPlaceholder}>
    <div className={styles.disclaimer}>
      <h1>Get Started with Publishing</h1>
      <p className={styles.paragraph}>
      By joining our network, you will become an active contributor, prepared to collaborate and share insights with peers. Creating an account enables you to author and publish your own articles, thereby disseminating your expertise and enhancing the <br/>
      decentralized ecosystem knowledge pool.
      </p>
      <button className={styles.button} onClick={initializeUser}>
        Create Account
      </button>
    </div>
  </div>
);

export default ProfileNoAccount;
