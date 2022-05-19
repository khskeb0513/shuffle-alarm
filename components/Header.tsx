import styles from '../styles/Home.module.css';
import Image from 'next/image';

const Header = () => {
  return (
    <div>
      <div className={styles.header}>
        <p>
          <Image
            src="/shuffle_on_FILL1_wght400_GRAD0_opsz48.svg"
            alt="icon"
            width="64"
            height="64"
          />{' '}
          <Image
            src="/alarm_FILL1_wght400_GRAD0_opsz48.svg"
            alt="icon"
            width="64"
            height="64"
          />
        </p>
        <h1 className={styles.title}>Shuffle Alarm</h1>
      </div>
      <p className={styles.description}>
        Make Youtube playlist to Alarm with{' '}
        <code className={styles.code}>Youtube Data API</code>
      </p>
    </div>
  );
};

export default Header;
