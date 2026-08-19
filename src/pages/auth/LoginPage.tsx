import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaPassed, setCaptchaPassed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!captchaPassed) {
      setErrorMsg('Silakan centang verifikasi keamanan CAPTCHA terlebih dahulu.');
      return;
    }

    try {
      setIsLoading(true);
      setErrorMsg('');
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setErrorMsg(err.message || 'Login gagal. Periksa kembali username/email dan password Anda.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left Visual Column (Pesantren Photo + Deep Blue Overlay) */}
      <div className="lg:col-span-7 relative hidden lg:flex flex-col justify-between p-12 bg-[#0B2F6B] text-white overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="/uploads/gallery/pesantren6.png"
            alt="Pesantren Cendekia Amanah"
            className="w-full h-full object-cover object-center opacity-30 mix-blend-luminosity scale-105 transition-transform duration-1000"
          />
          <div
            className="absolute inset-0 bg-gradient-to-tr from-[#0B2F6B] via-[#0B2F6B]/90 to-[#1F5FD0]/70"
            style={{ background: 'linear-gradient(135deg, rgba(11,47,107,0.95) 0%, rgba(31,95,208,0.7) 100%)' }}
          />
        </div>

        {/* Top Logo & Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-white p-1.5 flex items-center justify-center shadow-md">
            <img src="/uploads/logo/main-logo.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-wider uppercase text-white">Pesantren Cendekia Amanah</h2>
            <p className="text-[10px] font-bold text-[#F0BD28] uppercase tracking-widest">Lembaga Pendidikan Terpadu</p>
          </div>
        </div>

        {/* Center Quotation */}
        <div className="relative z-10 space-y-4 max-w-lg">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-[#8ED6A8] border border-white/10 backdrop-blur-xs uppercase tracking-wider">
            Enterprise CMS & Admin Console
          </span>
          <h1 className="text-3xl lg:text-4xl font-black leading-tight tracking-tight text-white">
            Mengelola Informasi, Membangun Kepercayaan, Menyampaikan Pendidikan.
          </h1>
          <p className="text-sm text-white/80 leading-relaxed">
            Platform kendali terpadu untuk publikasi konten berita, opini, pendaftaran santri baru (PPDB), kurikulum pendidikan, dan manajemen operasional website.
          </p>
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
          <span>Pengasuh: KH. Cholil Nafis, Lc., MA., Ph.D</span>
          <span>© 2026 Cendekia Amanah</span>
        </div>
      </div>

      {/* Right Login Card Column */}
      <div className="lg:col-span-5 flex items-center justify-center p-6 sm:p-10 bg-[#F4F7FB] lg:bg-white">
        <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl lg:rounded-none shadow-xl lg:shadow-none border border-[#DDE6F1] lg:border-none space-y-8">
          {/* Header */}
          <div className="space-y-2 text-center lg:text-left">
            <div className="lg:hidden w-12 h-12 rounded-2xl bg-white p-1.5 mx-auto flex items-center justify-center shadow-sm border border-[#DDE6F1] mb-4">
              <img src="/uploads/logo/main-logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h2 className="text-2xl font-black text-[#0B2F6B] tracking-tight">Selamat Datang</h2>
            <p className="text-xs sm:text-sm text-[#64748B]">
              Masuk ke Console CMS Pesantren Cendekia Amanah
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-[#FEECEC] border border-[#D8232A]/30 text-xs font-semibold text-[#D8232A] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D8232A]"></span>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-[#1A293B]">Username atau Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin atau admin@cendekiaamanah.sch.id"
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] focus:bg-white transition-all text-[#1A293B]"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1A293B]">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-xs font-semibold text-[#1F5FD0] hover:underline"
                >
                  Lupa Password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-[#F8FAFC] border border-[#DDE6F1] rounded-xl focus:outline-hidden focus:border-[#1F5FD0] focus:bg-white transition-all text-[#1A293B]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#1A293B]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Cloudflare Turnstile Simulation CAPTCHA */}
            <div className="p-3.5 rounded-xl border border-[#DDE6F1] bg-[#F8FAFC] flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={captchaPassed}
                  onChange={(e) => setCaptchaPassed(e.target.checked)}
                  className="w-4 h-4 rounded text-[#1F5FD0] focus:ring-[#1F5FD0] border-[#CBD5E1]"
                />
                <span className="text-xs font-semibold text-[#1A293B]">Saya bukan robot (Verifikasi Keamanan)</span>
              </label>
              <ShieldCheck className="w-5 h-5 text-[#1F5FD0]" />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full text-xs font-bold text-white bg-[#0B2F6B] hover:bg-[#1A4FA0] disabled:opacity-50 shadow-md transition-all flex items-center justify-center gap-2 transform active:scale-98"
            >
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk ke Console'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-xl border border-[#DDE6F1]">
            <h3 className="text-base font-bold text-[#0B2F6B]">Reset Password Administrator</h3>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Untuk keamanan enterprise, permintaan reset password administrator wajib diajukan melalui administrator sistem utama atau hubungi tim TI Pesantren Cendekia Amanah.
            </p>
            <button
              type="button"
              onClick={() => setShowForgotPassword(false)}
              className="w-full py-2.5 rounded-full text-xs font-bold bg-[#0B2F6B] text-white hover:bg-[#1A4FA0] transition-colors"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
