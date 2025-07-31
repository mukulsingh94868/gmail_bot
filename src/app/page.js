"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const HRBotApp = () => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? `${process.env.NEXT_PUBLIC_APP}/api/auth/login`
      : `${process.env.NEXT_PUBLIC_APP}/api/auth/register`;

    if (!isLogin && formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match");
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isLogin
            ? {
              email: formData.email,
              password: formData.password,
            }
            : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }
        ),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Something went wrong");
        return;
      }

      toast.success(data.message || (isLogin ? "Login successful" : "Registration successful"));

      if (isLogin) {
        if (data.token) {
          localStorage.setItem("token", data.token);
          // setAuthToken(data.token);
          router.push("/position");
        }
      } else {
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-blue-700">RecruitLoop</h1>
          <p className="text-sm text-gray-500 mt-1">Automate your recruiter outreach with smart templates</p>
        </div>

        <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {isLogin ? "Login to your account" : "Create an account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border px-4 py-2 rounded-lg text-gray-800"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-4 py-2 rounded-lg text-gray-800"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full border px-4 py-2 rounded-lg text-gray-800"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border px-4 py-2 rounded-lg text-gray-800"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold"
          >
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={handleToggle}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default HRBotApp;
