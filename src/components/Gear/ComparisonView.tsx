import { Guitar, Zap, Radio, ArrowRight, ChevronDown } from 'lucide-react';
import { GearSetup } from '../../types';
import styles from './ComparisonView.module.css';

interface ComparisonViewProps {
  setupA: GearSetup | null;
  setupB: GearSetup | null;
  allSetups: GearSetup[];
  onSelectA: (id: string) => void;
  onSelectB: (id: string) => void;
}

const DiffBadge = ({ match }: { match: boolean }) => (
  <span className={`${styles.diffBadge} ${match ? styles.match : styles.diff}`}>
    {match ? '≈ match' : '≠ diff'}
  </span>
);

interface CompareRowProps {
  label: string;
  icon: React.ReactNode;
  a: string;
  b: string;
}

const CompareRow = ({ label, icon, a, b }: CompareRowProps) => {
  const match = a.toLowerCase().trim() === b.toLowerCase().trim() && a !== '';
  const hasA = Boolean(a);
  const hasB = Boolean(b);

  return (
    <div className={styles.compareRow}>
      <div className={styles.rowLabel}>
        {icon}
        {label}
        {hasA && hasB && <DiffBadge match={match} />}
      </div>
      <div className={styles.rowValues}>
        <div className={`${styles.cell} ${!hasA ? styles.empty : ''}`}>
          {a || <span className={styles.noValue}>—</span>}
        </div>
        <div className={styles.divider} />
        <div className={`${styles.cell} ${!hasB ? styles.empty : ''}`}>
          {b || <span className={styles.noValue}>—</span>}
        </div>
      </div>
    </div>
  );
};

export const ComparisonView = ({
  setupA,
  setupB,
  allSetups,
  onSelectA,
  onSelectB,
}: ComparisonViewProps) => {
  const pedalNamesA = setupA?.pedals.map((p) => p.name).join(', ') ?? '';
  const pedalNamesB = setupB?.pedals.map((p) => p.name).join(', ') ?? '';

  return (
    <div className={styles.container}>
      {/* Slot selectors */}
      <div className={styles.slotRow}>
        <div className={styles.slot}>
          <div className={styles.slotLabel}>
            <span className={styles.slotBadge}>A</span>
            Setup A
          </div>
          <div className={styles.selectWrapper}>
            <select
              className={styles.setupSelect}
              value={setupA?.id ?? ''}
              onChange={(e) => onSelectA(e.target.value)}
            >
              <option value="">— Choose a setup —</option>
              {allSetups.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.selectIcon} />
          </div>
        </div>

        <div className={styles.vsLabel}>VS</div>

        <div className={styles.slot}>
          <div className={styles.slotLabel}>
            <span className={`${styles.slotBadge} ${styles.slotB}`}>B</span>
            Setup B
          </div>
          <div className={styles.selectWrapper}>
            <select
              className={styles.setupSelect}
              value={setupB?.id ?? ''}
              onChange={(e) => onSelectB(e.target.value)}
            >
              <option value="">— Choose a setup —</option>
              {allSetups.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <ChevronDown size={14} className={styles.selectIcon} />
          </div>
        </div>
      </div>

      {(!setupA || !setupB) ? (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>⟷</div>
          <p>Select two setups above to compare them side by side.</p>
        </div>
      ) : (
        <div className={styles.table}>
          {/* Header row */}
          <div className={styles.tableHeader}>
            <div className={styles.headerLeft} />
            <div className={styles.headerCells}>
              <div className={styles.headerCell}>
                <span className={styles.slotBadge}>A</span>
                {setupA.name}
              </div>
              <div className={styles.headerDivider} />
              <div className={styles.headerCell}>
                <span className={`${styles.slotBadge} ${styles.slotB}`}>B</span>
                {setupB.name}
              </div>
            </div>
          </div>

          <CompareRow
            label="Guitar"
            icon={<Guitar size={13} />}
            a={setupA.guitar}
            b={setupB.guitar}
          />
          <CompareRow
            label="Amp"
            icon={<Radio size={13} />}
            a={setupA.amp}
            b={setupB.amp}
          />
          <CompareRow
            label="Pedals"
            icon={<Zap size={13} />}
            a={pedalNamesA}
            b={pedalNamesB}
          />
          <CompareRow
            label="Signal Chain"
            icon={<ArrowRight size={13} />}
            a={setupA.signalChain}
            b={setupB.signalChain}
          />

          {/* Tone descriptions side by side */}
          <div className={styles.toneSection}>
            <div className={styles.toneLabel}>Tone Description</div>
            <div className={styles.toneGrid}>
              <div className={styles.toneBox}>
                <span className={styles.slotBadge}>A</span>
                <p>{setupA.toneDescription || <em>No description</em>}</p>
              </div>
              <div className={`${styles.toneBox} ${styles.toneBB}`}>
                <span className={`${styles.slotBadge} ${styles.slotB}`}>B</span>
                <p>{setupB.toneDescription || <em>No description</em>}</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className={styles.compareRow}>
            <div className={styles.rowLabel}>Genre / Tags</div>
            <div className={styles.rowValues}>
              <div className={styles.cell}>
                {setupA.genre && <span className={styles.genreBadge}>{setupA.genre}</span>}
                {setupA.tags.map((t) => <span key={t} className={styles.tagBadge}>#{t}</span>)}
              </div>
              <div className={styles.divider} />
              <div className={styles.cell}>
                {setupB.genre && <span className={styles.genreBadge}>{setupB.genre}</span>}
                {setupB.tags.map((t) => <span key={t} className={styles.tagBadge}>#{t}</span>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
