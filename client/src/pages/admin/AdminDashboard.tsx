import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Users, Heart, Calendar, Image,
  MessageSquare, FileText, LogOut, CheckCircle2,
  AlertCircle, Plus, Trash2, Edit, Save, Clock, Search, X
} from 'lucide-react';
import { apiRequest, clearAuthToken } from '../../api';

interface AdminMetrics {
  totalRegisteredUsers: number;
  memberAccounts: number;
  pendingAdmissions: number;
  totalAdmissions: number;
  pendingMembership: number;
  unreadMessages: number;
  totalMessages: number;
  volunteerCount: number;
  pendingDonations: number;
  upcomingEvents: number;
  totalGalleryItems: number;
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'admissions' | 'membership' | 'volunteers' | 'donations' | 'messages' | 'events' | 'gallery' | 'members' | 'audit' | 'security'
  >('overview');
  const [isLoading, setIsLoading] = useState(true);

  // Data lists
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [membershipRequests, setMembershipRequests] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [members, setMembers] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Password rotation modal/form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState({ text: '', isError: false });

  // New Event Form State
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'Community Celebration',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 01:00 PM',
    venue: 'Vyenkatesh Ashram, Anjikar Bagh, Mahuli',
    coverImage: '/assets/images/ashram_building.jpg',
  });

  // New Gallery Form State
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: '',
    caption: '',
    type: 'photo',
    category: 'ashram',
    mediaUrl: '/assets/images/ashram_building.jpg',
  });

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  const checkAuthAndLoad = async () => {
    setIsLoading(true);
    try {
      const userRes = await apiRequest<{ success: boolean; user: any }>('/auth/me');
      if (!userRes.success || userRes.user.role !== 'admin') {
        clearAuthToken();
        navigate('/admin-login');
        return;
      }
      setCurrentUser(userRes.user);

      // Load Metrics
      const mRes = await apiRequest<{ success: boolean; data: AdminMetrics }>('/admin/metrics');
      if (mRes.success) setMetrics(mRes.data);

      // Load collections
      loadCollections();
    } catch (err) {
      clearAuthToken();
      navigate('/admin-login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCollections = async () => {
    try {
      const [adm, memReq, vol, don, msg, evts, gal, mems, logs] = await Promise.all([
        apiRequest<{ success: boolean; data: any[] }>('/admin/admissions'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/membership-requests'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/volunteers'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/donations'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/messages'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/events'),
        apiRequest<{ success: boolean; data: any[] }>('/public/gallery'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/members'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/audit-logs'),
      ]);

      if (adm.success) setAdmissions(adm.data);
      if (memReq.success) setMembershipRequests(memReq.data);
      if (vol.success) setVolunteers(vol.data);
      if (don.success) setDonations(don.data);
      if (msg.success) setMessages(msg.data);
      if (evts.success) setEvents(evts.data);
      if (gal.success) setGallery(gal.data);
      if (mems.success) setMembers(mems.data);
      if (logs.success) setAuditLogs(logs.data);
    } catch (err) {
      console.error('Error fetching admin data', err);
    }
  };

  const handleUpdateAdmission = async (id: string, status: string, notes: string) => {
    try {
      await apiRequest(`/admin/admissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status, notes }),
      });
      loadCollections();
    } catch (err: any) {
      alert('Error updating admission: ' + err.message);
    }
  };

  const handleUpdateMembershipReq = async (id: string, status: string) => {
    try {
      await apiRequest(`/admin/membership-requests/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      loadCollections();
    } catch (err: any) {
      alert('Error updating membership request: ' + err.message);
    }
  };

  const handleUpdateDonation = async (id: string, status: string) => {
    try {
      await apiRequest(`/admin/donations/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
      });
      loadCollections();
    } catch (err: any) {
      alert('Error updating donation: ' + err.message);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/events', {
        method: 'POST',
        body: JSON.stringify(newEvent),
      });
      setShowEventModal(false);
      loadCollections();
    } catch (err: any) {
      alert('Error creating event: ' + err.message);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await apiRequest(`/admin/events/${id}`, { method: 'DELETE' });
      loadCollections();
    } catch (err: any) {
      alert('Error deleting event: ' + err.message);
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/gallery', {
        method: 'POST',
        body: JSON.stringify(newGallery),
      });
      setShowGalleryModal(false);
      loadCollections();
    } catch (err: any) {
      alert('Error adding gallery item: ' + err.message);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Remove media asset from gallery?')) return;
    try {
      await apiRequest(`/admin/gallery/${id}`, { method: 'DELETE' });
      loadCollections();
    } catch (err: any) {
      alert('Error removing media: ' + err.message);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ text: '', isError: false });
    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.success) {
        setPassMsg({ text: 'Password successfully updated.', isError: false });
        setCurrentUser({ ...currentUser, mustChangePassword: false });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      setPassMsg({ text: err.message || 'Failed to update password.', isError: true });
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-foundation-forestDark flex items-center justify-center p-8 text-foundation-ivory text-xs">
        Authenticating administrator session...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foundation-ivory py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">

        {/* Dashboard Top Navigation & Status */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-foundation-forest text-foundation-gold flex items-center justify-center border-2 border-foundation-gold shadow-md">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-foundation-forest bg-foundation-forest/10 px-2.5 py-0.5 rounded-full">
                Super Administrator
              </span>
              <h1 className="text-2xl font-display font-bold text-foundation-charcoal">
                Foundation Management Portal
              </h1>
              <p className="text-xs text-stone-500">
                Logged in as <strong>{currentUser?.fullName}</strong> ({currentUser?.username})
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-foundation-borderMuted pb-4 text-xs font-bold">
          {[
            { id: 'overview', label: 'Dashboard Metrics' },
            { id: 'admissions', label: `Admissions (${metrics?.pendingAdmissions || 0} New)` },
            { id: 'membership', label: `Membership Requests (${metrics?.pendingMembership || 0})` },
            { id: 'volunteers', label: `Volunteers (${metrics?.volunteerCount || 0})` },
            { id: 'donations', label: `Donations (${metrics?.pendingDonations || 0})` },
            { id: 'messages', label: `Messages (${metrics?.unreadMessages || 0})` },
            { id: 'events', label: 'Events Manager' },
            { id: 'gallery', label: 'Gallery Manager' },
            { id: 'members', label: 'Accounts' },
            { id: 'audit', label: 'Audit Logs' },
            { id: 'security', label: 'Account Security' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-full transition-all ${
                activeTab === tab.id
                  ? 'bg-foundation-forest text-foundation-ivory shadow'
                  : 'bg-white text-stone-700 border border-foundation-borderMuted hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview Metrics */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-center">
                <span className="text-2xl font-bold font-display text-foundation-forest">
                  {metrics?.totalRegisteredUsers || 0}
                </span>
                <p className="text-xs text-stone-500 mt-1 font-semibold">User Accounts</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-center">
                <span className="text-2xl font-bold font-display text-emerald-700">
                  {metrics?.pendingAdmissions || 0}
                </span>
                <p className="text-xs text-stone-500 mt-1 font-semibold">New Admissions</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-center">
                <span className="text-2xl font-bold font-display text-amber-600">
                  {metrics?.pendingMembership || 0}
                </span>
                <p className="text-xs text-stone-500 mt-1 font-semibold">Pending Members</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-center">
                <span className="text-2xl font-bold font-display text-blue-600">
                  {metrics?.volunteerCount || 0}
                </span>
                <p className="text-xs text-stone-500 mt-1 font-semibold">Volunteers</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-center">
                <span className="text-2xl font-bold font-display text-rose-600">
                  {metrics?.pendingDonations || 0}
                </span>
                <p className="text-xs text-stone-500 mt-1 font-semibold">Donation Inquiries</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-foundation-borderMuted shadow-soft-sm text-center">
                <span className="text-2xl font-bold font-display text-indigo-600">
                  {metrics?.unreadMessages || 0}
                </span>
                <p className="text-xs text-stone-500 mt-1 font-semibold">Unread Messages</p>
              </div>
            </div>

            {/* Quick Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-foundation-borderMuted shadow-soft space-y-3">
                <h3 className="font-display font-bold text-base text-foundation-charcoal">
                  Recent Admission Enquiries
                </h3>
                {admissions.slice(0, 3).map((adm: any) => (
                  <div key={adm.id} className="p-3 bg-foundation-warmGray rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foundation-charcoal">{adm.residentName} (Age: {adm.residentAge})</p>
                      <p className="text-[11px] text-stone-500">Applicant: {adm.applicantName} ({adm.applicantPhone})</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                      {adm.status}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-3xl p-6 border border-foundation-borderMuted shadow-soft space-y-3">
                <h3 className="font-display font-bold text-base text-foundation-charcoal">
                  Recent Contact Inquiries
                </h3>
                {messages.slice(0, 3).map((msg: any) => (
                  <div key={msg.id} className="p-3 bg-foundation-warmGray rounded-xl text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-foundation-charcoal">{msg.name}</p>
                      <p className="text-[11px] text-stone-500 truncate max-w-xs">{msg.message}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-200 text-stone-800">
                      {msg.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Admission Enquiries */}
        {activeTab === 'admissions' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              Admission Enquiries Management
            </h2>

            {admissions.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No admission records found.</p>
            ) : (
              <div className="space-y-4">
                {admissions.map((adm: any) => (
                  <div key={adm.id} className="p-5 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-foundation-borderMuted pb-2">
                      <div>
                        <span className="font-bold text-sm text-foundation-forest">
                          Resident: {adm.residentName} (Age: {adm.residentAge}, {adm.residentGender})
                        </span>
                        <p className="text-[11px] text-stone-500">
                          Ref: {adm.id} • Submitted: {new Date(adm.createdAt).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-stone-600">Status:</span>
                        <select
                          value={adm.status}
                          onChange={(e) => handleUpdateAdmission(adm.id, e.target.value, adm.notes || '')}
                          className="bg-white border rounded-lg px-2.5 py-1 text-xs font-bold"
                        >
                          <option value="new">New</option>
                          <option value="reviewing">Reviewing</option>
                          <option value="contacted">Contacted</option>
                          <option value="verified">Verified</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <p><strong>Applicant:</strong> {adm.applicantName} ({adm.relationWithResident})</p>
                        <p><strong>Phone:</strong> <a href={`tel:${adm.applicantPhone}`} className="text-foundation-forest underline font-bold">{adm.applicantPhone}</a></p>
                        <p><strong>Email:</strong> {adm.applicantEmail || 'Not provided'}</p>
                      </div>
                      <div>
                        <p><strong>Mobility:</strong> {adm.mobilityStatus}</p>
                        <p><strong>Medical Notes:</strong> {adm.medicalNotes || 'None'}</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-foundation-borderMuted flex items-center space-x-2">
                      <span className="font-bold text-stone-600">Admin Internal Notes:</span>
                      <input
                        type="text"
                        defaultValue={adm.notes || ''}
                        onBlur={(e) => handleUpdateAdmission(adm.id, adm.status, e.target.value)}
                        placeholder="Add internal notes (e.g. called family on 16 Oct, room availability confirmed)..."
                        className="flex-1 bg-white border border-foundation-borderMuted rounded-lg px-3 py-1 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Membership Requests */}
        {activeTab === 'membership' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              Society Membership Applications
            </h2>

            {membershipRequests.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No pending membership requests.</p>
            ) : (
              <div className="space-y-4">
                {membershipRequests.map((req: any) => (
                  <div key={req.id} className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <p className="font-bold text-sm text-foundation-forest">{req.fullName}</p>
                      <p className="text-stone-600">Phone: {req.mobile} • Email: {req.email}</p>
                      <p className="text-stone-500">Address: {req.address} • Occupation: {req.occupation}</p>
                      <p className="italic text-stone-600">“{req.reason}”</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="font-semibold">Status: {req.status}</span>
                      {req.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateMembershipReq(req.id, 'approved')}
                            className="px-3 py-1 bg-emerald-700 text-white rounded-lg text-xs font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdateMembershipReq(req.id, 'rejected')}
                            className="px-3 py-1 bg-red-700 text-white rounded-lg text-xs font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Volunteers */}
        {activeTab === 'volunteers' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              Volunteer Seva Applications ({volunteers.length})
            </h2>

            <div className="space-y-3">
              {volunteers.map((vol: any) => (
                <div key={vol.id} className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foundation-forest">{vol.fullName}</span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold uppercase text-[10px]">
                      {vol.status}
                    </span>
                  </div>
                  <p><strong>Phone:</strong> {vol.phone} • <strong>Email:</strong> {vol.email}</p>
                  <p><strong>Availability:</strong> {vol.availability}</p>
                  <p><strong>Interests:</strong> {vol.areasOfInterest?.join(', ')}</p>
                  {vol.message && <p className="italic text-stone-500">Message: {vol.message}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Donations */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              Donations & Support Records ({donations.length})
            </h2>

            <div className="space-y-3">
              {donations.map((don: any) => (
                <div key={don.id} className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-sm text-foundation-forest">{don.donorName}</p>
                    <p>Phone: {don.phone} • Email: {don.email || 'N/A'}</p>
                    <p><strong>Items / Contribution:</strong> {don.amountOrItems} ({don.donationType})</p>
                    {don.panNumber && <p className="text-[11px] text-stone-500">PAN: {don.panNumber}</p>}
                  </div>

                  <div className="flex items-center space-x-2">
                    <select
                      value={don.status}
                      onChange={(e) => handleUpdateDonation(don.id, e.target.value)}
                      className="bg-white border rounded-lg px-2.5 py-1 text-xs font-bold"
                    >
                      <option value="pending">Pending</option>
                      <option value="acknowledged">Acknowledged</option>
                      <option value="receipt_issued">Receipt Issued</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Messages */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              Contact Messages ({messages.length})
            </h2>

            <div className="space-y-3">
              {messages.map((msg: any) => (
                <div key={msg.id} className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foundation-forest">{msg.name} ({msg.category})</span>
                    <span className="text-[10px] text-stone-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>Phone: {msg.phone} • Email: {msg.email}</p>
                  <p className="p-2 bg-white rounded-lg border text-stone-700">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 7: Events Manager */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-display font-bold text-foundation-charcoal">
                Events & Health Camps Manager
              </h2>
              <button
                onClick={() => setShowEventModal(true)}
                className="px-4 py-2 bg-foundation-forest text-foundation-ivory text-xs font-bold rounded-full flex items-center space-x-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </button>
            </div>

            <div className="space-y-3">
              {events.map((evt: any) => (
                <div key={evt.id} className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-sm text-foundation-forest">{evt.title}</p>
                    <p className="text-stone-500">Date: {evt.date} • Time: {evt.time} • Venue: {evt.venue}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete Event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create Event Modal */}
            {showEventModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <form
                  onSubmit={handleCreateEvent}
                  className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl"
                >
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-sm text-foundation-charcoal">Create Event</h3>
                    <button type="button" onClick={() => setShowEventModal(false)}><X className="w-5 h-5" /></button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="w-full bg-stone-100 rounded-lg p-2 text-xs border"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                      className="w-full bg-stone-100 rounded-lg p-2 text-xs border"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold mb-1">Date</label>
                      <input
                        type="date"
                        required
                        value={newEvent.date}
                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                        className="w-full bg-stone-100 rounded-lg p-2 text-xs border"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1">Time</label>
                      <input
                        type="text"
                        value={newEvent.time}
                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                        className="w-full bg-stone-100 rounded-lg p-2 text-xs border"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold mb-1">Venue</label>
                    <input
                      type="text"
                      value={newEvent.venue}
                      onChange={(e) => setNewEvent({ ...newEvent, venue: e.target.value })}
                      className="w-full bg-stone-100 rounded-lg p-2 text-xs border"
                    />
                  </div>

                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowEventModal(false)}
                      className="px-4 py-2 bg-stone-200 text-xs font-bold rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-foundation-forest text-white text-xs font-bold rounded-lg"
                    >
                      Publish Event
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 8: Gallery Manager */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-display font-bold text-foundation-charcoal">
                Gallery Media Manager
              </h2>
              <button
                onClick={() => setShowGalleryModal(true)}
                className="px-4 py-2 bg-foundation-forest text-foundation-ivory text-xs font-bold rounded-full flex items-center space-x-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add Media</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {gallery.map((item: any) => (
                <div key={item.id} className="relative rounded-xl overflow-hidden border group bg-stone-100">
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-36 object-cover" />
                  <div className="p-2 text-xs">
                    <p className="font-bold truncate">{item.title}</p>
                    <span className="text-[10px] text-stone-500 uppercase">{item.category}</span>
                  </div>
                  <button
                    onClick={() => handleDeleteGallery(item.id)}
                    className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full opacity-80 hover:opacity-100"
                    title="Delete Media"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {showGalleryModal && (
              <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <form onSubmit={handleCreateGallery} className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
                  <div className="flex items-center justify-between border-b pb-2">
                    <h3 className="font-bold text-sm">Add Gallery Media</h3>
                    <button type="button" onClick={() => setShowGalleryModal(false)}><X className="w-5 h-5" /></button>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Title</label>
                    <input
                      type="text"
                      required
                      value={newGallery.title}
                      onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                      className="w-full bg-stone-100 rounded-lg p-2 text-xs border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Media URL</label>
                    <input
                      type="text"
                      required
                      value={newGallery.mediaUrl}
                      onChange={(e) => setNewGallery({ ...newGallery, mediaUrl: e.target.value })}
                      className="w-full bg-stone-100 rounded-lg p-2 text-xs border"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1">Category</label>
                    <select
                      value={newGallery.category}
                      onChange={(e) => setNewGallery({ ...newGallery, category: e.target.value })}
                      className="w-full bg-stone-100 rounded-lg p-2 text-xs border"
                    >
                      <option value="ashram">Ashram & Architecture</option>
                      <option value="goseva">Go-Seva Kendra</option>
                      <option value="naturopathy">Naturopathy & Yoga</option>
                      <option value="events">Events & Festivals</option>
                    </select>
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button type="button" onClick={() => setShowGalleryModal(false)} className="px-4 py-2 bg-stone-200 text-xs font-bold rounded-lg">Cancel</button>
                    <button type="submit" className="px-4 py-2 bg-foundation-forest text-white text-xs font-bold rounded-lg">Add to Gallery</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 9: Registered Accounts */}
        {activeTab === 'members' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              Registered Website Accounts ({members.length})
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b bg-stone-50 text-stone-600">
                    <th className="p-3">Full Name</th>
                    <th className="p-3">Member ID</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Email / Mobile</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((m: any) => (
                    <tr key={m.id} className="border-b hover:bg-stone-50">
                      <td className="p-3 font-bold text-foundation-forest">{m.fullName}</td>
                      <td className="p-3">{m.memberId}</td>
                      <td className="p-3 capitalize font-semibold">{m.role}</td>
                      <td className="p-3">{m.email} <br /><span className="text-stone-400">{m.mobile}</span></td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 10: Audit Logs */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              Immutable System & Security Audit Logs
            </h2>

            <div className="space-y-2 max-h-[500px] overflow-y-auto">
              {auditLogs.map((log: any) => (
                <div key={log.id} className="p-3 bg-foundation-warmGray rounded-xl text-xs flex items-center justify-between border">
                  <div>
                    <span className="font-bold text-foundation-forest">[{log.action}]</span>{' '}
                    <span className="text-stone-700">{log.details}</span>
                    <p className="text-[10px] text-stone-400">Actor: {log.actorName} ({log.actorId})</p>
                  </div>
                  <span className="text-[10px] text-stone-400 whitespace-nowrap ml-4">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 11: Security & Password Rotation */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-5 max-w-md">
            <div className="space-y-1 border-b pb-3">
              <h2 className="text-lg font-display font-bold text-foundation-charcoal">
                Administrator Password Rotation
              </h2>
              <p className="text-xs text-stone-500">
                Ensure superadmin credentials are rotated away from initial defaults.
              </p>
            </div>

            {passMsg.text && (
              <div className={`p-3 text-xs rounded-xl border ${passMsg.isError ? 'bg-red-50 text-red-700 border-red-200' : 'bg-emerald-50 text-emerald-800 border-emerald-200'}`}>
                {passMsg.text}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Current Password *</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Current password"
                className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">New Confidential Password *</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 8 characters)"
                className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-foundation-forest focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory text-xs font-bold rounded-full shadow transition-all"
            >
              Rotate Administrator Password
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
