
"use client";
export const dynamic = "force-dynamic";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Film, Mail, Lock, Loader2, ArrowRight, User as UserIcon } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (isLogin) {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      window.location.href = "/dashboard"; // Take them to their new Profile Hub
    }
    } else {
      // Register logic
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        
        if (res.ok) {
          setSuccess("Account created! You can now log in.");
          setIsLogin(true);
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError("Something went wrong");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4 pt-20 pb-12">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="text-center space-y-4">
          <Link href="/" className="inline-flex items-center gap-2 text-red-600 font-black text-4xl tracking-tighter">
            <Film size={40} />
            <span>FREE SDK STREAM</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-black tracking-tight">{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p className="text-gray-500 font-medium">
              {isLogin ? "Sign in to access your personal watchlist." : "Join the premium community of film lovers."}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900/50 p-10 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-xl">
          <form onSubmit={handleCredentialsSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input 
                  required 
                  type="text" 
                  placeholder="Full Name"
                  className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition placeholder:text-zinc-700"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                required 
                type="email" 
                placeholder="Email Address"
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition placeholder:text-zinc-700"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input 
                required 
                type="password" 
                placeholder="Password"
                className="w-full bg-black border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition placeholder:text-zinc-700"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>

            {error && <p className="text-red-500 text-sm font-bold bg-red-500/10 p-4 rounded-xl border border-red-500/20 text-center">{error}</p>}
            {success && <p className="text-emerald-500 text-sm font-bold bg-emerald-500/10 p-4 rounded-xl border border-emerald-900/50 text-center">{success}</p>}

            <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-red-900/40 flex items-center justify-center gap-3">
              {loading ? <Loader2 className="animate-spin" /> : (isLogin ? "Sign In" : "Register Now")}
              {!loading && <ArrowRight size={20} />}
            </button>

            <div className="mt-8 pt-8 border-t border-white/5 text-center">
              <button 
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                  setSuccess("");
                }}
                className="text-gray-500 font-bold hover:text-white transition text-sm"
              >
                {isLogin ? "New to Free SDK Stream? Create account" : "Already have an account? Sign In"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
