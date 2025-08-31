"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setAuthToken } from "@/utils/CookieData";
import { registerLoginAction } from "@/actions/loginActions";
import { Eye, EyeOff, Loader2 } from "lucide-react"; // ✅ Added Loader2

const HRBotApp = () => {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "candidate",
    });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "role") {
      setFormData((prev) => ({
        ...prev,
        role: checked ? "recruiter" : "candidate",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Basic validation
    if (isLogin) {
      if (!formData.email || !formData.password) {
        return toast.error("Email and password are required");
      }
    } else {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        return toast.error("All fields are required");
      }
      if (formData.password !== formData.confirmPassword) {
        return toast.error("Passwords do not match");
      }
    }

    setLoading(true); // ✅ Start loading
    const endpoint = isLogin ? `auth/login` : `auth/register`;

    try {
      const payload = isLogin
        ? {
            email: formData.email,
            password: formData.password,
            role: formData.role || "candidate",
          }
        : {
            name: formData.name,
            email: formData.email,
            password: formData.password,
            role: formData.role || "candidate",
          };

      const res = await registerLoginAction(endpoint, payload);

      if (res?.error) {
        if (isLogin && res.error === "User not found") {
          return toast.error("Please Register First");
        }
        if (isLogin && res.error === "Invalid credentials") {
          return toast.error("Invalid Email or Password");
        }
        if (!isLogin && res.error === "User already exists") {
          return toast.error("User already registered, please login");
        }
        return toast.error(res.error);
      }

      if (isLogin) {
        if (res?.token) {
          toast.success(`Login successful as ${res?.data?.role}`);
          setAuthToken(res.token, "token");
          setAuthToken(res?.data?.role, "role");
          setFormData((prev) => ({
            ...prev,
            role: res?.data?.role || prev.role,
          }));

          if (res?.data?.role === "recruiter") {
            router.push("/recruiter-dashboard");
          } else {
            router.push("/position");
          }
        } else {
          toast.error("Something went wrong. Try again.");
        }
      } else {
        toast.success(
          `Registration successful as ${formData.role}. Please login now.`
        );
        setIsLogin(true);
        setFormData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          role: "candidate",
        });
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Network error");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-blue-700">RecruitLoop</h1>
          <p className="text-sm text-gray-500 mt-1">
            Automate your recruiter outreach with smart templates
          </p>
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

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full border px-4 py-2 rounded-lg text-gray-800 pr-10"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {!isLogin && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm Password"
                className="w-full border px-4 py-2 rounded-lg text-gray-800 pr-10"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          )}

          {!isLogin && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="role"
                id="role"
                checked={formData.role === "recruiter"}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label htmlFor="role" className="text-gray-700">
                {!isLogin && "Register as Recruiter"}
              </label>
            </div>
          )}

          {/* ✅ Submit Button with loader */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 ${
              loading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-lg font-semibold`}
          >
            {loading ? (
              <>
                {/* <Loader2 className="animate-spin" size={18} /> */}
                {isLogin ? "Logging in..." : "Registering..."}
              </>
            ) : (
              <>{isLogin ? "Login" : "Register"}</>
            )}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={handleToggle}
            className="text-blue-600 hover:underline font-medium cursor-pointer"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default HRBotApp;
