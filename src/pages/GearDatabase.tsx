import { useState } from 'react';
import { Plus, Search, SlidersHorizontal, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useGear } from '../hooks/useGear';
import { GearCard } from '../components/Gear/GearCard';
import { GearForm } from '../components/Gear/GearForm';
import { Modal } from '../components/UI/Modal';
import { Button } from '../components/UI/Button';
import { Select } from '../components/UI/Input';
import { GearSetup } from '../types';
import styles from './GearDatabase.module.css';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Date Created' },
  { value: 'updatedAt', label: 'Last Updated' },
  { value: 'name', label: 'Name' },
  { value: 'genre', label: 'Genre' },
];

export const GearDatabase = () => {
  const { user } = useAuth();
  const {
    filteredSetups,
    setups,
    loading,
    filter,
    setFilter,
    allGenres,
    addSetup,
    editSetup,
    removeSetup,
  } = useGear(user?.uid);

  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<GearSetup | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

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

  const genreOptions = allGenres.map((g) => ({ value: g, label: g }));
  const hasActiveFilters = filter.search || filter.genre || filter.tags.length > 0;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>My Setups</h1>
          <p className={styles.subtitle}>
            {setups.length} setup{setups.length !== 1 ? 's' : ''} in your database
          </p>
        </div>
        <Button icon={<Plus size={15} />} onClick={() => setShowCreate(true)}>
          New Setup
        </Button>
      </div>

      {/* Search + filter bar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={15} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search by name, guitar, amp, tone..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
          {filter.search && (
            <button className={styles.clearBtn} onClick={() => setFilter({ ...filter, search: '' })}>
              <X size={14} />
            </button>
          )}
        </div>

        <Button
          variant={showFilters ? 'outline' : 'secondary'}
          size="sm"
          icon={<SlidersHorizontal size={14} />}
          onClick={() => setShowFilters(!showFilters)}
        >
          Filters {hasActiveFilters ? '●' : ''}
        </Button>

        <div className={styles.sortRow}>
          <Select
            value={filter.sortField}
            onChange={(v) => setFilter({ ...filter, sortField: v as typeof filter.sortField })}
            options={SORT_OPTIONS}
          />
          <button
            className={styles.sortDir}
            onClick={() => setFilter({
              ...filter,
              sortDirection: filter.sortDirection === 'asc' ? 'desc' : 'asc',
            })}
            title="Toggle sort direction"
          >
            {filter.sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className={styles.filterPanel}>
          <Select
            label="Genre"
            value={filter.genre}
            onChange={(v) => setFilter({ ...filter, genre: v })}
            options={genreOptions}
            placeholder="All genres"
          />
          {hasActiveFilters && (
            <button
              className={styles.clearFilters}
              onClick={() => setFilter({ ...filter, search: '', genre: '', tags: [] })}
            >
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          Loading your setups…
        </div>
      ) : filteredSetups.length === 0 ? (
        <div className={styles.empty}>
          {setups.length === 0 ? (
            <>
              <div className={styles.emptyIcon}>🎸</div>
              <h3>No setups yet</h3>
              <p>Document your rig and tone for every setup you own.</p>
              <Button icon={<Plus size={14} />} onClick={() => setShowCreate(true)}>
                Create First Setup
              </Button>
            </>
          ) : (
            <>
              <div className={styles.emptyIcon}>🔍</div>
              <h3>No results</h3>
              <p>No setups match your current filters.</p>
              <Button variant="ghost" onClick={() => setFilter({ ...filter, search: '', genre: '', tags: [] })}>
                Clear Filters
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredSetups.map((s) => (
            <GearCard
              key={s.id}
              setup={s}
              onEdit={() => setEditing(s)}
              onDelete={() => handleDelete(s.id)}
            />
          ))}
        </div>
      )}

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Gear Setup" size="xl">
        <GearForm onSubmit={handleCreate} onCancel={() => setShowCreate(false)} loading={formLoading} />
      </Modal>

      <Modal isOpen={Boolean(editing)} onClose={() => setEditing(null)} title="Edit Setup" size="xl">
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
