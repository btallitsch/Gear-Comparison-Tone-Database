import { useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import {
  loginWithEmail,
  loginWithGoogle,
  logout,
  registerWithEmail,
  resetPassword,
} from '../services/auth.service';

export const useAuth = () => {
  const { user, loading } = useAuthContext();
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  const clearError = () => setAuthError(null);

  const handleRegister = async (
    email: string,
    password: string,
    displayName: string
  ): Promise<boolean> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await registerWithEmail(email, password, displayName);
      return true;
    } catch (err: unknown) {
      setAuthError(getFirebaseErrorMessage(err));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await loginWithEmail(email, password);
      return true;
    } catch (err: unknown) {
      setAuthError(getFirebaseErrorMessage(err));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleGoogleLogin = async (): Promise<boolean> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await loginWithGoogle();
      return true;
    } catch (err: unknown) {
      setAuthError(getFirebaseErrorMessage(err));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    await logout();
  };

  const handleResetPassword = async (email: string): Promise<boolean> => {
    try {
      setAuthLoading(true);
      setAuthError(null);
      await resetPassword(email);
      return true;
    } catch (err: unknown) {
      setAuthError(getFirebaseErrorMessage(err));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  return {
    user,
    loading,
    authError,
    authLoading,
    clearError,
    handleRegister,
    handleLogin,
    handleGoogleLogin,
    handleLogout,
    handleResetPassword,
  };
};

function getFirebaseErrorMessage(err: unknown): string {
  if (typeof err === 'object' && err !== null && 'code' in err) {
    const code = (err as { code: string }).code;
    const messages: Record<string, string> = {
      'auth/email-already-in-use': 'This email is already registered.',
      'auth/invalid-email': 'Invalid email address.',
      'auth/weak-password': 'Password must be at least 6 characters.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password.',
      'auth/too-many-requests': 'Too many attempts. Please try again later.',
      'auth/popup-closed-by-user': 'Sign-in popup was closed.',
    };
    return messages[code] ?? 'An unexpected error occurred.';
  }
  return 'An unexpected error occurred.';
}
