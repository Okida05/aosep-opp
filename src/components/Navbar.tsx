"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { loadProfile } from "@/lib/matching";
import { OPPORTUNITIES, Opportunity } from "@/data/opportunities";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLanguage } from "@/lib/LanguageContext";

export default function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const isOnboarding = pathname === "/onboarding";
  const [hasProfile, setHasProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isOverDark, setIsOverDark] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setHasProfile(!!loadProfile());
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (!navRef.current) return;
      const navRect = navRef.current.getBoundingClientRect();
      const navBottom = navRect.bottom;
      
      // Check if over dark sections (stats strip or CTA)
      const darkSections = document.querySelectorAll('[data-dark-section]');
      let overDark = false;
      
      darkSections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (navBottom > rect.top && navBottom < rect.bottom) {
          overDark = true;
        }
      });
      
      setIsOverDark(overDark);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setIsUserDropdownOpen(false);
      }
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node) && !isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      router.push("/home");
      return;
    }

    // Filter opportunities based on search query
    const filteredOpportunities = OPPORTUNITIES.filter((opportunity: Opportunity) => {
      const query = searchQuery.toLowerCase();
      return (
        opportunity.title.toLowerCase().includes(query) ||
        opportunity.country.toLowerCase().includes(query) ||
        opportunity.field.toLowerCase().includes(query) ||
        opportunity.tags.some(tag => tag.toLowerCase().includes(query)) ||
        opportunity.description.toLowerCase().includes(query)
      );
    });

    // Navigate to home page with search results
    const searchParams = new URLSearchParams();
    searchParams.set('search', searchQuery);
    searchParams.set('results', JSON.stringify(filteredOpportunities.map(op => op.id)));
    
    router.push(`/home?${searchParams.toString()}`);
    setIsSearchOpen(false);
  };

  const navLinks = hasProfile ? [
    { href: "/home", label: t.nav.opportunities },
    { href: "/saved", label: t.nav.saved },
    { href: "/dashboard", label: t.nav.dashboard },
    // { href: "/profile", label: "Profile" },
  ] : [];

  return (
    <>
      <nav ref={navRef} className="sticky top-0 z-50 bg-cream/92 backdrop-blur-md border-b border-gray-200 px-4 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-4">
          <div className="relative">
            <img 
              src={isOverDark ? "/aosep-light.png" : "/aosep.png"}
              alt="AOSEP Logo"
              className="h-10 w-auto transition-opacity duration-200"
            />
          </div>
          <div className="flex items-center">
          </div>
        </Link>

        {/* Search Bar - Desktop */}
        <div className={`flex-1 max-w-md mx-8 ${isOnboarding ? "hidden" : "hidden md:flex"}`}>
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              placeholder={t.nav.searchPlaceholder}
              className="w-full px-4 py-2 pl-10 pr-4 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent transition-all duration-200"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </form>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} active={pathname === link.href} isOverDark={isOverDark}>
              {link.label}
            </NavLink>
          ))}
          <div className="ml-2">
            <LanguageSwitcher />
          </div>
        </div>
          
        
          {/* User Dropdown
          {hasProfile ? (
            <div ref={userDropdownRef} className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-navy rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">U</span>
                </div>
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-medium border border-gray-200 py-2">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    My Profile
                  </Link>
                  <Link href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Settings
                  </Link>
                  <hr className="my-2 border-gray-200" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/onboarding" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          )}
        </div> */}

        {/* Mobile Menu Button */}
        {!isOnboarding && (
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-navy transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
      </nav>

      {/* Mobile Menu */}
      {!isOnboarding && isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-40 bg-white border-t border-gray-200">
          <div className="p-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.nav.searchPlaceholder}
                className="w-full px-4 py-2 pl-10 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-navy focus:border-transparent"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>

            {/* Mobile Navigation Links */}
            <nav className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    pathname === link.href
                      ? "bg-navy text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Language Switcher - Mobile */}
              <div className="px-4 py-3 border-t border-gray-100 mt-2">
                <span className="text-xs text-gray-500 uppercase tracking-wider">Language / اللغة</span>
                <div className="mt-2">
                  <LanguageSwitcher />
                </div>
              </div>
              
              {!hasProfile && (
                <Link
                  href="/onboarding"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block btn btn-primary w-full text-center"
                >
                  Get Started
                </Link>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, active, isOverDark, children }: { href: string; active: boolean; isOverDark?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
        active
          ? "bg-navy text-white"
          : isOverDark
          ? "text-white/70 hover:bg-white/10 hover:text-white"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {children}
    </Link>
  );
}
