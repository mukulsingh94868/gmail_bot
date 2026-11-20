"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { setAuthToken } from "@/utils/CookieData";
import { registerLoginAction } from "@/actions/loginActions";
import {
  ArrowRight,
  Briefcase,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  User,
  UserPlus,
} from "lucide-react";
import Logo from "@/components/ui/Logo";

const HRBotApp = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "candidate",
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "", confirmPassword: "", role: "candidate" });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox" && name === "role") {
      setFormData((prev) => ({ ...prev, role: checked ? "recruiter" : "candidate" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      if (!formData.email || !formData.password) return toast.error("Email and password are required");
    } else {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword)
        return toast.error("All fields are required");
      if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");
    }

    setLoading(true);
    const endpoint = isLogin ? "auth/login" : "auth/register";

    try {
      const payload = isLogin
        ? { email: formData.email, password: formData.password, role: formData.role || "candidate" }
        : { name: formData.name, email: formData.email, password: formData.password, role: formData.role || "candidate" };

      const res = await registerLoginAction(endpoint, payload);

      if (res?.error) {
        if (isLogin && res.error === "User not found") return toast.error("Please Register First");
        if (isLogin && res.error === "Invalid credentials") return toast.error("Invalid Email or Password");
        if (!isLogin && res.error === "User already exists") return toast.error("User already registered, please login");
        return toast.error(res.error);
      }

      if (isLogin) {
        if (res?.token) {
          toast.success(`Login successful as ${res?.data?.role}`);
          setAuthToken(res.token, "token");
          setAuthToken(res?.data?.role, "role");
          setFormData((prev) => ({ ...prev, role: res?.data?.role || prev.role }));
          router.push(res?.data?.role === "recruiter" ? "/recruiter-dashboard" : "/position");
        } else {
          toast.error("Something went wrong. Try again.");
        }
      } else {
        toast.success(`Registration successful as ${formData.role}. Please login now.`);
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "", confirmPassword: "", role: "candidate" });
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  const tabClass = (active) =>
    `inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
      active
        ? "bg-white text-brand-800 shadow-sm"
        : "text-slate-500 hover:text-slate-800"
    }`;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-canvas px-4 py-10">
      {/* Soft gradient backdrop */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-brand-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[26rem] w-[26rem] rounded-full bg-brand-300/30 blur-3xl" />
      <div className="pointer-events-none absolute right-1/4 top-10 h-48 w-48 rounded-full bg-rose-200/30 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <span className="mt-5 inline-flex items-center gap-2 rounded-full bg-brand-100/80 px-3 py-1 text-[11px] font-semibold text-brand-800">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-700" />
            Automate your job outreach with smart templates
          </span>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Elevate your outreach pipeline
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm text-slate-500">
            Target hiring managers, sequence smart follow-ups, and land interviews faster.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-xl shadow-brand-900/5">
          <div className="grid grid-cols-2 gap-1 bg-brand-50 p-1.5" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={isLogin}
              onClick={() => !isLogin && handleToggle()}
              className={tabClass(isLogin)}
            >
              <LogIn size={15} />
              Sign In
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={!isLogin}
              onClick={() => isLogin && handleToggle()}
              className={tabClass(!isLogin)}
            >
              <UserPlus size={15} />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 p-6 sm:p-7">
            {!isLogin && (
              <div>
                <label htmlFor="auth-name" className="rl-label-caps">Full Name</label>
                <div className="relative">
                  <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="auth-name"
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    className="rl-input pl-10"
                    value={formData.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="auth-email" className="rl-label-caps">Email Address</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  className="rl-input pl-10"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="auth-password" className="rl-label-caps">Password</label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter password"
                  className="rl-input pl-10 pr-11"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete={isLogin ? "current-password" : "new-password"}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="rl-icon-btn absolute right-1.5 top-1/2 -translate-y-1/2"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="auth-confirm" className="rl-label-caps">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="auth-confirm"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm password"
                    className="rl-input pl-10 pr-11"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="rl-icon-btn absolute right-1.5 top-1/2 -translate-y-1/2"
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            )}

            {!isLogin && (
              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                  formData.role === "recruiter"
                    ? "border-brand-300 bg-brand-50"
                    : "border-brand-100 hover:bg-brand-50/50"
                }`}
              >
                <input
                  type="checkbox"
                  name="role"
                  checked={formData.role === "recruiter"}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-slate-300 accent-brand-700"
                />
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-brand-700 shadow-sm">
                  <Briefcase size={15} />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-slate-800">Register as Recruiter</span>
                  <span className="block text-xs text-slate-500">Post jobs instead of applying to them</span>
                </span>
              </label>
            )}

            <button type="submit" disabled={loading} className="rl-btn-primary w-full py-3">
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {isLogin ? "Signing in..." : "Creating account..."}
                </>
              ) : (
                <>
                  {isLogin ? "Sign In to RecruitLoop" : "Create Account"}
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="border-t border-brand-100 pt-4 text-center text-sm text-slate-500">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={handleToggle}
                className="cursor-pointer font-semibold text-rose-600 transition hover:text-rose-700 hover:underline"
              >
                {isLogin ? "Sign up now" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HRBotApp;
