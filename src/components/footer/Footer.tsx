import Link from 'next/link';
import styles from './footer.module.css';

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.links}>
        <Link href="/about">Learn More</Link>
        <Link href="/">Privacy</Link>
        <Link href="/">Terms & Condition</Link>
      </div>
      <div className={styles.logo}>
      <Link href="/"><span>wordink</span></Link>

      </div>
    </div>
  );
};

export default Footer;
