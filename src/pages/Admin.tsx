import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Images,
  PlusCircle,
  Upload,
  Package,
  Settings,
  Camera,
  Bell,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  TrendingUp,
  Star,
  ChevronRight,
  X,
  Check,
  LogOut,
  Loader2,
  ImageIcon,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEvents, createEvent, deleteEvent } from '../hooks/useEvents';
import { usePackages } from '../hooks/usePackages';
import { useImageUpload } from '../hooks/useImages';
import { useToast } from '../contexts/ToastContext';
import type { Event } from '../types/database';

type Tab = 'dashboard' | 'gallery' | 'add-event' | 'upload' | 'packages' | 'settings';

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'gallery', label: 'Manage Gallery', icon: Images },
  { id: 'add-event', label: 'Add Event', icon: PlusCircle },
  { id: 'upload', label: 'Upload Images', icon: Upload },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'settings', label: 'Settings', icon: Settings },
];

// Login Component
function Login({ onLogin }: { onLogin: (email: string, password: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await onLogin(email, password);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera size={28} className="text-white" />
          </div>
          <h1 className="font-serif text-2xl text-stone-800">Admin Login</h1>
          <p className="font-sans text-sm text-stone-400 mt-1">DJ Photography Karaikudi</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
              placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="font-sans text-sm text-red-500 text-center">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-gold-500 to-gold-600 text-white font-sans font-medium py-3 rounded-lg hover:shadow-lg hover:shadow-gold-500/30 transition-all duration-300 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function Admin() {
  const { isAuthenticated, signIn, signOut, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await signIn(email, password);
    if (error) throw error;
    showToast('success', 'Welcome back, Dass!');
  };

  const handleLogout = async () => {
    await signOut();
    showToast('success', 'Logged out successfully');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <Loader2 size={40} className="text-gold-500 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-stone-100 flex">
      {/* Sidebar */}
      <AnimatePresence initial={false}>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            className="w-64 min-h-screen bg-stone-900 text-white flex flex-col fixed left-0 top-0 z-30 shadow-2xl"
          >
            {/* Logo */}
            <div className="px-6 py-7 border-b border-stone-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-gold-500 to-gold-700 rounded-full flex items-center justify-center">
                  <Camera size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-script text-gold-400 text-lg leading-none">DJ Photography</p>
                  <p className="font-sans text-xs text-stone-400 tracking-widest uppercase">Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-6 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-sans text-sm transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                      : 'text-stone-400 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <item.icon size={18} className={activeTab === item.id ? 'text-gold-400' : ''} />
                  {item.label}
                  {activeTab === item.id && (
                    <ChevronRight size={14} className="ml-auto text-gold-400" />
                  )}
                </button>
              ))}
            </nav>

            {/* User */}
            <div className="px-4 py-5 border-t border-stone-700">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 font-serif font-semibold text-sm border border-gold-500/30">
                  D
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-white truncate">Dass</p>
                  <p className="font-sans text-xs text-stone-400 truncate">Administrator</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Topbar */}
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 shadow-sm">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
          >
            <LayoutDashboard size={20} />
          </button>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search events, clients..."
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-lg font-sans text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:border-gold-400 focus:bg-white transition-colors"
              />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <button className="relative p-2 text-stone-500 hover:bg-stone-100 rounded-lg transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full" />
            </button>
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center text-white font-serif font-semibold text-sm">
              D
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'dashboard' && <DashboardTab />}
              {activeTab === 'gallery' && <GalleryTab />}
              {activeTab === 'add-event' && <AddEventTab />}
              {activeTab === 'upload' && <UploadTab dragOver={dragOver} setDragOver={setDragOver} />}
              {activeTab === 'packages' && <PackagesTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

/* ─────────────── Dashboard Tab ─────────────── */
function DashboardTab() {
  const { events, loading } = useEvents();
  const { packages } = usePackages();
  
  const totalPhotos = events.reduce((acc, e) => acc + e.images.length, 0);

  const stats = [
    { label: 'Total Events', value: events.length.toString(), change: '+3 this month', icon: Images, color: 'text-blue-500 bg-blue-50' },
    { label: 'Total Photos', value: totalPhotos.toLocaleString(), change: '+240 this month', icon: Camera, color: 'text-gold-600 bg-gold-50' },
    { label: 'Packages', value: packages.length.toString(), change: 'All active', icon: Package, color: 'text-green-600 bg-green-50' },
    { label: 'Storage', value: '85%', change: '12GB used', icon: Star, color: 'text-maroon-600 bg-maroon-50' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl text-stone-800">Dashboard</h1>
        <p className="font-sans text-stone-400 text-sm mt-1">Welcome back, Dass. Here's what's happening.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-stone-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="font-sans text-sm text-stone-500">{s.label}</span>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon size={20} />
              </div>
            </div>
            <div className="font-serif text-3xl text-stone-800 font-light">{s.value}</div>
            <div className="flex items-center gap-1 mt-1">
              <TrendingUp size={12} className="text-green-500" />
              <span className="font-sans text-xs text-stone-400">{s.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <h3 className="font-serif text-lg text-stone-800">Recent Events</h3>
          <span className="font-sans text-xs text-stone-400">{events.length} total</span>
        </div>
        <div className="divide-y divide-stone-50">
          {events.slice(0, 5).map((event) => (
            <div key={event.id} className="flex items-center gap-4 px-6 py-4 hover:bg-stone-50 transition-colors">
              <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                <img src={event.coverImage} alt={event.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-sans text-sm font-medium text-stone-700 truncate">{event.name}</p>
                <p className="font-sans text-xs text-stone-400">{event.date} · {event.location}</p>
              </div>
              <span className="font-sans text-xs bg-cream-100 text-stone-600 px-2.5 py-1 rounded-full">{event.images.length} photos</span>
              <span className="font-sans text-xs bg-gold-50 text-gold-700 px-2.5 py-1 rounded-full">{event.category}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Gallery Tab ─────────────── */
function GalleryTab() {
  const { events, loading, refetch } = useEvents();
  const { showToast } = useToast();
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const handleDelete = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.name}"? This will also delete all ${event.images.length} photos.`)) {
      return;
    }

    setDeleteLoading(event.id);
    try {
      await deleteEvent(event.id);
      showToast('success', 'Event deleted successfully');
      refetch();
    } catch (err) {
      showToast('error', 'Failed to delete event');
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-800">Manage Gallery</h1>
          <p className="font-sans text-stone-400 text-sm mt-1">{events.length} events · Manage your photo albums</p>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-stone-200">
          <ImageIcon size={48} className="text-stone-300 mx-auto mb-4" />
          <p className="font-sans text-stone-500">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              <div className="relative h-40 overflow-hidden">
                <img
                  src={event.coverImage}
                  alt={event.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <span className="absolute bottom-3 left-3 bg-gold-500/90 text-white text-xs font-sans px-2 py-0.5 rounded-full">
                  {event.category}
                </span>
              </div>
              <div className="p-4">
                <h3 className="font-sans font-medium text-stone-800 text-sm">{event.name}</h3>
                <p className="font-sans text-xs text-stone-400 mt-0.5">{event.date} · {event.location}</p>
                <p className="font-sans text-xs text-stone-500 mt-1">{event.images.length} photos</p>
                <div className="flex gap-2 mt-3">
                  <a
                    href={`/gallery/${event.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-sans transition-colors"
                  >
                    <Eye size={13} /> View
                  </a>
                  <button
                    onClick={() => handleDelete(event)}
                    disabled={deleteLoading === event.id}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 text-xs font-sans transition-colors disabled:opacity-50"
                  >
                    {deleteLoading === event.id ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Trash2 size={13} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────── Add Event Tab ─────────────── */
function AddEventTab() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    event_name: '',
    category: 'Wedding',
    event_date: '',
    location: '',
    description: '',
    cover_image: '',
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.event_name || !formData.event_date || !formData.location) {
      showToast('error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await createEvent({
        ...formData,
        slug: generateSlug(formData.event_name),
      });
      showToast('success', 'Event created successfully!');
      setFormData({
        event_name: '',
        category: 'Wedding',
        event_date: '',
        location: '',
        description: '',
        cover_image: '',
      });
    } catch (err) {
      showToast('error', 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl text-stone-800">Add New Event</h1>
        <p className="font-sans text-stone-400 text-sm mt-1">Create a new gallery event album</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-stone-200 shadow-sm p-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Event Name *</label>
            <input
              type="text"
              value={formData.event_name}
              onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
              placeholder="e.g. Ravi & Sona Wedding"
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
              required
            />
          </div>
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors bg-white"
            >
              {['Wedding', 'Pre-Wedding', 'Engagement', 'Reception', 'Ceremony', 'Event'].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Event Date *</label>
            <input
              type="text"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              placeholder="e.g. January 2024"
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
              required
            />
          </div>
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Location *</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Karaikudi"
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Event Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            placeholder="Brief description about this event..."
            className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Cover Image URL</label>
          <input
            type="url"
            value={formData.cover_image}
            onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })}
            placeholder="https://..."
            className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 placeholder-stone-300 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
          />
          <p className="font-sans text-xs text-stone-400 mt-1">Leave empty to use a placeholder image</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="btn-gold text-xs px-8 py-3 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
            Create Event
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              event_name: '',
              category: 'Wedding',
              event_date: '',
              location: '',
              description: '',
              cover_image: '',
            })}
            className="btn-outline-gold text-xs px-6 py-3"
          >
            <X size={15} />
            Clear
          </button>
        </div>
      </form>
    </div>
  );
}

/* ─────────────── Upload Tab ─────────────── */
function UploadTab({ dragOver, setDragOver }: { dragOver: boolean; setDragOver: (v: boolean) => void }) {
  const { events, loading: eventsLoading } = useEvents();
  const { showToast } = useToast();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [uploadQueue, setUploadQueue] = useState<{ file: File; status: 'pending' | 'uploading' | 'done' | 'error' }[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadImages, uploading } = useImageUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      const newQueue = files.map((file) => ({ file, status: 'pending' as const }));
      setUploadQueue((prev) => [...prev, ...newQueue]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'));
    if (files.length > 0) {
      const newQueue = files.map((file) => ({ file, status: 'pending' as const }));
      setUploadQueue((prev) => [...prev, ...newQueue]);
    }
  };

  const handleUpload = async () => {
    if (!selectedEvent) {
      showToast('error', 'Please select an event');
      return;
    }
    if (uploadQueue.length === 0) {
      showToast('error', 'No files to upload');
      return;
    }

    const pendingFiles = uploadQueue.filter((q) => q.status === 'pending').map((q) => q.file);
    
    try {
      await uploadImages(pendingFiles, selectedEvent.id, selectedEvent.slug);
      showToast('success', 'Images uploaded successfully!');
      setUploadQueue([]);
    } catch (err) {
      showToast('error', 'Failed to upload some images');
    }
  };

  const removeFromQueue = (index: number) => {
    setUploadQueue((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="font-serif text-3xl text-stone-800">Upload Images</h1>
        <p className="font-sans text-stone-400 text-sm mt-1">Drag and drop photos to upload them to an event album</p>
      </div>

      {/* Select Event */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
        <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Select Event Album *</label>
        <select
          value={selectedEvent?.id || ''}
          onChange={(e) => {
            const event = events.find((ev) => ev.id === e.target.value);
            setSelectedEvent(event || null);
          }}
          className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 transition-colors bg-white"
        >
          <option value="">-- Choose an event --</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>{e.name} ({e.images.length} photos)</option>
          ))}
        </select>
      </div>

      {/* Drag Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 cursor-pointer ${
          dragOver
            ? 'border-gold-500 bg-gold-50'
            : 'border-stone-200 bg-white hover:border-gold-400 hover:bg-cream-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload size={40} className={`mx-auto mb-4 transition-colors ${dragOver ? 'text-gold-500' : 'text-stone-300'}`} />
        <p className="font-serif text-xl text-stone-600 mb-2">
          {dragOver ? 'Drop files here' : 'Drag & Drop Photos'}
        </p>
        <p className="font-sans text-sm text-stone-400 mb-4">or click to browse from your computer</p>
        <button type="button" className="btn-outline-gold text-xs">Browse Files</button>
        <p className="font-sans text-xs text-stone-300 mt-4">Supports JPG, PNG, WEBP · Max 20MB per file</p>
      </div>

      {/* Upload Queue */}
      {uploadQueue.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200 shadow-sm">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h3 className="font-sans text-sm font-medium text-stone-700">Upload Queue ({uploadQueue.length})</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setUploadQueue([])}
                className="text-xs text-stone-400 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedEvent}
                className="btn-gold text-xs px-4 py-2 flex items-center gap-2 disabled:opacity-50"
              >
                {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                Upload All
              </button>
            </div>
          </div>
          <div className="divide-y divide-stone-50 max-h-64 overflow-y-auto">
            {uploadQueue.map((item, index) => (
              <div key={index} className="flex items-center gap-4 px-6 py-3">
                <Camera size={18} className="text-stone-300 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-stone-700 truncate">{item.file.name}</p>
                  <p className="font-sans text-xs text-stone-400">{formatFileSize(item.file.size)}</p>
                </div>
                {item.status === 'done' && (
                  <span className="flex items-center gap-1 text-green-600 text-xs font-sans">
                    <Check size={14} /> Done
                  </span>
                )}
                {item.status === 'uploading' && (
                  <span className="text-gold-600 text-xs font-sans animate-pulse">Uploading...</span>
                )}
                {item.status === 'pending' && (
                  <button
                    onClick={() => removeFromQueue(index)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Packages Tab ─────────────── */
function PackagesTab() {
  const { packages, loading } = usePackages();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={40} className="text-gold-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-800">Packages</h1>
          <p className="font-sans text-stone-400 text-sm mt-1">Manage your photography packages and pricing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif text-xl text-stone-800">{pkg.name}</h3>
                <p className="font-sans text-xs text-stone-400 tracking-widest uppercase mt-0.5">{pkg.priceNote}</p>
              </div>
              <div className="text-right">
                <p className="font-serif text-2xl text-gold-600 font-medium">{pkg.price}</p>
                {pkg.badge && (
                  <span className="text-xs bg-gold-50 text-gold-700 px-2 py-0.5 rounded-full font-sans">{pkg.badge}</span>
                )}
              </div>
            </div>
            <div className="space-y-1.5 mb-5">
              {pkg.features.slice(0, 5).map((f) => (
                <div key={f.text} className="flex items-center gap-2">
                  {f.included ? (
                    <Check size={13} className="text-green-500 flex-shrink-0" />
                  ) : (
                    <X size={13} className="text-stone-300 flex-shrink-0" />
                  )}
                  <span className={`font-sans text-xs ${f.included ? 'text-stone-600' : 'text-stone-300'}`}>{f.text}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gold-50 hover:bg-gold-100 text-gold-700 text-xs font-sans transition-colors">
                <Pencil size={13} /> Edit Package
              </button>
              <button className="p-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-500 transition-colors">
                <MoreHorizontal size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Settings Tab ─────────────── */
function SettingsTab() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="font-serif text-3xl text-stone-800">Settings</h1>
        <p className="font-sans text-stone-400 text-sm mt-1">Manage your studio profile and preferences</p>
      </div>

      {[
        {
          title: 'Studio Profile',
          fields: [
            { label: 'Studio Name', value: 'DJ Photography', type: 'text' },
            { label: 'Photographer Name', value: 'Dass', type: 'text' },
            { label: 'Location', value: 'Karaikudi, Tamil Nadu', type: 'text' },
          ],
        },
        {
          title: 'Contact Information',
          fields: [
            { label: 'Phone / WhatsApp', value: '+91 88256 05403', type: 'tel' },
            { label: 'Email', value: 'djphotographykkdi@gmail.com', type: 'email' },
            { label: 'Instagram', value: '@dj_photography_kkdi', type: 'text' },
          ],
        },
        {
          title: 'Change Password',
          fields: [
            { label: 'Current Password', value: '', type: 'password' },
            { label: 'New Password', value: '', type: 'password' },
          ],
        },
      ].map((section) => (
        <div key={section.title} className="bg-white rounded-xl border border-stone-200 shadow-sm p-8 space-y-5">
          <h3 className="font-serif text-lg text-stone-800 border-b border-stone-100 pb-3">{section.title}</h3>
          {section.fields.map((field) => (
            <div key={field.label}>
              <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">{field.label}</label>
              <input
                type={field.type}
                defaultValue={field.value}
                className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
              />
            </div>
          ))}
          <button className="btn-gold text-xs">
            <Check size={14} />
            Save Changes
          </button>
        </div>
      ))}
    </div>
  );
}
