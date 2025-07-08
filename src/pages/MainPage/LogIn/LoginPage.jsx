import React, { useState } from "react";
import "./LoginPage.scss";
import { useNavigate } from "react-router-dom";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import DefaultAnim from "../../../Lootie/loginanim.lottie";
import { useAuth } from "../../../AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [animationType, setAnimationType] = useState("default");
  const [animationKey, setAnimationKey] = useState(0);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setAnimationType("default");
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "USERNAME": username,
          "PASSWORD": password,
          "DEBUG": "true",
          "NOCATCH": "true",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const foundUser = await response.json();
      setAnimationType("success");
      setAnimationKey((prevKey) => prevKey + 1);
      setTimeout(() => {
        login(foundUser); // ذخیره اطلاعات کاربر در AuthContext
        navigate("/MainPage", {
          state: { welcomeMessage: `${foundUser.role || "کاربر"} محترم خوش آمدید!` },
        });
      }, 3000);
    } catch (error) {
      setAnimationType("error");
      setAnimationKey((prevKey) => prevKey + 1);
      setTimeout(() => {
        setAnimationType("default");
      }, 2000);
      // می‌توانید پیام خطا را لاگ یا نمایش دهید
      console.error(error);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1>ورود به حساب کاربری</h1>
        <form className="login-form" onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="نام کاربری"
            className="form-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={animationType === "success"}
          />
          <input
            type="password"
            placeholder="رمز عبور"
            className="form-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={animationType === "success"}
          />
          <button
            type="submit"
            className="login-button"
            disabled={animationType === "success"}
          >
            {animationType === "success" ? "در حال ورود..." : "ورود"}
          </button>
        </form>
      </div>

      <div className="login-right">
        <div>
          <DotLottieReact
            key={animationKey}
            id="loginAnim"
            src={
              animationType === "success"
                ? DefaultAnim
                : animationType === "error"
                ? "https://lottie.host/89138cb4-e80f-4771-ab37-f8749d088e25/Uky1oW3Iz3.lottie"
                : DefaultAnim
            }
            autoplay={animationType !== "default"}
            loop={animationType !== "default"}
          />
        </div>
        <h1>خوش آمدید!</h1>
        <h3>برای ورود به حساب کاربری خود، اطلاعات را وارد کنید.</h3>
      </div>
    </div>
  );
};

export default LoginPage;
