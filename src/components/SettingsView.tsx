import React, { useState, useEffect } from "react";
import { 
  User, 
  Sparkles, 
  Check, 
  Database, 
  HelpCircle, 
  Key, 
  Mail, 
  CreditCard, 
  Copy,
  Info,
  Layers,
  Zap,
  RotateCcw
} from "lucide-react";
import { UserProfile } from "../types";
import { motion } from "motion/react";
import CheckoutModal from "./CheckoutModal";

interface PaymentPackage {
  id: string;
  name: string;
  credits: number;
  price: string;
  priceVal: number;
  description: string;
  popular?: boolean;
}

interface SettingsViewProps {
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
  credits: number;
  onAddCredits: (amount: number) => void;
}

export default function SettingsView({ userProfile, onUpdateProfile, credits, onAddCredits }: SettingsViewProps) {
  const [firstName, setFirstName] = useState(userProfile.firstName);
  const [lastName, setLastName] = useState(userProfile.lastName);
  const [email, setEmail] = useState(userProfile.email);
  const [aiModel, setAiModel] = useState(userProfile.aiModel || "Gemini 2.5 Flash (Recommended)");
  
  // Notification States
  const [productUpdates, setProductUpdates] = useState(userProfile.productUpdates);
  const [securityAlerts, setSecurityAlerts] = useState(userProfile.securityAlerts);
  const [marketEmails, setMarketEmails] = useState(userProfile.marketEmails);

  // Success Toast alert state
  const [showToast, setShowToast] = useState(false);
  const [copiedKey, setCopiedKey] = useState<"prod" | "test" | null>(null);

  // Recharge credits feedback state
  const [rechargeSuccess, setRechargeSuccess] = useState<string | null>(null);

  // Secure payment gateway states
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PaymentPackage | null>(null);

  const packages: PaymentPackage[] = [
    {
      id: "starter",
      name: "Starter Refuel",
      credits: 500,
      price: "$4.99",
      priceVal: 4.99,
      description: "Ideal for light writers.",
      popular: false
    },
    {
      id: "growth",
      name: "Standard Refill",
      credits: 1500,
      price: "$9.99",
      priceVal: 9.99,
      description: "Popular choice for creators.",
      popular: true
    },
    {
      id: "pro",
      name: "Enterprise Boost",
      credits: 5000,
      price: "$24.99",
      priceVal: 24.99,
      description: "Unlimited potential.",
      popular: false
    }
  ];

  const handleOpenCheckout = (pkg: PaymentPackage) => {
    setSelectedPackage(pkg);
    setIsCheckoutOpen(true);
  };

  const handlePaymentSuccess = (creditedAmount: number) => {
    onAddCredits(creditedAmount);
    setRechargeSuccess(`Successfully recharged +${creditedAmount} credits!`);
    setTimeout(() => setRechargeSuccess(null), 3000);
  };

  // Sync state if prop changes
  useEffect(() => {
    setFirstName(userProfile.firstName);
    setLastName(userProfile.lastName);
    setEmail(userProfile.email);
    setAiModel(userProfile.aiModel || "Gemini 2.5 Flash (Recommended)");
    setProductUpdates(userProfile.productUpdates);
    setSecurityAlerts(userProfile.securityAlerts);
    setMarketEmails(userProfile.marketEmails);
  }, [userProfile]);

  const handleCopy = (keyType: "prod" | "test", value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(keyType);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Save to global state (which syncs to localStorage automatically)
    onUpdateProfile({
      firstName,
      lastName,
      email,
      productUpdates,
      securityAlerts,
      marketEmails,
      aiModel
    });

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleRecharge = (amount: number) => {
    onAddCredits(amount);
    setRechargeSuccess(`Successfully recharged +${amount} credits!`);
    setTimeout(() => setRechargeSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in text-[#0d0d0d] pb-20 relative" id="settings-view-container">
      
      {/* Settings Top Header with Save Changes alignment */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <h1 className="font-display font-semibold text-2xl tracking-tight text-[#0d0d0d]">
            Settings Suite
          </h1>
          <p className="text-sm text-gray-400 font-sans mt-0.5">
            Optimize your creator credentials, select AI intelligence models, recharge limits, and customize alerts.
          </p>
        </div>

        <button 
          onClick={() => handleSave()}
          className="bg-[#0d0d0d] hover:bg-[#FF6B00] active:scale-95 text-white text-xs font-semibold py-2.5 px-6 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Save Configuration
        </button>
      </div>

      {/* Success Toast */}
      {showToast && (
        <motion.div 
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-6 right-6 bg-black text-white text-xs px-5 py-3.5 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 border border-white/10"
        >
          <div className="w-5 h-5 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3px]" />
          </div>
          <span className="font-sans font-semibold">Creator settings updated and saved!</span>
        </motion.div>
      )}

      {/* Recharge Credits Flash Banner */}
      {rechargeSuccess && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            <span>{rechargeSuccess}</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 px-2 py-0.5 rounded">
            Updated Balance: {credits} Credits
          </span>
        </motion.div>
      )}

      {/* Main Settings Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Columns - Width 2/3 */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card: Profile Information */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm space-y-5">
            <h3 className="font-display font-semibold text-sm text-[#0D0D0D] flex items-center gap-2 border-b border-gray-100 pb-3">
              <User className="w-4 h-4 text-gray-500" />
              Creator Information
            </h3>

            {/* Avatar Row */}
            <div className="flex items-center gap-4.5 bg-[#FAF9F9] p-4 rounded-xl border border-gray-100">
              <div className="w-14 h-14 rounded-full bg-[#FF6B00] text-white flex items-center justify-center font-display font-black text-xl select-none border-2 border-white shadow-md">
                {`${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || "ME"}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-gray-850 leading-none">
                  {firstName || "New"} {lastName || "Creator"}
                </h4>
                <p className="text-xs text-gray-400 mt-1 font-mono">{email || "no-email@studio.com"}</p>
                <div className="flex gap-3 text-[10px] uppercase font-bold tracking-wide text-gray-500 mt-2.5">
                  <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-extrabold uppercase tracking-widest text-[9px]">
                    Pro Level Axis
                  </span>
                </div>
              </div>
            </div>

            {/* Inputs Grid */}
            <form onSubmit={handleSave} className="space-y-4 text-xs font-semibold text-gray-750">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">First Name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="e.g. Shaheer"
                    className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] px-3.5 py-2.5 rounded-xl text-gray-800 font-sans transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="e.g. Khan"
                    className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] px-3.5 py-2.5 rounded-xl text-gray-800 font-sans transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. shaheer@domain.cc"
                  className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] px-3.5 py-2.5 rounded-xl text-gray-800 font-mono transition-all"
                />
              </div>
            </form>
          </div>

          {/* New Card: AI Engine Configuration */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-display font-semibold text-sm text-[#0D0D0D] flex items-center gap-2 border-b border-gray-100 pb-3">
              <Layers className="w-4 h-4 text-gray-500" />
              AI Intelligence Engine
            </h3>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Preferred LLM Model</label>
              <select 
                value={aiModel} 
                onChange={(e) => setAiModel(e.target.value)}
                className="w-full bg-[#FAF9F9] focus:bg-white border border-gray-250 font-sans p-3 rounded-xl text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
              >
                <option value="Gemini 2.5 Flash (Recommended)">Gemini 2.5 Flash – High speed, precise texturing &amp; covers</option>
                <option value="Gemini 2.5 Pro – Professional Scripting">Gemini 2.5 Pro – Unmatched conceptual logic &amp; narrative structures</option>
                <option value="Gemini 1.5 Pro – Legacy Heavy">Gemini 1.5 Pro – Deep analysis and high context support</option>
              </select>
              
              <div className="bg-[#FAF9F9] p-3 rounded-lg flex items-start gap-2 border border-gray-200/55 text-[11px] text-gray-500">
                <Info className="w-4 h-4 text-[#FF6B00] shrink-0 mt-0.5" />
                <p>Gemini is automatically handled server-side securely. This setting overrides default prompt temperatures to match specific creative subgenres.</p>
              </div>
            </div>
          </div>

          {/* Card: Plan & Billing with Dynamic recharge trigger */}
          <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-sm space-y-5">
            <h2 className="font-display font-semibold text-sm text-[#0D0D0D] flex items-center gap-2 border-b border-gray-100 pb-3">
              <CreditCard className="w-4 h-4 text-gray-500" />
              Usage Limits &amp; Recharge Credits
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-start flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-sm text-gray-800">Yourt Space Credits</span>
                    <span className="text-[9px] font-extrabold text-[#FF6B00] bg-[#FFF2EB] border border-[#FF6B00]/15 tracking-widest px-2.5 py-0.5 rounded uppercase">
                      Pro Plan
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 font-sans mt-1">Available balance: <strong>{credits} Credits</strong>. Cycles reset on next billing period.</p>
                </div>

                <div className="flex gap-2 text-xs font-bold uppercase tracking-wider text-gray-500 text-[10px]">
                  <button 
                    onClick={() => handleSave()}
                    className="hover:text-[#FF6B00] cursor-pointer"
                  >
                    Sync Profile
                  </button>
                </div>
              </div>

              {/* Progress Bar of Generations */}
              <div className="space-y-2 pt-2 border-t border-gray-50">
                <div className="flex justify-between text-xs font-semibold select-none text-gray-500">
                  <span>Credit consumption limits:</span>
                  <span className="text-gray-800 font-bold">{credits} Units Available</span>
                </div>
                
                {/* Horizontal Progress bar */}
                <div className="w-full bg-gray-150 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#FF6B00] to-orange-400 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (credits / 2500) * 100)}%` }} 
                  />
                </div>
              </div>

              {/* Buy Credits Only (One-Time Refills) */}
              <div className="pt-5 mt-4 bg-[#fff7f2]/50 rounded-2xl p-5 border border-[#ff6b00]/15 space-y-4" id="buy-credits-only">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-[#ff6b00]" />
                      Refill Space Credits (One-Time Purchase)
                    </h4>
                    <p className="text-[11px] text-gray-500 font-sans mt-0.5">Top-up your balance immediately to continue producing high-retention content.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {packages.map((pkg) => (
                    <div 
                      key={pkg.id} 
                      className={`relative bg-white p-4.5 rounded-2xl border flex flex-col justify-between transition-all duration-300 ${
                        pkg.popular 
                          ? "border-[#FF6B00] ring-1 ring-[#FF6B00]/25 shadow-xs" 
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="absolute -top-2 left-4 px-2 py-0.5 bg-[#FF6B00] text-white text-[8px] font-black uppercase tracking-widest rounded-full leading-none">
                          BEST VALUE
                        </span>
                      )}
                      
                      <div className="space-y-1 mb-3">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">{pkg.name}</span>
                        <h5 className="font-display font-black text-[#0d0d0d] text-sm">+{pkg.credits} Credits</h5>
                        <p className="text-[10px] text-gray-500 font-sans leading-relaxed mt-1">{pkg.description}</p>
                      </div>

                      <div className="pt-2 border-t border-gray-50 flex items-center justify-between gap-2 mt-auto">
                        <span className="font-mono font-black text-[#0d0d0d] text-xs">{pkg.price}</span>
                        <button
                          type="button"
                          onClick={() => handleOpenCheckout(pkg)}
                          className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer ${
                            pkg.popular
                              ? "bg-[#FF6B00] text-white hover:bg-[#E05E00]"
                              : "bg-[#0d0d0d] text-white hover:bg-[#FF6B00]"
                          }`}
                        >
                          Buy Credits
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Columns - Width 1/3 */}
        <div className="space-y-6">
          
          {/* Card: Developer API Keys */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-display font-semibold text-sm text-[#0D0D0D] flex items-center gap-2 border-b border-gray-100 pb-3">
              <Key className="w-4 h-4 text-gray-500" />
              Developer API Keys
            </h3>

            <p className="text-[11px] text-gray-400 font-medium font-sans leading-relaxed">
              Use these keys to authenticate your custom integrations and external applications.
            </p>

            <div className="space-y-3.5 text-xs">
              {/* Key 1: Production */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Production Key</span>
                <div className="flex bg-[#FAF9F9] border border-gray-100 rounded-xl p-2 items-center justify-between font-mono">
                  <span className="text-gray-600 truncate text-[10px] select-all max-w-[155px]">yr_prod_8x92nm418sz92m2q</span>
                  <button 
                    onClick={() => handleCopy("prod", "yr_prod_8x92nm418sz92m2q")}
                    className="p-1 text-gray-400 hover:text-[#FF6B00] cursor-pointer"
                  >
                    {copiedKey === "prod" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Key 2: Testing */}
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">Testing Key</span>
                <div className="flex bg-[#FAF9F9] border border-gray-100 rounded-xl p-2 items-center justify-between font-mono">
                  <span className="text-gray-600 truncate text-[10px] select-all max-w-[155px]">yr_test_4b11nz8p932k01zp</span>
                  <button 
                    onClick={() => handleCopy("test", "yr_test_4b11nz8p932k01zp")}
                    className="p-1 text-gray-400 hover:text-[#FF6B00] cursor-pointer"
                  >
                    {copiedKey === "test" ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-50 flex justify-end">
              <button 
                type="button"
                onClick={() => alert("API documentations are linked specifically to developer keys.")}
                className="text-[10px] uppercase font-extrabold text-gray-400 hover:text-[#FF6B00] tracking-wider"
              >
                View API Documentation
              </button>
            </div>
          </div>

          {/* Card: Email Notifications */}
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-display font-semibold text-sm text-[#0D0D0D] flex items-center gap-2 border-b border-gray-100 pb-3">
              <Mail className="w-4 h-4 text-gray-500" />
              Email Notifications
            </h3>

            {/* Switches */}
            <div className="space-y-3.5 font-sans">
              
              {/* Product Updates */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700">Product Updates</h4>
                  <p className="text-[10px] text-gray-400">New features and release logs.</p>
                </div>
                {/* Custom toggle slider */}
                <button 
                  type="button"
                  onClick={() => setProductUpdates(!productUpdates)}
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all cursor-pointer ${productUpdates ? "bg-[#FF6B00]" : "bg-gray-250"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${productUpdates ? "translate-x-4" : ""}`} />
                </button>
              </div>

              {/* Security Alerts */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700">Security Alerts</h4>
                  <p className="text-[10px] text-gray-400">Critical checks and key revocations.</p>
                </div>
                {/* Custom toggle slider */}
                <button 
                  type="button"
                  onClick={() => setSecurityAlerts(!securityAlerts)}
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all cursor-pointer ${securityAlerts ? "bg-[#FF6B00]" : "bg-gray-250"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${securityAlerts ? "translate-x-4" : ""}`} />
                </button>
              </div>

              {/* Marketing Emails */}
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-semibold text-gray-700">Marketing Emails</h4>
                  <p className="text-[10px] text-gray-400">Newsletters and promotional credits.</p>
                </div>
                {/* Custom toggle slider */}
                <button 
                  type="button"
                  onClick={() => setMarketEmails(!marketEmails)}
                  className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all cursor-pointer ${marketEmails ? "bg-[#FF6B00]" : "bg-gray-250"}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${marketEmails ? "translate-x-4" : ""}`} />
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Secure checkout gateway modal */}
      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        packageDetails={selectedPackage} 
        onPaymentSuccess={handlePaymentSuccess} 
      />
    </div>
  );
}
