import React from 'react';
import styles from './feature.module.css'; // Import CSS file for styling
interface FeatureProps {
    title: string;
    description: string;

}

const Feature: React.FC<FeatureProps> = ({ title, description }) => {
    return (
        <div className={styles.container}>
            <h2>{title}</h2>
            <div className={styles.content}>
                <p>{description}</p>
            </div>
        </div>
    );
};

export default Feature;
