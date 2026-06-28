import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { 
  doc, 
  getDoc, 
  setDoc,
  onSnapshot 
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { UserProfile, SavedItem, CalendarEvent } from "../types";

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  authError: string | null;
  signUp: (email: string, pass: string, first: string, last: string) => Promise<void>;
  signIn: (email: string, pass: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUserProfile: (newProfile: UserProfile) => Promise<void>;
  syncCredits: (amount: number) => Promise<void>;
  syncSavedList: (list: SavedItem[]) => Promise<void>;
  syncCalendarEvents: (events: CalendarEvent[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Sync state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthError(null);

      if (currentUser) {
        setUser(currentUser);
        setProfile(null); // Clear stale profile immediately
        // Fetch or create user record in Firestore
        try {
          const userDocRef = doc(db, "yourt_users", currentUser.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const data = userSnap.data();
            setProfile(data.profile || {
              firstName: currentUser.displayName?.split(" ")[0] || "Creative",
              lastName: currentUser.displayName?.split(" ")[1] || "Member",
              email: currentUser.email || "",
              productUpdates: true,
              securityAlerts: true,
              marketEmails: false,
              aiModel: "Gemini 2.5 Flash (Recommended)"
            });
          } else {
            // Document does not exist, initialize user profile in Firestore
            const initialProfile: UserProfile = {
              firstName: currentUser.displayName?.split(" ")[0] || "Alex",
              lastName: currentUser.displayName?.split(" ")[1] || "Rivera",
              email: currentUser.email || "",
              productUpdates: true,
              securityAlerts: true,
              marketEmails: false,
              aiModel: "Gemini 2.5 Flash (Recommended)"
            };

            const defaultData = {
              uid: currentUser.uid,
              profile: initialProfile,
              credits: 250,
              savedList: [],
              calendarEvents: [],
              createdAt: new Date().toISOString()
            };

            await setDoc(userDocRef, defaultData);
            setProfile(initialProfile);
          }
        } catch (e: any) {
          const isOffline = e?.message?.includes("offline") || e?.toString()?.includes("offline");
          if (isOffline) {
            console.warn("Operating in offline/cached mode: Firestore is currently offline, applying fallback user profile.");
          } else {
            console.error("Firestore loading error, applying defensive fallback profile:", e);
          }
          // Fallback static profile representation
          setProfile({
            firstName: currentUser.displayName?.split(" ")[0] || "Creative",
            lastName: currentUser.displayName?.split(" ")[1] || "Member",
            email: currentUser.email || "",
            productUpdates: true,
            securityAlerts: true,
            marketEmails: false,
            aiModel: "Gemini 2.5 Flash (Recommended)"
          });
        }
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, pass: string, first: string, last: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const trimmedEmail = email.trim();
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, pass);
      const newUser = userCredential.user;

      // Update auth display name
      const fullName = `${first} ${last}`.trim();
      await updateProfile(newUser, { displayName: fullName });

      // Create doc in custom database
      const userDocRef = doc(db, "yourt_users", newUser.uid);
      const newProfile: UserProfile = {
        firstName: first,
        lastName: last,
        email: trimmedEmail,
        productUpdates: true,
        securityAlerts: true,
        marketEmails: false,
        aiModel: "Gemini 2.5 Flash (Recommended)"
      };

      await setDoc(userDocRef, {
        uid: newUser.uid,
        profile: newProfile,
        credits: 250,
        savedList: [],
        calendarEvents: [],
        createdAt: new Date().toISOString()
      });

      setProfile(newProfile);
    } catch (e: any) {
      console.error("Signup failed:", e);
      let friendlyMessage = e.message || "An account could not be initialized.";
      if (e.code === "auth/email-already-in-use") {
        friendlyMessage = "This email is already associated with an account.";
      } else if (e.code === "auth/weak-password") {
        friendlyMessage = "The password is too weak. Please choose at least 6 characters.";
      } else if (e.code === "auth/invalid-email") {
        friendlyMessage = "The email address is formatted incorrectly.";
      } else if (e.code === "auth/operation-not-allowed") {
        friendlyMessage = "Email/Password sign-up is not yet enabled in your Firebase project. To enable it, navigate to the Firebase Console -> Build -> Authentication -> Sign-in Method, and switch on the 'Email/Password' provider.";
      }
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, pass: string) => {
    setLoading(true);
    setAuthError(null);
    try {
      const trimmedEmail = email.trim();
      await signInWithEmailAndPassword(auth, trimmedEmail, pass);
    } catch (e: any) {
      console.error("Sign-in failed:", e);
      let friendlyMessage = "Invalid credentials. Please verify your email and password.";
      if (e.code === "auth/user-not-found" || e.code === "auth/wrong-password" || e.code === "auth/invalid-credential") {
        friendlyMessage = "Invalid email credentials. Please check your credentials and try again.";
      } else if (e.code === "auth/invalid-email") {
        friendlyMessage = "This email address format is invalid.";
      } else if (e.code === "auth/operation-not-allowed") {
        friendlyMessage = "Email/Password sign-in is not yet enabled in your Firebase project. To enable it, navigate to the Firebase Console -> Build -> Authentication -> Sign-in Method, and switch on the 'Email/Password' provider.";
      }
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e: any) {
      console.error("Google sign-in failed:", e);
      let friendlyMessage = e.message || "Could not complete Google authentication.";
      if (e.code === "auth/popup-closed-by-user") {
        friendlyMessage = "Google login popup was closed before completion.";
      } else if (e.code === "auth/cancelled-popup-request") {
        friendlyMessage = "Google sign-in was cancelled.";
      } else if (e.code === "auth/unauthorized-domain") {
        friendlyMessage = `This domain (${window.location.hostname}) is not authorized for Google Sign-In in your Firebase project. To fix this, please: 1. Open your Firebase Console. 2. Navigate to Authentication -> Settings -> Authorized Domains. 3. Click "Add Domain" and type in "${window.location.hostname}" (without any http/https protocol prefix).`;
      }
      setAuthError(friendlyMessage);
      throw new Error(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      if (user?.uid === "public-creator-user-id") {
        setUser(null);
        setProfile(null);
      } else {
        await firebaseSignOut(auth);
        setProfile(null);
      }
    } catch (e: any) {
      console.error("Sign-out failed:", e);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
    } catch (e: any) {
      console.error("Password reset error:", e);
      let msg = "Could not deliver recovery link. Check email format.";
      if (e.code === "auth/user-not-found") {
        msg = "No user found with this email addresses.";
      }
      throw new Error(msg);
    }
  };

  const updateUserProfile = async (newProfile: UserProfile) => {
    if (!user) return;
    if (user.uid === "public-creator-user-id") {
      setProfile(newProfile);
      localStorage.setItem("yourt_user_profile", JSON.stringify(newProfile));
      return;
    }
    try {
      setProfile(newProfile);
      const userDocRef = doc(db, "yourt_users", user.uid);
      await setDoc(userDocRef, { profile: newProfile }, { merge: true });
    } catch (e: any) {
      const isOffline = e?.message?.includes("offline") || e?.toString()?.includes("offline");
      if (isOffline) {
        console.warn("Offline status: profile state updated locally but write is queued/offline.");
      } else {
        console.error("Firestore user update failure:", e);
      }
    }
  };

  const syncCredits = async (amount: number) => {
    if (!user) return;
    if (user.uid === "public-creator-user-id") {
      localStorage.setItem("yourt_credits", amount.toString());
      return;
    }
    try {
      const userDocRef = doc(db, "yourt_users", user.uid);
      await setDoc(userDocRef, { credits: amount }, { merge: true });
    } catch (e: any) {
      const isOffline = e?.message?.includes("offline") || e?.toString()?.includes("offline");
      if (isOffline) {
        console.warn("Offline status: credits updated locally but sync is queued/offline.");
      } else {
        console.error("Firestore sync credits failure:", e);
      }
    }
  };

  const syncSavedList = async (list: SavedItem[]) => {
    if (!user) return;
    if (user.uid === "public-creator-user-id") {
      localStorage.setItem("yourt_saved_assets", JSON.stringify(list));
      return;
    }
    try {
      const userDocRef = doc(db, "yourt_users", user.uid);
      await setDoc(userDocRef, { savedList: list }, { merge: true });
    } catch (e: any) {
      const isOffline = e?.message?.includes("offline") || e?.toString()?.includes("offline");
      if (isOffline) {
        console.warn("Offline status: saved list updated locally but sync is queued/offline.");
      } else {
        console.error("Firestore sync saved list failure:", e);
      }
    }
  };

  const syncCalendarEvents = async (events: CalendarEvent[]) => {
    if (!user) return;
    if (user.uid === "public-creator-user-id") {
      localStorage.setItem("yourt_calendar_events", JSON.stringify(events));
      return;
    }
    try {
      const userDocRef = doc(db, "yourt_users", user.uid);
      await setDoc(userDocRef, { calendarEvents: events }, { merge: true });
    } catch (e: any) {
      const isOffline = e?.message?.includes("offline") || e?.toString()?.includes("offline");
      if (isOffline) {
        console.warn("Offline status: calendar events updated locally but sync is queued/offline.");
      } else {
        console.error("Firestore sync events failure:", e);
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      authError,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      resetPassword,
      updateUserProfile,
      syncCredits,
      syncSavedList,
      syncCalendarEvents
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be defined inside an AuthProvider");
  }
  return context;
}
