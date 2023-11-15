import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, getDoc, setDoc, doc } from "firebase/firestore";
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);

  const handleAuth = async () => {
    try {
      setError(null);
      setLoading(true);

      const documentId = email;

      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Fetch user data from the "Users" collection
        const userDoc = await getDoc(doc(db, "Users", documentId));

        if (userDoc.exists()) {
          // Set user data in state
          setUserData(userDoc.data());
          console.log("User logged in successfully!");
          alert("Authenticated!")
        } else {
          console.log("User document does not exist.");
        }
      } else {
        // Signup
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Add user data to the "Users" collection
        const usersCollection = collection(db, "Users");
        await setDoc(doc(usersCollection, documentId), {
          EMAIL: email,
          // Add other user data as needed
          /////////////////////////////////////////////////////
          DESIGNATION: "Web Developer",
          /////////////////////////////////////////////////////
        });

        // Fetch the newly added user data from the "Users" collection
        const newUserDoc = await getDoc(doc(db, "Users", documentId));

        if (newUserDoc.exists()) {
          // Set user data in state
          setUserData(newUserDoc.data());
          console.log("User signed up successfully!");
          alert("Authenticated!")
        } else {
          console.log("Newly created user document does not exist.");
        }
      }
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      setError(errorMessage);
      console.error("Authentication error:", errorCode, errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    ///////////////////////firebase might be preventing it from extracting///////////////
    console.log("userData", userData);
  }, [userData]);
  return (
    <div className={styles.card}>
      {error && <p className={styles.error}>{error}</p>}
      <h2 className={styles.header}>{isLogin ? "Login" : "Sign Up"}</h2>
      <div className={styles.greet}>
        <p className={styles.greetline}>Hello there !</p>
        {isLogin ? <p className={styles.greetline}>Welcome Back</p> :  <p className={styles.greetline}>Welcome to O2 </p>}
      </div>
      <form className={styles.form}>
        <input
          type="email"
          value={email}
          className={styles.input}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          className={styles.input}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className={styles.forgotwrap}>
        <p onClick={()=>alert("forgot password button clicked")} className={styles.forgot}>
          Forgot password?
        </p>
        </div>
        <button
          className={styles.button}
          onClick={handleAuth}
          disabled={loading}
        >
          {loading ? "Hold on..." : isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      <p  onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ?<p className={styles.link} > Don't have an account? <span className={styles.linkN}>Sign up</span> here.</p>
          : <p className={styles.link}>Already have an account? <span className={styles.linkN}>Login</span> here.</p>}
      </p>
    </div>
  );
}
