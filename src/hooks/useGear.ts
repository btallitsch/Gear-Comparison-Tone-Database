import { useState, useEffect, useCallback } from 'react';
import { GearSetup, FilterState, SortField } from '../types';
import {
  getGearSetups,
  createGearSetup,
  updateGearSetup,
  deleteGearSetup,
} from '../services/gear.service';

export const useGear = (userId: string | undefined) => {
  const [setups, setSetups] = useState<GearSetup[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState<FilterState>({
    search: '',
    genre: '',
    tags: [],
    sortField: 'createdAt',
    sortDirection: 'desc',
  });

  const fetchSetups = useCallback(async () => {
    if (!userId) return;
    try {
      setLoading(true);
      setError(null);
      const data = await getGearSetups(userId);
      setSetups(data);
    } catch {
      setError('Failed to load gear setups.');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSetups();
  }, [fetchSetups]);

  const addSetup = async (
    data: Omit<GearSetup, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
  ): Promise<boolean> => {
    if (!userId) return false;
    try {
      const id = await createGearSetup(userId, data);
      const newSetup: GearSetup = {
        ...data,
        id,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setSetups((prev) => [newSetup, ...prev]);
      return true;
    } catch {
      setError('Failed to create gear setup.');
      return false;
    }
  };

  const editSetup = async (
    id: string,
    data: Partial<Omit<GearSetup, 'id' | 'userId' | 'createdAt'>>
  ): Promise<boolean> => {
    try {
      await updateGearSetup(id, data);
      setSetups((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, ...data, updatedAt: new Date() } : s
        )
      );
      return true;
    } catch {
      setError('Failed to update gear setup.');
      return false;
    }
  };

  const removeSetup = async (id: string): Promise<boolean> => {
    try {
      await deleteGearSetup(id);
      setSetups((prev) => prev.filter((s) => s.id !== id));
      return true;
    } catch {
      setError('Failed to delete gear setup.');
      return false;
    }
  };

  const filteredSetups = setups
    .filter((s) => {
      const q = filter.search.toLowerCase();
      if (q) {
        const match =
          s.name.toLowerCase().includes(q) ||
          s.guitar.toLowerCase().includes(q) ||
          s.amp.toLowerCase().includes(q) ||
          s.toneDescription.toLowerCase().includes(q) ||
          s.pedals.some((p) => p.name.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (filter.genre && s.genre !== filter.genre) return false;
      if (filter.tags.length > 0) {
        if (!filter.tags.every((t) => s.tags.includes(t))) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const field = filter.sortField as SortField;
      let aVal: string | Date = a[field] as string | Date;
      let bVal: string | Date = b[field] as string | Date;
      if (aVal instanceof Date && bVal instanceof Date) {
        return filter.sortDirection === 'asc'
          ? aVal.getTime() - bVal.getTime()
          : bVal.getTime() - aVal.getTime();
      }
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      return filter.sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    });

  const allGenres = [...new Set(setups.map((s) => s.genre).filter(Boolean))];
  const allTags = [...new Set(setups.flatMap((s) => s.tags))];

  return {
    setups,
    filteredSetups,
    loading,
    error,
    filter,
    setFilter,
    allGenres,
    allTags,
    addSetup,
    editSetup,
    removeSetup,
    refetch: fetchSetups,
  };
};
