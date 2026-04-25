
"use client";
import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function WatchlistButton({ movieId, initialIsWatchlisted }: { movieId: string, initialIsWatchlisted: boolean }) {
  const [isWatchlisted, setIsWatchlisted] = useState(initialIsWatchlisted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const toggleWatchlist = async () => {
    setLoading(true);
    try {
      const method = isWatchlisted ? "DELETE" : "POST";
      const res = await fetch("/api/watchlist", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      if (res.ok) {
        setIsWatchlisted(!isWatchlisted);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={toggleWatchlist}
      disabled={loading}
      className={`flex items-center gap-3 font-bold px-8 py-4 rounded-xl transition-all shadow-lg ${
        isWatchlisted 
        ? "bg-emerald-600 text-white hover:bg-emerald-700" 
        : "bg-zinc-800 text-white hover:bg-zinc-700"
      }`}
    >
      {loading ? <Loader2 className="animate-spin" size={20} /> : (isWatchlisted ? <BookmarkCheck size={20} /> : <Bookmark size={20} />)}
      {isWatchlisted ? "In Watchlist" : "Add to Watchlist"}
    </button>
  );
}
