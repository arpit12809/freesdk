
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ExternalLink, Calendar, Film as FilmIcon, PlayCircle } from "lucide-react";
import WatchlistButton from "@/components/WatchlistButton";
import { getSession } from "@/lib/auth";

export default async function MovieDetail({ params }: { params: { slug: string } }) {
  const movie = await prisma.movie.findUnique({ 
    where: { slug: params.slug },
    include: { watchlistedBy: true }
  });
  
  if (!movie) notFound();

  const session = await getSession();
  const isWatchlisted = session ? movie.watchlistedBy.some(w => w.userId === session.user.id) : false;
  const streamingLinks = JSON.parse(movie.streamingLinks || '[]');

  // Helper to extract YouTube ID
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const trailerId = movie.trailerUrl ? getYoutubeId(movie.trailerUrl) : null;

  return (
    <div className="min-h-screen pt-32 px-10 max-w-7xl mx-auto pb-20 bg-black">
      <div className="flex flex-col lg:flex-row gap-16">
        
        {/* Left: Poster & Actions */}
        <div className="w-full lg:w-1/3 space-y-8">
          <div className="relative group">
            <img src={movie.posterUrl} alt={movie.title} className="w-full rounded-[2.5rem] shadow-2xl border border-white/5 object-cover aspect-[2/3]" />
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-t from-black/60 to-transparent"></div>
          </div>
          
          <div className="flex flex-col gap-4">
             <WatchlistButton movieId={movie.id} initialIsWatchlisted={isWatchlisted} />
             
             {streamingLinks.length > 0 && (
               <div className="space-y-4 pt-4">
                 <h3 className="text-sm font-black text-gray-500 uppercase tracking-widest">Available On</h3>
                 <div className="grid grid-cols-1 gap-3">
                   {streamingLinks.map((link: any, idx: number) => (
                     <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" 
                        className="flex items-center justify-between bg-zinc-900/50 hover:bg-zinc-800 border border-white/5 p-4 rounded-2xl transition-all">
                       <span className="font-bold">{link.platform}</span>
                       <ExternalLink size={16} className="text-red-500" />
                     </a>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>

        {/* Right: Info & Trailer */}
        <div className="w-full lg:w-2/3 space-y-12">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <span className="bg-red-600 text-white px-3 py-1 rounded-md text-xs font-black uppercase tracking-widest">{movie.category}</span>
              <span className="flex items-center gap-2 text-gray-400 font-bold text-sm"><Calendar size={16}/> {movie.releaseYear}</span>
              <span className="flex items-center gap-2 text-gray-400 font-bold text-sm"><FilmIcon size={16}/> {movie.type}</span>
            </div>
            
            <h1 className="text-7xl font-black tracking-tighter leading-none">{movie.title}</h1>
            <p className="text-xl text-gray-400 font-medium leading-relaxed border-l-4 border-red-600 pl-8 py-2 bg-white/5 rounded-r-2xl">
              {movie.description}
            </p>
          </div>

          {/* Trailer Section */}
          {trailerId ? (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <PlayCircle className="text-red-600" size={28} />
                <h2 className="text-2xl font-black tracking-tight">Official Trailer</h2>
              </div>
              <div className="relative aspect-video w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
                <iframe 
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${trailerId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          ) : (
             <div className="bg-zinc-900/30 border border-zinc-800 p-12 rounded-[2rem] text-center italic text-gray-500">
               Trailer coming soon for this {movie.type.toLowerCase()}.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
