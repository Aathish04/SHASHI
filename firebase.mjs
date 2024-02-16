// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore/lite';
import { getAnalytics } from "firebase/analytics";
import "dotenv/config";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTHDOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGINGSENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export async function getServerChannelUserHistory(serverid, channelid, userid) {
  const docRef = doc(db, "servers", serverid, "channels", channelid, "users", userid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists() && "history" in docSnap.data()) {
    return docSnap.data()["history"];
  }
  return []
}
export async function deleteServerChannelUserHistory(serverid, channelid, userid) {
  const docRef = doc(db, "servers", serverid, "channels", channelid, "users", userid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    let data = docSnap.data();
    data[`history_${Date.now()}`] = data["history"];
    data["history"] = [];
    await setDoc(docRef, data);
  }
  return 0;
}
export async function updateServerChannelUserHistory(serverid, channelid, userid, history) {// Also Writes
  const docRef = doc(db, "servers", serverid, "channels", channelid, "users", userid);
  await setDoc(docRef, { "history": history });
}
// const analytics = getAnalytics(app);
