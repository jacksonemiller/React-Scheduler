import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyCeUhQuIhx94BcEU1JSrC0z13crzdlvlgQ",
  authDomain: "react-scheduler-28d6d.firebaseapp.com",
  databaseURL: "https://react-scheduler-28d6d-default-rtdb.firebaseio.com",
  projectId: "react-scheduler-28d6d",
  storageBucket: "react-scheduler-28d6d.appspot.com",
  messagingSenderId: "31477040960",
  appId: "1:31477040960:web:0f0f0045b83b677bab5ca5",
  measurementId: "G-JSLRJ7C96Y"
};

const firebase = initializeApp(firebaseConfig);
const database = getDatabase(firebase);

export const useData = (path, transform) => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState();
  
    useEffect(() => {
      const dbRef = ref(database, path);
      const devMode = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
      if (devMode) { console.log(`loading ${path}`); }
      return onValue(dbRef, (snapshot) => {
        const val = snapshot.val();
        if (devMode) { console.log(val); }
        setData(transform ? transform(val) : val);
        setLoading(false);
        setError(null);
      }, (error) => {
        setData(null);
        setLoading(false);
        setError(error);
      });
    }, [path, transform]);
  
    return [data, loading, error];
  };

export const setData = (path, value) => (
    set(ref(database, path), value)
  );