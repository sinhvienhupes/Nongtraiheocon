import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Phone, ArrowRight, Sun, Cloud, Sparkles, Sprout, IdCard, Loader2, CheckCircle2 } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged, 
  updateProfile
} from "firebase/auth";

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyAQa6awFxFTOrRXPnda8rS6vlKLKPDMJT0",
  authDomain: "nongtraiheocon.firebaseapp.com",
  projectId: "nongtraiheocon",
  storageBucket: "nongtraiheocon.firebasestorage.app",
  messagingSenderId: "964519162656",
  appId: "1:964519162656:web:27247ed6287dfc74ef5d45",
  measurementId: "G-RT8HPTJERF"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// ===================================================

// --- Các Component Hình Ảnh (SVG) ---
const PigMascot = ({ isHappy, className = "w-24 h-24" }) => (
  <svg viewBox="0 0 100 100" className={`${className} drop-shadow-sm transition-transform duration-300 hover:scale-110`}>
    <path d="M 20 40 L 10 10 L 40 25 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
    <path d="M 80 40 L 90 10 L 60 25 Z" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
    <circle cx="50" cy="50" r="40" fill="#fbcfe8" stroke="#f472b6" strokeWidth="2" />
    <circle cx="35" cy="40" r="4" fill="#475569" className={`transition-all duration-300 ${isHappy ? 'translate-y-1' : ''}`} />
    <circle cx="65" cy="40" r="4" fill="#475569" className={`transition-all duration-300 ${isHappy ? 'translate-y-1' : ''}`} />
    <circle cx="25" cy="50" r="6" fill="#fce7f3" opacity="0.8" />
    <circle cx="75" cy="50" r="6" fill="#fce7f3" opacity="0.8" />
    <ellipse cx="50" cy="55" rx="16" ry="12" fill="#f472b6" stroke="#db2777" strokeWidth="1.5" />
    <circle cx="44" cy="55" r="3" fill="#be185d" />
    <circle cx="56" cy="55" r="3" fill="#be185d" />
    {isHappy ? (
      <path d="M 35 70 Q 50 85 65 70" fill="none" stroke="#db2777" strokeWidth="3" strokeLinecap="round" />
    ) : (
      <path d="M 45 75 Q 50 78 55 75" fill="none" stroke="#db2777" strokeWidth="2" strokeLinecap="round" />
    )}
  </svg>
);

const BarnSVG = () => (
  <svg viewBox="0 0 200 150" className="w-full h-full drop-shadow-xl">
    <rect x="30" y="60" width="140" height="90" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" />
    <polygon points="100,10 10,60 190,60" fill="#dc2626" stroke="#991b1b" strokeWidth="2" />
    <polygon points="100,20 30,60 170,60" fill="#f87171" opacity="0.3" />
    <rect x="75" y="90" width="50" height="60" fill="#78350f" rx="5" />
    <path d="M 75 90 L 125 150 M 125 90 L 75 150" stroke="#d97706" strokeWidth="3" />
    <circle cx="100" cy="45" r="12" fill="#292524" stroke="#fde047" strokeWidth="2" />
    <line x1="100" y1="33" x2="100" y2="57" stroke="#fde047" strokeWidth="2" />
    <line x1="88" y1="45" x2="112" y2="45" stroke="#fde047" strokeWidth="2" />
    <rect x="0" y="120" width="30" height="5" fill="#d97706" />
    <rect x="0" y="135" width="30" height="5" fill="#d97706" />
    <rect x="10" y="115" width="5" height="35" fill="#b45309" />
    <rect x="170" y="120" width="30" height="5" fill="#d97706" />
    <rect x="170" y="135" width="30" height="5" fill="#d97706" />
    <rect x="185" y="115" width="5" height="35" fill="#b45309" />
  </svg>
);

// Icon Mạng Xã Hội
const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// --- Main App Component ---
export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const scrollContainerRef = useRef(null);

  const [formData, setFormData] = useState({
    username: '',
    phone: '',
    fullName: '',
    password: '',
    confirmPassword: ''
  });

  const removeAccentsAndUppercase = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'fullName') {
      setFormData({ ...formData, [name]: removeAccentsAndUppercase(value) });
    } else if (name === 'username') {
      setFormData({ ...formData, [name]: removeAccentsAndUppercase(value).toLowerCase().replace(/\s/g, '') });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrorMsg(""); 
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser && !errorMsg) {
        setIsSuccess(true);
        setTimeout(() => {
          window.location.href = 'trangchu.html';
        }, 1500);
      }
    });
    return () => unsubscribe();
  }, [errorMsg]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [isLogin]);

  const translateError = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use': return "Tên đăng nhập này đã tồn tại!";
      case 'auth/invalid-credential': return "Tên đăng nhập hoặc mật khẩu không chính xác!";
      case 'auth/weak-password': return "Mật khẩu yếu (cần ít nhất 6 ký tự).";
      case 'auth/network-request-failed': return "Mất kết nối mạng. Vui lòng thử lại!";
      default: return "Lỗi hệ thống, vui lòng thử lại! (" + errorCode + ")";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const pseudoEmail = `${formData.username}@nongtraiheocon.game`;

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, pseudoEmail, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Mật khẩu xác nhận không khớp!");
        }
        if (formData.phone.length < 9) {
          throw new Error("Số điện thoại không hợp lệ!");
        }
        const userCredential = await createUserWithEmailAndPassword(auth, pseudoEmail, formData.password);
        await updateProfile(userCredential.user, {
          displayName: formData.fullName
        });
      }
    } catch (error) {
      if (error.code) {
        setErrorMsg(translateError(error.code));
      } else {
        setErrorMsg(error.message);
      }
      setLoading(false);
    }
  };

  return (
    // THAY ĐỔI 1: fixed inset-0 KHÓA CHẶT TRÌNH DUYỆT, chống bung layout khi bàn phím xuất hiện
    <div className="fixed inset-0 w-full flex flex-col lg:flex-row font-sans bg-stone-50 overflow-hidden">
      
      {/* ================= PHẦN TRÁI / TRÊN (PHONG CẢNH - CỐ ĐỊNH) ================= */}
      {/* THAY ĐỔI 2: Dùng kích thước pixel cố định (h-[180px]) & shrink-0 cho mobile để nó vĩnh viễn không bị ép dẹp */}
      <div className="w-full lg:w-[50%] xl:w-[55%] h-[180px] sm:h-[220px] lg:h-full relative bg-sky-300 flex flex-col overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] lg:shadow-[10px_0_30px_rgba(0,0,0,0.1)] z-10 shrink-0">
        
        <div className="absolute top-4 left-4 sm:top-8 sm:left-8 text-yellow-300 animate-[spin_60s_linear_infinite] scale-50 sm:scale-75 lg:scale-100 lg:top-12 lg:left-12 origin-top-left">
          <Sun size={120} fill="currentColor" />
        </div>
        <div className="absolute top-8 left-1/3 sm:top-16 text-white/70 animate-[bounce_4s_infinite] scale-50 sm:scale-75 lg:scale-100 lg:top-24 origin-top">
          <Cloud size={80} fill="currentColor" />
        </div>
        <div className="absolute top-4 right-4 sm:top-10 sm:right-10 text-white/50 animate-[bounce_5s_infinite_reverse] scale-50 sm:scale-75 lg:scale-100 lg:top-16 lg:right-20 origin-top-right">
          <Cloud size={140} fill="currentColor" />
        </div>

        <div className="relative z-20 mt-5 sm:mt-10 lg:mt-32 px-4 lg:px-16 text-center">
          <div className="hidden sm:inline-flex items-center justify-center space-x-1.5 bg-white/30 backdrop-blur-md px-4 sm:px-6 py-1.5 sm:py-2 rounded-full mb-2 sm:mb-4 lg:mb-6 border border-white/50 text-sky-900 font-bold tracking-wide shadow-sm text-[10px] sm:text-xs lg:text-sm">
            <Sparkles size={14} className="text-yellow-400" />
            <span>Server: Thảo Nguyên Xanh</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white drop-shadow-lg mb-1 sm:mb-2 lg:mb-4 leading-tight tracking-tight">
            Nông Trại <br className="hidden lg:block"/>
            <span className="text-pink-300">Heo Con</span>
          </h1>
          <p className="hidden lg:block text-xl text-sky-900 font-semibold drop-shadow-sm max-w-md mx-auto">
            Gieo hạt giống yêu thương, thu hoạch niềm vui mỗi ngày!
          </p>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[60%] sm:h-[50%] lg:h-[45%] z-10">
          <div className="absolute bottom-0 left-[-10%] w-[120%] h-[80%] bg-green-500 rounded-t-[100%]"></div>
          <div className="absolute bottom-[-10%] left-[-20%] w-[140%] h-[60%] bg-green-400 rounded-t-[100%] shadow-[0_-10px_20px_rgba(0,0,0,0.1)]"></div>
          
          <div className="absolute bottom-[5%] sm:bottom-[10%] lg:bottom-[20%] left-[5%] sm:left-[10%] lg:left-[20%] w-24 h-16 sm:w-32 sm:h-24 lg:w-64 lg:h-48 z-20">
            <BarnSVG />
          </div>
          
          <div className="absolute bottom-0 sm:bottom-[5%] lg:bottom-[10%] right-[10%] sm:right-[15%] lg:right-[25%] z-30 animate-bounce origin-bottom">
            <PigMascot isHappy={true} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-40 lg:h-40" />
          </div>
        </div>
      </div>

      {/* ================= PHẦN PHẢI / DƯỚI (AUTH FORM) ================= */}
      <div className="w-full lg:w-[50%] xl:w-[45%] flex-1 flex flex-col bg-white relative overflow-hidden">
        
        {/* === HEADER CỐ ĐỊNH === */}
        <div className="shrink-0 px-4 sm:px-8 lg:px-16 pt-4 sm:pt-6 pb-3 sm:pb-4 lg:pt-12 bg-white z-20 border-b border-stone-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-center lg:justify-start mb-3 sm:mb-4 lg:mb-6">
            <PigMascot isHappy={isHovering || formData.username.length > 0} className="w-8 h-8 sm:w-10 sm:h-10 mr-2 sm:mr-3 hidden lg:block" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-stone-800 tracking-tight">
              {isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}
            </h2>
          </div>

          <div className="flex bg-stone-100 p-1 sm:p-1.5 rounded-xl">
            <button
              onClick={() => { setIsLogin(true); setErrorMsg(""); }}
              className={`flex-1 py-2 sm:py-2.5 lg:py-3 text-[11px] sm:text-xs lg:text-sm font-bold rounded-lg transition-all duration-300 ${
                isLogin ? 'bg-white text-pink-600 shadow-sm scale-[1.02]' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              ĐĂNG NHẬP
            </button>
            <button
              onClick={() => { setIsLogin(false); setErrorMsg(""); }}
              className={`flex-1 py-2 sm:py-2.5 lg:py-3 text-[11px] sm:text-xs lg:text-sm font-bold rounded-lg transition-all duration-300 ${
                !isLogin ? 'bg-white text-pink-600 shadow-sm scale-[1.02]' : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              ĐĂNG KÝ
            </button>
          </div>
        </div>

        {/* === BODY CUỘN ĐƯỢC === */}
        <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-16 py-4 sm:py-6 bg-white relative scroll-smooth flex flex-col">
          
          {/* THAY ĐỔI 3: Thêm my-auto để CĂN GIỮA DỌC form, lấp đầy không gian */}
          <div className="w-full max-w-md mx-auto lg:mx-0 my-auto flex flex-col justify-center min-h-full">
            
            {isSuccess ? (
              <div className="text-center animate-in zoom-in duration-500 py-8 sm:py-12">
                <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-green-500 mx-auto mb-3 sm:mb-4 animate-bounce" />
                <h3 className="text-xl sm:text-2xl font-bold text-stone-800 mb-2">Thành Công!</h3>
                <p className="text-sm sm:text-base text-stone-500 font-medium flex items-center justify-center">
                  <Loader2 className="animate-spin w-4 h-4 mr-2 text-pink-500" />
                  Đang chuyển hướng...
                </p>
              </div>
            ) : (
              <>
                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  
                  {errorMsg && (
                    <div className="p-2.5 sm:p-3 bg-red-50 border-l-4 border-red-500 rounded text-red-700 text-xs sm:text-sm font-semibold animate-in slide-in-from-top-2">
                      {errorMsg}
                    </div>
                  )}

                  {/* 1. Tên Đăng Nhập */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-stone-600 mb-1 sm:mb-1.5">Tên đăng nhập <span className="text-red-500">*</span></label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-pink-500 transition-colors">
                        <User size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      {/* THAY ĐỔI 4: Ép chuẩn text-base (16px) cho thẻ input để chống việc iPhone tự động Zoom khi gõ phím */}
                      <input
                        type="text"
                        name="username"
                        placeholder="tendangnhap"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-base bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all text-stone-800 font-medium"
                        required
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <div className="space-y-3 sm:space-y-4 animate-in slide-in-from-top-4 fade-in duration-500">
                      
                      {/* 2. Số Điện Thoại */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-stone-600 mb-1 sm:mb-1.5">Số điện thoại <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-pink-500 transition-colors">
                            <Phone size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <input
                            type="tel"
                            name="phone"
                            placeholder="0912345678"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-base bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all text-stone-800 font-medium"
                            required={!isLogin}
                          />
                        </div>
                      </div>

                      {/* 3. Họ và Tên */}
                      <div>
                        <label className="block text-xs sm:text-sm font-semibold text-stone-600 mb-1 sm:mb-1.5">Họ và tên <span className="text-red-500">*</span></label>
                        <div className="relative group">
                          <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-pink-500 transition-colors">
                            <IdCard size={16} className="sm:w-[18px] sm:h-[18px]" />
                          </div>
                          <input
                            type="text"
                            name="fullName"
                            placeholder="NGUYEN VAN A"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-base bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all text-stone-800 font-bold"
                            required={!isLogin}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Mật Khẩu */}
                  <div>
                    <div className="flex justify-between items-center mb-1 sm:mb-1.5">
                      <label className="block text-xs sm:text-sm font-semibold text-stone-600">Mật khẩu <span className="text-red-500">*</span></label>
                    </div>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-pink-500 transition-colors">
                        <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
                      </div>
                      <input
                        type="password"
                        name="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-base bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all text-stone-800 font-medium tracking-widest"
                        required
                      />
                    </div>
                  </div>

                  {/* 5. Nhập Lại Mật Khẩu */}
                  {!isLogin && (
                    <div className="animate-in slide-in-from-top-2 fade-in duration-500">
                      <label className="block text-xs sm:text-sm font-semibold text-stone-600 mb-1 sm:mb-1.5">Nhập lại mật khẩu <span className="text-red-500">*</span></label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-3.5 sm:pl-4 flex items-center pointer-events-none text-stone-400 group-focus-within:text-pink-500 transition-colors">
                          <Lock size={16} className="sm:w-[18px] sm:h-[18px]" />
                        </div>
                        <input
                          type="password"
                          name="confirmPassword"
                          placeholder="••••••••"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full pl-10 sm:pl-11 pr-3 sm:pr-4 py-2.5 sm:py-3 text-base bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:border-pink-500 focus:bg-white focus:ring-4 focus:ring-pink-500/10 transition-all text-stone-800 font-medium tracking-widest"
                          required={!isLogin}
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className={`w-full mt-2 sm:mt-4 py-3 sm:py-3.5 px-4 rounded-lg font-bold text-white transition-all flex items-center justify-center group ${
                      loading 
                        ? 'bg-pink-400 cursor-not-allowed opacity-80' 
                        : 'bg-pink-600 hover:bg-pink-700 shadow-md hover:shadow-lg active:scale-[0.98]'
                    }`}
                  >
                    {loading ? (
                      <Loader2 className="animate-spin w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <>
                        <span className="text-sm sm:text-base tracking-wide">{isLogin ? 'Đăng Nhập' : 'Tạo Tài Khoản'}</span>
                        <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                {/* THAY ĐỔI 5: Thêm khu vực "Đăng nhập Mạng xã hội" cho Tab Đăng Nhập để cân bằng chiều cao và lấp khoảng trắng */}
                {isLogin && (
                  <div className="mt-6 sm:mt-8 animate-in fade-in duration-500 pb-4">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-stone-200"></div>
                      </div>
                      <div className="relative flex justify-center text-xs sm:text-sm">
                        <span className="px-3 bg-white text-stone-500 font-medium">Hoặc đăng nhập bằng</span>
                      </div>
                    </div>
                    <div className="mt-5 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                      <button type="button" className="flex items-center justify-center py-2.5 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-sm active:scale-95">
                        <FacebookIcon /> <span className="ml-2 text-sm font-bold text-stone-600">Facebook</span>
                      </button>
                      <button type="button" className="flex items-center justify-center py-2.5 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors shadow-sm active:scale-95">
                        <GoogleIcon /> <span className="ml-2 text-sm font-bold text-stone-600">Google</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
            
            {!isLogin && !isSuccess && (
              <p className="mt-4 sm:mt-6 text-center text-[11px] sm:text-sm text-stone-500 px-2 pb-4">
                Bằng việc đăng ký, bạn đồng ý với <a href="#" className="text-pink-600 hover:underline font-medium">Điều khoản</a> và <a href="#" className="text-pink-600 hover:underline font-medium">Bảo mật</a>.
              </p>
            )}

          </div>
        </div>
      </div>
      
    </div>
  );
}

