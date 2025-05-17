import { useState } from "react";
import "./login.css";
import eyeOpen from "../assets/eye-open.svg";
import eyeClosed from "../assets/eye-closed.svg";

function login({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (
        (storedUser &&
          email === storedUser.email &&
          password === storedUser.password) ||
        (email === "admin@example.com" && password === "admin")
      ) {
        onLogin();
      } else {
        alert("Email atau password salah!");
      }
    } else {
      if (password !== confirmPassword) {
        alert("Password dan konfirmasi tidak cocok!");
        return;
      }

      const user = { email, password };
      localStorage.setItem("user", JSON.stringify(user));
      alert("Akun berhasil dibuat! Silakan login.");
      toggleForm();
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      alert("Silakan masukkan email terlebih dahulu.");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser && storedUser.email === email) {
      alert(`Password kamu adalah: ${storedUser.password}`);
    } else {
      alert("Email tidak ditemukan.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <h1>Welcome to GIS</h1>
        <p>Sistem Informasi Geografis</p>
      </div>

      <div className="auth-right">
        <h2>{isLogin ? "Sign In" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <img
              src={showPassword ? eyeOpen : eyeClosed}
              alt="Toggle visibility"
              onClick={togglePasswordVisibility}
              className="eye-icon"
            />
          </div>

          {!isLogin && (
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <img
                src={showPassword ? eyeOpen : eyeClosed}
                alt="Toggle visibility"
                onClick={togglePasswordVisibility}
                className="eye-icon"
              />
            </div>
          )}

          {isLogin && (
            <div className="options">
              <label>
                <input type="checkbox" /> Remember Me
              </label>
              <span className="forgot-password" onClick={handleForgotPassword}>
                Forget Password?
              </span>
            </div>
          )}
          <button type="submit" className="signin-btn">
            {isLogin ? "Sign in now" : "Sign up now"}
          </button>
        </form>
        <p className="toggle-text">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={toggleForm}>
            {isLogin ? "Sign up" : "Sign in"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default login;
