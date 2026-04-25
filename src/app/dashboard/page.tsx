
"use client";
export const dynamic = "force-dynamic";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Bookmark, LogOut, Star, Clock, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import RatingControl from "@/components/RatingControl";

function DashboardContent() {
  const { data: session, status } = useSession();
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (status === "authenticated") {
      fetch("/api/watchlist")
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setWatchlist(data);
          } else {
            setWatchlist([]);
          }
          setLoading(false);
        })
        .catch(() => {
          setWatchlist([]);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === "loading" || loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-black text-2xl animate-pulse italic uppercase tracking-tighter">Synchronizing Hub...</div>;
  }

  return (
    <div className="min-h-screen bg-black pt-32 pb-20 px-6 lg:px-12 text-white">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center gap-8 bg-zinc-900/30 p-10 rounded-[3rem] border border-white/5 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          
          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-900 rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl relative z-10 uppercase rotate-3">
             {session?.user?.name?.[0] || session?.user?.email?.[0]}
          </div>

          <div className="space-y-1 text-center md:text-left relative z-10">
            <h1 className="text-5xl font-black tracking-tighter uppercase italic">{session?.user?.name || "Viewer"}</h1>
            <p className="text-zinc-500 font-bold tracking-tight">{session?.user?.email}</p>
            <div className="flex gap-4 pt-2">
              <span className="bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">Member since 2026</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:ml-auto w-full md:w-auto relative z-10">
            <button onClick={() => signOut()} className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-red-600 transition-all px-8 py-3 rounded-2xl font-bold text-sm">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6 group hover:bg-zinc-900 transition-all cursor-default">
            <div className="bg-red-600/20 p-4 rounded-2xl text-red-500 group-hover:scale-110 transition-transform">
              <Bookmark size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Saved Titles</p>
              <p className="text-4xl font-black italic">{watchlist.length}</p>
            </div>
          </div>
          <div className="bg-zinc-900/50 p-8 rounded-[2.5rem] border border-white/5 flex items-center gap-6 group hover:bg-zinc-900 transition-all cursor-default">
            <div className="bg-emerald-600/20 p-4 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform">
              <Star size={28} />
            </div>
            <div>
              <p className="text-gray-500 text-xs font-black uppercase tracking-[0.2em]">Active Ratings</p>
              <p className="text-4xl font-black italic">User Powered</p>
            </div>
          </div>
        </div>

        {/* Watchlist Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">My Collection</h2>
            <Link href="/" className="text-red-500 font-black flex items-center gap-2 hover:underline text-sm uppercase tracking-widest">
              Add More Content <ArrowRight size={18} />
            </Link>
          </div>

          {watchlist.length === 0 ? (
            <div className="bg-zinc-900/20 border-2 border-dashed border-zinc-800 rounded-[3rem] py-20 text-center space-y-4">
              <p className="text-gray-500 text-lg font-bold italic">Your collection is empty.</p>
              <Link href="/" className="inline-block bg-white text-black px-8 py-3 rounded-xl font-black uppercase tracking-tighter">Explore Now</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {watchlist.map((movie: any) => (
                <div key={movie.id} className="flex flex-col md:flex-row items-center gap-8 bg-zinc-900/40 p-6 rounded-[2rem] border border-white/5 hover:bg-zinc-900/60 transition-all group">
                  <Link href={`/movie/${movie.slug}`} className="flex-shrink-0 w-full md:w-32 aspect-[2/3] overflow-hidden rounded-2xl border border-white/5 shadow-2xl">
                    <img src={movie.posterUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </Link>
                  
                  <div className="flex-grow space-y-4 text-center md:text-left w-full">
                    <div>
                      <h3 className="text-2xl font-black tracking-tight">{movie.title}</h3>
                      <p className="text-red-500 text-xs font-black uppercase tracking-widest">{movie.category} • {movie.releaseYear}</p>
                    </div>
                    
                    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 inline-block w-full md:w-auto">
                      <RatingControl movieId={movie.id} />
                    </div>
                  </div>

                  <Link href={`/movie/${movie.slug}`} className="bg-white text-black p-4 rounded-2xl hover:scale-110 transition-all shadow-xl shadow-white/5">
                    <ArrowRight size={24} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-bold animate-pulse uppercase tracking-widest italic">Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
