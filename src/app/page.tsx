
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Play, Star, TrendingUp, Clock, SearchX } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: { cat?: string, search?: string } }) {
  const category = searchParams.cat;
  const search = searchParams.search;

  const movies = await prisma.movie.findMany({ 
    where: {
      AND: [
        category ? { category } : {},
        search ? {
          OR: [
            { title: { contains: search } },
            { genre: { contains: search } },
            { description: { contains: search } }
          ]
        } : {}
      ]
    },
    orderBy: { createdAt: 'desc' } 
  });

  return (
    <div className="pb-32 bg-black">
      {/* Hero Section - Hide if searching to focus on results */}
      {!search && (
        <div className="relative min-h-[95vh] w-full flex items-center px-10 border-b border-white/5 overflow-hidden pt-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2025&auto=format&fit=crop')] bg-cover bg-center scale-110 blur-[2px] opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
          
          <div className="relative z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000 py-24">
            <div className="flex items-center gap-3 text-red-500 font-black tracking-widest uppercase text-sm bg-red-600/10 w-fit px-4 py-2 rounded-full border border-red-600/20 shadow-lg shadow-red-900/10">
              <TrendingUp size={18} /> #1 Trending This Week
            </div>

                      <h1 className="text-8xl font-black text-white leading-[0.9] tracking-tighter italic">
                        FREE SDK <br/> <span className="text-red-600">STREAM.</span>
                      </h1>

            <p className="text-2xl text-gray-400 font-medium max-w-2xl leading-relaxed">
              Discover the world's most acclaimed movies and series. From Hollywood blockbusters to heart-touching K-Dramas.
            </p>
            <div className="flex gap-4 pt-4">
              <button className="bg-white text-black px-10 py-5 rounded-2xl font-black text-lg hover:bg-gray-200 transition-all flex items-center gap-3 shadow-2xl shadow-white/10">
                <Play fill="black" size={24} /> Start Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className={`px-10 relative z-20 ${!search ? 'mt-20' : 'pt-40'}`}>
        <div className="flex items-end justify-between mb-10">
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              {search ? `Results for "${search}"` : (category ? `${category.replace('_', ' ').charAt(0) + category.replace('_', ' ').slice(1).toLowerCase()} Collection` : "New Releases")}
            </h2>
            <p className="text-gray-500 font-medium">{search ? `We found ${movies.length} matches for your query.` : "Handpicked premium content for your viewing pleasure."}</p>
          </div>
        </div>

        {movies.length === 0 ? (
          <div className="bg-zinc-900/40 border-2 border-dashed border-zinc-800 rounded-[3rem] py-32 text-center space-y-6">
            <SearchX size={64} className="mx-auto text-zinc-700" />
            <div className="space-y-2">
              <p className="text-gray-500 text-xl font-bold">No results found.</p>
              <p className="text-gray-600 text-sm max-w-md mx-auto">Try adjusting your search or category filter to find what you're looking for.</p>
            </div>
            <Link href="/" className="inline-block bg-red-600 text-white px-8 py-3 rounded-xl font-black uppercase tracking-tighter hover:bg-red-700 transition">View All Content</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {movies.map((movie) => (
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
