import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { GearSetup, PedalEntry, PedalType } from '../../types';
import { Input, Textarea, Select } from '../UI/Input';
import { Button } from '../UI/Button';
import styles from './GearForm.module.css';

const GENRES = [
  { value: 'thrash', label: 'Thrash Metal' },
  { value: 'death', label: 'Death Metal' },
  { value: 'black', label: 'Black Metal' },
  { value: 'doom', label: 'Doom Metal' },
  { value: 'heavy', label: 'Heavy Metal' },
  { value: 'prog', label: 'Progressive' },
  { value: 'groove', label: 'Groove Metal' },
  { value: 'punk', label: 'Punk / Hardcore' },
  { value: 'blues', label: 'Blues' },
  { value: 'rock', label: 'Rock' },
  { value: 'clean', label: 'Clean / Jazz' },
  { value: 'ambient', label: 'Ambient' },
  { value: 'other', label: 'Other' },
];

const PEDAL_TYPES: { value: PedalType; label: string }[] = [
  { value: 'overdrive', label: 'Overdrive' },
  { value: 'distortion', label: 'Distortion' },
  { value: 'fuzz', label: 'Fuzz' },
  { value: 'boost', label: 'Boost' },
  { value: 'compressor', label: 'Compressor' },
  { value: 'eq', label: 'EQ' },
  { value: 'noise_gate', label: 'Noise Gate' },
  { value: 'wah', label: 'Wah' },
  { value: 'chorus', label: 'Chorus' },
  { value: 'flanger', label: 'Flanger' },
  { value: 'phaser', label: 'Phaser' },
  { value: 'delay', label: 'Delay' },
  { value: 'reverb', label: 'Reverb' },
  { value: 'other', label: 'Other' },
];

type FormData = Omit<GearSetup, 'id' | 'userId' | 'createdAt' | 'updatedAt'>;

interface GearFormProps {
  initial?: GearSetup;
  onSubmit: (data: FormData) => Promise<boolean>;
  onCancel: () => void;
  loading?: boolean;
}

const emptyForm = (): FormData => ({
  name: '',
  guitar: '',
  amp: '',
  pedals: [],
  signalChain: '',
  toneDescription: '',
  genre: '',
  tags: [],
});

export const GearForm = ({ initial, onSubmit, onCancel, loading }: GearFormProps) => {
  const [form, setForm] = useState<FormData>(
    initial
      ? {
          name: initial.name,
          guitar: initial.guitar,
          amp: initial.amp,
          pedals: initial.pedals,
          signalChain: initial.signalChain,
          toneDescription: initial.toneDescription,
          genre: initial.genre,
          tags: initial.tags,
        }
      : emptyForm()
  );
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const set = <K extends keyof FormData>(key: K, val: FormData[K]) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }));
  };

  const validate = (): boolean => {
    const e: typeof errors = {};
    if (!form.name.trim()) e.name = 'Setup name is required';
    if (!form.guitar.trim()) e.guitar = 'Guitar is required';
    if (!form.amp.trim()) e.amp = 'Amp is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    const ok = await onSubmit(form);
    if (ok) onCancel();
  };

  // Pedal management
  const addPedal = () => {
    const pedal: PedalEntry = {
      id: uuidv4(),
      name: '',
      brand: '',
      type: 'distortion',
      settings: '',
    };
    set('pedals', [...form.pedals, pedal]);
  };

  const updatePedal = (id: string, field: keyof PedalEntry, value: string) => {
    set(
      'pedals',
      form.pedals.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const removePedal = (id: string) => {
    set('pedals', form.pedals.filter((p) => p.id !== id));
  };

  // Tags
  const addTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (tag && !form.tags.includes(tag)) {
      set('tags', [...form.tags, tag]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    set('tags', form.tags.filter((t) => t !== tag));
  };

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Setup Info</h4>
        <div className={styles.grid2}>
          <Input
            label="Setup Name *"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Thrash Lead Tone"
            error={errors.name}
          />
          <Select
            label="Genre"
            value={form.genre}
            onChange={(v) => set('genre', v)}
            options={GENRES}
            placeholder="Select genre..."
          />
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Core Gear</h4>
        <div className={styles.grid2}>
          <Input
            label="Guitar *"
            value={form.guitar}
            onChange={(e) => set('guitar', e.target.value)}
            placeholder="e.g. Charvel Pro-Mod San Dimas"
            error={errors.guitar}
          />
          <Input
            label="Amp *"
            value={form.amp}
            onChange={(e) => set('amp', e.target.value)}
            placeholder="e.g. Marshall JCM800"
            error={errors.amp}
          />
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h4 className={styles.sectionTitle}>Pedals</h4>
          <Button variant="ghost" size="sm" icon={<Plus size={13} />} onClick={addPedal}>
            Add Pedal
          </Button>
        </div>

        {form.pedals.length === 0 && (
          <p className={styles.empty}>No pedals added. Click "Add Pedal" to add one.</p>
        )}

        {form.pedals.map((p, i) => (
          <div key={p.id} className={styles.pedalRow}>
            <div className={styles.pedalNum}>{i + 1}</div>
            <div className={styles.pedalFields}>
              <Input
                placeholder="Brand (optional)"
                value={p.brand}
                onChange={(e) => updatePedal(p.id, 'brand', e.target.value)}
              />
              <Input
                placeholder="Model name *"
                value={p.name}
                onChange={(e) => updatePedal(p.id, 'name', e.target.value)}
              />
              <Select
                value={p.type}
                onChange={(v) => updatePedal(p.id, 'type', v)}
                options={PEDAL_TYPES}
              />
              <Input
                placeholder="Settings / notes"
                value={p.settings ?? ''}
                onChange={(e) => updatePedal(p.id, 'settings', e.target.value)}
              />
            </div>
            <button className={styles.pedalDelete} onClick={() => removePedal(p.id)}>
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <Input
          label="Signal Chain"
          value={form.signalChain}
          onChange={(e) => set('signalChain', e.target.value)}
          placeholder="e.g. Guitar → Noise Gate → OD → Amp FX Return"
          hint="Document the order of your signal path"
        />
      </div>

      <div className={styles.section}>
        <Textarea
          label="Tone Description"
          value={form.toneDescription}
          onChange={(e) => set('toneDescription', e.target.value)}
          placeholder="Describe the tone in detail: character, feel, how it cuts in a mix, EQ notes..."
          rows={5}
        />
      </div>

      <div className={styles.section}>
        <div className={styles.tagSection}>
          <div className={styles.tagInputRow}>
            <Input
              label="Tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="e.g. high-gain, tight, 80s"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
              hint="Press Enter or click Add to add a tag"
            />
            <Button variant="secondary" size="sm" onClick={addTag} className={styles.addTagBtn}>
              Add
            </Button>
          </div>
          {form.tags.length > 0 && (
            <div className={styles.tagList}>
              {form.tags.map((t) => (
                <span key={t} className={styles.tagChip}>
                  #{t}
                  <button onClick={() => removeTag(t)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formActions}>
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button loading={loading} onClick={handleSubmit}>
          {initial ? 'Save Changes' : 'Create Setup'}
        </Button>
      </div>
    </div>
  );
};
