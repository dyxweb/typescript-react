import React from 'react';
import smallImg from '@/assets/4kb.png';
import bigImg from '@/assets/20kb.png';
import styles from './app.scss';

const App = () => (
  <div className={styles.app}>
    <img src={smallImg} />
    <img src={bigImg} />
    app
  </div>
);
export default App;