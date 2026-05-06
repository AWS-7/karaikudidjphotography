import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Images,
  PlusCircle,
  Upload,
  Settings,
  LogOut,
  Trash2,
  Check,
  X,
  ChevronRight,
  Camera,
  Star,
  Package,
  Eye,
  TrendingUp,
  Loader2,
  MessageSquare,
  Bell,
  Home,
  XCircle,
  ImageIcon,
  Search,
  Pencil,
  Phone,
  Mail,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { useEvents, createEvent, deleteEvent } from '../hooks/useEvents';
import { usePackages, updatePackage, createPackage, deletePackage } from '../hooks/usePackages';
import { useEnquiries, updateEnquiryStatus, deleteEnquiry } from '../hooks/useEnquiries';
import { useAvailability, updateAvailability, deleteAvailability } from '../hooks/useAvailability';
import { useImageUpload, deleteImage } from '../hooks/useImages';
import { useToast } from '../contexts/ToastContext';
import type { Event, Enquiry, Availability } from '../types/database';
import { saveTestimonials, loadTestimonials, type Testimonial } from '../data/testimonials';
import img1 from '../images/1778054327731.jpg';
import img2 from '../images/1778054327722.jpg';
import img3 from '../images/1778054327710.jpg';
import img4 from '../images/1778054327688.jpg';
import logo from '../images/1778058672282-removebg-preview.png';

const packageImages = [img1, img2, img3, img4];

type Tab = 'dashboard' | 'gallery' | 'add-event' | 'upload' | 'packages' | 'hero' | 'about' | 'reviews' | 'enquiries' | 'calendar' | 'settings';

const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'enquiries', label: 'New Enquiries', icon: MessageSquare },
  { id: 'calendar', label: 'Availability', icon: Bell },
  { id: 'gallery', label: 'Manage Gallery', icon: Images },
  { id: 'add-event', label: 'Add Event', icon: PlusCircle },
  { id: 'upload', label: 'Upload Images', icon: Upload },
  { id: 'packages', label: 'Packages', icon: Package },
  { id: 'hero', label: 'Hero Section', icon: Home },
  { id: 'about', label: 'About Me', icon: Camera },
  { id: 'reviews', label: 'Reviews', icon: Bell },
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
              <div className="flex items-center">
                <img src={logo} alt="DJ Photography" className="h-12 w-auto object-contain brightness-0 invert" />
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
              {activeTab === 'hero' && <HeroTab />}
              {activeTab === 'about' && <AboutTab />}
              {activeTab === 'enquiries' && <EnquiriesTab />}
              {activeTab === 'calendar' && <CalendarTab />}
              {activeTab === 'reviews' && <ReviewsTab />}
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
  const { events, loading: eventsLoading } = useEvents();
  const { packages } = usePackages();
  const { enquiries, loading: enquiriesLoading } = useEnquiries();
  
  const totalPhotos = events.reduce((acc, e) => acc + e.images.length, 0);
  const newEnquiriesCount = enquiries.filter(e => e.status === 'new').length;

  const stats = [
    { label: 'New Enquiries', value: newEnquiriesCount.toString(), change: 'Requires attention', icon: MessageSquare, color: 'text-gold-600 bg-gold-50' },
    { label: 'Total Events', value: events.length.toString(), change: '+3 this month', icon: Images, color: 'text-blue-500 bg-blue-50' },
    { label: 'Total Photos', value: totalPhotos.toLocaleString(), change: '+240 this month', icon: Camera, color: 'text-stone-600 bg-stone-50' },
    { label: 'Packages', value: packages.length.toString(), change: 'All active', icon: Package, color: 'text-green-600 bg-green-50' },
  ];

  if (eventsLoading || enquiriesLoading) {
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
                <p className="font-sans text-xs text-stone-400">{event.category}</p>
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
  const [selectedEventImages, setSelectedEventImages] = useState<Event | null>(null);

  const handleDelete = async (event: Event) => {
    if (!confirm(`Are you sure you want to delete "${event.name}"? This will also delete all ${event.images.length} photos.`)) {
      return;
    }

    setDeleteLoading(event.id);
    try {
      await deleteEvent(event.id);
      showToast('success', 'Event deleted successfully');
      // Force refresh data
      await refetch();
    } catch (err) {
      console.error('Delete event error:', err);
      showToast('error', `Failed to delete event: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleDeleteImage = async (imageId: string, storagePath?: string) => {
    if (!confirm('Delete this image?')) return;
    
    if (!storagePath) {
      showToast('error', 'Could not determine storage path');
      return;
    }

    try {
      await deleteImage(imageId, storagePath);
      showToast('success', 'Image deleted');
      // Refresh local state
      if (selectedEventImages) {
        setSelectedEventImages({
          ...selectedEventImages,
          images: selectedEventImages.images.filter(img => img.id !== imageId)
        });
      }
      await refetch();
    } catch (err) {
      console.error('Delete image error:', err);
      showToast('error', `Failed to delete image: ${err instanceof Error ? err.message : 'Unknown error'}`);
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
                <p className="font-sans text-xs text-stone-500 mt-1">{event.images.length} photos</p>
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => setSelectedEventImages(event)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-gold-50 hover:bg-gold-100 text-gold-700 text-xs font-sans transition-colors"
                  >
                    <Images size={13} /> Manage Photos
                  </button>
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

      {/* Manage Images Modal */}
      <AnimatePresence>
        {selectedEventImages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedEventImages(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-2xl text-stone-800">{selectedEventImages.name}</h2>
                  <p className="font-sans text-stone-400 text-sm">Manage {selectedEventImages.images.length} photos</p>
                </div>
                <button
                  onClick={() => setSelectedEventImages(null)}
                  className="p-2 hover:bg-stone-100 rounded-full transition-colors"
                >
                  <X size={24} className="text-stone-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {selectedEventImages.images.map((img) => (
                    <div key={img.id} className="relative group aspect-square rounded-lg overflow-hidden border border-stone-100 shadow-sm">
                      <img src={img.src} alt="" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteImage(img.id, img.storagePath)}
                          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors transform scale-90 group-hover:scale-100 duration-200"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-4 bg-stone-50 border-t border-stone-100 text-right">
                <button
                  onClick={() => setSelectedEventImages(null)}
                  className="px-6 py-2 bg-white border border-stone-200 rounded-lg font-sans text-sm text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
    if (!formData.event_name) {
      showToast('error', 'Please fill in the event name');
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
  const { events } = useEvents();
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
  const { packages, loading, refetch } = usePackages();
  const { showToast } = useToast();
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [editingPackage, setEditingPackage] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [uploadingPkgImage, setUploadingPkgImage] = useState(false);
  const pkgFileInputRef = useRef<HTMLInputElement>(null);

  const handleEditClick = (pkg: any) => {
    setIsCreating(false);
    // Extract numeric price from formatted string (e.g., "₹95,000" -> 95000)
    let numericPrice = 0;
    if (typeof pkg.price === 'string') {
      const cleaned = pkg.price.replace(/[^0-9]/g, '');
      numericPrice = cleaned ? parseInt(cleaned) : 0;
    } else {
      numericPrice = pkg.price || 0;
    }

    setEditingPackage({
      ...pkg,
      price: numericPrice,
      cover_image: pkg.coverImage || '',
      // Ensure features is a fresh copy
      features: pkg.features ? JSON.parse(JSON.stringify(pkg.features)) : []
    });
  };

  const handleAddNewClick = () => {
    setIsCreating(true);
    setEditingPackage({
      name: '',
      price: 0,
      priceNote: 'Starting price',
      badge: '',
      popular: false,
      accent_color: 'from-gold-500 to-gold-400',
      cover_image: '',
      features: [
        { text: 'Professional Photography', included: true },
        { text: 'Edited Photos', included: true },
        { text: 'Online Gallery', included: true },
      ]
    });
  };

  const handlePackageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editingPackage) return;

    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select an image file');
      return;
    }

    setUploadingPkgImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `package_${Date.now()}.${fileExt}`;
      const storagePath = `packages/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(storagePath, file);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(storagePath);
      setEditingPackage({ ...editingPackage, cover_image: urlData.publicUrl });
      showToast('success', 'Image uploaded successfully!');
    } catch (err) {
      console.error('Package image upload error:', err);
      showToast('error', 'Failed to upload image');
    } finally {
      setUploadingPkgImage(false);
    }
  };

  const handleUpdatePackage = async () => {
    if (!editingPackage) return;
    setUpdateLoading(true);
    try {
      if (isCreating) {
        await createPackage({
          name: editingPackage.name,
          price: editingPackage.price,
          price_note: editingPackage.priceNote,
          badge: editingPackage.badge,
          popular: editingPackage.popular,
          accent_color: editingPackage.accent_color,
          cover_image: editingPackage.cover_image,
          features: editingPackage.features,
        });
        showToast('success', 'Package created successfully!');
      } else {
        await updatePackage(editingPackage.id, {
          name: editingPackage.name,
          price: editingPackage.price,
          price_note: editingPackage.priceNote,
          badge: editingPackage.badge,
          popular: editingPackage.popular,
          cover_image: editingPackage.cover_image,
          features: editingPackage.features,
        });
        showToast('success', 'Package updated successfully!');
      }
      setEditingPackage(null);
      // Wait a bit before refetching to ensure DB consistency
      setTimeout(() => refetch(), 500);
    } catch (err: any) {
      console.error('Save package error:', err);
      if (err.message?.includes("cover_image") || err.details?.includes("cover_image")) {
        showToast('error', 'Database needs update: Please add "cover_image" column to packages table in Supabase.');
      } else {
        showToast('error', `Failed to ${isCreating ? 'create' : 'update'} package`);
      }
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    
    try {
      await deletePackage(id);
      showToast('success', 'Package deleted successfully');
      refetch();
    } catch (err) {
      showToast('error', 'Failed to delete package');
    }
  };

  const toggleFeature = (index: number) => {
    if (!editingPackage) return;
    const newFeatures = [...editingPackage.features];
    newFeatures[index].included = !newFeatures[index].included;
    setEditingPackage({ ...editingPackage, features: newFeatures });
  };

  const addFeature = () => {
    if (!editingPackage || !newFeatureText.trim()) return;
    const newFeatures = [
      ...editingPackage.features,
      { text: newFeatureText.trim(), included: true }
    ];
    setEditingPackage({ ...editingPackage, features: newFeatures });
    setNewFeatureText('');
  };

  const removeFeature = (index: number) => {
    if (!editingPackage) return;
    const newFeatures = editingPackage.features.filter((_: any, i: number) => i !== index);
    setEditingPackage({ ...editingPackage, features: newFeatures });
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
          <h1 className="font-serif text-3xl text-stone-800">Packages</h1>
          <p className="font-sans text-stone-400 text-sm mt-1">Manage your photography packages and pricing</p>
        </div>
        <button
          onClick={handleAddNewClick}
          className="btn-gold flex items-center gap-2 text-sm"
        >
          <PlusCircle size={18} />
          Add New Package
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {packages.map((pkg, i) => (
          <div key={pkg.id} className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-32 overflow-hidden">
              <img src={pkg.coverImage || packageImages[i] || packageImages[0]} alt={pkg.name} className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <h3 className="font-serif text-xl text-white">{pkg.name}</h3>
                <p className="font-sans text-[10px] text-white/70 tracking-widest uppercase">{pkg.priceNote}</p>
              </div>
              <div className="absolute top-3 right-4">
                <p className="font-serif text-xl text-gold-300 font-medium">{pkg.price}</p>
              </div>
            </div>
            
            <div className="p-5">
              <div className="space-y-1.5 mb-5">
                {pkg.features.slice(0, 3).map((f) => (
                  <div key={f.text} className="flex items-center gap-2">
                    {f.included ? (
                      <Check size={13} className="text-green-500 flex-shrink-0" />
                    ) : (
                      <X size={13} className="text-stone-300 flex-shrink-0" />
                    )}
                    <span className={`font-sans text-xs ${f.included ? 'text-stone-600' : 'text-stone-300'}`}>{f.text}</span>
                  </div>
                ))}
                {pkg.features.length > 3 && (
                  <p className="font-sans text-[10px] text-stone-400 italic">+{pkg.features.length - 3} more services...</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPackage(i)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-gold-50 hover:bg-gold-100 text-gold-700 text-xs font-sans transition-colors"
                >
                  <Eye size={13} /> View Details
                </button>
                <button 
                  onClick={() => handleEditClick(pkg)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-stone-600 text-xs font-sans transition-colors"
                >
                  <Pencil size={13} /> Edit
                </button>
                <button 
                  onClick={() => handleDeletePackage(pkg.id)}
                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors"
                  title="Delete Package"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit/Create Package Modal */}
      <AnimatePresence>
        {editingPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            >
              <div className="p-6 border-b border-stone-100 flex items-center justify-between">
                <h2 className="font-serif text-2xl text-stone-800">{isCreating ? 'Add New' : 'Edit ' + editingPackage.name} Package</h2>
                <button onClick={() => setEditingPackage(null)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
                  <X size={20} className="text-stone-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-5">
                {/* Package Image */}
                <div>
                  <label className="font-sans text-xs text-stone-400 uppercase tracking-widest mb-1.5 block">Package Image</label>
                  <div className="flex gap-4 items-center">
                    <div className="w-24 h-16 rounded-lg overflow-hidden border border-stone-100 shadow-sm bg-stone-50">
                      {editingPackage.cover_image ? (
                        <img src={editingPackage.cover_image} alt="Package" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300">
                          <ImageIcon size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        ref={pkgFileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handlePackageImageUpload}
                        className="hidden"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => pkgFileInputRef.current?.click()}
                          disabled={uploadingPkgImage}
                          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-600 text-xs font-sans transition-colors flex items-center gap-2"
                        >
                          {uploadingPkgImage ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                          Upload Photo
                        </button>
                        <input
                          type="url"
                          value={editingPackage.cover_image}
                          onChange={(e) => setEditingPackage({ ...editingPackage, cover_image: e.target.value })}
                          placeholder="Or paste image URL"
                          className="flex-1 border border-stone-200 rounded-lg px-3 py-2 font-sans text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-sans text-xs text-stone-400 uppercase tracking-widest mb-1.5 block">Package Name</label>
                    <input
                      type="text"
                      value={editingPackage.name}
                      onChange={(e) => setEditingPackage({ ...editingPackage, name: e.target.value })}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2.5 font-sans text-sm"
                    />
                  </div>
                  <div>
                    <label className="font-sans text-xs text-stone-400 uppercase tracking-widest mb-1.5 block">Price (₹)</label>
                    <input
                      type="number"
                      value={editingPackage.price || ''}
                      onChange={(e) => setEditingPackage({ ...editingPackage, price: e.target.value === '' ? 0 : parseInt(e.target.value) })}
                      className="w-full border border-stone-200 rounded-lg px-4 py-2.5 font-sans text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-sans text-xs text-stone-400 uppercase tracking-widest mb-1.5 block">Price Note</label>
                  <input
                    type="text"
                    value={editingPackage.priceNote}
                    onChange={(e) => setEditingPackage({ ...editingPackage, priceNote: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-4 py-2.5 font-sans text-sm"
                  />
                </div>

                <div>
                  <label className="font-sans text-xs text-stone-400 uppercase tracking-widest mb-3 block">Manage Features</label>
                  
                  {/* Add New Feature */}
                  <div className="flex gap-2 mb-4">
                    <input
                      type="text"
                      value={newFeatureText}
                      onChange={(e) => setNewFeatureText(e.target.value)}
                      placeholder="Type a new service/feature..."
                      className="flex-1 border border-stone-200 rounded-lg px-4 py-2 font-sans text-sm focus:border-gold-400 outline-none"
                      onKeyDown={(e) => e.key === 'Enter' && addFeature()}
                    />
                    <button
                      onClick={addFeature}
                      className="bg-stone-800 text-white px-4 py-2 rounded-lg font-sans text-xs hover:bg-stone-700 transition-colors flex items-center gap-2"
                    >
                      <PlusCircle size={14} /> Add
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {editingPackage.features.map((feature: any, idx: number) => (
                      <div key={idx} className="relative group/feat">
                        <button
                          onClick={() => toggleFeature(idx)}
                          className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left pr-10 ${
                            feature.included 
                              ? 'border-gold-200 bg-gold-50 text-gold-700' 
                              : 'border-stone-100 bg-stone-50 text-stone-400'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                            feature.included ? 'bg-gold-500 text-white' : 'bg-stone-200 text-stone-400'
                          }`}>
                            {feature.included ? <Check size={12} strokeWidth={3} /> : <X size={12} strokeWidth={3} />}
                          </div>
                          <span className="font-sans text-xs font-medium truncate">{feature.text}</span>
                        </button>
                        
                        {/* Remove button */}
                        <button
                          onClick={() => removeFeature(idx)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-stone-300 hover:text-red-500 opacity-0 group-hover/feat:opacity-100 transition-all"
                          title="Remove feature"
                        >
                          <XCircle size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 bg-stone-50 border-t border-stone-100 flex gap-3">
                <button
                  onClick={() => setEditingPackage(null)}
                  className="flex-1 py-3 rounded-xl font-sans text-sm font-semibold text-stone-500 hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePackage}
                  disabled={updateLoading}
                  className="flex-[2] py-3 rounded-xl font-sans text-sm font-semibold bg-gold-500 text-white hover:bg-gold-600 transition-all shadow-lg shadow-gold-500/20 flex items-center justify-center gap-2"
                >
                  {updateLoading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Preview Modal (Same as User Side) */}
      <AnimatePresence>
        {selectedPackage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedPackage(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative bg-white rounded-3xl overflow-hidden shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedPackage(null)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <XCircle size={20} />
              </button>

              {/* Package Image */}
              <div className="relative h-48 sm:h-56">
                <img
                  src={packageImages[selectedPackage]}
                  alt={packages[selectedPackage].name}
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                  <h3 className="font-serif text-3xl sm:text-4xl font-light text-white">
                    {packages[selectedPackage].name}
                  </h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-serif text-xl sm:text-2xl text-gold-300">
                      {packages[selectedPackage].price}
                    </span>
                    <span className="font-sans text-white/60 text-xs">
                      {packages[selectedPackage].priceNote}
                    </span>
                  </div>
                </div>
              </div>

              {/* Services List */}
              <div className="p-5 sm:p-6">
                <h4 className="font-serif text-lg text-stone-800 mb-4 flex items-center gap-2">
                  <Check size={18} className="text-gold-500" />
                  Package Services
                </h4>
                <ul className="space-y-2">
                  {packages[selectedPackage].features.map((feature) => (
                    <li key={feature.text} className={`flex items-start gap-3 ${!feature.included ? 'opacity-40' : ''}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        feature.included ? 'bg-gold-100' : 'bg-stone-100'
                      }`}>
                        {feature.included ? (
                          <Check size={10} className="text-gold-600" strokeWidth={3} />
                        ) : (
                          <X size={10} className="text-stone-300" strokeWidth={3} />
                        )}
                      </div>
                      <span className={`font-sans text-sm ${feature.included ? 'text-stone-700' : 'text-stone-400'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Preview Info (instead of Book Now in Admin) */}
                <div className="mt-6 w-full flex items-center justify-center gap-3 py-3.5 rounded-xl font-sans text-base font-semibold tracking-wider uppercase bg-stone-100 text-stone-500 border border-stone-200">
                  <Eye size={18} />
                  User Preview Mode
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────── Hero Tab ─────────────── */
const HERO_STORAGE_KEY = 'dj_hero_data';

interface HeroData {
  subtitle: string;
  title: string;
  tagline: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  bgImage: string;
  bgImages?: string[];
}

function loadHeroData(): HeroData {
  const defaultData: HeroData = {
    subtitle: 'DJ Photography',
    title: 'Capturing Love, Light & Emotion',
    tagline: 'Professional Wedding Photographer & Cinematographer',
    stat1Value: '8+',
    stat1Label: 'Years Experience',
    stat2Value: '1500+',
    stat2Label: 'Weddings',
    stat3Value: '100%',
    stat3Label: 'Happy Clients',
    bgImage: 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=1920',
    bgImages: ['https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=1920'],
  };

  try {
    const stored = localStorage.getItem(HERO_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { 
        ...defaultData, 
        ...parsed,
        bgImages: parsed.bgImages || [parsed.bgImage || defaultData.bgImage]
      };
    }
  } catch { /* ignore */ }
  return defaultData;
}

function HeroTab() {
  const { showToast } = useToast();
  const [heroData, setHeroData] = useState<HeroData>(loadHeroData);
  const [uploadingHero, setUploadingHero] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (url: string) => {
    let normalizedUrl = url;
    
    // Handle Google Drive share links
    if (url.includes('drive.google.com')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        normalizedUrl = `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }
    
    // Warn about Google Photos (they don't allow direct linking easily)
    if (url.includes('photos.app.goo.gl') || url.includes('photos.google.com')) {
      showToast('error', 'Google Photos links are not direct images. Please use the Upload button instead.');
    }

    setHeroData({ 
      ...heroData, 
      bgImage: normalizedUrl,
      bgImages: [...(heroData.bgImages || []), normalizedUrl]
    });
  };

  const handleRemoveImage = (index: number) => {
    const currentImages = heroData.bgImages || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setHeroData({
      ...heroData,
      bgImages: newImages,
      bgImage: newImages[0] || ''
    });
  };

  const handleSave = () => {
    try {
      // Don't save base64 data to localStorage to avoid QuotaExceededError
      if (heroData.bgImage.startsWith('data:') || (heroData.bgImages || []).some(img => img.startsWith('data:'))) {
        showToast('error', 'Please wait for all image uploads to complete before saving');
        return;
      }
      localStorage.setItem(HERO_STORAGE_KEY, JSON.stringify(heroData));
      showToast('success', 'Hero section updated successfully!');
    } catch (err) {
      console.error('Save hero error:', err);
      if (err instanceof Error && err.name === 'QuotaExceededError') {
        showToast('error', 'Storage full. Try using smaller images or URLs.');
      } else {
        showToast('error', 'Failed to save changes');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingHero(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;
        if (file.size > 5 * 1024 * 1024) {
          showToast('error', `File ${file.name} too large (>5MB)`);
          continue;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `hero_bg_${Date.now()}_${i}.${fileExt}`;
        const storagePath = `hero/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('gallery')
          .upload(storagePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(storagePath);
        uploadedUrls.push(urlData.publicUrl);
      }

      const newImages = [...(heroData.bgImages || []), ...uploadedUrls];
      setHeroData((prev) => ({ 
        ...prev, 
        bgImages: newImages,
        bgImage: newImages[0] || prev.bgImage
      }));
      
      showToast('success', `${uploadedUrls.length} images uploaded successfully!`);
    } catch (err) {
      console.error('Hero upload error:', err);
      showToast('error', 'Failed to upload images to storage');
    } finally {
      setUploadingHero(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl text-stone-800">Hero Section</h1>
        <p className="font-sans text-stone-400 text-sm mt-1">Edit your homepage hero slider and content</p>
      </div>

      {/* Preview Slider */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden p-6">
        <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-4 block">Background Slider Preview</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {(heroData.bgImages || []).map((img, idx) => (
            <div key={idx} className="relative group aspect-[16/10] rounded-lg overflow-hidden border border-stone-100 shadow-sm">
              <img src={img} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => handleRemoveImage(idx)}
                  className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              {idx === 0 && (
                <div className="absolute top-1 left-1 bg-gold-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-sans uppercase tracking-tighter">
                  Primary
                </div>
              )}
            </div>
          ))}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingHero}
            className="aspect-[16/10] rounded-lg border-2 border-dashed border-stone-200 flex flex-col items-center justify-center text-stone-400 hover:border-gold-300 hover:text-gold-500 transition-all group"
          >
            {uploadingHero ? <Loader2 size={24} className="animate-spin" /> : <PlusCircle size={24} />}
            <span className="text-[10px] mt-1 font-sans">Add Image</span>
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8 space-y-5">
        <h3 className="font-serif text-lg text-stone-800 border-b border-stone-100 pb-3">Hero Content</h3>

        {/* Multiple Upload */}
        <div className="space-y-3">
          <label className="font-sans text-xs text-stone-400 tracking-widest uppercase block">Add Background Images</label>
          <div className="flex gap-3">
            <input
              type="url"
              placeholder="Paste image URL and press enter"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUrlChange((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = '';
                }
              }}
              className="flex-1 border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingHero}
              className="flex items-center gap-2 px-6 py-3 bg-stone-100 hover:bg-stone-200 rounded-lg text-stone-600 text-sm font-sans transition-colors disabled:opacity-50"
            >
              {uploadingHero ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              Upload Multiple
            </button>
          </div>
          <p className="font-sans text-[10px] text-stone-400">Recommended size: 1920x1080px. Images will cycle every 5 seconds.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Subtitle (Script)</label>
            <input
              type="text"
              value={heroData.subtitle}
              onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
            />
          </div>
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Tagline</label>
            <input
              type="text"
              value={heroData.tagline}
              onChange={(e) => setHeroData({ ...heroData, tagline: e.target.value })}
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Main Title</label>
          <input
            type="text"
            value={heroData.title}
            onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
            className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 focus:ring-1 focus:ring-gold-400 transition-colors"
          />
        </div>

        <h3 className="font-serif text-lg text-stone-800 border-b border-stone-100 pb-3 pt-2">Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[
            { valueKey: 'stat1Value', labelKey: 'stat1Label', title: 'Stat 1' },
            { valueKey: 'stat2Value', labelKey: 'stat2Label', title: 'Stat 2' },
            { valueKey: 'stat3Value', labelKey: 'stat3Label', title: 'Stat 3' },
          ].map((stat) => (
            <div key={stat.title} className="space-y-3">
              <label className="font-sans text-xs text-stone-500 font-medium">{stat.title}</label>
              <input
                type="text"
                value={heroData[stat.valueKey as keyof typeof heroData]}
                onChange={(e) => setHeroData({ ...heroData, [stat.valueKey]: e.target.value })}
                placeholder="Value"
                className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 transition-colors"
              />
              <input
                type="text"
                value={heroData[stat.labelKey as keyof typeof heroData]}
                onChange={(e) => setHeroData({ ...heroData, [stat.labelKey]: e.target.value })}
                placeholder="Label"
                className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 transition-colors"
              />
            </div>
          ))}
        </div>

        <button onClick={handleSave} className="btn-gold text-xs flex items-center gap-2">
          <Check size={14} />
          Save Hero Changes
        </button>
      </div>
    </div>
  );
}

/* ─────────────── About Tab ─────────────── */
const ABOUT_STORAGE_KEY = 'dj_about_data';

interface AboutData {
  name: string;
  subtitle: string;
  title: string;
  description1: string;
  description2: string;
  since: string;
  location: string;
  image: string;
  specialties: string[];
  stats: { icon: string; value: string; label: string }[];
}

function loadAboutData(): AboutData {
  const defaultData: AboutData = {
    name: 'Dass',
    subtitle: 'Get To Know Me',
    title: 'Your Storyteller Behind the Lens in Karaikudi',
    description1: "Based in the heart of Karaikudi, I've spent over 8 years perfecting the art of capturing life's most precious moments. Every wedding is a unique story — and I believe in telling it through candid emotions, natural light, and real moments that you'll treasure forever.",
    description2: "From the nervous excitement of the morning preparations to the joyful tears during the ceremony, I document every layer of your wedding day with a cinematic eye and a respectful presence. My approach is unobtrusive, allowing genuine moments to unfold naturally.",
    since: '2016',
    location: 'Karaikudi',
    image: 'https://images.pexels.com/photos/1456613/pexels-photo-1456613.jpeg?auto=compress&cs=tinysrgb&w=1200',
    specialties: [
      'Candid Storytelling',
      'Emotion-First Approach',
      'Cinematic Filmmaking',
      'Pre-Wedding Shoots',
      'Chettinad Specialist',
      'Same-Day Edits',
    ],
    stats: [
      { icon: 'Camera', value: '8+', label: 'Years of Experience' },
      { icon: 'Heart', value: '1500+', label: 'Weddings Captured' },
      { icon: 'Award', value: '50+', label: 'Awards & Recognition' },
      { icon: 'Star', value: '100%', label: 'Client Satisfaction' },
    ],
  };

  try {
    const stored = localStorage.getItem(ABOUT_STORAGE_KEY);
    if (stored) return { ...defaultData, ...JSON.parse(stored) };
  } catch { /* ignore */ }
  return defaultData;
}

function AboutTab() {
  const { showToast } = useToast();
  const [aboutData, setAboutData] = useState<AboutData>(loadAboutData);
  const [uploadingAbout, setUploadingAbout] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSpecialty, setNewSpecialty] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('error', 'Please select an image file');
      return;
    }

    setUploadingAbout(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `about_me_${Date.now()}.${fileExt}`;
      const storagePath = `about/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(storagePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(storagePath);
      const imageUrl = urlData.publicUrl;

      setAboutData((prev) => ({ ...prev, image: imageUrl }));
      showToast('success', 'Profile image uploaded successfully!');
    } catch (err) {
      console.error('About upload error:', err);
      showToast('error', 'Failed to upload image');
    } finally {
      setUploadingAbout(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = () => {
    try {
      localStorage.setItem(ABOUT_STORAGE_KEY, JSON.stringify(aboutData));
      showToast('success', 'About section updated successfully!');
    } catch (err) {
      showToast('error', 'Failed to save changes');
    }
  };

  const addSpecialty = () => {
    if (!newSpecialty.trim()) return;
    setAboutData({
      ...aboutData,
      specialties: [...aboutData.specialties, newSpecialty.trim()],
    });
    setNewSpecialty('');
  };

  const removeSpecialty = (index: number) => {
    setAboutData({
      ...aboutData,
      specialties: aboutData.specialties.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl text-stone-800">About Me</h1>
        <p className="font-sans text-stone-400 text-sm mt-1">Manage your professional profile and biography</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image & Quick Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden p-6">
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-4 block">Profile Image</label>
            <div className="relative group aspect-[3/4] rounded-lg overflow-hidden mb-4">
              <img src={aboutData.image} alt="Profile" className="w-full h-full object-cover" />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2"
              >
                {uploadingAbout ? <Loader2 className="animate-spin" /> : <Upload size={20} />}
                <span className="text-sm font-medium">Change Photo</span>
              </button>
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            
            <div className="space-y-4 pt-2">
              <div>
                <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-1.5 block">Photographer Name</label>
                <input
                  type="text"
                  value={aboutData.name}
                  onChange={(e) => setAboutData({ ...aboutData, name: e.target.value })}
                  className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-sans"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-1.5 block">Since (Year)</label>
                  <input
                    type="text"
                    value={aboutData.since}
                    onChange={(e) => setAboutData({ ...aboutData, since: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-sans"
                  />
                </div>
                <div>
                  <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-1.5 block">Location</label>
                  <input
                    type="text"
                    value={aboutData.location}
                    onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
                    className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-sans"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-6">
            <h3 className="font-serif text-lg text-stone-800 border-b border-stone-100 pb-3 mb-4">Stats</h3>
            <div className="space-y-4">
              {aboutData.stats.map((stat, idx) => (
                <div key={idx} className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const newStats = [...aboutData.stats];
                      newStats[idx].value = e.target.value;
                      setAboutData({ ...aboutData, stats: newStats });
                    }}
                    placeholder="Value (e.g. 8+)"
                    className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-sans"
                  />
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const newStats = [...aboutData.stats];
                      newStats[idx].label = e.target.value;
                      setAboutData({ ...aboutData, stats: newStats });
                    }}
                    placeholder="Label"
                    className="border border-stone-200 rounded-lg px-3 py-2 text-sm font-sans"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Bio & Specialties */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8 space-y-5">
            <h3 className="font-serif text-lg text-stone-800 border-b border-stone-100 pb-3">Biography</h3>
            
            <div>
              <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Heading Subtitle</label>
              <input
                type="text"
                value={aboutData.subtitle}
                onChange={(e) => setAboutData({ ...aboutData, subtitle: e.target.value })}
                className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700"
              />
            </div>

            <div>
              <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Main Heading</label>
              <input
                type="text"
                value={aboutData.title}
                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700"
              />
            </div>

            <div>
              <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Bio Paragraph 1</label>
              <textarea
                value={aboutData.description1}
                onChange={(e) => setAboutData({ ...aboutData, description1: e.target.value })}
                rows={4}
                className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700"
              />
            </div>

            <div>
              <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Bio Paragraph 2</label>
              <textarea
                value={aboutData.description2}
                onChange={(e) => setAboutData({ ...aboutData, description2: e.target.value })}
                rows={4}
                className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8">
            <h3 className="font-serif text-lg text-stone-800 border-b border-stone-100 pb-3 mb-5">Specialties</h3>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {aboutData.specialties.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-stone-100 px-3 py-1.5 rounded-full text-stone-600 text-sm">
                  {item}
                  <button onClick={() => removeSpecialty(idx)} className="hover:text-red-500">
                    <XCircle size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSpecialty}
                onChange={(e) => setNewSpecialty(e.target.value)}
                placeholder="Add new specialty..."
                onKeyPress={(e) => e.key === 'Enter' && addSpecialty()}
                className="flex-1 border border-stone-200 rounded-lg px-4 py-2 text-sm"
              />
              <button onClick={addSpecialty} className="p-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition-colors">
                <PlusCircle size={20} />
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button onClick={handleSave} className="btn-gold flex items-center gap-2">
              <Check size={18} />
              Save All Profile Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────── Reviews Tab ─────────────── */
function ReviewsTab() {
  const { showToast } = useToast();
  const [reviews, setReviews] = useState<Testimonial[]>(loadTestimonials());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    location: '',
    avatar: '',
    review: '',
    rating: 5,
    event: '',
  });

  const handleAdd = () => {
    if (!formData.name || !formData.review) {
      showToast('error', 'Name and review are required');
      return;
    }
    const newReview: Testimonial = {
      id: Date.now().toString(),
      name: formData.name || '',
      role: formData.role || 'Client',
      location: formData.location || '',
      avatar: formData.avatar || 'https://placehold.co/100',
      review: formData.review || '',
      rating: formData.rating || 5,
      event: formData.event || '',
    };
    const updated = [...reviews, newReview];
    setReviews(updated);
    saveTestimonials(updated);
    setFormData({ name: '', role: '', location: '', avatar: '', review: '', rating: 5, event: '' });
    showToast('success', 'Review added successfully!');
  };

  const handleEdit = (review: Testimonial) => {
    setEditingId(review.id);
    setFormData(review);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdate = () => {
    if (!editingId) return;
    const updated = reviews.map(r => r.id === editingId ? { ...r, ...formData } as Testimonial : r);
    setReviews(updated);
    saveTestimonials(updated);
    setEditingId(null);
    setFormData({ name: '', role: '', location: '', avatar: '', review: '', rating: 5, event: '' });
    showToast('success', 'Review updated successfully!');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Delete this review?')) return;
    const updated = reviews.filter((r) => r.id !== id);
    setReviews(updated);
    saveTestimonials(updated);
    showToast('success', 'Review deleted');
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-serif text-3xl text-stone-800">Reviews & Testimonials</h1>
        <p className="font-sans text-stone-400 text-sm mt-1">Manage client testimonials displayed on your site</p>
      </div>

      {/* Add Review Form */}
      <div className="bg-white rounded-xl border border-stone-200 shadow-sm p-8 space-y-5">
        <h3 className="font-serif text-lg text-stone-800 border-b border-stone-100 pb-3">
          {editingId ? 'Edit Review' : 'Add New Review'}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Client Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Karthik & Meena"
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 transition-colors"
            />
          </div>
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Event Type</label>
            <input
              type="text"
              value={formData.event}
              onChange={(e) => setFormData({ ...formData, event: e.target.value })}
              placeholder="e.g. Wedding Photography"
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Karaikudi"
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 transition-colors"
            />
          </div>
          <div>
            <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Rating (1-5)</label>
            <select
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
              className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 transition-colors bg-white"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Avatar URL</label>
          <input
            type="url"
            value={formData.avatar}
            onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
            placeholder="https://..."
            className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 transition-colors"
          />
        </div>

        <div>
          <label className="font-sans text-xs text-stone-400 tracking-widest uppercase mb-2 block">Review Text *</label>
          <textarea
            value={formData.review}
            onChange={(e) => setFormData({ ...formData, review: e.target.value })}
            rows={4}
            placeholder="Client's testimonial..."
            className="w-full border border-stone-200 rounded-lg px-4 py-3 font-sans text-sm text-stone-700 focus:outline-none focus:border-gold-400 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={editingId ? handleUpdate : handleAdd}
            className="btn-gold text-xs px-8 py-3 flex items-center gap-2"
          >
            {editingId ? <Check size={15} /> : <PlusCircle size={15} />}
            {editingId ? 'Update Review' : 'Add Review'}
          </button>
          {editingId && (
            <button
              onClick={() => {
                setEditingId(null);
                setFormData({ name: '', role: '', location: '', avatar: '', review: '', rating: 5, event: '' });
              }}
              className="btn-outline-gold text-xs px-6 py-3"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="font-serif text-lg text-stone-800">All Reviews ({reviews.length})</h3>
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-stone-200 shadow-sm p-6 flex gap-4 group">
            <img src={review.avatar} alt={review.name} className="w-14 h-14 rounded-full object-cover border-2 border-gold-200 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-sans font-medium text-stone-800">{review.name}</h4>
                  <p className="font-sans text-xs text-stone-400">{review.event} · {review.location}</p>
                  <div className="flex gap-0.5 mt-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} size={12} className="text-gold-500 fill-gold-500" />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(review)}
                    className="p-2 text-stone-400 hover:text-gold-600 hover:bg-gold-50 rounded-lg transition-colors"
                    title="Edit Review"
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p className="font-sans text-sm text-stone-600 mt-2 line-clamp-3">"{review.review}"</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────── Enquiries Tab ─────────────── */
function EnquiriesTab() {
  const { enquiries, loading, refetch } = useEnquiries();
  const { showToast } = useToast();

  const handleStatusChange = async (id: string, status: Enquiry['status']) => {
    try {
      await updateEnquiryStatus(id, status);
      showToast('success', 'Enquiry updated');
      refetch();
    } catch (err) {
      showToast('error', 'Failed to update enquiry');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    try {
      await deleteEnquiry(id);
      showToast('success', 'Enquiry deleted');
      refetch();
    } catch (err) {
      showToast('error', 'Failed to delete enquiry');
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
      <div>
        <h1 className="font-serif text-3xl text-stone-800">New Enquiries</h1>
        <p className="font-sans text-stone-400 text-sm mt-1">Manage leads from your website</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {enquiries.length === 0 ? (
          <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
            <MessageSquare size={48} className="text-stone-200 mx-auto mb-4" />
            <p className="text-stone-500 font-sans">No enquiries found</p>
          </div>
        ) : (
          enquiries.map((enq) => (
            <div key={enq.id} className={`bg-white rounded-xl border ${enq.status === 'new' ? 'border-gold-300 ring-1 ring-gold-100' : 'border-stone-200'} shadow-sm p-6 hover:shadow-md transition-shadow`}>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="font-serif text-xl text-stone-800">{enq.name}</h3>
                    {enq.status === 'new' && (
                      <span className="bg-gold-500 text-white text-[10px] px-2 py-0.5 rounded-full font-sans uppercase tracking-widest">New</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm">
                    <div className="flex items-center gap-2 text-stone-600">
                      <Phone size={14} className="text-stone-400" />
                      {enq.phone}
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <Mail size={14} className="text-stone-400" />
                      {enq.email}
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <Bell size={14} className="text-stone-400" />
                      {enq.eventType}
                    </div>
                    <div className="flex items-center gap-2 text-stone-600">
                      <TrendingUp size={14} className="text-stone-400" />
                      {new Date(enq.eventDate).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-stone-600 text-sm bg-stone-50 p-3 rounded-lg border border-stone-100">
                    "{enq.message}"
                  </p>
                </div>
                
                <div className="flex md:flex-col gap-2 justify-end">
                  <select
                    value={enq.status}
                    onChange={(e) => handleStatusChange(enq.id, e.target.value as any)}
                    className="border border-stone-200 rounded-lg px-3 py-2 text-xs font-sans focus:border-gold-400 focus:outline-none"
                  >
                    <option value="new">Mark as New</option>
                    <option value="read">Mark as Read</option>
                    <option value="contacted">Mark as Contacted</option>
                    <option value="booked">Mark as Booked</option>
                  </select>
                  <button
                    onClick={() => window.open(`https://wa.me/${enq.phone.replace(/[^0-9]/g, '')}`, '_blank')}
                    className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-green-500 hover:bg-green-600 text-white text-xs font-sans transition-colors"
                  >
                    <MessageSquare size={14} /> WhatsApp
                  </button>
                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ─────────────── Calendar Tab ─────────────── */
function CalendarTab() {
  const { availability, loading, refetch } = useAvailability();
  const { showToast } = useToast();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState<Availability['status']>('busy');

  const handleUpdate = async () => {
    try {
      await updateAvailability(selectedDate, status, note);
      showToast('success', 'Availability updated');
      refetch();
      setNote('');
    } catch (err) {
      showToast('error', 'Failed to update availability');
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
      <div>
        <h1 className="font-serif text-3xl text-stone-800">Availability Calendar</h1>
        <p className="font-sans text-stone-400 text-sm mt-1">Mark dates as busy or tentative</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white rounded-xl border border-stone-200 shadow-sm p-6 space-y-4">
          <h3 className="font-serif text-lg text-stone-800 border-b border-stone-100 pb-3">Mark a Date</h3>
          <div>
            <label className="font-sans text-xs text-stone-400 uppercase mb-2 block">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:border-gold-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-sans text-xs text-stone-400 uppercase mb-2 block">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:border-gold-400 focus:outline-none"
            >
              <option value="busy">Busy (Booked)</option>
              <option value="tentative">Tentative (Enquiry)</option>
              <option value="available">Available</option>
            </select>
          </div>
          <div>
            <label className="font-sans text-xs text-stone-400 uppercase mb-2 block">Note (Optional)</label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="e.g. Wedding at Madurai"
              className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:border-gold-400 focus:outline-none"
            />
          </div>
          <button onClick={handleUpdate} className="w-full btn-gold py-3">Update Availability</button>
        </div>

        <div className="lg:col-span-2 bg-white rounded-xl border border-stone-200 shadow-sm p-6">
          <h3 className="font-serif text-lg text-stone-800 border-b border-stone-100 pb-3 mb-4">Booked Dates</h3>
          <div className="space-y-3">
            {availability.filter(a => a.status !== 'available').length === 0 ? (
              <p className="text-stone-400 text-sm italic py-8 text-center">No busy dates marked yet</p>
            ) : (
              availability.filter(a => a.status !== 'available').map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-lg border border-stone-100">
                  <div>
                    <p className="font-sans font-medium text-stone-700">{new Date(a.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="font-sans text-xs text-stone-400">{a.note || 'No notes'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-sans uppercase tracking-widest ${a.status === 'busy' ? 'bg-red-100 text-red-600' : 'bg-gold-100 text-gold-600'}`}>
                      {a.status}
                    </span>
                    <button onClick={() => deleteAvailability(a.id).then(refetch)} className="text-stone-300 hover:text-red-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
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
