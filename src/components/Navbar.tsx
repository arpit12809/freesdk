
"use client";
import { useState, useEffect } from "react";
import Link from 'next/link';
import { Film, Lock, Sparkles, User, Search, Bookmark, LogOut, X, LayoutGrid, UserCircle } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";

import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCat = searchParams.get('cat');

  // Detect Admin using environment variable for deployment safety
  const isAdmin = session?.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL; 

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const categories = [
    { name: 'Hollywood', slug: 'HOLLYWOOD' },
    { name: 'Bollywood', slug: 'BOLLYWOOD' },
    { name: 'Asian Drama', slug: 'ASIAN_DRAMA' },
    { name: 'Anime', slug: 'ANIME' },
    { name: '18+', slug: 'ADULT' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="flex items-center justify-between px-6 lg:px-12 py-5 bg-black/40 backdrop-blur-3xl fixed w-full z-[100] border-b border-white/5 transition-all duration-500">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex items-center gap-2 text-red-600 font-black text-2xl tracking-tighter group">
          <Film size={28} className="group-hover:rotate-12 transition-transform duration-300" />
          <span className="hidden sm:inline">FREE SDK STREAM</span>
        </Link>
        
        {/* Categories - Improved layout with flex-wrap and tighter gap */}
        <div className="hidden xl:flex items-center gap-6">
          <Link href="/" className={`text-xs font-black uppercase tracking-widest transition flex items-center gap-2 ${!activeCat ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}>
            <LayoutGrid size={14} /> Home
          </Link>
          {categories.map((cat) => (
            <Link 
              key={cat.slug} 
              href={`/?cat=${cat.slug}`} 
              className={`text-[11px] font-black uppercase tracking-wider transition whitespace-nowrap px-1 py-1 rounded-lg ${activeCat === cat.slug ? 'text-white border-b-2 border-red-600' : 'text-gray-400 hover:text-white'}`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 flex-grow justify-end ml-4">
        {/* Search Bar - Professional Integrated UI */}
        <form onSubmit={handleSearch} className="relative max-w-md w-full group hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="text-zinc-500 group-focus-within:text-red-600 transition-colors" size={16} />
          </div>
          <input 
            type="text" 
            placeholder="Search by name, genre, category..."
            className="w-full bg-zinc-900/50 border border-white/10 rounded-2xl py-2.5 pl-11 pr-4 text-xs font-medium outline-none focus:bg-black focus:border-red-600 focus:ring-4 focus:ring-red-600/10 transition-all placeholder:text-zinc-600"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button type="button" onClick={() => {setSearchQuery(""); router.push("/");}} className="absolute inset-y-0 right-0 pr-4 flex items-center text-zinc-500 hover:text-white">
              <X size={14} />
            </button>
          )}
        </form>

        {/* Mobile Search Toggle */}
        <button className="md:hidden text-zinc-400 hover:text-white transition" onClick={() => setIsSearchOpen(!isSearchOpen)}>
          <Search size={22} />
        </button>

        <div className="flex items-center gap-3 border-l border-white/10 pl-6 ml-2">
          {session ? (
            <div className="flex items-center gap-3">
              <Link href="/dashboard" className="bg-zinc-900 text-zinc-400 p-2.5 rounded-xl hover:bg-zinc-800 hover:text-white transition relative group" title="My Profile Hub">
                <UserCircle size={18} />
              </Link>
              <Link href="/watchlist" className="bg-zinc-900 text-zinc-400 p-2.5 rounded-xl hover:bg-zinc-800 hover:text-white transition relative group" title="My Watchlist">
                <Bookmark size={18} />
                <span className="absolute top-2 right-2 bg-red-600 w-1.5 h-1.5 rounded-full border border-black hidden group-hover:block transition animate-pulse"></span>
              </Link>
              <button onClick={handleLogout} className="bg-zinc-900 text-zinc-400 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link href="/login" className="flex items-center gap-2 bg-white text-black px-5 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-wider hover:bg-zinc-200 transition shadow-xl shadow-white/5">
              <User size={16} /> Login
            </Link>
          )}
          
          {isAdmin && (
            <Link href="/admin" className="bg-red-600/10 text-red-500 p-2.5 rounded-xl hover:bg-red-600 hover:text-white transition border border-red-600/20" title="Admin Studio">
              <Lock size={18} />
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
