import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      if (!user.emailVerified) {
        await sendEmailVerification(user);

        alert(
  "⚠️ Your email is not verified yet.\n\n📧 A new verification email has been sent.\n\n👉 Please check your Primary, Promotions, Spam or Inbox tabs.\n\nIf you're using Gmail, the email may appear in the Promotions tab."
);

        return;
      }

      alert("✅ Login Successful");
      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("✅ Password reset email sent. Please check your inbox.");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="bg-zinc-900 border border-yellow-400 p-8 rounded-2xl w-full max-w-md">

        <h1 className="text-3xl font-bold text-yellow-400 text-center mb-6">
          Login
        </h1>

        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700"
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-yellow-400 text-black py-3 rounded-lg font-bold hover:bg-yellow-300 transition"
        >
          Login
        </button>

        <button
          onClick={handleForgotPassword}
          className="w-full mt-4 text-yellow-400 hover:underline"
        >
          Forgot Password?
        </button>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-yellow-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}