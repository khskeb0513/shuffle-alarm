import styles from '../styles/Home.module.css';
import Image from 'next/image';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <a
        href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className={styles.logo}>
          <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
        </span>
        <span className={styles.logo}>
          <a
            href="https://github.com/khskeb0513/shuffle-alarm.git"
            target="_blank"
            rel="noopener noreferrer"
          >
            {' '}
            @khskeb0513
          </a>
        </span>
      </a>
    </footer>
  );
};

export default Footer;
