// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

import {
  createUserWithEmailAndPassword,
  initializeAuth,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { doc, getFirestore, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = initializeAuth(app);

const signUpWithEmail = async (
  email: string,
  instaHandle: string,
  password: string,
  nickname: string,
  name: string,
  learningLanguage: string,
  languageLevel: string,
  roles: string[],
  onSuccess?: () => void,
  onError?: (error: any) => void
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    await setDoc(doc(db, "users", user.uid), {
      email,
      nickname,
      name,
      learningLanguage,
      languageLevel,
      roles,
      instaHandle,
      growthPoints: 0,
    });
    console.log("User document set in Firestore");

    // Get and store the ID token
    const idToken = await user.getIdToken();
    await AsyncStorage.setItem("userID", user.uid ?? "");
    await AsyncStorage.setItem("authToken", idToken);
    console.log("Auth token stored successfully");

    if (onSuccess) onSuccess();
  } catch (error) {
    console.error("Error during sign up:", error);
    if (onError) onError(error);
  }
};

const signInWithEmail = async (
  email: string,
  password: string,
  onSuccess?: () => void,
  onError?: (error: any) => void
): Promise<string | void> => {
  console.log("signInWithEmail called", { email });
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log("User signed in:", user.uid);

    // Get and store the ID token
    const idToken = await user.getIdToken();
    await AsyncStorage.setItem("userID", user.uid ?? "");
    await AsyncStorage.setItem("authToken", idToken);
    console.log("Auth token stored successfully");

    if (onSuccess) onSuccess();
  } catch (error: any) {
    console.error("Error during sign in:", error);
    if (onError) onError(error);
    return error.message;
  }
};

const signOutUser = async () => {
  try {
    await auth.signOut();
    await AsyncStorage.removeItem("userID");
    await AsyncStorage.removeItem("authToken");
    console.log("User signed out and tokens cleared");
  } catch (error) {
    console.error("Error during sign out:", error);
  }
};

const getStoredAuthToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem("authToken");
    return token;
  } catch (error) {
    console.error("Error getting stored auth token:", error);
    return null;
  }
};

const getStoredUserId = async (): Promise<string | null> => {
  try {
    const userId = await AsyncStorage.getItem("userID");
    return userId;
  } catch (error) {
    console.error("Error getting stored user ID:", error);
    return null;
  }
};

export {
  auth,
  db,
  getStoredAuthToken,
  getStoredUserId,
  signInWithEmail,
  signOutUser,
  signUpWithEmail,
};
