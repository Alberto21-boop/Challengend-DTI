import styles from './Loading.module.css';

export function Loading() {
  return (
    <div className={styles.shadow}>
      <span className={styles.spinner}></span>
    </div>
  );
}