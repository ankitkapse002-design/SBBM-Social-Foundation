import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail, Image as ImageIcon, Trash2, Edit3, Eye, EyeOff, Search,
  Upload, Plus, Check, CheckCircle2, AlertCircle, X,
  ExternalLink, LogOut, RefreshCw, Phone, Clock, ShieldCheck,
  CheckSquare
} from 'lucide-react';
import { apiRequest, clearAuthToken } from '../../api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  status: 'unread' | 'read' | 'replied' | 'archived';
  createdAt: string;
}

interface GalleryAsset {
  id: string;
  title: string;
  caption: string;
  type: 'photo' | 'video';
  category: string;
  mediaUrl: string;
  status: 'published' | 'draft' | 'unpublished';
  createdAt: string;
}

type ActiveSection = 'messages' | 'gallery';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<ActiveSection>('messages');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Messages State
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [messageSearch, setMessageSearch] = useState<string>('');
  const [messageStatusFilter, setMessageStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<ContactMessage | null>(null);

  // Gallery State
  const [galleryAssets, setGalleryAssets] = useState<GalleryAsset[]>([]);
  const [gallerySearch, setGallerySearch] = useState<string>('');
  const [galleryCategoryFilter, setGalleryCategoryFilter] = useState<string>('all');
  const [galleryStatusFilter, setGalleryStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Add/Upload Photo Modal State
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<{ data: string; filename: string; sizeKB: number } | null>(null);
  const [newPhotoTitle, setNewPhotoTitle] = useState<string>('');
  const [newPhotoCaption, setNewPhotoCaption] = useState<string>('');
  const [newPhotoCategory, setNewPhotoCategory] = useState<string>('ashram');
  const [newPhotoStatus, setNewPhotoStatus] = useState<'published' | 'draft'>('published');
  const [isSubmittingPhoto, setIsSubmittingPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Photo Modal State
  const [editingPhoto, setEditingPhoto] = useState<GalleryAsset | null>(null);
  const [editPhotoTitle, setEditPhotoTitle] = useState<string>('');
  const [editPhotoCaption, setEditPhotoCaption] = useState<string>('');
  const [editPhotoCategory, setEditPhotoCategory] = useState<string>('ashram');
  const [editPhotoStatus, setEditPhotoStatus] = useState<'published' | 'draft'>('published');
  const [editReplacePreview, setEditReplacePreview] = useState<string | null>(null);
  const [editReplaceFile, setEditReplaceFile] = useState<{ data: string; filename: string } | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);

  // Delete Photo Confirmation State
  const [photoToDelete, setPhotoToDelete] = useState<GalleryAsset | null>(null);

  // Auto-dismiss feedback after 4 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  // Load Messages from API
  const loadMessages = useCallback(async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: ContactMessage[]; unreadCount: number }>('/admin/messages');
      if (res.success && Array.isArray(res.data)) {
        setMessages(res.data);
        const unread = res.unreadCount !== undefined
          ? res.unreadCount
          : res.data.filter(m => m.status === 'unread').length;
        setUnreadCount(unread);
      }
    } catch (err: any) {
      console.error('Failed to load messages:', err);
    }
  }, []);

  // Load Gallery Assets from API
  const loadGallery = useCallback(async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: GalleryAsset[] }>('/admin/gallery');
      if (res.success && Array.isArray(res.data)) {
        setGalleryAssets(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load gallery assets:', err);
    }
  }, []);

  // Auth Verification & Initial Data Load
  const checkAuthAndLoad = useCallback(async () => {
    document.title = 'Administrative Management Console | SBBM Social Foundation';
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow');

    setIsLoading(true);
    try {
      const authRes = await apiRequest<{ success: boolean; user: any }>('/auth/me');
      if (!authRes.success || !authRes.user || authRes.user.role !== 'admin') {
        clearAuthToken();
        navigate('/admin-login');
        return;
      }
      setCurrentUser(authRes.user);
      await Promise.all([loadMessages(), loadGallery()]);
    } catch {
      clearAuthToken();
      navigate('/admin-login');
    } finally {
      setIsLoading(false);
    }
  }, [navigate, loadMessages, loadGallery]);

  useEffect(() => {
    checkAuthAndLoad();
  }, [checkAuthAndLoad]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([loadMessages(), loadGallery()]);
    setIsRefreshing(false);
    setFeedback({ type: 'success', message: 'Dashboard updated with latest records.' });
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admin-login');
  };

  // --------------------------------------------------------------------------
  // MESSAGES HANDLERS
  // --------------------------------------------------------------------------
  const handleToggleMessageStatus = async (msg: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const nextStatus = msg.status === 'unread' ? 'read' : 'unread';
    try {
      const res = await apiRequest<{ success: boolean }>(`/admin/messages/${msg.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.success) {
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, status: nextStatus } : m));
        setUnreadCount(prev => nextStatus === 'read' ? Math.max(0, prev - 1) : prev + 1);
        if (selectedMessage && selectedMessage.id === msg.id) {
          setSelectedMessage({ ...selectedMessage, status: nextStatus });
        }
        setFeedback({
          type: 'success',
          message: `Inquiry marked as ${nextStatus === 'read' ? 'Read' : 'Unread'}.`,
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update message status.' });
    }
  };

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      const res = await apiRequest<{ success: boolean }>(`/admin/messages/${messageToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setMessages(prev => prev.filter(m => m.id !== messageToDelete.id));
        if (messageToDelete.status === 'unread') {
          setUnreadCount(prev => Math.max(0, prev - 1));
        }
        if (selectedMessage && selectedMessage.id === messageToDelete.id) {
          setSelectedMessage(null);
        }
        setFeedback({ type: 'success', message: 'Inquiry deleted successfully.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete inquiry.' });
    } finally {
      setMessageToDelete(null);
    }
  };

  // Filtered Messages
  const filteredMessages = messages.filter(m => {
    const matchesStatus =
      messageStatusFilter === 'all' ||
      (messageStatusFilter === 'unread' && m.status === 'unread') ||
      (messageStatusFilter === 'read' && m.status !== 'unread');

    const q = messageSearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.email && m.email.toLowerCase().includes(q)) ||
      (m.phone && m.phone.toLowerCase().includes(q)) ||
      (m.message && m.message.toLowerCase().includes(q)) ||
      (m.category && m.category.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // --------------------------------------------------------------------------
  // GALLERY HANDLERS
  // --------------------------------------------------------------------------
  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (JPG, PNG, or WebP).' });
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'Selected image is larger than 15MB. Please choose a smaller image.' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setUploadPreview(result);
      setUploadFile({
        data: result,
        filename: file.name,
        sizeKB: Math.round(file.size / 1024),
      });
      if (!newPhotoTitle) {
        // Auto-fill title from clean filename
        const cleanName = file.name
          .replace(/\.[^/.]+$/, '')
          .replace(/[-_]+/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
        setNewPhotoTitle(cleanName);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setFeedback({ type: 'error', message: 'Please select a valid image file (JPG, PNG, or WebP).' });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setEditReplacePreview(result);
      setEditReplaceFile({ data: result, filename: file.name });
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !uploadPreview) {
      setFeedback({ type: 'error', message: 'Please select an image file to upload.' });
      return;
    }
    if (!newPhotoTitle.trim()) {
      setFeedback({ type: 'error', message: 'Please provide a photograph title.' });
      return;
    }

    setIsSubmittingPhoto(true);
    try {
      // 1. Upload photograph binary
      const uploadRes = await apiRequest<{ success: boolean; url: string }>('/admin/gallery/upload', {
        method: 'POST',
        body: JSON.stringify({
          image: uploadFile.data,
          filename: uploadFile.filename,
        }),
      });

      if (!uploadRes.success || !uploadRes.url) {
        throw new Error('Image file could not be written to server storage.');
      }

      // 2. Create Gallery Record
      const createRes = await apiRequest<{ success: boolean; data: GalleryAsset }>('/admin/gallery', {
        method: 'POST',
        body: JSON.stringify({
          title: newPhotoTitle.trim(),
          caption: newPhotoCaption.trim(),
          category: newPhotoCategory,
          mediaUrl: uploadRes.url,
          status: newPhotoStatus,
          type: 'photo',
        }),
      });

      if (createRes.success && createRes.data) {
        setGalleryAssets(prev => [createRes.data, ...prev]);
        setFeedback({
          type: 'success',
          message: `Photograph "${newPhotoTitle}" successfully added${newPhotoStatus === 'published' ? ' and published to website gallery' : ' as draft'}.`,
        });
        // Reset form
        setShowUploadModal(false);
        setUploadPreview(null);
        setUploadFile(null);
        setNewPhotoTitle('');
        setNewPhotoCaption('');
        setNewPhotoCategory('ashram');
        setNewPhotoStatus('published');
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to publish photograph.' });
    } finally {
      setIsSubmittingPhoto(false);
    }
  };

  const handleTogglePublishPhoto = async (asset: GalleryAsset) => {
    const isCurrentlyPublished = asset.status === 'published';
    const nextStatus = isCurrentlyPublished ? 'draft' : 'published';

    try {
      const res = await apiRequest<{ success: boolean }>(`/admin/gallery/${asset.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: nextStatus }),
      });

      if (res.success) {
        setGalleryAssets(prev => prev.map(g => g.id === asset.id ? { ...g, status: nextStatus } : g));
        setFeedback({
          type: 'success',
          message: isCurrentlyPublished
            ? `Photograph unpublished. It has been removed from the public website gallery.`
            : `Photograph published! It is now live on the public website gallery.`,
        });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update publication status.' });
    }
  };

  const openEditPhoto = (asset: GalleryAsset) => {
    setEditingPhoto(asset);
    setEditPhotoTitle(asset.title);
    setEditPhotoCaption(asset.caption || '');
    setEditPhotoCategory(asset.category || 'ashram');
    setEditPhotoStatus(asset.status === 'published' ? 'published' : 'draft');
    setEditReplacePreview(null);
    setEditReplaceFile(null);
  };

  const handleSaveEditPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPhoto) return;
    if (!editPhotoTitle.trim()) {
      setFeedback({ type: 'error', message: 'Photograph title cannot be empty.' });
      return;
    }

    setIsSubmittingPhoto(true);
    try {
      let finalMediaUrl = editingPhoto.mediaUrl;

      // If replacing the image file
      if (editReplaceFile) {
        const uploadRes = await apiRequest<{ success: boolean; url: string }>('/admin/gallery/upload', {
          method: 'POST',
          body: JSON.stringify({
            image: editReplaceFile.data,
            filename: editReplaceFile.filename,
          }),
        });
        if (uploadRes.success && uploadRes.url) {
          finalMediaUrl = uploadRes.url;
        }
      }

      const res = await apiRequest<{ success: boolean; data: GalleryAsset }>(`/admin/gallery/${editingPhoto.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: editPhotoTitle.trim(),
          caption: editPhotoCaption.trim(),
          category: editPhotoCategory,
          status: editPhotoStatus,
          mediaUrl: finalMediaUrl,
        }),
      });

      if (res.success) {
        setGalleryAssets(prev =>
          prev.map(g =>
            g.id === editingPhoto.id
              ? {
                  ...g,
                  title: editPhotoTitle.trim(),
                  caption: editPhotoCaption.trim(),
                  category: editPhotoCategory,
                  status: editPhotoStatus,
                  mediaUrl: finalMediaUrl,
                }
              : g
          )
        );
        setFeedback({ type: 'success', message: 'Photograph details updated successfully.' });
        setEditingPhoto(null);
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to update photograph.' });
    } finally {
      setIsSubmittingPhoto(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!photoToDelete) return;
    try {
      const res = await apiRequest<{ success: boolean }>(`/admin/gallery/${photoToDelete.id}`, {
        method: 'DELETE',
      });
      if (res.success) {
        setGalleryAssets(prev => prev.filter(g => g.id !== photoToDelete.id));
        setFeedback({ type: 'success', message: 'Photograph permanently deleted from gallery.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to delete photograph.' });
    } finally {
      setPhotoToDelete(null);
    }
  };

  // Filtered Gallery Assets
  const filteredGallery = galleryAssets.filter(g => {
    const matchesCategory = galleryCategoryFilter === 'all' || g.category === galleryCategoryFilter;
    const matchesStatus =
      galleryStatusFilter === 'all' ||
      (galleryStatusFilter === 'published' && g.status === 'published') ||
      (galleryStatusFilter === 'draft' && g.status !== 'published');

    const q = gallerySearch.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (g.title && g.title.toLowerCase().includes(q)) ||
      (g.caption && g.caption.toLowerCase().includes(q));

    return matchesCategory && matchesStatus && matchesSearch;
  });

  const publishedCount = galleryAssets.filter(g => g.status === 'published').length;
  const draftCount = galleryAssets.filter(g => g.status !== 'published').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FA] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-12 h-12 border-4 border-[#8B1D24] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold text-stone-600">Verifying administrative credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F5F7] text-stone-800 font-sans antialiased flex flex-col">
      {/* =========================================================================
          TOP ADMIN HEADER BAR
         ========================================================================= */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left Brand Identity */}
          <div className="flex items-center space-x-3">
            <img
              src="/assets/images/logo.png"
              alt="SBBM Social Foundation"
              className="w-10 h-10 object-contain shrink-0 drop-shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm sm:text-base text-stone-900 leading-tight">
                  SBBM Social Foundation
                </span>
                <span className="px-2 py-0.5 bg-[#8B1D24]/10 text-[#8B1D24] font-semibold text-[10px] rounded uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Registered Society & Public Trust (MAH/332/15/NAG • F-33193)
              </p>
            </div>
          </div>

          {/* Right Admin Controls */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              title="Refresh Data"
              className="p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors border border-stone-200"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#8B1D24]' : ''}`} />
            </button>

            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-200 transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Admin Profile Chip */}
            <div className="flex items-center space-x-2 pl-2 border-l border-stone-200 text-xs">
              <div className="w-8 h-8 rounded-full bg-[#8B1D24] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {currentUser?.fullName ? currentUser.fullName.charAt(0) : 'A'}
              </div>
              <div className="hidden lg:block text-left">
                <span className="block font-semibold text-stone-900 text-xs leading-none">
                  {currentUser?.fullName || 'Administrator'}
                </span>
                <span className="text-[10px] text-emerald-700 font-medium">Authorised Trustee</span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-lg border border-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Global Feedback Banner */}
      {feedback && (
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 w-full transition-all animate-in fade-in slide-in-from-top-1`}
        >
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium shadow-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-red-50 border-red-200 text-red-800'
            }`}
          >
            <div className="flex items-center space-x-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-stone-400 hover:text-stone-600">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          MAIN CONTAINER & 2-SECTION TABS
         ========================================================================= */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1 space-y-6">
        
        {/* Navigation Tabs (Only Two Sections!) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-2 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {/* Tab 1: Messages & Inquiries */}
            <button
              onClick={() => setActiveSection('messages')}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-2.5 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                activeSection === 'messages'
                  ? 'bg-[#8B1D24] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Messages & Inquiries</span>
              {unreadCount > 0 ? (
                <span
                  className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                    activeSection === 'messages'
                      ? 'bg-white text-[#8B1D24]'
                      : 'bg-red-500 text-white animate-pulse'
                  }`}
                >
                  {unreadCount} unread
                </span>
              ) : (
                <span className="text-[11px] opacity-75">({messages.length})</span>
              )}
            </button>

            {/* Tab 2: Gallery Management */}
            <button
              onClick={() => setActiveSection('gallery')}
              className={`flex-1 sm:flex-none inline-flex items-center justify-center space-x-2.5 px-5 py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all ${
                activeSection === 'gallery'
                  ? 'bg-[#8B1D24] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery Management</span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                  activeSection === 'gallery'
                    ? 'bg-white text-[#8B1D24]'
                    : 'bg-stone-100 text-stone-700'
                }`}
              >
                {galleryAssets.length} Photos
              </span>
            </button>
          </div>

          <div className="text-xs text-stone-500 hidden md:flex items-center space-x-1.5 px-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Dedicated Admin Management Mode</span>
          </div>
        </div>

        {/* =======================================================================
            SECTION 1: OFFICIAL MESSAGES AND INQUIRIES
           ======================================================================= */}
        {activeSection === 'messages' && (
          <div className="space-y-5">
            {/* Section Subheader & Controls */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Official Messages & Inquiries
                  </h2>
                  <p className="text-xs text-stone-500">
                    Direct inquiries submitted via the website's public "Send an Official Message or Inquiry" form.
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs">
                  <span className="px-2.5 py-1 bg-stone-100 text-stone-700 font-semibold rounded-lg">
                    Total: {messages.length}
                  </span>
                  <span className="px-2.5 py-1 bg-red-50 text-red-700 font-semibold rounded-lg">
                    Unread: {unreadCount}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-semibold rounded-lg">
                    Read: {messages.length - unreadCount}
                  </span>
                </div>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Box */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={messageSearch}
                    onChange={(e) => setMessageSearch(e.target.value)}
                    placeholder="Search by sender name, mobile, email, or keywords..."
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D24] focus:bg-white"
                  />
                  {messageSearch && (
                    <button
                      onClick={() => setMessageSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Status Filter Pills */}
                <div className="flex items-center space-x-1.5 self-start md:self-auto bg-stone-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setMessageStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      messageStatusFilter === 'all'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    All ({messages.length})
                  </button>
                  <button
                    onClick={() => setMessageStatusFilter('unread')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      messageStatusFilter === 'unread'
                        ? 'bg-white text-[#8B1D24] shadow-2xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Unread ({unreadCount})
                  </button>
                  <button
                    onClick={() => setMessageStatusFilter('read')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      messageStatusFilter === 'read'
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Read ({messages.length - unreadCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Messages List & Empty State */}
            {filteredMessages.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <Mail className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-stone-800">
                  {messageSearch || messageStatusFilter !== 'all'
                    ? 'No inquiries match your filter criteria'
                    : 'No inquiries received yet.'}
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  {messageSearch || messageStatusFilter !== 'all'
                    ? 'Try clearing your search query or selecting a different status filter.'
                    : 'Whenever a visitor submits an official message through the public website contact form, it will automatically appear here in real-time.'}
                </p>
                {(messageSearch || messageStatusFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setMessageSearch('');
                      setMessageStatusFilter('all');
                    }}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors inline-block mt-2"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredMessages.map((msg) => {
                  const isUnread = msg.status === 'unread';
                  return (
                    <div
                      key={msg.id}
                      className={`bg-white rounded-2xl border transition-all p-5 space-y-4 shadow-2xs ${
                        isUnread
                          ? 'border-[#8B1D24]/40 bg-[#FDFBFB]'
                          : 'border-stone-200 hover:border-stone-300'
                      }`}
                    >
                      {/* Top Bar: Sender Name, Date, Status Pill */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                        <div className="flex items-center space-x-2.5">
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                              isUnread ? 'bg-red-500 ring-4 ring-red-100 animate-pulse' : 'bg-stone-300'
                            }`}
                          />
                          <div>
                            <h3 className="font-bold text-sm text-stone-900 flex items-center space-x-2">
                              <span>{msg.name}</span>
                              {msg.category && (
                                <span className="text-[10px] uppercase font-mono font-bold bg-stone-100 text-stone-700 px-2 py-0.5 rounded">
                                  {msg.category.replace('_', ' ')}
                                </span>
                              )}
                            </h3>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-stone-500">
                          <span className="flex items-center space-x-1 text-[11px]">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>
                              {new Date(msg.createdAt).toLocaleDateString('en-IN', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                              })}{' '}
                              at{' '}
                              {new Date(msg.createdAt).toLocaleTimeString('en-IN', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                          </span>

                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              isUnread
                                ? 'bg-red-100 text-red-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {isUnread ? 'Unread' : 'Read'}
                          </span>
                        </div>
                      </div>

                      {/* Contact Credentials Strip */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-100">
                        {msg.phone && (
                          <a
                            href={`tel:${msg.phone}`}
                            className="flex items-center space-x-1.5 text-stone-800 hover:text-[#8B1D24] font-semibold"
                          >
                            <Phone className="w-3.5 h-3.5 text-[#8B1D24]" />
                            <span>{msg.phone}</span>
                          </a>
                        )}

                        {msg.email && (
                          <>
                            <span className="text-stone-300">•</span>
                            <a
                              href={`mailto:${msg.email}?subject=Response from SBBM Social Foundation regarding your inquiry`}
                              className="flex items-center space-x-1.5 text-stone-800 hover:text-[#8B1D24] font-semibold underline"
                            >
                              <Mail className="w-3.5 h-3.5 text-[#8B1D24]" />
                              <span>{msg.email}</span>
                            </a>
                          </>
                        )}
                      </div>

                      {/* Complete Message Content */}
                      <div className="text-xs sm:text-sm text-stone-800 leading-relaxed bg-white p-4 rounded-xl border border-stone-200 whitespace-pre-wrap">
                        {msg.message}
                      </div>

                      {/* Action Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex items-center space-x-2 text-xs">
                          {msg.email && (
                            <a
                              href={`mailto:${msg.email}?subject=Response from SBBM Social Foundation`}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#8B1D24] hover:bg-[#6E1419] text-white font-semibold rounded-lg transition-colors shadow-2xs"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply via Email</span>
                            </a>
                          )}
                          {msg.phone && (
                            <a
                              href={`tel:${msg.phone}`}
                              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold rounded-lg border border-stone-200 transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-[#8B1D24]" />
                              <span>Call Sender</span>
                            </a>
                          )}
                        </div>

                        <div className="flex items-center space-x-2 text-xs">
                          <button
                            onClick={(e) => handleToggleMessageStatus(msg, e)}
                            className={`px-3 py-1.5 font-semibold rounded-lg border transition-colors inline-flex items-center space-x-1.5 ${
                              isUnread
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
                            }`}
                          >
                            <CheckSquare className="w-3.5 h-3.5" />
                            <span>{isUnread ? 'Mark as Read' : 'Mark as Unread'}</span>
                          </button>

                          <button
                            onClick={() => setMessageToDelete(msg)}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-semibold rounded-lg border border-red-200 transition-colors inline-flex items-center space-x-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =======================================================================
            SECTION 2: WEBSITE GALLERY MANAGEMENT
           ======================================================================= */}
        {activeSection === 'gallery' && (
          <div className="space-y-5">
            {/* Gallery Control Bar */}
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-3">
                <div>
                  <h2 className="text-lg font-bold text-stone-900">
                    Website Gallery Management
                  </h2>
                  <p className="text-xs text-stone-500">
                    Manage the photographs displayed in the official public website Gallery. Newly published photos appear automatically.
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 bg-stone-100 text-stone-700 font-semibold text-xs rounded-lg">
                    Total: {galleryAssets.length}
                  </span>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 font-semibold text-xs rounded-lg">
                    Live: {publishedCount}
                  </span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-800 font-semibold text-xs rounded-lg">
                    Drafts: {draftCount}
                  </span>

                  <button
                    onClick={() => {
                      setShowUploadModal(true);
                      setUploadPreview(null);
                      setUploadFile(null);
                      setNewPhotoTitle('');
                      setNewPhotoCaption('');
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#8B1D24] hover:bg-[#6E1419] text-white font-semibold text-xs rounded-xl transition-all shadow-sm shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Upload New Photograph</span>
                  </button>
                </div>
              </div>

              {/* Search & Category Filter Bar */}
              <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={gallerySearch}
                    onChange={(e) => setGallerySearch(e.target.value)}
                    placeholder="Search photographs by title or description..."
                    className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#8B1D24] focus:bg-white"
                  />
                  {gallerySearch && (
                    <button
                      onClick={() => setGallerySearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Category Dropdown */}
                <select
                  value={galleryCategoryFilter}
                  onChange={(e) => setGalleryCategoryFilter(e.target.value)}
                  className="bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs font-semibold text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#8B1D24]"
                >
                  <option value="all">All Categories</option>
                  <option value="ashram">Ashram Campus</option>
                  <option value="activities">Activities & Annadaan</option>
                  <option value="healthcare">Healthcare & Camps</option>
                  <option value="elders">Resident Elders</option>
                  <option value="governance">Governance</option>
                  <option value="events">Events & Festivals</option>
                </select>

                {/* Status Filter */}
                <div className="flex items-center space-x-1.5 bg-stone-100 p-1 rounded-xl text-xs">
                  <button
                    onClick={() => setGalleryStatusFilter('all')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      galleryStatusFilter === 'all'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    All ({galleryAssets.length})
                  </button>
                  <button
                    onClick={() => setGalleryStatusFilter('published')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      galleryStatusFilter === 'published'
                        ? 'bg-white text-emerald-800 shadow-2xs font-bold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Published ({publishedCount})
                  </button>
                  <button
                    onClick={() => setGalleryStatusFilter('draft')}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                      galleryStatusFilter === 'draft'
                        ? 'bg-white text-amber-800 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Unpublished ({draftCount})
                  </button>
                </div>
              </div>
            </div>

            {/* Gallery Cards Grid */}
            {filteredGallery.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <div className="w-14 h-14 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-400">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-base text-stone-800">No photographs found</h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                  {gallerySearch || galleryCategoryFilter !== 'all' || galleryStatusFilter !== 'all'
                    ? 'No photographs match your current filter selection.'
                    : 'Your website gallery has no photographs stored. Click "Upload New Photograph" to add one.'}
                </p>
                <button
                  onClick={() => {
                    setShowUploadModal(true);
                    setUploadPreview(null);
                    setUploadFile(null);
                  }}
                  className="px-4 py-2 bg-[#8B1D24] text-white text-xs font-semibold rounded-lg shadow-sm hover:bg-[#6E1419] transition-colors inline-block mt-2"
                >
                  Upload Photograph Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredGallery.map((asset) => {
                  const isPublished = asset.status === 'published';
                  return (
                    <div
                      key={asset.id}
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-card transition-all flex flex-col justify-between group"
                    >
                      {/* Image Preview & Status Badges */}
                      <div className="relative h-48 bg-stone-100 overflow-hidden">
                        <img
                          src={asset.mediaUrl}
                          alt={asset.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md shadow-xs ${
                              isPublished
                                ? 'bg-emerald-600/90 text-white'
                                : 'bg-amber-600/90 text-white'
                            }`}
                          >
                            {isPublished ? 'Live on Website' : 'Unpublished (Draft)'}
                          </span>

                          {asset.category && (
                            <span className="px-2 py-0.5 bg-black/70 text-white rounded text-[10px] uppercase font-mono backdrop-blur-xs">
                              {asset.category}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Photograph Information */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div className="space-y-1">
                          <h4 className="font-bold text-sm text-stone-900 line-clamp-1" title={asset.title}>
                            {asset.title}
                          </h4>
                          {asset.caption ? (
                            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed" title={asset.caption}>
                              {asset.caption}
                            </p>
                          ) : (
                            <p className="text-xs text-stone-400 italic">No description provided.</p>
                          )}
                        </div>

                        <div className="text-[10px] text-stone-400 pt-2 border-t border-stone-100 flex items-center justify-between">
                          <span>
                            Added:{' '}
                            {new Date(asset.createdAt).toLocaleDateString('en-IN', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          <span className="font-mono text-[9px] text-stone-300">{asset.id}</span>
                        </div>
                      </div>

                      {/* Action Footer */}
                      <div className="px-4 py-3 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                        {/* Publish / Unpublish Toggle */}
                        <button
                          onClick={() => handleTogglePublishPhoto(asset)}
                          className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 transition-colors border ${
                            isPublished
                              ? 'bg-white hover:bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-emerald-600 hover:bg-emerald-700 text-white border-transparent shadow-2xs'
                          }`}
                          title={isPublished ? 'Hide from public website' : 'Make live on public website'}
                        >
                          {isPublished ? (
                            <>
                              <EyeOff className="w-3.5 h-3.5" />
                              <span>Unpublish</span>
                            </>
                          ) : (
                            <>
                              <Eye className="w-3.5 h-3.5" />
                              <span>Publish</span>
                            </>
                          )}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditPhoto(asset)}
                          className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-200/60 rounded-lg border border-stone-200 transition-colors"
                          title="Edit photograph details or replace image"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setPhotoToDelete(asset)}
                          className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                          title="Permanently delete photograph"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* =========================================================================
          MODAL: UPLOAD NEW PHOTOGRAPH
         ========================================================================= */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#8B1D24]/10 text-[#8B1D24] flex items-center justify-center">
                  <Upload className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Upload Photograph to Gallery</h3>
                  <p className="text-[11px] text-stone-500">Add an authentic photograph to the public website</p>
                </div>
              </div>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleUploadPhoto} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* File Dropzone */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  Select Image File from Computer *
                </label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleSelectFile}
                  className="hidden"
                />

                {uploadPreview ? (
                  <div className="space-y-2">
                    <div className="h-44 rounded-xl overflow-hidden border border-stone-200 relative bg-stone-100">
                      <img src={uploadPreview} alt="Preview" className="w-full h-full object-contain" />
                      <button
                        type="button"
                        onClick={() => {
                          setUploadPreview(null);
                          setUploadFile(null);
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors"
                        title="Remove selection"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {uploadFile && (
                      <p className="text-[11px] text-stone-500 text-center">
                        {uploadFile.filename} ({uploadFile.sizeKB} KB)
                      </p>
                    )}
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-stone-300 hover:border-[#8B1D24] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-stone-50 hover:bg-stone-100/50 space-y-2"
                  >
                    <div className="w-10 h-10 bg-white rounded-full shadow-xs flex items-center justify-center mx-auto text-[#8B1D24]">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-semibold text-stone-800">Click to browse your computer</span>
                      <p className="text-[11px] text-stone-500">Supports JPG, PNG, or WebP up to 15MB</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Photograph Title *
                </label>
                <input
                  type="text"
                  required
                  value={newPhotoTitle}
                  onChange={(e) => setNewPhotoTitle(e.target.value)}
                  placeholder="e.g. Free Eye Surgery Medical Camp"
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8B1D24] focus:outline-none focus:bg-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={newPhotoCategory}
                  onChange={(e) => setNewPhotoCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8B1D24] focus:outline-none focus:bg-white"
                >
                  <option value="ashram">Ashram Facility & Campus</option>
                  <option value="elders">Resident Elders ("Aai-Baba")</option>
                  <option value="healthcare">Health Camps & Naturopathy</option>
                  <option value="events">Camps & Community Seva</option>
                  <option value="leadership">Founders & Leadership</option>
                  <option value="general">General Foundation</option>
                </select>
              </div>

              {/* Description / Caption */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Description / Caption (Optional)
                </label>
                <textarea
                  rows={2}
                  value={newPhotoCaption}
                  onChange={(e) => setNewPhotoCaption(e.target.value)}
                  placeholder="Provide context about what this photo shows..."
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8B1D24] focus:outline-none focus:bg-white resize-none"
                />
              </div>

              {/* Publication Status Toggle */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800 block text-xs">Publish Immediately?</span>
                  <span className="text-[11px] text-stone-500">
                    {newPhotoStatus === 'published'
                      ? 'Will appear in public website gallery right away'
                      : 'Saved as draft in admin dashboard only'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNewPhotoStatus(prev => (prev === 'published' ? 'draft' : 'published'))
                  }
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    newPhotoStatus === 'published'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {newPhotoStatus === 'published' ? 'Published' : 'Draft Only'}
                </button>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPhoto || !uploadPreview}
                  className="px-5 py-2.5 bg-[#8B1D24] hover:bg-[#6E1419] text-white font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {isSubmittingPhoto ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Photograph...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save & Publish Photograph</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: EDIT EXISTING PHOTOGRAPH
         ========================================================================= */}
      {editingPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-stone-900">Edit Photograph Details</h3>
                  <p className="text-[11px] text-stone-500">Update title, caption, or replace image</p>
                </div>
              </div>
              <button
                onClick={() => setEditingPhoto(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveEditPhoto} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Image Preview & Replacement */}
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  Current Photograph
                </label>
                <div className="h-44 rounded-xl overflow-hidden border border-stone-200 relative bg-stone-100">
                  <img
                    src={editReplacePreview || editingPhoto.mediaUrl}
                    alt={editingPhoto.title}
                    className="w-full h-full object-contain"
                  />
                  <div className="absolute bottom-2 right-2">
                    <input
                      ref={editFileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleSelectReplaceFile}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => editFileInputRef.current?.click()}
                      className="px-3 py-1.5 bg-black/80 hover:bg-black text-white rounded-lg text-[11px] font-semibold backdrop-blur-xs flex items-center space-x-1 shadow"
                    >
                      <Upload className="w-3 h-3" />
                      <span>Replace Image</span>
                    </button>
                  </div>
                </div>
                {editReplaceFile && (
                  <p className="text-[11px] text-emerald-700 font-medium pt-1">
                    ✓ New image selected: {editReplaceFile.filename}
                  </p>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Photograph Title *
                </label>
                <input
                  type="text"
                  required
                  value={editPhotoTitle}
                  onChange={(e) => setEditPhotoTitle(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8B1D24] focus:outline-none focus:bg-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Category Tag
                </label>
                <select
                  value={editPhotoCategory}
                  onChange={(e) => setEditPhotoCategory(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8B1D24] focus:outline-none focus:bg-white"
                >
                  <option value="ashram">Ashram Facility & Campus</option>
                  <option value="elders">Resident Elders ("Aai-Baba")</option>
                  <option value="healthcare">Health Camps & Naturopathy</option>
                  <option value="events">Camps & Community Seva</option>
                  <option value="leadership">Founders & Leadership</option>
                  <option value="general">General Foundation</option>
                </select>
              </div>

              {/* Description / Caption */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Description / Caption
                </label>
                <textarea
                  rows={2}
                  value={editPhotoCaption}
                  onChange={(e) => setEditPhotoCaption(e.target.value)}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#8B1D24] focus:outline-none focus:bg-white resize-none"
                />
              </div>

              {/* Publication Status */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800 block text-xs">Publication Status</span>
                  <span className="text-[11px] text-stone-500">
                    {editPhotoStatus === 'published'
                      ? 'Live on public website gallery'
                      : 'Hidden from public gallery (draft)'}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setEditPhotoStatus(prev => (prev === 'published' ? 'draft' : 'published'))
                  }
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                    editPhotoStatus === 'published'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-300 text-stone-700'
                  }`}
                >
                  {editPhotoStatus === 'published' ? 'Published' : 'Unpublished'}
                </button>
              </div>

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setEditingPhoto(null)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 font-semibold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingPhoto}
                  className="px-5 py-2.5 bg-[#8B1D24] hover:bg-[#6E1419] text-white font-semibold text-xs rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {isSubmittingPhoto ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIRMATION MODAL: DELETE MESSAGE
         ========================================================================= */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-xl p-6 space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-stone-900">Delete Inquiry?</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Are you sure you want to delete this message from{' '}
                <strong className="text-stone-800">{messageToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setMessageToDelete(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-800 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteMessage}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Yes, Delete Inquiry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CONFIRMATION MODAL: DELETE PHOTOGRAPH
         ========================================================================= */}
      {photoToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full border border-stone-200 shadow-xl p-6 space-y-4">
            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-base text-stone-900">Delete Photograph?</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Are you sure you want to permanently remove{' '}
                <strong className="text-stone-800">"{photoToDelete.title}"</strong> from the website gallery?
              </p>
            </div>
            <div className="flex items-center justify-end space-x-2 pt-2">
              <button
                onClick={() => setPhotoToDelete(null)}
                className="px-4 py-2 text-stone-600 hover:text-stone-800 font-semibold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePhoto}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors"
              >
                Yes, Delete Photograph
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
