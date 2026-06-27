import React, { useState } from "react";
import { 
  X, 
  Lock, 
  CreditCard, 
  ShieldCheck, 
  CheckCircle, 
  AlertCircle, 
  Activity, 
  Sparkles,
  DollarSign,
  Smartphone,
  Wallet,
  Landmark,
  QrCode,
  ClipboardCheck,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  packageDetails: {
    id: string;
    name: string;
    credits: number;
    price: string;
    priceVal: number;
    description: string;
    popular?: boolean;
  } | null;
  onPaymentSuccess: (creditedAmount: number) => void;
}

const PKR_RATE = 280; // Stable exchange rate representation

export default function CheckoutModal({ isOpen, onClose, packageDetails, onPaymentSuccess }: CheckoutModalProps) {
  const [method, setMethod] = useState<"card" | "mobile" | "fintech" | "bank">("card");
  const [mobileProvider, setMobileProvider] = useState<"easypaisa" | "jazzcash">("easypaisa");
  const [fintechProvider, setFintechProvider] = useState<"sadapay" | "nayapay">("sadapay");
  
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");

  const [mobileNumber, setMobileNumber] = useState("");
  const [fintechId, setFintechId] = useState("");
  const [bankSenderName, setBankSenderName] = useState("");
  const [bankTxId, setBankTxId] = useState("");

  // Step-based verification flags for mobile and fintech wallets
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [awaitingAppApproval, setAwaitingAppApproval] = useState(false);
  
  // Checkout processing states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStep, setProcessStep] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<{
    transactionId: string;
    timestamp: string;
    amountPaid: string;
    creditsAdded: number;
    paymentMethod: string;
    invoiceNo: string;
  } | null>(null);

  if (!isOpen || !packageDetails) return null;

  const pkrPrice = Math.round(packageDetails.priceVal * PKR_RATE);

  // Formatting inputs
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    let matches = value.match(/\d{4,16}/g);
    let match = (matches && matches[0]) || "";
    let parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length > 0) {
      setCardNumber(parts.join(" "));
    } else {
      setCardNumber(value);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (value.length >= 2) {
      setExpiry(value.substring(0, 2) + "/" + value.substring(2, 4));
    } else {
      setExpiry(value);
    }
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (value.length <= 4) {
      setCvc(value);
    }
  };

  // Pre-fill card / wallet details for demo/review
  const fillTestCard = () => {
    setCardName("Alex Rivera");
    setCardNumber("4242 4242 4242 4242");
    setExpiry("12/28");
    setCvc("345");
  };

  const fillTestWallet = () => {
    setMobileNumber("03217654321");
  };

  const fillTestFintech = () => {
    setFintechId("@shaheer");
  };

  const fillTestBank = () => {
    setBankSenderName("Shaheer Khan");
    setBankTxId("TRX" + Math.floor(100000 + Math.random() * 900000));
  };

  // Secure Multi-Method Payment Handler
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // 1. Interactive client state transitions for Mobile Wallet (OTP)
    if (method === "mobile" && !otpSent) {
      if (mobileNumber.length < 11) {
        setError("Please enter a valid Pakistani mobile number (11 digits, e.g. 0321xxxxxxx).");
        return;
      }
      setIsProcessing(true);
      setProcessStep("Connecting to GSM Mobile Money Gateway...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessStep(`Generating secure ${mobileProvider === "easypaisa" ? "EasyPaisa" : "JazzCash"} pull invoice request...`);
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsProcessing(false);
      setOtpSent(true);
      return;
    }

    // 2. Interactive client state transitions for Fintech direct pull (SadaPay/NayaPay App approve)
    if (method === "fintech" && !awaitingAppApproval) {
      if (!fintechId.trim()) {
        setError("Please enter your SadaPay or NayaPay handle/number.");
        return;
      }
      setIsProcessing(true);
      setProcessStep(`Connecting to ${fintechProvider === "sadapay" ? "SadaPay API" : "NayaPay Gateway"}...`);
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessStep("Pushing payment invoice directly to your smartphone app...");
      await new Promise((resolve) => setTimeout(resolve, 900));
      setIsProcessing(false);
      setAwaitingAppApproval(true);
      return;
    }

    // 3. Main processing flow
    const cleanNum = cardNumber.replace(/\s/g, "");
    if (method === "card") {
      if (cleanNum.length < 15 || cleanNum.length > 16) {
        setError("Please enter a valid credit card number (15 or 16 digits).");
        return;
      }
      if (!expiry.includes("/") || expiry.split("/")[0].length !== 2) {
        setError("Please enter a valid expiry date (MM/YY).");
        return;
      }
      if (cvc.length < 3) {
        setError("Please enter a valid CVC security code.");
        return;
      }
      if (!cardName.trim()) {
        setError("Please enter the cardholder's full name.");
        return;
      }
    }

    if (method === "mobile" && otpSent) {
      if (otpCode.length < 4) {
        setError("Please enter the 4-digit verification code sent to your mobile.");
        return;
      }
    }

    if (method === "bank") {
      if (!bankSenderName.trim()) {
        setError("Please enter the sender account name/title to verify transaction.");
        return;
      }
    }

    setIsProcessing(true);
    setProcessStep("Initializing secure transaction...");

    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setProcessStep("Encrypting payload and transmitting secure ledger packet...");
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProcessStep("Authorizing credentials & verifying block balance...");

      // Call our updated multi-method backend API
      const response = await fetch("/api/payment/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          packageId: packageDetails.id,
          packageName: packageDetails.name,
          amount: packageDetails.priceVal,
          credits: packageDetails.credits,
          paymentMethod: method,
          
          // Card Details
          cardHolder: method === "card" ? cardName : undefined,
          cardNumber: method === "card" ? cleanNum : undefined,
          expiry: method === "card" ? expiry : undefined,
          cvc: method === "card" ? cvc : undefined,
          
          // Mobile Wallet Details
          mobileProvider: method === "mobile" ? mobileProvider : undefined,
          mobileNumber: method === "mobile" ? mobileNumber : undefined,
          otpCode: method === "mobile" ? otpCode : undefined,

          // Fintech Details
          fintechProvider: method === "fintech" ? fintechProvider : undefined,
          fintechId: method === "fintech" ? fintechId : undefined,

          // Bank Details
          bankSenderName: method === "bank" ? bankSenderName : undefined,
          bankTxId: method === "bank" ? bankTxId : undefined,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Transaction declined by gateway.");
      }

      setProcessStep("Refueling creators' credits balance...");
      await new Promise((resolve) => setTimeout(resolve, 600));

      let displayPaymentMethod = "";
      if (method === "card") {
        displayPaymentMethod = `Card: •••• ${cleanNum.slice(-4)}`;
      } else if (method === "mobile") {
        displayPaymentMethod = `${mobileProvider === "easypaisa" ? "EasyPaisa" : "JazzCash"}: ${mobileNumber}`;
      } else if (method === "fintech") {
        displayPaymentMethod = `${fintechProvider === "sadapay" ? "SadaPay" : "NayaPay"}: ${fintechId}`;
      } else if (method === "bank") {
        displayPaymentMethod = "Bank Deposit Alfalah";
      }

      setReceipt({
        transactionId: result.transactionId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        timestamp: new Date().toLocaleString(),
        amountPaid: method === "card" ? packageDetails.price : `Rs. ${pkrPrice.toLocaleString()}`,
        creditsAdded: packageDetails.credits,
        paymentMethod: displayPaymentMethod,
        invoiceNo: result.invoiceNo || `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`
      });

      // Fire global credit sync callback
      onPaymentSuccess(packageDetails.credits);

    } catch (err: any) {
      console.error("[Payment Checkout Error]", err);
      setError(err.message || "An unexpected gateway error occurred. Please try again.");
    } finally {
      setIsProcessing(false);
      setProcessStep("");
    }
  };

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 bg-[#0d0d0d]/70 backdrop-blur-xs flex items-center justify-center z-50 p-4"
        id="payment-gateway-overlay"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh]"
          id="payment-gateway-modal"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-[#FAF9F9]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#FF6B00]/10 flex items-center justify-center text-[#FF6B00]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#0d0d0d] text-base leading-tight">
                  YourtPay Secure Checkout
                </h3>
                <p className="text-[10px] text-gray-500 font-sans flex items-center gap-1 mt-0.5">
                  <Lock className="w-2.5 h-2.5 text-emerald-600" />
                  PCI-DSS Secure Pakistani Gateway Node
                </p>
              </div>
            </div>
            
            {!isProcessing && (
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 text-gray-400 hover:text-black flex items-center justify-center transition-colors cursor-pointer border-0"
                id="close-gateway-btn"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Body Content Scrollable container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            
            {/* Case 1: Payment Success Receipt Screen */}
            {receipt ? (
              <div className="space-y-6 animate-fade-in text-center py-2" id="payment-receipt-container">
                <div className="mx-auto w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-1">
                  <CheckCircle className="w-7 h-7 stroke-[2.5]" />
                </div>
                
                <div className="space-y-1.5">
                  <h4 className="font-display font-black text-xl text-[#0d0d0d]">Refuel Approved!</h4>
                  <p className="text-xs text-gray-500 font-sans max-w-xs mx-auto">
                    Your account has been instantly credited with the brand new creative boost package.
                  </p>
                </div>

                {/* Professional Invoice Slip layout */}
                <div className="bg-[#FAF9F9] border border-gray-150 rounded-2xl p-5 text-left text-xs font-sans space-y-3.5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#FF6B00]" />
                  <div className="flex justify-between border-b border-gray-200/60 pb-2">
                    <span className="text-gray-400 uppercase font-bold text-[9px] tracking-wider">INVOICE NUMBER</span>
                    <span className="font-mono font-bold text-gray-800">{receipt.invoiceNo}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3.5 pt-1">
                    <div>
                      <span className="text-gray-400 block text-[9px] font-bold tracking-widest uppercase">CREATIVE PACKAGE</span>
                      <span className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FF6B00] fill-[#FF6B00]/10" />
                        {packageDetails.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-[9px] font-bold tracking-widest uppercase">CREDITS ADDED</span>
                      <span className="font-black text-emerald-600 text-sm">+{receipt.creditsAdded} Credits</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[9px] font-bold tracking-widest uppercase">GATEWAY PROVIDER</span>
                      <span className="font-bold text-gray-800 mt-0.5 block">YourtPay PK Ledger</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-[9px] font-bold tracking-widest uppercase">AMOUNT PAID</span>
                      <span className="font-mono font-black text-[#0d0d0d] text-sm md:text-base">{receipt.amountPaid}</span>
                    </div>

                    <div>
                      <span className="text-gray-400 block text-[9px] font-bold tracking-widest uppercase">TRANSACTION ID</span>
                      <span className="font-mono text-gray-500 text-[10px] select-all block mt-0.5">{receipt.transactionId}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-gray-400 block text-[9px] font-bold tracking-widest uppercase">PAYMENT SOURCE</span>
                      <span className="font-mono text-gray-800 text-[11px] block mt-0.5">{receipt.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between text-[10px] text-gray-400 font-mono">
                    <span>{receipt.timestamp}</span>
                    <span className="text-[#FF6B00] font-bold">STATUS: SETTLED</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full bg-[#0d0d0d] hover:bg-[#FF6B00] text-white text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer border-0 shadow-sm"
                >
                  Return to Creator Suite
                </button>
              </div>
            ) : isProcessing ? (
              /* Case 2: Checkout Processing Animation */
              <div className="py-12 flex flex-col items-center justify-center space-y-6 text-center animate-fade-in" id="payment-processing-loader">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-100 border-t-[#FF6B00] rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-gray-400 animate-pulse" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-display font-bold text-[#0d0d0d] text-sm">Processing Secure Transaction</h4>
                  <p className="text-xs text-gray-400 font-sans">{processStep}</p>
                </div>
                
                <div className="bg-[#FAF9F9] border border-gray-100 px-4 py-2.5 rounded-full text-[10px] text-gray-500 font-sans flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-600" />
                  Secure Handshake Session
                </div>
              </div>
            ) : (
              /* Case 3: Standard Multi-Method Payment Selector Form */
              <form onSubmit={handlePaymentSubmit} className="space-y-4" id="checkout-gateway-form">
                
                {/* Selected Package Details */}
                <div className="bg-[#fff7f2] border border-[#ff6b00]/10 rounded-2xl p-4 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-extrabold text-[#FF6B00] tracking-widest uppercase">REFUEL BUNDLE</span>
                    <h4 className="font-display font-black text-gray-800 text-sm flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#ff6b00]" />
                      {packageDetails.name}
                    </h4>
                    <p className="text-[11px] text-gray-500 font-sans">{packageDetails.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block font-mono">Total Price</span>
                    <span className="font-display font-black text-base text-[#0d0d0d]">{packageDetails.price}</span>
                    <span className="font-mono text-[10px] text-gray-500 block">Rs. {pkrPrice.toLocaleString()} PKR</span>
                  </div>
                </div>

                {/* Tab Method Selector */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide block">Select Payment Method</label>
                  <div className="grid grid-cols-4 gap-1.5 bg-[#FAF9F9] p-1 rounded-xl border border-gray-200">
                    <button
                      type="button"
                      onClick={() => { setMethod("card"); setError(null); }}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all border-0 cursor-pointer ${
                        method === "card" ? "bg-white text-[#FF6B00] shadow-xs" : "bg-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Card</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMethod("mobile"); setError(null); }}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all border-0 cursor-pointer ${
                        method === "mobile" ? "bg-white text-[#FF6B00] shadow-xs" : "bg-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMethod("fintech"); setError(null); }}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all border-0 cursor-pointer ${
                        method === "fintech" ? "bg-white text-[#FF6B00] shadow-xs" : "bg-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <Wallet className="w-3.5 h-3.5" />
                      <span>Fintech</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => { setMethod("bank"); setError(null); }}
                      className={`py-2 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all border-0 cursor-pointer ${
                        method === "bank" ? "bg-white text-[#FF6B00] shadow-xs" : "bg-transparent text-gray-500 hover:text-gray-800"
                      }`}
                    >
                      <Landmark className="w-3.5 h-3.5" />
                      <span>Bank</span>
                    </button>
                  </div>
                </div>

                {/* Validation Error Banner */}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 text-red-700 text-[11px] rounded-xl flex items-start gap-2.5 animate-shake">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                    <p className="font-sans leading-relaxed">{error}</p>
                  </div>
                )}

                {/* Content Forms according to Method */}
                <div className="bg-[#FCFCFC] border border-gray-150 rounded-2xl p-4 min-h-[160px] flex flex-col justify-center">
                  
                  {/* Option 1: Credit Card Form */}
                  {method === "card" && (
                    <div className="space-y-3.5 text-xs font-semibold text-gray-700 w-full">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wide">
                        <span>Card Information (via Safepay / Stripe)</span>
                        <button
                          type="button"
                          onClick={fillTestCard}
                          className="text-[10px] font-bold text-[#FF6B00] hover:underline cursor-pointer bg-transparent border-0"
                        >
                          Auto-fill Card
                        </button>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase block">Cardholder Name</label>
                        <input 
                          type="text" 
                          required
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="e.g. Shaheer Khan"
                          className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] px-3 py-2 rounded-xl text-gray-800 font-sans transition-all text-xs"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase block">Card Number</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            required
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            placeholder="4242 4242 4242 4242"
                            maxLength={19}
                            className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] pl-9 pr-3 py-2 rounded-xl text-gray-800 font-mono transition-all text-xs"
                          />
                          <CreditCard className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase block">Expiry Date</label>
                          <input 
                            type="text" 
                            required
                            value={expiry}
                            onChange={handleExpiryChange}
                            placeholder="MM/YY"
                            maxLength={5}
                            className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] px-3 py-2 rounded-xl text-gray-800 font-mono transition-all text-center text-xs"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase block">CVC Security Code</label>
                          <input 
                            type="password" 
                            required
                            value={cvc}
                            onChange={handleCvcChange}
                            placeholder="123"
                            maxLength={4}
                            className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] px-3 py-2 rounded-xl text-gray-800 font-mono transition-all text-center text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Option 2: Mobile Money Wallets (EasyPaisa/JazzCash) */}
                  {method === "mobile" && (
                    <div className="space-y-3.5 text-xs font-semibold text-gray-700 w-full">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wide">
                        <span>Pakistani Mobile Wallet Integration</span>
                        {!otpSent && (
                          <button
                            type="button"
                            onClick={fillTestWallet}
                            className="text-[10px] font-bold text-[#FF6B00] hover:underline cursor-pointer bg-transparent border-0"
                          >
                            Auto-fill Phone
                          </button>
                        )}
                      </div>

                      {/* Mobile money selector toggles */}
                      {!otpSent && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setMobileProvider("easypaisa")}
                            className={`py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                              mobileProvider === "easypaisa" 
                                ? "border-[#39b54a] bg-[#39b54a]/5 text-[#39b54a]" 
                                : "border-gray-200 bg-white text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#39b54a]" />
                            EasyPaisa Wallet
                          </button>
                          <button
                            type="button"
                            onClick={() => setMobileProvider("jazzcash")}
                            className={`py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                              mobileProvider === "jazzcash" 
                                ? "border-[#FFB500] bg-[#FFB500]/5 text-[#c98e00]" 
                                : "border-gray-200 bg-white text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#FFB500]" />
                            JazzCash Wallet
                          </button>
                        </div>
                      )}

                      {/* OTP Code State */}
                      {otpSent ? (
                        <div className="space-y-3.5 text-center py-1">
                          <div className="w-10 h-10 rounded-full bg-[#FF6B00]/10 text-[#FF6B00] flex items-center justify-center mx-auto mb-1">
                            <Lock className="w-5 h-5" />
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-800 text-xs">Verify OTP Authentication Code</h5>
                            <p className="text-[10px] text-gray-500 font-normal mt-0.5 leading-relaxed">
                              We sent a 4-digit mobile verification code via push network response to **{mobileNumber}**.
                            </p>
                          </div>
                          <div className="space-y-2 max-w-[150px] mx-auto">
                            <input
                              type="text"
                              maxLength={4}
                              required
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                              placeholder="e.g. 1234"
                              className="w-full text-center tracking-[0.75em] pl-[0.75em] bg-white border border-gray-250 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] py-2 rounded-xl text-gray-800 font-mono font-black text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => { setOtpCode("1234"); setError(null); }}
                              className="text-[9px] font-bold text-emerald-600 hover:underline cursor-pointer bg-transparent border-0"
                            >
                              Simulate SMS Delivery (Use 1234)
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase block">Mobile Money Account Number</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ""))}
                              placeholder="e.g. 03217654321"
                              maxLength={11}
                              className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] pl-9 pr-3 py-2 rounded-xl text-gray-800 font-mono text-xs transition-all"
                            />
                            <Smartphone className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                          </div>
                          <p className="text-[9px] text-gray-400 leading-normal font-sans pt-1">
                            Ensure you have active funds on your phone wallet. We will trigger a secure payment push direct popup approval request to your device.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Option 3: Fintech Wallets (SadaPay/NayaPay) */}
                  {method === "fintech" && (
                    <div className="space-y-3.5 text-xs font-semibold text-gray-700 w-full">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wide">
                        <span>SadaPay / NayaPay Instant Authorization</span>
                        {!awaitingAppApproval && (
                          <button
                            type="button"
                            onClick={fillTestFintech}
                            className="text-[10px] font-bold text-[#FF6B00] hover:underline cursor-pointer bg-transparent border-0"
                          >
                            Auto-fill Handle
                          </button>
                        )}
                      </div>

                      {!awaitingAppApproval && (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => setFintechProvider("sadapay")}
                            className={`py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                              fintechProvider === "sadapay" 
                                ? "border-[#14b8a6] bg-[#14b8a6]/5 text-[#14b8a6]" 
                                : "border-gray-200 bg-white text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#14b8a6]" />
                            SadaPay App
                          </button>
                          <button
                            type="button"
                            onClick={() => setFintechProvider("nayapay")}
                            className={`py-2 rounded-xl border text-[11px] font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                              fintechProvider === "nayapay" 
                                ? "border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00]" 
                                : "border-gray-200 bg-white text-gray-500 hover:text-gray-800"
                            }`}
                          >
                            <span className="w-2 h-2 rounded-full bg-[#FF6B00]" />
                            NayaPay App
                          </button>
                        </div>
                      )}

                      {awaitingAppApproval ? (
                        <div className="space-y-3 text-center py-1">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                            <Smartphone className="w-5 h-5 animate-bounce" />
                          </div>
                          <div>
                            <h5 className="font-bold text-gray-800 text-xs">Awaiting Application Approval...</h5>
                            <p className="text-[10px] text-gray-500 font-normal mt-0.5 leading-relaxed max-w-sm mx-auto">
                              We pushed an invoice of **Rs. {pkrPrice.toLocaleString()}** to your **{fintechProvider === "sadapay" ? "SadaPay" : "NayaPay"}** application for ID **{fintechId}**. Open your phone app, approve the pending request, and click continue below.
                            </p>
                          </div>
                          <div className="text-[9px] text-emerald-600 font-bold bg-emerald-50 py-1.5 px-3 rounded-lg inline-block">
                            💡 Tap "Check Approval &amp; Sync Credits" below to complete payment
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase block">Account Handle or Number (@handle)</label>
                          <div className="relative">
                            <input 
                              type="text" 
                              required
                              value={fintechId}
                              onChange={(e) => setFintechId(e.target.value)}
                              placeholder="e.g. @shaheer or 03217654321"
                              className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] pl-9 pr-3 py-2 rounded-xl text-gray-800 font-sans text-xs transition-all"
                            />
                            <Wallet className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                          </div>
                          <p className="text-[9px] text-gray-400 leading-normal font-sans pt-1">
                            The system will automatically ping your SadaPay/NayaPay mobile application node securely to fetch approval.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Option 4: Direct Bank Wire Transfer / IBAN */}
                  {method === "bank" && (
                    <div className="space-y-3 text-xs font-semibold text-gray-700 w-full">
                      <div className="flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-wide border-b border-gray-150 pb-1.5">
                        <span>Direct Bank Deposit Info</span>
                        <button
                          type="button"
                          onClick={fillTestBank}
                          className="text-[10px] font-bold text-[#FF6B00] hover:underline cursor-pointer bg-transparent border-0"
                        >
                          Auto-fill Details
                        </button>
                      </div>

                      {/* Display corporate bank account credentials */}
                      <div className="bg-[#FAF9F9] border border-gray-200 p-3 rounded-xl space-y-1.5 text-[11px] font-sans">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Beneficiary Bank:</span>
                          <span className="font-bold text-gray-800">Bank Alfalah (PK)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Account Title:</span>
                          <span className="font-bold text-gray-800">Yourt AI (Pvt) Ltd.</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">IBAN:</span>
                          <span className="font-mono font-bold text-gray-800 text-[10px] bg-white px-1.5 py-0.5 rounded border border-gray-150 select-all">
                            PK74ALFH00100938472918
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Required Amount:</span>
                          <span className="font-black text-gray-800">Rs. {pkrPrice.toLocaleString()} PKR</span>
                        </div>
                        <div className="flex justify-between items-center border-t border-dashed border-gray-200 pt-1.5 mt-1.5">
                          <span className="text-[#FF6B00] font-bold">Transfer Memo / Ref:</span>
                          <span className="font-mono font-extrabold text-[#FF6B00] text-[10px] bg-[#FF6B00]/5 px-1.5 py-0.5 rounded border border-[#FF6B00]/20 select-all">
                            YRT-{packageDetails.id.toUpperCase()}-{pkrPrice}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase block">Your Bank Account Holder Title</label>
                        <input 
                          type="text" 
                          required
                          value={bankSenderName}
                          onChange={(e) => setBankSenderName(e.target.value)}
                          placeholder="e.g. Shaheer Khan"
                          className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] px-3 py-2 rounded-xl text-gray-800 font-sans text-xs transition-all"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase block">Transaction Reference / ID (Optional)</label>
                        <input 
                          type="text" 
                          value={bankTxId}
                          onChange={(e) => setBankTxId(e.target.value)}
                          placeholder="e.g. FT2614839210"
                          className="w-full bg-white border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#FF6B00] px-3 py-2 rounded-xl text-gray-800 font-mono text-xs transition-all"
                        />
                      </div>
                    </div>
                  )}

                </div>

                {/* Secure Seal & Pay Action Button */}
                <div className="pt-3 border-t border-gray-100 space-y-3.5">
                  <button
                    type="submit"
                    className="w-full bg-[#0d0d0d] hover:bg-[#FF6B00] text-white text-xs font-black uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer shadow-sm flex items-center justify-center gap-2 group border-0"
                  >
                    <Lock className="w-3.5 h-3.5 text-white/80 group-hover:scale-110 transition-transform" />
                    {method === "card" && `Pay ${packageDetails.price} securely`}
                    {method === "mobile" && !otpSent && "Send Push OTP Pin"}
                    {method === "mobile" && otpSent && "Verify & Refuel Balance"}
                    {method === "fintech" && !awaitingAppApproval && "Push App Invoice"}
                    {method === "fintech" && awaitingAppApproval && "Check Approval & Sync Credits"}
                    {method === "bank" && "Submit Wire Receipt Ledger"}
                  </button>

                  <div className="flex items-center justify-center gap-4 text-[9px] text-gray-400 select-none">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                      100% Secure Payments
                    </span>
                    <span className="w-1.5 h-1.5 bg-gray-200 rounded-full" />
                    <span>Instant Credit Sync Node</span>
                  </div>
                </div>

              </form>
            )}

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
