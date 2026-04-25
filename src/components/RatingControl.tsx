
"use client";
import { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";

export default function RatingControl({ movieId }: { movieId: string }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/ratings?movieId=${movieId}`)
      .then(res => res.json())
      .then(data => {
        setRating(data.score || 0);
        setLoading(false);
      });
  }, [movieId]);

  const handleRate = async (score: number) => {
    setRating(score);
    try {
      await fetch("/api/ratings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId, score }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="flex gap-1 animate-pulse"><Star size={16} className="text-zinc-800" /></div>;

  return (
    <div className="space-y-2">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Your Rating</p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
          <button
            key={star}
            onClick={() => handleRate(star)}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            className="transition-all duration-200"
          >
            <Star 
              size={18} 
              fill={(hover || rating) >= star ? "#e50914" : "none"} 
              className={(hover || rating) >= star ? "text-red-600 scale-110" : "text-zinc-700 hover:text-zinc-500"} 
            />
          </button>
        ))}
        {rating > 0 && <span className="ml-3 text-sm font-black text-white italic">{rating}/10</span>}
      </div>
    </div>
  );
}
