import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import YourtLogo from "./YourtLogo";
import { Loader2, Mail, Lock, User as UserIcon, ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";

interface AuthScreenProps {
  onBack?: () => void;
  initialMode?: "signin" | "signup" | "forgot";
}

export default function AuthScreen({ onBack, initialMode = "signin" }: AuthScreenProps) {
  const { signIn, signUp, signInWithGoogle, resetPassword, authError, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup" | "forgot">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [forgotSent, setForgotSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!email.trim() || !email.includes("@")) {
      setSubmitError("Please enter a valid email address.");
      return;
    }

    if (mode !== "forgot" && password.length < 6) {
      setSubmitError("Password should be at least 6 characters.");
      return;
    }

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else if (mode === "signup") {
        if (!firstName.trim() || !lastName.trim()) {
          setSubmitError("Please provide both first and last names.");
          return;
        }
        await signUp(email, password, firstName.trim(), lastName.trim());
      } else if (mode === "forgot") {
        await resetPassword(email);
        setForgotSent(true);
      }
    } catch (err: any) {
      setSubmitError(err.message || "An authentication error occurred.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F9] flex flex-col items-center justify-center p-4 relative overflow-hidden" id="auth-screen-layout">
      {/* Absolute decorative accent blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#FF6B00]/5 blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-black/3 blur-3xl -z-10" />

      {/* Auth Screen box branding */}
      <div className="w-full max-w-md space-y-6">
        
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-[#FF6B00] transition-colors cursor-pointer self-start bg-transparent border-0 p-0"
            id="auth-back-to-landing-btn"
          >
            ← Back to Landing Page
          </button>
        )}

        {/* Brand header */}
        <div className="text-center space-y-2 select-none">
          <div className="mx-auto flex justify-center">
            <YourtLogo size={48} />
          </div>
          <h1 className="font-display font-black text-2xl text-[#0D0D0D] tracking-tight mt-3">
            Yourt AI Creator Suite
          </h1>
          <p className="text-xs text-gray-500 font-sans tracking-wide">
            Real-time secure creator workspace connected to cloud storage
          </p>
        </div>

        {/* Core form card */}
        <motion.div 
          layout
          className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6"
        >
          {forgotSent ? (
            <div className="space-y-4 py-4 text-center animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="font-display font-bold text-lg text-gray-800">Check Your Inbox</h2>
              <p className="text-xs text-gray-500 max-w-sm mx-auto leading-relaxed">
                If an account matches **{email}**, we've sent instructions to safely reset your password.
              </p>
              <button 
                onClick={() => { setForgotSent(false); setMode("signin"); }}
                className="w-full bg-black hover:bg-neutral-800 text-white py-3 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer mt-2"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* mode titles */}
              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <h2 className="font-display font-black text-sm uppercase tracking-wider text-[#0D0D0D]">
                  {mode === "signin" && "Sign In To Account"}
                  {mode === "signup" && "Create Free Account"}
                  {mode === "forgot" && "Recover Password"}
                </h2>
                
                {mode !== "forgot" && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode(mode === "signin" ? "signup" : "signin");
                      setSubmitError(null);
                    }}
                    className="text-[#FF6B00] hover:text-black font-sans font-bold text-xs transition-colors cursor-pointer"
                  >
                    {mode === "signin" ? "Need an account?" : "Have an account?"}
                  </button>
                )}
              </div>

              {/* General inputs depending on the mode */}
              {mode === "signup" && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-405 block uppercase tracking-wider">First Name</label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Alex"
                        className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-250 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-[#FF6B00] focus:outline-none transition-all placeholder-gray-400"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-405 block uppercase tracking-wider">Last Name</label>
                    <div className="relative">
                      <input 
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Rivera"
                        className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-250 rounded-xl px-3.5 py-2.5 text-xs focus:ring-1 focus:ring-[#FF6B00] focus:outline-none transition-all placeholder-gray-400"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-405 block uppercase tracking-wider">Email Address</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-gray-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input 
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-250 rounded-xl pl-10 pr-3.5 py-2.5 text-xs focus:ring-1 focus:ring-[#FF6B00] focus:outline-none transition-all placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Password */}
              {mode !== "forgot" && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-gray-405 block uppercase tracking-wider">Password</label>
                    {mode === "signin" && (
                      <button
                        type="button"
                        onClick={() => { setMode("forgot"); setSubmitError(null); }}
                        className="text-[10px] text-gray-400 hover:text-[#FF6B00] font-semibold transition-colors cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-gray-400">
                      <Lock className="w-4 h-4" />
                    </span>
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-250 rounded-xl pl-10 pr-10 py-2.5 text-xs focus:ring-1 focus:ring-[#FF6B00] focus:outline-none transition-all placeholder-gray-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* Error logs */}
              {(submitError || authError) && (() => {
                const errorMsg = submitError || authError || "";
                const isAlreadyRegistered = errorMsg.toLowerCase().includes("already") || errorMsg.toLowerCase().includes("in-use") || errorMsg.toLowerCase().includes("in use");
                const isUserNotFound = errorMsg.toLowerCase().includes("not-found") || errorMsg.toLowerCase().includes("user not found") || errorMsg.toLowerCase().includes("no user") || errorMsg.toLowerCase().includes("invalid-credential") || errorMsg.toLowerCase().includes("invalid password") || errorMsg.toLowerCase().includes("wrong-password") || errorMsg.toLowerCase().includes("invalid credential");
                const isUnauthorizedDomain = errorMsg.toLowerCase().includes("unauthorized-domain") || 
                                             errorMsg.toLowerCase().includes("unauthorized domain") || 
                                             errorMsg.toLowerCase().includes("not authorized") ||
                                             errorMsg.toLowerCase().includes("unauthorized");

                if (isUnauthorizedDomain) {
                  return (
                    <div className="p-4 bg-orange-50 text-orange-950 border border-orange-200 rounded-2xl text-xs font-sans leading-relaxed animate-fade-in flex flex-col gap-3">
                      <div className="flex items-center gap-2 font-bold text-orange-900">
                        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full shrink-0 animate-ping" />
                        <span className="font-display font-black uppercase tracking-wider text-[11px]">Domain Authorization Needed</span>
                      </div>
                      <p className="text-orange-900 text-[11px]">
                        Google Sign-In is blocked because this sandbox preview domain is not yet authorized in your <strong>yourt-ai</strong> Firebase console.
                      </p>
                      
                      <div className="bg-white border border-orange-100 rounded-xl p-3 space-y-2 text-[11px]">
                        <span className="font-bold text-gray-700 block text-[10px] uppercase tracking-wider">1. Copy this domain address:</span>
                        <div className="flex items-center justify-between gap-2 bg-gray-50 border border-gray-150 rounded-lg px-2.5 py-1.5 font-mono text-[10.5px] text-gray-600">
                          <span className="break-all select-all font-semibold">{window.location.hostname}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.hostname);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 2000);
                            }}
                            className={`px-2.5 py-1 rounded text-[9px] font-sans font-bold transition-all cursor-pointer shadow-3xs ${copied ? "bg-emerald-600 text-white" : "bg-white hover:bg-gray-100 border border-gray-250 text-gray-700"}`}
                          >
                            {copied ? "Copied!" : "Copy"}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-orange-950 text-[11px]">
                        <span className="font-bold block text-[10px] uppercase tracking-wider">2. Enable in your Firebase Console:</span>
                        <ol className="list-decimal list-inside space-y-1 text-orange-900 pl-1">
                          <li>Go to <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-bold hover:text-black">Firebase Console</a></li>
                          <li>Open your project: <strong className="font-semibold text-orange-950">yourt-ai</strong></li>
                          <li>Select <strong>Authentication</strong> &rarr; <strong>Settings</strong> &rarr; <strong>Authorized Domains</strong></li>
                          <li>Click <strong>Add Domain</strong> and paste the copied address</li>
                        </ol>
                      </div>
                    </div>
                  );
                }

                if (isAlreadyRegistered) {
                  return (
                    <div className="p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-2xl text-xs font-sans leading-relaxed animate-fade-in flex flex-col gap-2.5">
                      <div className="flex items-center gap-2 font-bold">
                        <span className="w-2 h-2 bg-amber-500 rounded-full shrink-0 animate-pulse" />
                        <span className="font-display">Email Already Registered</span>
                      </div>
                      <p className="text-amber-850">
                        This email address is already associated with a Yourt AI account. Please log in directly with your password instead.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signin");
                          setSubmitError(null);
                        }}
                        className="self-start px-3.5 py-1.5 bg-[#0D0D0D] hover:bg-[#FF6B00] text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                      >
                        Switch to Sign In
                      </button>
                    </div>
                  );
                }

                if (isUserNotFound && mode === "signin") {
                  return (
                    <div className="p-4 bg-red-50 text-red-900 border border-red-200 rounded-2xl text-xs font-sans leading-relaxed animate-fade-in flex flex-col gap-2.5">
                      <div className="flex items-center gap-2 font-bold">
                        <span className="w-2 h-2 bg-red-500 rounded-full shrink-0" />
                        <span className="font-display">Account Not Found</span>
                      </div>
                      <p className="text-red-850">
                        We couldn't find an active account with these credentials. If this is your first time, please register an account first.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setMode("signup");
                          setSubmitError(null);
                        }}
                        className="self-start px-3.5 py-1.5 bg-[#FF6B00] hover:bg-black text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer shadow-3xs"
                      >
                        Register New Account
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="p-3.5 bg-red-50 text-red-700 border border-red-100 rounded-xl text-[11px] font-sans leading-relaxed animate-fade-in flex flex-col gap-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full shrink-0" />
                      <span>Authentication Failed</span>
                    </div>
                    <p className="text-gray-600">
                      {errorMsg}
                    </p>
                  </div>
                );
              })()}



              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0D0D0D] hover:bg-[#FF6B00] text-white font-sans font-bold text-xs py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Encrypting Keys...
                  </>
                ) : (
                  <>
                    <span>
                      {mode === "signin" && "Sign In"}
                      {mode === "signup" && "Register Account"}
                      {mode === "forgot" && "Send Reset Link"}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              {mode === "forgot" && (
                <button
                  type="button"
                  onClick={() => { setMode("signin"); setSubmitError(null); }}
                  className="w-full hover:bg-[#FAF9F9] text-gray-500 font-sans font-bold text-xs py-2 bg-transparent border border-transparent rounded-xl transition-all cursor-pointer block text-center"
                >
                  Cancel and Back
                </button>
              )}

            </form>
          )}

          {/* Google Authentication */}
          <div className="relative pt-4 border-t border-gray-100 flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black absolute -top-2 bg-white px-3 font-display">
              Or Sign In With
            </span>
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setSubmitError(null);
                try {
                  await signInWithGoogle();
                } catch (err: any) {
                  setSubmitError(err.message || "Failed to sign in with Google.");
                }
              }}
              className="w-full bg-white hover:bg-gray-50 border border-gray-250 hover:border-[#ff6b00]/30 text-gray-700 font-sans font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-3 shadow-2xs hover:shadow-xs disabled:opacity-50"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
              </svg>
              <span>Continue with Google</span>
            </button>

            <p className="text-[10px] text-gray-400 mt-2.5 text-center leading-relaxed">
              Secure authentication processed via safe, encrypted single sign-on protocols.
            </p>
          </div>

        </motion.div>



      </div>
    </div>
  );
}
