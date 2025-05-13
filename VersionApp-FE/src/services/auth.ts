import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const authService = {
  async signIn(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      return { user: userCredential.user, idToken };
    } catch (error) {
      throw error;
    }
  },

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  async getCurrentUser() {
    return auth.currentUser;
  },

  async getIdToken() {
    const user = auth.currentUser;
    if (!user) return null;
    return user.getIdToken();
  }
};