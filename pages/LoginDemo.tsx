import React, { useState } from 'react';
import { APPS, MOCK_USERS } from '../services/mockData';
import { Lock, Smartphone, ArrowRight, Fingerprint, Loader2 } from 'lucide-react';

export const LoginDemo: React.FC = () => {
  const [selectedApp, setSelectedApp] = useState(APPS[0]);
  const [method, setMethod] = useState<'credentials' | 'otp'>('credentials');
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call to Kratos
    setTimeout(() => {
        setIsLoading(false);
        if (method === 'credentials') {
            // Password verification simulated
            startRedirect();
        } else {
            // OTP step
            setStep(2); 
        }
    }, 1000);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        startRedirect();
    }, 1000);
  };

  const startRedirect = () => {
      setRedirecting(true);
      // Simulate OAuthkeeper/Kratos redirect
      setTimeout(() => {
          setRedirecting(false);
          setStep(1);
          setIdentifier('');
          alert(`Login Successful!\n\nOathkeeper is redirecting you to:\n${selectedApp.redirectUrl}`);
      }, 1500);
  }

  const handleFillTestUser = (email: string) => {
      setIdentifier(email);
      setMethod('credentials');
  }

  return (
    <div className="h-full flex items-center justify-center p-4 md:p-8 bg-slate-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className={`absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-gradient-to-br from-${selectedApp.themeColor}-900 to-slate-900`} />
      
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 z-10">
        
        {/* Configuration Panel */}
        <div className="space-y-6 order-2 md:order-1">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-4">Application Context</h3>
            <p className="text-sm text-slate-400 mb-6">
              Simulate the Single Sign-On (SSO) flow. Select an app to see how the login page adapts and where it redirects.
            </p>
            
            <div className="space-y-3">
              {APPS.map(app => (
                <button
                  key={app.id}
                  onClick={() => { setSelectedApp(app); setStep(1); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                    selectedApp.id === app.id
                      ? `bg-${app.themeColor}-500/20 border-${app.themeColor}-500 text-white`
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="text-left">
                    <span className="font-medium block">{app.name}</span>
                    <span className="text-xs opacity-60">{app.domain}</span>
                  </div>
                  <div className={`w-3 h-3 rounded-full bg-${app.themeColor}-500`} />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 p-6 rounded-2xl">
             <h3 className="text-lg font-bold text-white mb-2">Test Credentials</h3>
             <div className="text-sm text-slate-400 mb-4">Click to autofill:</div>
             <div className="space-y-2">
                {MOCK_USERS.slice(0, 2).map(u => (
                  <button 
                    key={u.id} 
                    onClick={() => handleFillTestUser(u.traits.email)}
                    className="w-full text-left text-xs bg-slate-900 hover:bg-slate-800 p-3 rounded border border-slate-800 hover:border-slate-600 transition-colors flex justify-between group"
                  >
                     <div>
                        <div className="text-slate-200 font-medium">{u.traits.email}</div>
                        <div className="text-slate-500">Pass: password123</div>
                     </div>
                     <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 text-indigo-400" />
                  </button>
                ))}
             </div>
          </div>
        </div>

        {/* Login UI Preview */}
        <div className="flex items-center justify-center order-1 md:order-2">
          {redirecting ? (
             <div className="text-center animate-pulse">
                <div className={`w-16 h-16 mx-auto bg-${selectedApp.themeColor}-500 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-${selectedApp.themeColor}-900/50`}>
                    <Lock className="text-white" size={32} />
                </div>
                <h2 className="text-2xl font-bold text-white">Redirecting...</h2>
                <p className="text-slate-400 mt-2">Validating session with Oathkeeper</p>
                <p className="text-xs text-slate-500 mt-1 font-mono">{selectedApp.redirectUrl}</p>
             </div>
          ) : (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden relative border-4 border-slate-800">
                <div className={`h-2 w-full bg-${selectedApp.themeColor}-600`} />
                
                <div className="p-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-slate-900">Welcome to {selectedApp.name}</h2>
                    <p className="text-slate-500 text-sm mt-1">{selectedApp.description}</p>
                </div>

                {step === 1 ? (
                    <>
                    {/* Tabs */}
                    <div className="flex p-1 bg-slate-100 rounded-lg mb-6">
                        <button
                        onClick={() => setMethod('credentials')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                            method === 'credentials' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                        >
                        Password
                        </button>
                        <button
                        onClick={() => setMethod('otp')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                            method === 'otp' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                        }`}
                        >
                        Phone OTP
                        </button>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        {method === 'credentials' ? (
                        <>
                            <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Email or Username</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                                placeholder="name@example.com"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                            </div>
                            <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Password</label>
                            <input type="password" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" placeholder="••••••••" defaultValue={identifier ? "password123" : ""} />
                            </div>
                        </>
                        ) : (
                        <div>
                            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">Phone Number</label>
                            <div className="flex">
                            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 bg-slate-50 text-slate-500 text-sm">
                                +1
                            </span>
                            <input 
                                type="tel" 
                                className="w-full px-4 py-2 border border-slate-300 rounded-r-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                                placeholder="555-0123" 
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                            />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">We will send a 6-digit code to your phone.</p>
                        </div>
                        )}

                        <button 
                            disabled={isLoading}
                            className={`w-full py-3 mt-4 bg-${selectedApp.themeColor}-600 hover:bg-${selectedApp.themeColor}-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-70`}
                        >
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : (method === 'credentials' ? <Lock size={18} /> : <Smartphone size={18} />)}
                        <span>{method === 'credentials' ? 'Sign In' : 'Send Code'}</span>
                        </button>
                    </form>
                    </>
                ) : (
                    <form onSubmit={handleVerifyOTP} className="space-y-6">
                    <div className="text-center">
                        <div className={`w-12 h-12 bg-${selectedApp.themeColor}-100 rounded-full flex items-center justify-center mx-auto mb-4`}>
                        <Fingerprint className={`text-${selectedApp.themeColor}-600`} size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Verify it's you</h3>
                        <p className="text-sm text-slate-500">
                        Enter the code sent to <span className="font-semibold text-slate-900">{identifier}</span>
                        </p>
                    </div>

                    <div className="flex justify-center space-x-2">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                        <input 
                            key={i} 
                            type="text" 
                            maxLength={1} 
                            className="w-10 h-12 text-center text-xl font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-900" 
                        />
                        ))}
                    </div>

                    <button disabled={isLoading} className={`w-full py-3 bg-${selectedApp.themeColor}-600 hover:bg-${selectedApp.themeColor}-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center space-x-2`}>
                        {isLoading ? <Loader2 className="animate-spin" size={18} /> : (
                            <>
                                <span>Verify & Continue</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                    
                    <button onClick={() => setStep(1)} type="button" className="w-full text-sm text-slate-500 hover:text-slate-800">
                        Back to login methods
                    </button>
                    </form>
                )}
                
                <div className="mt-8 text-center">
                    <p className="text-xs text-slate-400">Powered by Ory Kratos</p>
                </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};