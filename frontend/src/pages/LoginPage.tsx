import { useState } from "react";
import { useNavigate } from "react-router";
import { Activity, AlertCircle, User, Shield, Stethoscope, FlaskConical, Scale } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cls } from "@/lib/utils";
import type { Role } from "@/types";

const ROLE_ICONS: Record<Role, React.ReactNode> = {
  doctor: <Stethoscope size={14} />,
  admin:  <Shield size={14} />,
  lab:    <FlaskConical size={14} />,
  jmo:    <Scale size={14} />,
};

const ROLE_COLORS: Record<Role, string> = {
  doctor: "bg-blue-100 text-blue-700",
  admin:  "bg-slate-100 text-slate-700",
  lab:    "bg-emerald-100 text-emerald-700",
  jmo:    "bg-purple-100 text-purple-700",
};

export function LoginPage() {
  const { setCurrentUser, users: USERS } = useApp();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      const match = USERS.find(u => u.email === email.trim() && u.password === password);
      if (match) {
        setCurrentUser(match);
        navigate("/dashboard");
      } else {
        setError("Invalid email or password. Please try again.");
      }
      setLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-2xl mb-4 border border-white/20">
            <Activity size={32} className="text-blue-300" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-family-heading)" }}>
            Forensic Medical Department
          </h1>
          <p className="text-blue-300 text-sm mt-1">Medico-Legal Records Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-7">
          <h2 className="text-lg font-bold text-slate-800 mb-1" style={{ fontFamily: "var(--font-family-heading)" }}>Sign In</h2>
          <p className="text-sm text-slate-500 mb-6">Enter your credentials to access the system.</p>

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError(""); }}
                placeholder="e.g. dr.perera@forensic.gov"
                className="w-full border border-slate-300 rounded-lg pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Password</label>
            <div className="relative">
              <Shield size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type={showPassword ? "text" : "password"} value={password}
                onChange={e => { setPassword(e.target.value); setError(""); }}
                placeholder="Enter your password"
                className="w-full border border-slate-300 rounded-lg pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
              />
              <button type="button" onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-medium">
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <AlertCircle size={14} className="flex-shrink-0" />{error}
            </div>
          )}

          <button type="submit" disabled={!email || !password || loading}
            className="w-full bg-primary text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="mt-5 bg-white/5 border border-white/10 rounded-xl p-4">
          <p className="text-xs text-blue-300 font-semibold mb-3 uppercase tracking-wide">Demo Credentials</p>
          <div className="space-y-2">
            {USERS.map(u => (
              <button key={u.id} type="button"
                onClick={() => { setEmail(u.email); setPassword(u.password); setError(""); }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-left">
                <div className="flex items-center gap-2">
                  <span className={cls("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium", ROLE_COLORS[u.role])}>
                    {ROLE_ICONS[u.role]} {u.role}
                  </span>
                  <span className="text-xs text-white/80">{u.name}</span>
                </div>
                <span className="text-xs font-mono text-blue-300/70">{u.email}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-blue-300/50 mt-2 text-center">Click any row to auto-fill</p>
        </div>
      </div>
    </div>
  );
}
