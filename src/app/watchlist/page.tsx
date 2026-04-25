
"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, SearchX, ArrowRight, Play } from "lucide-react";

export default function WatchlistPage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/watchlist").then(res => res.json()).then(data => {
      setMovies(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="min-h-screen pt-40 text-center font-black text-2xl animate-pulse">Loading Your Collection...</div>;

  return (
    <div className="min-h-screen pt-40 px-10 pb-20 bg-black">
      <div className="flex items-end justify-between mb-16 max-w-7xl mx-auto">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-red-500 font-black tracking-widest uppercase text-sm">
            <Bookmark size={18} /> My Personal Library
          </div>
          <h1 className="text-6xl font-black tracking-tighter">WATCHLIST</h1>
          <p className="text-gray-500 font-medium italic">You have {movies.length} titles saved for later.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {movies.length === 0 ? (
          <div className="bg-zinc-900/40 border-2 border-dashed border-zinc-800 rounded-[3rem] py-32 text-center space-y-6">
            <SearchX size={64} className="mx-auto text-zinc-700" />
            <div className="space-y-2">
              <p className="text-gray-500 text-xl font-bold">Your watchlist is empty.</p>
              <p className="text-gray-600 text-sm max-w-md mx-auto">Start exploring and save your favorite movies and series here.</p>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 bg-white text-black px-10 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-gray-200 transition">
              Explore Content <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {movies.map((movie: any) => (
              <Link href={`/movie/${movie.slug}`} key={movie.id} className="group relative">
                <div className="aspect-[2/3] overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-900 transition-all duration-500 group-hover:rounded-xl group-hover:scale-95 group-hover:rotate-1 shadow-2xl">
                  <img src={movie.posterUrl} alt={movie.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                  
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-8">
                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500 space-y-3">
                      <div className="flex gap-2">
                        <span className="bg-red-600 text-[10px] font-black px-2 py-1 rounded text-white uppercase tracking-widest">{movie.category}</span>
                      </div>
                      <h3 className="text-xl font-black text-white leading-tight">{movie.title}</h3>
                      <p className="text-xs font-bold text-gray-400">{movie.genre} • {movie.releaseYear}</p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
