import React from 'react';
import styles from "../style/home.module.css";
import Link from 'next/link';

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.textContainer}>
        <h1 className={styles.title}>

          Empowering Creators,<br/>Redefining Publishing.
        </h1>
        <p className={styles.desc}>
          Welcome to our decentralized publishing platform, empowering creators
          to share their perspectives freely. <br />
          Together, we're reshaping publishing, fostering creativity, and
          celebrating diverse voices. <br />
          Join us to redefine publishing and unlock the full potential of your
          ideas.
        </p>
        <div className={styles.buttons}>
          <button className={styles.button}>Get Started</button>
          <Link href="/about">
          <button className={styles.button}>Learn More</button>

          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
