import React, { useState } from 'react';
import { Wine, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Small delay for UX
    await new Promise(resolve => setTimeout(resolve, 300));

    const success = login(password);
    
    if (!success) {
      setError('Incorrect password');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-canvas-warm flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-charcoal rounded-2xl shadow-lg mb-4">
            <Wine className="text-vermillion w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-charcoal">PourDecisions</h1>
          <p className="text-stone-500 mt-1">Drink. Rate. Repeat.</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 border border-stone-200">
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-5 w-5" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-stone-200 rounded-lg focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20 transition-all"
                autoFocus
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-vermillion/10 border border-vermillion/20 rounded-lg flex items-center gap-2 text-vermillion text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-vermillion text-white py-3 rounded-lg font-semibold hover:bg-vermillion/90 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-stone-400 text-xs mt-6">
          Personal wine journal • Private access
        </p>
      </div>
    </div>
  );
}
