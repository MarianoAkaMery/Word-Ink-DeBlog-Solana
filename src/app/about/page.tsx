import React from "react";
import styles from "./about.module.css";
import Feature from "@/components/feature/feature"; // Assuming the path is correct

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <h1>Your place to read, learn, write.</h1>
        <p>wordink aims to be the hub for the creation of content in the web3 space.</p>
      </div>
      <div className={styles.sectionDivider}></div>
      <h1>WHAT?</h1>

      <div className={styles.features}>
        <Feature
          title="Inherently Decentralized"
          description="Embrace content control through decentralization with the fusion of web3 technologies. Safely access via Solana authentication, store your compositions using IPFS, and utilize Wordink's impartial protocol for dissemination."

        />
        <Feature
          title="Unique Collectibles"
          description="Each post signifies a chance for originality. Cultivate your audience. It's more than just financial backing; it's about fostering a community around your ideas from the grassroots level."

        />


      </div>

      <div className={styles.more}>
        <h1>Coming soon...</h1>
      </div>
    </div>
  );
};

export default AboutPage;
