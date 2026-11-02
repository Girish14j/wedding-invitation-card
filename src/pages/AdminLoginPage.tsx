import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (data.user) {
        navigate('/admin');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-royalty-deepMaroon p-4">
      <div className="max-w-md w-full p-8 rounded-2xl bg-royalty-burgundy/60 border border-royalty-gold/40 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-royalty-maroon border border-royalty-gold mb-3">
            <Lock className="w-8 h-8 text-royalty-gold" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-royalty-champagne">Royal Wedding CMS</h1>
          <p className="text-xs text-royalty-warmBeige/60 uppercase tracking-widest mt-1">
            Khushal &amp; Bhanupriya Admin Suite
          </p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 rounded-xl bg-red-900/50 border border-red-500 text-red-200 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-1 font-sans">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-royalty-gold/50 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@wedding.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-royalty-deepMaroon border border-royalty-gold/30 text-royalty-warmBeige focus:outline-none focus:border-royalty-gold text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-royalty-gold mb-1 font-sans">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-royalty-gold/50 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-royalty-deepMaroon border border-royalty-gold/30 text-royalty-warmBeige focus:outline-none focus:border-royalty-gold text-sm"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-serif text-xs uppercase tracking-widest font-bold bg-gradient-to-r from-royalty-champagne via-royalty-gold to-yellow-600 text-royalty-deepMaroon shadow-lg hover:shadow-royalty-gold/40 transition-all disabled:opacity-50 mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In to Console'}
          </button>
        </form>
      </div>
    </div>
  );
};
