import styles from './footer.module.css';
import { RiTwitterXFill,RiFacebookFill  } from "react-icons/ri";

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.rightside}>
        <div className={styles.logo}>
          <span>wordink.</span>
        </div>
      </div>
    
      <div className={styles.text}>
        Coding x Insubria © All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
