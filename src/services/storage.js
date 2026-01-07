import { supabase } from '../lib/supabaseClient';

const TABLE_NAME = 'app_storage';

// Helper to check if we should use Supabase
const useSupabase = () => !!supabase;

export const storage = {
  /**
   * Get value by key
   * @param {string} key
   * @param {any} defaultValue
   * @returns {Promise<any>}
   */
  async get(key, defaultValue) {
    if (useSupabase()) {
      try {
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .select('value')
          .eq('key', key)
          .single();

        if (error) {
           // If error code is PGRST116, it means no rows returned, which is fine (return default)
           if (error.code !== 'PGRST116') {
             console.error(`Supabase error fetching ${key}:`, error);
           }
           return defaultValue;
        }

        return data ? data.value : defaultValue;
      } catch (e) {
        console.error(`Error fetching ${key}:`, e);
        return defaultValue;
      }
    } else {
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
      } catch (e) {
        console.error(`Error reading localStorage for ${key}:`, e);
        return defaultValue;
      }
    }
  },

  /**
   * Set value by key
   * @param {string} key
   * @param {any} value
   * @returns {Promise<void>}
   */
  async set(key, value) {
    if (useSupabase()) {
      try {
        // Upsert (insert or update)
        const { error } = await supabase
          .from(TABLE_NAME)
          .upsert({ key, value }, { onConflict: 'key' });

        if (error) {
          console.error(`Supabase error saving ${key}:`, error);
        }
      } catch (e) {
        console.error(`Error saving ${key}:`, e);
      }
    } else {
      // Fallback to localStorage
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        console.error(`Error saving to localStorage for ${key}:`, e);
      }
    }
  },

  /**
   * Remove value by key
   * @param {string} key
   * @returns {Promise<void>}
   */
  async remove(key) {
    if (useSupabase()) {
      try {
        const { error } = await supabase
          .from(TABLE_NAME)
          .delete()
          .eq('key', key);

        if (error) {
          console.error(`Supabase error deleting ${key}:`, error);
        }
      } catch (e) {
        console.error(`Error deleting ${key}:`, e);
      }
    } else {
      localStorage.removeItem(key);
    }
  }
};
