import React from "react";
import styles from "./about.module.css";
import Feature from "@/components/feature/feature"; // Assuming the path is correct

const AboutPage = () => {
  return (
    <div className={styles.container}>
      <div className={styles.intro}>
        <h1>wordink</h1>
        <p>The hub for the creation of content in the web3 space.</p>
        <h2>Read Learn Write Earn</h2>
      </div>
      <div className={styles.features}>
        <Feature
          title="Read"
          description="Discover diverse content and innovative ideas with Wordink’s secure, decentralized platform. Enjoy uninterrupted access to articles and insights, safeguarded by cutting-edge web3 technologies and permanent, immutable storage."
        />
        <Feature
          title="Learn"
          description="Enhance your knowledge through valuable resources and community interactions. Share ideas, receive feedback, and grow within a dynamic ecosystem that supports collaborative learning and mutual development."
        />
        <Feature
          title="Write"
          description="Create and publish with confidence using web3 technologies. Protect your content and identity with Solana authentication and Arweave's decentralized storage. Distribute transparently via Wordink’s protocol, maintaining full control and ownership of your work."
        />
        <Feature
          title="Earn"
          description="Monetize your creativity by engaging with a diverse audience. Build a loyal following and benefit from a transparent reward system that aligns your financial incentives with the value you provide."
        />
      </div>

      <div className={styles.roadmap}>
        <h1>Roadmap</h1>
        <div className={styles.roadmapContainer}>
          <div className={styles.roadmapItem}>
            <h2>Q4 2024</h2>
            <h4>Core Team Development</h4>
            <p>Assemble and onboard a skilled core team to lay the foundation for the platform's success. Focus on defining roles, and integrating new team members.</p>
          </div>
          <div className={styles.roadmapItem}>
            <h2>Q1 2025</h2>
            <h4>Feature Expansion</h4>
            <p>Introduce new tools for enhanced content creation. Expand community engagement features to foster a vibrant user base and improve platform interactions.</p>
          </div>
          <div className={styles.roadmapItem}>
            <h2>Q2 2025</h2>
            <h4>Stability and Testing</h4>
            <p>Focus on ensuring platform stability through extensive testing. Address any issues and gather valuable feedback to refine the platform.</p>
          </div>
          <div className={styles.roadmapItem}>
            <h2>Q4 2025</h2>
            <h4>Official Launch and Growth</h4>
            <p>Refine the platform based on user feedback and scale operations for broader adoption. Implement strategic updates and prepare for the next phase of growth and development.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AboutPage;
