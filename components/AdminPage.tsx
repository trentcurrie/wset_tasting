import React, { useState, useEffect } from 'react';
import { X, Trash2, UserPlus, Mail, Loader2, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '../services/supabase';
import { useAuth } from '../context/AuthContext';

interface AllowedEmail {
  id: string;
  email: string;
  created_at: string;
}

interface Props {
  onClose?: () => void;
}

export const AdminPage: React.FC<Props> = ({ onClose }) => {
  const { user } = useAuth();
  const [emails, setEmails] = useState<AllowedEmail[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('allowed_emails')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmails(data || []);
    } catch (err) {
      console.error('Error fetching emails:', err);
      setError('Failed to load allowed emails. Make sure you have admin permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(newEmail.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsAdding(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('allowed_emails')
        .insert({
          email: newEmail.trim().toLowerCase(),
          added_by: user?.id
        });

      if (error) {
        if (error.code === '23505') {
          throw new Error('This email is already in the allowed list');
        }
        throw error;
      }

      setSuccess(`Successfully added ${newEmail.trim()}`);
      setNewEmail('');
      fetchEmails();
    } catch (err: any) {
      console.error('Error adding email:', err);
      setError(err.message || 'Failed to add email');
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteEmail = async (id: string, email: string) => {
    // Prevent deleting your own email
    if (email === user?.email) {
      setError("You can't remove your own email");
      return;
    }

    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('allowed_emails')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setSuccess(`Removed ${email} from allowed list`);
      fetchEmails();
    } catch (err) {
      console.error('Error deleting email:', err);
      setError('Failed to remove email');
    }
  };

  // Auto-clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  return (
    <div className="h-full flex flex-col bg-canvas-warm dark:bg-stone-900">
      {/* Header */}
      <header className="bg-charcoal text-white p-4 md:p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-serif flex items-center gap-2">
              <Shield size={24} className="text-vermillion" />
              Admin Panel
            </h1>
            <p className="text-stone-400 text-sm">Manage allowed users for PourDecisions</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-lg transition-colors">
              <X size={24} />
            </button>
          )}
        </div>
      </header>

      {/* Geometric accent bar */}
      <div className="h-1.5 flex flex-shrink-0">
        <div className="flex-1 bg-vermillion"></div>
        <div className="flex-1 bg-tangerine"></div>
        <div className="flex-1 bg-teal"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Add Email Form */}
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-charcoal dark:text-stone-100 mb-4 flex items-center gap-2">
              <UserPlus size={20} className="text-teal" />
              Invite a Friend
            </h2>
            <form onSubmit={handleAddEmail} className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
                <input
                  type="email"
                  placeholder="friend@example.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 dark:bg-stone-700 border border-stone-200 dark:border-stone-600 rounded-lg text-charcoal dark:text-stone-100 placeholder-stone-400 focus:ring-2 focus:ring-teal focus:border-teal transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={isAdding || !newEmail.trim()}
                className="px-6 py-3 bg-teal text-white rounded-lg font-medium hover:bg-teal/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isAdding ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <UserPlus size={18} />
                )}
                Add
              </button>
            </form>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-3">
              Adding an email allows that person to sign up with Google OAuth. They'll need to use the same email when signing in.
            </p>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <p className="text-green-700 dark:text-green-300 text-sm">{success}</p>
            </div>
          )}

          {/* Email List */}
          <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-700">
              <h2 className="text-lg font-semibold text-charcoal dark:text-stone-100 flex items-center gap-2">
                <Mail size={20} className="text-vine" />
                Allowed Emails
                <span className="ml-auto text-sm font-normal text-stone-500">
                  {emails.length} {emails.length === 1 ? 'user' : 'users'}
                </span>
              </h2>
            </div>

            {isLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 size={24} className="animate-spin text-stone-400" />
              </div>
            ) : emails.length === 0 ? (
              <div className="p-8 text-center text-stone-400">
                <Mail size={32} className="mx-auto mb-2 opacity-50" />
                <p>No allowed emails found</p>
              </div>
            ) : (
              <ul className="divide-y divide-stone-200 dark:divide-stone-700">
                {emails.map((item) => (
                  <li key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-700/50 transition-colors">
                    <div>
                      <p className="text-charcoal dark:text-stone-100 font-medium">
                        {item.email}
                        {item.email === user?.email && (
                          <span className="ml-2 text-xs bg-teal/20 text-teal px-2 py-0.5 rounded-full">
                            You
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-stone-500 dark:text-stone-400">
                        Added {new Date(item.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteEmail(item.id, item.email)}
                      disabled={item.email === user?.email}
                      className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      title={item.email === user?.email ? "Can't remove yourself" : 'Remove email'}
                    >
                      <Trash2 size={18} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
