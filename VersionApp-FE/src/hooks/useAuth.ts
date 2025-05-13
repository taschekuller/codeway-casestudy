import { ref, onMounted, onUnmounted } from 'vue';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export const useAuth = () => {
  const user = ref<User | null>(null);
  const loading = ref(true);
  const error = ref<string | null>(null);

  const getIdToken = async (forceRefresh = false): Promise<string | null> => {
    if (!user.value) return null;
    try {
      return await user.value.getIdToken(forceRefresh);
    } catch (err) {
      console.error('Error getting ID token:', err);
      return null;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      error.value = null;
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred during sign in';
      throw err;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An error occurred during sign out';
      throw err;
    }
  };

  // Set up auth state listener
  onMounted(() => {
    const unsubscribe = onAuthStateChanged(auth, (newUser) => {
      user.value = newUser;
      loading.value = false;
    });

    // Clean up listener on component unmount
    onUnmounted(() => {
      unsubscribe();
    });
  });

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    getIdToken
  };
};