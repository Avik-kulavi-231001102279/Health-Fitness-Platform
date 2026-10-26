import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/services';
import AnimatedLogo from '../../components/common/AnimatedLogo';
import { Mail, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authService.forgotPassword(email);
      toast.success(data.message || 'Reset token generated!');
      if (data.resetToken) {
        setResetToken(data.resetToken);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to process request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-dark-950 text-gray-900 dark:text-gray-100">
      <div className="card p-8 w-full max-w-md shadow-2xl border border-gray-100 dark:border-dark-800 animate-fade-in">
        <div className="text-center mb-8">
          <div className="mb-4">
            <AnimatedLogo size="lg" to="/" />
          </div>
          <h2 className="text-2xl font-bold">Forgot Password</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Enter your account email to receive a password reset token
          </p>
        </div>

        {!resetToken ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-primary-50 dark:bg-primary-950/40 border border-primary-200 dark:border-primary-800 rounded-xl">
              <KeyRound className="mx-auto text-primary-500 mb-2" size={32} />
              <p className="text-xs font-semibold uppercase text-primary-700 dark:text-primary-300 mb-1">Your Reset Token (Demo Mode)</p>
              <p className="text-xs font-mono break-all p-2 bg-white dark:bg-dark-900 rounded border border-gray-200 dark:border-dark-800 select-all">
                {resetToken}
              </p>
            </div>
            <button
              onClick={() => navigate(`/reset-password?token=${resetToken}`)}
              className="w-full btn-primary py-3 font-bold"
            >
              Proceed to Reset Password →
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-dark-800 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:hover:text-gray-100">
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
