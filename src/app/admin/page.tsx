
"use client";
export const dynamic = "force-dynamic";
import { useState, useEffect } from "react";
import { Trash2, Pencil, PlusCircle, LayoutDashboard, LogOut, ShieldCheck, X } from "lucide-react";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  // ... rest of state
  const [movies, setMovies] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", description: "", posterUrl: "", trailerUrl: "", type: "MOVIE", category: "HOLLYWOOD", genre: "", releaseYear: "", streamingLinks: '[]'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [links, setLinks] = useState([{ platform: "", url: "" }]);

  useEffect(() => {
    // If user is logged in, check if they are the admin
    if (status === "authenticated") {
      if (session?.user?.email !== "2004arpit@gmail.com") {
        router.push("/"); // Kick out non-admins
        return;
      }
    } else if (status === "unauthenticated") {
       // Optional: Allow them to see the password prompt even if not logged in, 
       // OR redirect to login. Let's keep your password prompt for now.
    }

    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") setIsAuthorized(true);
    if (auth === "true") fetchMovies();
  }, [status, session]);

  const addLinkField = () => setLinks([...links, { platform: "", url: "" }]);
  const removeLinkField = (index: number) => setLinks(links.filter((_, i) => i !== index));
  const updateLink = (index: number, field: string, value: string) => {
    const newLinks = [...links];
    (newLinks[index] as any)[field] = value;
    setLinks(newLinks);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Arpit2004@") {
      setIsAuthorized(true);
      localStorage.setItem("admin_auth", "true");
      fetchMovies();
    } else {
      alert("Incorrect Admin Password");
    }
  };

  const handleLogout = () => {
    setIsAuthorized(false);
    localStorage.removeItem("admin_auth");
  };

  const fetchMovies = async () => {
    const res = await fetch("/api/movies");
    const data = await res.json();
    setMovies(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = editId ? `/api/movies/${editId}` : "/api/movies";
      const method = editId ? "PATCH" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          releaseYear: parseInt(formData.releaseYear as any),
          streamingLinks: JSON.stringify(links.filter(l => l.url))
        }),
      });

      if (res.ok) {
        setMessage(editId ? "Changes Saved!" : "Content Published!");
        setFormData({ title: "", description: "", posterUrl: "", trailerUrl: "", type: "MOVIE", category: "HOLLYWOOD", genre: "", releaseYear: "", streamingLinks: '[]' });
        setLinks([{ platform: "", url: "" }]);
        setEditId(null);
        fetchMovies();
      } else {
        setMessage("Error processing request.");
      }
    } catch (err) {
      setMessage("An error occurred.");
    }
    setLoading(false);
  };

  const handleEdit = (movie: any) => {
    setEditId(movie.id);
    setFormData({
      title: movie.title,
      description: movie.description,
      posterUrl: movie.posterUrl,
      trailerUrl: movie.trailerUrl || "",
      type: movie.type,
      category: movie.category,
      genre: movie.genre,
      releaseYear: movie.releaseYear.toString(),
      streamingLinks: movie.streamingLinks
    });
    try {
      const parsedLinks = JSON.parse(movie.streamingLinks);
      setLinks(parsedLinks.length > 0 ? parsedLinks : [{ platform: "", url: "" }]);
    } catch {
      setLinks([{ platform: "", url: "" }]);
    }
    setMessage("");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setFormData({ title: "", description: "", posterUrl: "", trailerUrl: "", type: "MOVIE", category: "HOLLYWOOD", genre: "", releaseYear: "", streamingLinks: '[]' });
    setLinks([{ platform: "", url: "" }]);
    setMessage("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      const res = await fetch(`/api/movies/${id}`, { method: "DELETE" });
      if (res.ok) fetchMovies();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-zinc-900/50 p-10 rounded-3xl border border-zinc-800 shadow-2xl space-y-8 backdrop-blur-md">
          <div className="text-center space-y-2">
            <div className="bg-red-600/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="text-red-500" size={32} />
            </div>
            <h1 className="text-3xl font-black tracking-tight">Admin Portal</h1>
            <p className="text-gray-400 text-sm">Enter the creator password to manage platform content.</p>
          </div>
          <div className="space-y-4">
            <input 
              type="password" 
              placeholder="Admin Password"
              className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              required
            />
            <button className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-900/40">
              Unlock Studio
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 px-6 max-w-7xl mx-auto pb-20">
      <div className="flex justify-between items-end mb-12">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tight">Free SDK <span className="text-red-600">Stream Studio</span></h1>
          <p className="text-gray-400 font-medium">Manage your premium content categories and publications.</p>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-6 py-3 rounded-xl transition text-sm font-bold">
          <LogOut size={18} /> Exit Studio
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* Left: Publish Form */}
        <div className="lg:w-1/2 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800 shadow-xl backdrop-blur-md">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Post Title</label>
                <input required type="text" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition" 
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Type</label>
                <select className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition"
                  value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="MOVIE">Movie</option>
                  <option value="SERIES">Series</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Category</label>
                <select className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition"
                  value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option value="HOLLYWOOD">Hollywood</option>
                  <option value="BOLLYWOOD">Bollywood</option>
                  <option value="ASIAN_DRAMA">Asian Drama</option>
                  <option value="ANIME">Anime</option>
                  <option value="ADULT">Adult (18+)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Release Year</label>
                <input required type="number" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition" 
                  value={formData.releaseYear} onChange={e => setFormData({...formData, releaseYear: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Genre</label>
                <input required type="text" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition" 
                  value={formData.genre} onChange={e => setFormData({...formData, genre: e.target.value})} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Poster Image URL</label>
              <input required type="url" className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition" 
                value={formData.posterUrl} onChange={e => setFormData({...formData, posterUrl: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Trailer URL (YouTube)</label>
              <input type="url" placeholder="https://youtube.com/watch?v=..." className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition" 
                value={formData.trailerUrl} onChange={e => setFormData({...formData, trailerUrl: e.target.value})} />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
              <textarea required rows={4} className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white outline-none focus:border-red-600 transition" 
                value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Links</label>
                <button type="button" onClick={addLinkField} className="text-[10px] bg-white/5 hover:bg-white/10 text-gray-300 px-3 py-1 rounded-lg border border-white/5 transition font-black uppercase tracking-tighter">
                  + Add Link
                </button>
              </div>
              <div className="space-y-3">
                {links.map((link, idx) => (
                  <div key={idx} className="flex gap-3 items-center animate-in fade-in slide-in-from-top-2 duration-300">
                    <input 
                      type="text" 
                      placeholder="Platform (e.g. Netflix)" 
                      className="bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-red-600 transition w-40"
                      value={link.platform}
                      onChange={(e) => updateLink(idx, 'platform', e.target.value)}
                    />
                    <input 
                      type="url" 
                      placeholder="URL (https://...)" 
                      className="flex-grow bg-black border border-zinc-800 rounded-xl p-3 text-sm text-white outline-none focus:border-red-600 transition"
                      value={link.url}
                      onChange={(e) => updateLink(idx, 'url', e.target.value)}
                    />
                    {links.length > 1 && (
                      <button type="button" onClick={() => removeLinkField(idx)} className="text-gray-500 hover:text-red-500 p-2 transition">
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button disabled={loading} type="submit" className={`flex-grow ${editId ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700'} text-white font-black py-4 rounded-xl transition-all shadow-lg`}>
                {loading ? "Processing..." : (editId ? "Save Changes" : "Launch Content")}
              </button>
              {editId && (
                <button type="button" onClick={cancelEdit} className="bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-6 py-4 rounded-xl transition-all flex items-center gap-2">
                  <X size={18} /> Cancel
                </button>
              )}
            </div>
            {message && <p className="text-center font-bold text-emerald-400 bg-emerald-900/20 p-4 rounded-xl border border-emerald-900/50">{message}</p>}
          </form>
        </div>

        {/* Right: Manage Content */}
        <div className="lg:w-1/2 space-y-6">
          <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm h-full">
            <h2 className="text-2xl font-black mb-8">Manage Publications</h2>
            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {movies.length === 0 ? (
                <p className="text-gray-500 italic text-center py-20">No content published yet.</p>
              ) : (
                movies.map((movie: any) => (
                  <div key={movie.id} className={`flex items-center gap-4 p-4 rounded-2xl border transition group ${editId === movie.id ? 'bg-emerald-600/10 border-emerald-600' : 'bg-black/40 border-zinc-800 hover:border-zinc-700'}`}>
                    <img src={movie.posterUrl} className="w-14 h-14 object-cover rounded-xl flex-shrink-0" alt="" />
                    <div className="flex-grow min-w-0">
                      <h3 className="font-bold text-white truncate">{movie.title}</h3>
                      <p className="text-xs font-black text-red-500 uppercase tracking-tighter">{movie.category}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(movie)} className="p-3 text-gray-400 hover:text-white hover:bg-white/10 rounded-xl transition" title="Edit post">
                        <Pencil size={18} /> 
                      </button>
                      <button onClick={() => handleDelete(movie.id)} className="p-3 text-gray-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition" title="Delete post">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
