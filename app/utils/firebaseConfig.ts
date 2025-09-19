// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";

import {
  createUserWithEmailAndPassword,
  getReactNativePersistence,
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
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

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
    await AsyncStorage.setItem("userID", user.uid ?? "");
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
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    await AsyncStorage.setItem("userID", user.uid ?? "");
    if (onSuccess) onSuccess();
  } catch (error: any) {
    if (onError) onError(error);
    return error.message;
  }
};

export { auth, db, signInWithEmail, signUpWithEmail };
