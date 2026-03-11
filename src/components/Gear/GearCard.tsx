import { Guitar, Zap, Radio, ArrowRight, Edit2, Trash2, GitCompare, Calendar } from 'lucide-react';
import { GearSetup } from '../../types';
import { Button } from '../UI/Button';
import styles from './GearCard.module.css';

interface GearCardProps {
  setup: GearSetup;
  onEdit?: () => void;
  onDelete?: () => void;
  onCompare?: () => void;
  compact?: boolean;
  selected?: boolean;
}

const PEDAL_TYPE_COLORS: Record<string, string> = {
  overdrive: '#e8501a',
  distortion: '#cc3a13',
  fuzz: '#a02d0f',
  delay: '#4a9ede',
  reverb: '#6a7de8',
  chorus: '#50c878',
  compressor: '#f0a500',
  eq: '#8a8a9a',
  noise_gate: '#5a5a6a',
  boost: '#e8c050',
  wah: '#c878e8',
  flanger: '#78c8e8',
  phaser: '#78e8c8',
  other: '#6a6a7a',
};

export const GearCard = ({
  setup,
  onEdit,
  onDelete,
  onCompare,
  compact = false,
  selected = false,
}: GearCardProps) => {
  const formattedDate = setup.createdAt instanceof Date
    ? setup.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '';

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ''} ${selected ? styles.selected : ''}`}>
      <div className={styles.cardHeader}>
        <div className={styles.nameRow}>
          <h3 className={styles.name}>{setup.name}</h3>
          {setup.genre && (
            <span className={styles.genre}>{setup.genre}</span>
          )}
        </div>
        {formattedDate && (
          <div className={styles.date}>
            <Calendar size={11} />
            {formattedDate}
          </div>
        )}
      </div>

      <div className={styles.gearGrid}>
        <div className={styles.gearItem}>
          <span className={styles.gearLabel}>
            <Guitar size={12} /> Guitar
          </span>
          <span className={styles.gearValue}>{setup.guitar || '—'}</span>
        </div>
        <div className={styles.gearItem}>
          <span className={styles.gearLabel}>
            <Radio size={12} /> Amp
          </span>
          <span className={styles.gearValue}>{setup.amp || '—'}</span>
        </div>
      </div>

      {setup.pedals.length > 0 && (
        <div className={styles.pedals}>
          <span className={styles.sectionLabel}>
            <Zap size={11} /> Pedals
          </span>
          <div className={styles.pedalList}>
            {setup.pedals.map((p) => (
              <span
                key={p.id}
                className={styles.pedalBadge}
                style={{ '--pedal-color': PEDAL_TYPE_COLORS[p.type] ?? '#6a6a7a' } as React.CSSProperties}
              >
                {p.brand ? `${p.brand} ${p.name}` : p.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {setup.signalChain && !compact && (
        <div className={styles.signalChain}>
          <span className={styles.sectionLabel}>
            <ArrowRight size={11} /> Signal Chain
          </span>
          <p className={styles.chainText}>{setup.signalChain}</p>
        </div>
      )}

      {setup.toneDescription && (
        <div className={styles.toneBox}>
          <span className={styles.sectionLabel}>Tone</span>
          <p className={styles.toneText}>
            {compact && setup.toneDescription.length > 120
              ? setup.toneDescription.slice(0, 120) + '…'
              : setup.toneDescription}
          </p>
        </div>
      )}

      {setup.tags.length > 0 && (
        <div className={styles.tags}>
          {setup.tags.map((t) => (
            <span key={t} className={styles.tag}>#{t}</span>
          ))}
        </div>
      )}

      {(onEdit || onDelete || onCompare) && (
        <div className={styles.actions}>
          {onCompare && (
            <Button variant="ghost" size="sm" icon={<GitCompare size={13} />} onClick={onCompare}>
              Compare
            </Button>
          )}
          {onEdit && (
            <Button variant="ghost" size="sm" icon={<Edit2 size={13} />} onClick={onEdit}>
              Edit
            </Button>
          )}
          {onDelete && (
            <Button variant="danger" size="sm" icon={<Trash2 size={13} />} onClick={onDelete}>
              Delete
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
