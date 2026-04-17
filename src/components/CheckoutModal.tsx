'use client';

import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { X, CheckCircle, Verified, Loader2, Mail, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';

interface CheckoutModalProps {
  amount: number;
  itemName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (websiteId: string) => void;
  configData: any;
  builderType: 'invitation' | 'countdown';
  themeId: string;
}

export default function CheckoutModal({ amount, itemName, isOpen, onClose, onSuccess, configData, builderType, themeId }: CheckoutModalProps) {
  const { user, signInWithGoogle, userData } = useAuth();
  const [voucher, setVoucher] = useState('');
  const [discount, setDiscount] = useState(0);
  const [step, setStep] = useState<'auth' | 'details' | 'payment' | 'verifying' | 'success'>(user ? 'details' : 'auth');
  
  // Auth states
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');

  React.useEffect(() => {
    if (isOpen && user && step === 'auth') {
      setStep('details');
    }
  }, [isOpen, user, step]);

  if (!isOpen) return null;

  const finalAmount = Math.max(0, amount - discount);
  // This will be replaced by the actual UPI ID provided by the user
  const upiId = process.env.NEXT_PUBLIC_UPI_ID || 'merchant@upi';
  const upiUrl = `upi://pay?pa=${upiId}&pn=Evently&am=${finalAmount}&cu=INR&tn=Payment for ${encodeURIComponent(itemName)}`;

  const applyVoucher = () => {
    // Hardcoded demo voucher logic
    if (voucher.toUpperCase() === 'WELCOME50') {
      setDiscount(50);
    } else if (voucher.toUpperCase() === 'FREE100') {
      setDiscount(finalAmount); // 100% off
    } else {
      alert('Invalid or expired voucher');
      setDiscount(0);
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      if (authMode === 'signup') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', cred.user.uid), {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: name || cred.user.email?.split('@')[0],
          role: 'user',
          createdAt: new Date().toISOString()
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      setStep('details');
    } catch (err: any) {
      setAuthError(err.message);
    }
  };

  const handleGoogleAuth = async () => {
    await signInWithGoogle();
    setStep('details');
  };

  const handleSimulatePayment = () => {
    setStep('verifying');
    setTimeout(async () => {
      try {
        const expiresInDays = 60;
        const generatedId = Math.random().toString(36).substring(2, 10);
        
        await addDoc(collection(db, 'websites'), {
          id: generatedId,
          userId: auth.currentUser?.uid,
          config: configData,
          type: builderType,
          themeId: themeId,
          title: itemName,
          amountPaid: finalAmount,
          createdAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
          editCount: 0
        });

        setStep('success');
        setTimeout(() => {
          onSuccess(generatedId);
        }, 2000);
      } catch (err) {
        console.error("Error saving website", err);
        setStep('details'); // Revert on failure
      }
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-[#13151f] border border-[#1a1d2e] rounded-2xl w-full max-w-md overflow-hidden relative shadow-[0_0_50px_rgba(77,184,255,0.1)]">
        
        {step !== 'success' && step !== 'verifying' && (
          <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-10">
            <X className="w-5 h-5" />
          </button>
        )}

        <div className="p-6 sm:p-8">
          {step === 'auth' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
               <div className="text-center">
                 <h2 className="text-2xl font-playfair text-white mb-2">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
                 <p className="text-sm text-gray-400">Please sign in to save your endpoints</p>
               </div>

               {authError && <p className="text-xs text-red-400 text-center">{authError}</p>}

               <form onSubmit={handleAuth} className="space-y-4">
                 {authMode === 'signup' && (
                   <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#4db8ff]" />
                 )}
                 <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" required className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#4db8ff]" />
                 <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required className="w-full bg-[#0a0b10] border border-[#1a1d2e] rounded-lg px-4 py-3 text-sm text-white outline-none focus:border-[#4db8ff]" />
                 
                 <button type="submit" className="w-full py-3 bg-[#4db8ff] text-black text-sm font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity">
                   {authMode === 'login' ? 'Sign In' : 'Create Account'}
                 </button>
               </form>

               <div className="relative flex justify-center text-xs">
                 <span className="bg-[#13151f] px-2 text-gray-500 z-10 relative">OR</span>
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#1a1d2e]"></div></div>
               </div>

               <button onClick={handleGoogleAuth} type="button" className="w-full flex items-center justify-center gap-2 py-3 bg-white text-black text-sm font-bold rounded-xl hover:bg-gray-100 transition-colors">
                 <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/></svg>
                 Continue with Google
               </button>

               <div className="text-center">
                 <button type="button" onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')} className="text-xs text-gray-400 hover:text-white transition-colors">
                   {authMode === 'login' ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                 </button>
               </div>
            </div>
          )}

          {step === 'details' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-playfair text-white mb-2">Complete Purchase</h2>
              <p className="text-sm text-gray-400 mb-6">You are purchasing: <strong className="text-white">{itemName}</strong></p>

              <div className="bg-[#0a0b10] border border-[#1a1d2e] rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white font-mono">₹{amount}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-400">
                    <span>Discount</span>
                    <span className="font-mono">-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-[#1a1d2e] pt-3 flex justify-between font-bold text-lg">
                  <span className="text-white">Total</span>
                  <span className="text-[#4db8ff] font-mono">₹{finalAmount}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 uppercase tracking-widest font-bold">Voucher Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={voucher}
                    onChange={(e) => setVoucher(e.target.value)}
                    placeholder="Enter code" 
                    className="flex-1 bg-[#0a0b10] border border-[#1a1d2e] rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#4db8ff]"
                  />
                  <button 
                    onClick={applyVoucher}
                    className="px-4 py-2 bg-[#1a1d2e] text-white text-sm font-medium rounded-lg hover:bg-[#1f2336] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <button 
                onClick={() => setStep('payment')}
                className="w-full py-4 mt-6 bg-gradient-to-r from-blue-600 to-[#4db8ff] text-white text-sm font-bold uppercase tracking-widest rounded-xl hover:-translate-y-0.5 transition-transform"
              >
                Proceed to Pay
              </button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6 text-center animate-in slide-in-from-right-4 duration-300">
               <h2 className="text-2xl font-playfair text-white">Scan to Pay</h2>
               <p className="text-sm text-gray-400">Use any UPI app (GPay, PhonePe, Paytm)</p>
               
               <div className="bg-white p-4 rounded-xl inline-block mx-auto shadow-xl">
                 <QRCodeCanvas value={upiUrl} size={200} />
               </div>
               
               <div className="text-3xl font-mono text-[#4db8ff] font-bold">
                 ₹{finalAmount}
               </div>

               <p className="text-xs text-gray-500 max-w-[250px] mx-auto">
                 Once you have completed the payment on your device, click the button below to verify.
               </p>

               <div className="flex gap-3 pt-4">
                  <button 
                    onClick={() => setStep('details')}
                    className="flex-1 py-3 bg-[#1a1d2e] text-white text-sm font-medium rounded-xl hover:bg-[#1f2336] transition-colors"
                  >
                    Back
                  </button>
                  <button 
                    onClick={handleSimulatePayment}
                    className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-400 text-black text-sm font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
                  >
                    I have Paid
                  </button>
               </div>
            </div>
          )}

          {step === 'verifying' && (
             <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-in fade-in duration-300">
               <Loader2 className="w-16 h-16 text-[#4db8ff] animate-spin" />
               <div className="text-center space-y-2">
                 <h3 className="text-xl font-bold text-white">Verifying Payment</h3>
                 <p className="text-sm text-gray-400">Please do not close this window...</p>
               </div>
             </div>
          )}

          {step === 'success' && (
             <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-in zoom-in-50 duration-500">
               <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                 <Verified className="w-10 h-10 text-green-400" />
               </div>
               <div className="text-center space-y-2">
                 <h3 className="text-2xl font-playfair text-white">Payment Successful</h3>
                 <p className="text-sm text-gray-400">Your website is being generated.</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
