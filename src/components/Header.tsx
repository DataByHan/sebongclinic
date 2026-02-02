'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', label: '메인' },
  { href: '/treatment', label: '진료안내' },
  { href: '/doctors', label: '의료진' },
  { href: '/location', label: '오시는길' },
  { href: '/notices', label: '공지사항' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-soft'
          : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          <Link href="/" className="flex items-center group">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform duration-300">
                <span className="text-white text-xl font-bold">세</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-primary-800 tracking-tight">
                  세봉한의원
                </h1>
                <p className="text-xs text-text-500 font-medium">
                  형상의학 전문
                </p>
              </div>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 rounded-lg text-text-600 hover:text-primary-700 font-medium transition-all duration-300 hover:bg-primary-50 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <Link
            href="tel:051-623-7227"
            className="hidden md:flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold shadow-medium hover:shadow-strong hover:-translate-y-0.5 transition-all duration-300"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span>051-623-7227</span>
          </Link>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl text-text-700 hover:text-primary-700 hover:bg-primary-50 transition-all duration-300"
            aria-label={isMenuOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                  className={isMenuOpen ? 'animate-rotate-in' : ''}
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="py-4 space-y-1 border-t border-accent-200/50">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-text-700 hover:text-primary-700 hover:bg-primary-50 font-medium transition-all duration-300 animate-slide-in"
                style={{ animationDelay: `${navItems.indexOf(item) * 50}ms` }}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <a
                href="tel:051-623-7227"
                className="flex items-center justify-center space-x-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold shadow-medium"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>전화 예약하기</span>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
