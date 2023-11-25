import React, { useState } from "react";
import { auth } from "../../../firebase";
import style from "./Login.module.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState(null);

  const handleResetPassword = async () => {
    try {
      setError(null);
      await auth.sendPasswordResetEmail(email);
      setResetSent(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      {resetSent ? (
        <p>Password reset email sent. Check your inbox.</p>
      ) : (
        <div>
          <p>Enter your email to reset your password.</p>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleResetPassword}>Reset Password</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
