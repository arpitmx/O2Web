import React, { useEffect, useState } from "react";
import { auth, db } from "../../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { collection, getDoc, setDoc, doc } from "firebase/firestore";

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
    <div>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <label>Email:</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <label>Password:</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth} disabled={loading}>
        {loading ? "Hold on..." : isLogin ? "Login" : "Sign Up"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Don't have an account? Sign up here."
          : "Already have an account? Login here."}
      </p>
    </div>
  );
}
