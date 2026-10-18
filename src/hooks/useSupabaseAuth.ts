/**
 * Supabase Auth Hook with Cloud Progress Synchronization
 */

import { useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { UserProgress } from '../types';

export function useSupabaseAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'saved' | 'error'>('idle');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    }).catch(() => {
      setUser(null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadCloudProgress = useCallback(async (): Promise<Partial<UserProgress> | null> => {
    if (!user) return null;
    try {
      setSyncStatus('syncing');
      const { data, error } = await supabase
        .from('user_progress')
        .select('progress_data')
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        setSyncStatus('idle');
        return null;
      }
      setSyncStatus('saved');
      return data.progress_data as Partial<UserProgress>;
    } catch {
      setSyncStatus('error');
      return null;
    }
  }, [user]);

  const saveCloudProgress = useCallback(async (progress: UserProgress): Promise<boolean> => {
    if (!user) return false;
    try {
      setSyncStatus('syncing');
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          progress_data: progress,
          updated_at: new Date().toISOString()
        });

      if (error) {
        setSyncStatus('error');
        return false;
      }
      setSyncStatus('saved');
      return true;
    } catch {
      setSyncStatus('error');
      return false;
    }
  }, [user]);

  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (err) {
      console.error('Sign out failed', err);
    }
  }, []);

  return {
    user,
    syncStatus,
    loadCloudProgress,
    saveCloudProgress,
    signOut
  };
}
