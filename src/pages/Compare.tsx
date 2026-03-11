import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useGear } from '../hooks/useGear';
import { ComparisonView } from '../components/Gear/ComparisonView';
import { GearSetup } from '../types';
import styles from './Compare.module.css';

export const Compare = () => {
  const { user } = useAuth();
  const { setups, loading } = useGear(user?.uid);
  const [setupA, setSetupA] = useState<GearSetup | null>(null);
  const [setupB, setSetupB] = useState<GearSetup | null>(null);

  const handleSelectA = (id: string) => {
    setSetupA(setups.find((s) => s.id === id) ?? null);
  };

  const handleSelectB = (id: string) => {
    setSetupB(setups.find((s) => s.id === id) ?? null);
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Compare Setups</h1>
        <p className={styles.subtitle}>
          Select two setups from your database to compare them side by side
        </p>
      </div>

      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          Loading setups…
        </div>
      ) : setups.length < 2 ? (
        <div className={styles.notice}>
          <span className={styles.noticeIcon}>⚡</span>
          <div>
            <strong>You need at least two setups to compare.</strong>
            <p>Head to My Setups to create more gear entries.</p>
          </div>
        </div>
      ) : (
        <ComparisonView
          setupA={setupA}
          setupB={setupB}
          allSetups={setups}
          onSelectA={handleSelectA}
          onSelectB={handleSelectB}
        />
      )}
    </div>
  );
};
