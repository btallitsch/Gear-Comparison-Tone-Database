import { useState } from 'react';
import { Plus, Database, GitCompare, Zap, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGear } from '../hooks/useGear';
import { GearCard } from '../components/Gear/GearCard';
import { GearForm } from '../components/Gear/GearForm';
import { Modal } from '../components/UI/Modal';
import { Button } from '../components/UI/Button';
import { GearSetup } from '../types';
import { useNavigate } from 'react-router-dom';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setups, loading, addSetup, editSetup, removeSetup } = useGear(user?.uid);
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<GearSetup | null>(null);
  const [formLoading, setFormLoading] = useState(false);

  const handleCreate = async (data: Parameters<typeof addSetup>[0]) => {
    setFormLoading(true);
    const ok = await addSetup(data);
    setFormLoading(false);
    if (ok) setShowCreate(false);
    return ok;
  };

  const handleEdit = async (data: Parameters<typeof editSetup>[1]) => {
    if (!editing) return false;
    setFormLoading(true);
    const ok = await editSetup(editing.id, data);
    setFormLoading(false);
    if (ok) setEditing(null);
    return ok;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this gear setup?')) {
      await removeSetup(id);
    }
  };

  const recentSetups = setups.slice(0, 4);
  const totalPedals = setups.reduce((acc, s) => acc + s.pedals.length, 0);
  const genres = [...new Set(setups.map((s) => s.genre).filter(Boolean))];

  const displayName = user?.displayName ?? user?.email?.split('@')[0] ?? 'there';

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroText}>
          <h1 className={styles.greeting}>
            Hey, <span className={styles.name}>{displayName}</span>
          </h1>
          <p className={styles.subgreeting}>
            {setups.length === 0
              ? 'Start documenting your tone. Create your first setup.'
              : `You have ${setups.length} gear setup${setups.length !== 1 ? 's' : ''} logged.`}
          </p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowCreate(true)} size="lg">
          New Setup
        </Button>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statIcon}><Database size={18} /></div>
          <div>
            <div className={styles.statValue}>{setups.length}</div>
            <div className={styles.statLabel}>Setups</div>
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statIcon}><Zap size={18} /></div>
          <div>
            <div className={styles.statValue}>{totalPedals}</div>
            <div className={styles.statLabel}>Pedals Logged</div>
          </div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statIcon}><TrendingUp size={18} /></div>
          <div>
            <div className={styles.statValue}>{genres.length}</div>
            <div className={styles.statLabel}>Genres</div>
          </div>
        </div>
        <div className={styles.statAction}>
          <Button
            variant="outline"
            icon={<GitCompare size={15} />}
            onClick={() => navigate('/compare')}
          >
            Compare Setups
          </Button>
        </div>
      </div>

      {/* Recent setups */}
      <section>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Setups</h2>
          {setups.length > 4 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/database')}>
              View All →
            </Button>
          )}
        </div>

        {loading ? (
          <div className={styles.loading}>
            <div className={styles.loadingSpinner} />
            Loading setups…
          </div>
        ) : recentSetups.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🎸</div>
            <h3>No setups yet</h3>
            <p>Document your first rig and start building your tone database.</p>
            <Button icon={<Plus size={15} />} onClick={() => setShowCreate(true)}>
              Create First Setup
            </Button>
          </div>
        ) : (
          <div className={styles.grid}>
            {recentSetups.map((s) => (
              <GearCard
                key={s.id}
                setup={s}
                compact
                onEdit={() => setEditing(s)}
                onDelete={() => handleDelete(s.id)}
                onCompare={() => navigate('/compare')}
              />
            ))}
          </div>
        )}
      </section>

      {/* Create modal */}
      <Modal
        isOpen={showCreate}
        onClose={() => setShowCreate(false)}
        title="New Gear Setup"
        size="xl"
      >
        <GearForm
          onSubmit={handleCreate}
          onCancel={() => setShowCreate(false)}
          loading={formLoading}
        />
      </Modal>

      {/* Edit modal */}
      <Modal
        isOpen={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit Setup"
        size="xl"
      >
        {editing && (
          <GearForm
            initial={editing}
            onSubmit={handleEdit}
            onCancel={() => setEditing(null)}
            loading={formLoading}
          />
        )}
      </Modal>
    </div>
  );
};
