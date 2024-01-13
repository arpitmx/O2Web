import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, logInWithEmailAndPassword } from "../../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUserData } from "../../utils/databaseOps";
import styles from "./Login.module.css";

export default function Login() {
  const [formData, setFormData] = React.useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      getUserData(auth.currentUser.email).then((userData) => {
        navigate("/create-task", { state: { userData : userData } });
      })
      .finally(() => {
        setLoading(false);
      })
    }
  }, [user]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: value,
      };
    });
  }

  async function handleSubmit(e) {
    setLoading(true);
    setError(null);
    e.preventDefault();
    logInWithEmailAndPassword(formData.email, formData.password)
    .catch((error) => {
      setLoading(false);
      switch(error.code) {
        case 'auth/user-not-found':
          setError("Email not registered");
          console.error("email not registered");
          break;
        case 'auth/wrong-password':
          setError("Incorrect password");
          console.error("wrong password");
          break;
        default: 
          setError("Network issue");
          console.log("network issue");
     }
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {error && <p className={styles.error}>{error}</p>}
        <h2 className={styles.header}>Login</h2>
        <div className={styles.greet}>
          <p className={styles.greetline}>Hello there !</p>
          <p className={styles.greetline}>Welcome to O2 </p>
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            id="email"
            className={styles.input}
            type="email"
            name="email"
            value={formData.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            id="password"
            className={styles.input}
            type="password"
            name="password"
            value={formData.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? "Hold on..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
