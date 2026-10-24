import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck, Users, Heart, Calendar, Image,
  MessageSquare, FileText, LogOut, CheckCircle2,
  AlertCircle, Plus, Trash2, Edit, Save, Clock, Search, X,
  UserCheck, Award, HeartHandshake, Briefcase, CheckSquare,
  AlertTriangle, Filter, ChevronRight, Eye, Send, Check, ArrowRight,
  Shield, RefreshCw
} from 'lucide-react';
import { apiRequest, clearAuthToken } from '../../api';
import { PasswordField } from '../../components/ui/PasswordField';

interface PortalMetricsData {
  sevaMembers: { total: number; pending: number; approved: number; rejected: number };
  societyMembers: { total: number; pending: number; approved: number; rejected: number };
  volunteers: { total: number; pending: number; approved: number; rejected: number };
  projects: { total: number; active: number; completed: number; onHold: number };
  tasks: { total: number; active: number; submitted: number; completed: number; overdue: number };
}

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Tab State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'seva_members' | 'membership' | 'volunteers' | 'projects_tasks' |
    'admissions' | 'donations' | 'messages' | 'events' | 'gallery' | 'audit' | 'security'
  >('overview');

  // Metrics Data
  const [portalMetrics, setPortalMetrics] = useState<PortalMetricsData | null>(null);
  const [legacyMetrics, setLegacyMetrics] = useState<any>(null);

  // Collections Data
  const [sevaMembers, setSevaMembers] = useState<any[]>([]);
  const [societyMembers, setSocietyMembers] = useState<any[]>([]);
  const [volunteersList, setVolunteersList] = useState<any[]>([]);
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [tasksList, setTasksList] = useState<any[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [donations, setDonations] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Action Dialog States
  const [selectedItemForStatus, setSelectedItemForStatus] = useState<{
    type: 'seva_member' | 'society_member' | 'volunteer';
    item: any;
  } | null>(null);
  const [newStatus, setNewStatus] = useState<string>('approved');
  const [rejectionReason, setRejectionReason] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');

  // Task Creation Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    category: 'seva_member' as 'seva_member' | 'member' | 'volunteer',
    assignedToId: '',
    assignedToName: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
    instructions: '',
  });

  // Task Review Modal State
  const [selectedTaskToReview, setSelectedTaskToReview] = useState<any>(null);
  const [reviewStatus, setReviewStatus] = useState<string>('completed');
  const [adminComments, setAdminComments] = useState<string>('');

  // Project Creation Modal State
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    objectives: '',
    leadMemberId: '',
    leadMemberName: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    deadline: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
    milestones: '',
  });

  // Seva Record Modal State
  const [showSevaRecordModal, setShowSevaRecordModal] = useState(false);
  const [newSevaRecord, setNewSevaRecord] = useState({
    memberId: '',
    title: 'Elder Care Seva & Dining Support',
    date: new Date().toISOString().split('T')[0],
    hoursSpent: 4,
    location: 'Vyenkatesh Ashram, Mahuli',
    receiptNumber: '',
    description: 'Assisted senior residents with meals and morning companion care.',
  });

  // Password Rotation Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passMsg, setPassMsg] = useState({ text: '', isError: false });

  // Event & Gallery Modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    category: 'Community Celebration',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM - 01:00 PM',
    venue: 'Vyenkatesh Ashram Hall, Mahuli',
    coverImage: '/assets/images/ashram_building.jpg',
  });

  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [newGallery, setNewGallery] = useState({
    title: '',
    caption: '',
    type: 'photo',
    category: 'ashram',
    mediaUrl: '/assets/images/ashram_building.jpg',
  });

  // Admission Review & Management State
  const [selectedAdmission, setSelectedAdmission] = useState<any>(null);
  const [admissionSearch, setAdmissionSearch] = useState('');
  const [admissionFilter, setAdmissionFilter] = useState<string>('all');
  const [admissionAdminNotes, setAdmissionAdminNotes] = useState('');
  const [admissionRejectionReason, setAdmissionRejectionReason] = useState('');
  const [admissionRequestedInfo, setAdmissionRequestedInfo] = useState('');
  const [isUpdatingAdmission, setIsUpdatingAdmission] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [admissionActionError, setAdmissionActionError] = useState('');
  const [admissionActionSuccess, setAdmissionActionSuccess] = useState('');

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

      await Promise.all([loadPortalMetrics(), loadLegacyMetrics(), loadAllCollections()]);
    } catch (err) {
      clearAuthToken();
      navigate('/admin-login');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPortalMetrics = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: PortalMetricsData }>('/portal/admin/metrics');
      if (res.success) setPortalMetrics(res.data);
    } catch (err) {
      console.error('Failed to load portal metrics', err);
    }
  };

  const loadLegacyMetrics = async () => {
    try {
      const res = await apiRequest<{ success: boolean; data: any }>('/admin/metrics');
      if (res.success) setLegacyMetrics(res.data);
    } catch (err) {
      console.error('Failed to load legacy metrics', err);
    }
  };

  const loadAllCollections = async () => {
    try {
      const [
        sm, soc, vol, prj, tsk, adm, don, msg, evts, gal, logs
      ] = await Promise.all([
        apiRequest<{ success: boolean; data: any[] }>('/portal/admin/seva-members'),
        apiRequest<{ success: boolean; data: any[] }>('/portal/admin/society-members'),
        apiRequest<{ success: boolean; data: any[] }>('/portal/admin/volunteers'),
        apiRequest<{ success: boolean; data: any[] }>('/portal/admin/projects'),
        apiRequest<{ success: boolean; data: any[] }>('/portal/admin/tasks'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/admissions'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/donations'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/messages'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/events'),
        apiRequest<{ success: boolean; data: any[] }>('/public/gallery'),
        apiRequest<{ success: boolean; data: any[] }>('/admin/audit-logs'),
      ]);

      if (sm.success) setSevaMembers(sm.data);
      if (soc.success) setSocietyMembers(soc.data);
      if (vol.success) setVolunteersList(vol.data);
      if (prj.success) setProjectsList(prj.data);
      if (tsk.success) setTasksList(tsk.data);
      if (adm.success) setAdmissions(adm.data);
      if (don.success) setDonations(don.data);
      if (msg.success) setMessages(msg.data);
      if (evts.success) setEvents(evts.data);
      if (gal.success) setGallery(gal.data);
      if (logs.success) setAuditLogs(logs.data);
    } catch (err) {
      console.error('Error fetching admin collections', err);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admin-login');
  };

  // Status Review Action Handlers
  const handleUpdateStatus = async () => {
    if (!selectedItemForStatus) return;
    const { type, item } = selectedItemForStatus;

    try {
      let endpoint = '';
      if (type === 'seva_member') endpoint = `/portal/admin/seva-members/${item.memberId || item.id}/status`;
      else if (type === 'society_member') endpoint = `/portal/admin/society-members/${item.membershipId || item.id}/status`;
      else if (type === 'volunteer') endpoint = `/portal/admin/volunteers/${item.volunteerId || item.id}/status`;

      await apiRequest(endpoint, {
        method: 'PUT',
        body: JSON.stringify({
          status: newStatus,
          rejectionReason: newStatus === 'rejected' ? rejectionReason : undefined,
          adminNotes,
        }),
      });

      setSelectedItemForStatus(null);
      setRejectionReason('');
      setAdminNotes('');
      await Promise.all([loadPortalMetrics(), loadAllCollections()]);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  // Admission Action Handlers
  const handleOpenAdmissionModal = (adm: any) => {
    setSelectedAdmission(adm);
    setAdmissionAdminNotes(adm.adminNotes || '');
    setAdmissionRejectionReason(adm.rejectionReason || '');
    setAdmissionRequestedInfo(adm.requestedInfoNotes || '');
    setAdmissionActionError('');
    setAdmissionActionSuccess('');
    setShowRejectConfirm(false);
  };

  const handleUpdateAdmissionStatus = async (enquiryId: string, actionStatus: string) => {
    if (actionStatus === 'rejected' && !admissionRejectionReason.trim()) {
      setAdmissionActionError('Please provide a mandatory rejection reason before rejecting an enquiry.');
      return;
    }

    setIsUpdatingAdmission(true);
    setAdmissionActionError('');
    setAdmissionActionSuccess('');

    try {
      const res = await apiRequest<{ success: boolean; message: string; data: any }>(
        `/admin/admissions/${enquiryId}`,
        {
          method: 'PUT',
          body: JSON.stringify({
            status: actionStatus,
            adminNotes: admissionAdminNotes.trim(),
            rejectionReason: admissionRejectionReason.trim(),
            requestedInfoNotes: admissionRequestedInfo.trim(),
          }),
        }
      );

      if (res.success) {
        setAdmissionActionSuccess(res.message || `Admission enquiry status updated to ${actionStatus.replace('_', ' ')}.`);
        setSelectedAdmission(res.data);
        setShowRejectConfirm(false);
        await Promise.all([loadPortalMetrics(), loadLegacyMetrics(), loadAllCollections()]);
      }
    } catch (err: any) {
      setAdmissionActionError(err.message || 'Failed to update admission status.');
    } finally {
      setIsUpdatingAdmission(false);
    }
  };

  const handleAdminResetAdmissionPassword = async (enquiry: any) => {
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(
        `/portal/admin/users/${enquiry.registrationId || enquiry.id}/reset-password`,
        { method: 'POST' }
      );
      if (res.success) {
        alert(res.message);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to reset admission applicant password.');
    }
  };

  // Task Creation Handler
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title || !newTask.assignedToId || !newTask.deadline) {
      alert('Please fill in title, assigned member, and deadline.');
      return;
    }

    try {
      await apiRequest('/portal/admin/tasks', {
        method: 'POST',
        body: JSON.stringify(newTask),
      });

      setShowTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        category: 'seva_member',
        assignedToId: '',
        assignedToName: '',
        priority: 'medium',
        deadline: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        instructions: '',
      });
      await Promise.all([loadPortalMetrics(), loadAllCollections()]);
    } catch (err: any) {
      alert('Failed to create task: ' + err.message);
    }
  };

  // Task Review Handler
  const handleReviewTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskToReview) return;

    try {
      await apiRequest(`/portal/admin/tasks/${selectedTaskToReview.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: reviewStatus,
          adminComments,
        }),
      });

      setSelectedTaskToReview(null);
      setAdminComments('');
      await Promise.all([loadPortalMetrics(), loadAllCollections()]);
    } catch (err: any) {
      alert('Failed to review task: ' + err.message);
    }
  };

  // Project Creation Handler
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.deadline) {
      alert('Title and deadline are required.');
      return;
    }

    try {
      const objectivesList = newProject.objectives
        .split('\n')
        .map(o => o.trim())
        .filter(Boolean);

      const milestonesList = newProject.milestones
        .split('\n')
        .map((m, i) => ({
          id: `m_${Date.now()}_${i}`,
          title: m.trim(),
          completed: false,
        }))
        .filter(m => m.title);

      await apiRequest('/portal/admin/projects', {
        method: 'POST',
        body: JSON.stringify({
          title: newProject.title,
          description: newProject.description,
          objectives: objectivesList,
          leadMemberId: newProject.leadMemberId,
          leadMemberName: newProject.leadMemberName,
          priority: newProject.priority,
          deadline: newProject.deadline,
          milestones: milestonesList,
        }),
      });

      setShowProjectModal(false);
      setNewProject({
        title: '',
        description: '',
        objectives: '',
        leadMemberId: '',
        leadMemberName: '',
        priority: 'medium',
        deadline: new Date(Date.now() + 86400000 * 30).toISOString().split('T')[0],
        milestones: '',
      });
      await Promise.all([loadPortalMetrics(), loadAllCollections()]);
    } catch (err: any) {
      alert('Failed to create project: ' + err.message);
    }
  };

  // Seva Record Creation Handler
  const handleIssueSevaRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/portal/admin/seva-records', {
        method: 'POST',
        body: JSON.stringify(newSevaRecord),
      });

      setShowSevaRecordModal(false);
      alert('Official Seva record issued successfully!');
    } catch (err: any) {
      alert('Failed to issue record: ' + err.message);
    }
  };

  // Admin Reset User Password Handler
  const handleResetUserPassword = async (userId: string, userName: string) => {
    if (!window.confirm(`Reset password for ${userName} (${userId})? This will restore their temporary credential format and require them to set a new password on their next login.`)) {
      return;
    }
    try {
      const res = await apiRequest<{ success: boolean; message: string }>(`/portal/admin/users/${userId}/reset-password`, {
        method: 'POST',
      });
      alert(res.message);
      await loadAllCollections();
    } catch (err: any) {
      alert('Failed to reset password: ' + err.message);
    }
  };

  // Password Rotation Handler
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg({ text: '', isError: false });

    if (newPassword.length < 8) {
      setPassMsg({ text: 'New password must be at least 8 characters long', isError: true });
      return;
    }

    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.success) {
        setPassMsg({ text: res.message, isError: false });
        setCurrentPassword('');
        setNewPassword('');
      }
    } catch (err: any) {
      setPassMsg({ text: err.message || 'Failed to update password', isError: true });
    }
  };

  // Event & Gallery Handlers
  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/events', { method: 'POST', body: JSON.stringify(newEvent) });
      setShowEventModal(false);
      loadAllCollections();
    } catch (err: any) {
      alert('Error creating event: ' + err.message);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm('Delete event?')) return;
    try {
      await apiRequest(`/admin/events/${id}`, { method: 'DELETE' });
      loadAllCollections();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleCreateGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest('/admin/gallery', { method: 'POST', body: JSON.stringify(newGallery) });
      setShowGalleryModal(false);
      loadAllCollections();
    } catch (err: any) {
      alert('Error creating gallery item: ' + err.message);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Delete gallery item?')) return;
    try {
      await apiRequest(`/admin/gallery/${id}`, { method: 'DELETE' });
      loadAllCollections();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-foundation-forestDark flex items-center justify-center p-8 text-foundation-ivory text-xs">
        Authenticating administrator session...
      </div>
    );
  }

  // Filtered Lists
  const filteredSevaMembers = sevaMembers.filter(sm => {
    const matchesSearch = sm.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sm.memberId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sm.mobile.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || sm.applicationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSocietyMembers = societyMembers.filter(m => {
    const matchesSearch = m.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.membershipId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.mobile.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || m.applicationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredVolunteers = volunteersList.filter(v => {
    const matchesSearch = v.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.volunteerId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.mobile.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || v.applicationStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTasks = tasksList.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assignedToName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-foundation-ivory py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        {/* Dashboard Top Header */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-foundation-forest text-foundation-gold flex items-center justify-center border-2 border-foundation-gold shadow-md shrink-0">
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

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Admin Logout</span>
            </button>
          </div>
        </div>

        {/* Dashboard Tabs Bar */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Main Overview & Live Metrics' },
            { id: 'seva_members', label: `Seva Members (${portalMetrics?.sevaMembers.pending || 0} Pending)` },
            { id: 'membership', label: `Society Membership (${portalMetrics?.societyMembers.pending || 0} Pending)` },
            { id: 'volunteers', label: `Volunteers (${portalMetrics?.volunteers.pending || 0} Pending)` },
            { id: 'projects_tasks', label: `Projects & Tasks (${portalMetrics?.tasks.submitted || 0} To Review)` },
            { id: 'admissions', label: `Admissions (${legacyMetrics?.pendingAdmissions || 0})` },
            { id: 'donations', label: `Donations (${legacyMetrics?.pendingDonations || 0})` },
            { id: 'messages', label: `Messages (${legacyMetrics?.unreadMessages || 0})` },
            { id: 'events', label: 'Events Manager' },
            { id: 'gallery', label: 'Gallery' },
            { id: 'audit', label: 'Audit Logs' },
            { id: 'security', label: 'Account Security' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-foundation-forest text-foundation-ivory shadow'
                  : 'bg-white text-stone-700 border border-foundation-borderMuted hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =========================================================================
            TAB 1: MAIN OVERVIEW WITH REAL DATABASE METRICS
           ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 12 Required Live Metric Summary Cards */}
            <div>
              <h2 className="text-xs uppercase font-bold tracking-widest text-stone-500 mb-3">
                Live Community & Governance Metrics (Database Grounded)
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Seva Members */}
                <div className="bg-white p-5 rounded-3xl border border-foundation-borderMuted shadow-soft text-center">
                  <span className="text-3xl font-display font-bold text-foundation-forest">
                    {portalMetrics?.sevaMembers.total || 0}
                  </span>
                  <p className="text-xs font-bold text-stone-700 mt-1">Total Seva Members</p>
                  <p className="text-[10px] text-stone-400">Registered applicants</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-amber-300 shadow-soft text-center bg-amber-50/30">
                  <span className="text-3xl font-display font-bold text-amber-700">
                    {portalMetrics?.sevaMembers.pending || 0}
                  </span>
                  <p className="text-xs font-bold text-amber-900 mt-1">Pending Seva Applications</p>
                  <p className="text-[10px] text-amber-700">Awaiting your approval</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-foundation-borderMuted shadow-soft text-center">
                  <span className="text-3xl font-display font-bold text-emerald-700">
                    {portalMetrics?.sevaMembers.approved || 0}
                  </span>
                  <p className="text-xs font-bold text-stone-700 mt-1">Approved Seva Members</p>
                  <p className="text-[10px] text-stone-400">Active in ashram duties</p>
                </div>

                {/* Society Membership */}
                <div className="bg-white p-5 rounded-3xl border border-foundation-borderMuted shadow-soft text-center">
                  <span className="text-3xl font-display font-bold text-amber-800">
                    {portalMetrics?.societyMembers.total || 0}
                  </span>
                  <p className="text-xs font-bold text-stone-700 mt-1">Total Membership Apps</p>
                  <p className="text-[10px] text-stone-400">Society registration</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-amber-300 shadow-soft text-center bg-amber-50/30">
                  <span className="text-3xl font-display font-bold text-amber-700">
                    {portalMetrics?.societyMembers.pending || 0}
                  </span>
                  <p className="text-xs font-bold text-amber-900 mt-1">Pending Membership</p>
                  <p className="text-[10px] text-amber-700">Board review required</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-foundation-borderMuted shadow-soft text-center">
                  <span className="text-3xl font-display font-bold text-emerald-700">
                    {portalMetrics?.societyMembers.approved || 0}
                  </span>
                  <p className="text-xs font-bold text-stone-700 mt-1">Approved Members</p>
                  <p className="text-[10px] text-stone-400">Life / Patron / Active</p>
                </div>

                {/* Volunteers */}
                <div className="bg-white p-5 rounded-3xl border border-foundation-borderMuted shadow-soft text-center">
                  <span className="text-3xl font-display font-bold text-blue-700">
                    {portalMetrics?.volunteers.total || 0}
                  </span>
                  <p className="text-xs font-bold text-stone-700 mt-1">Total Volunteers</p>
                  <p className="text-[10px] text-stone-400">Enrolled supporters</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-blue-300 shadow-soft text-center bg-blue-50/30">
                  <span className="text-3xl font-display font-bold text-blue-800">
                    {portalMetrics?.volunteers.pending || 0}
                  </span>
                  <p className="text-xs font-bold text-blue-900 mt-1">Pending Volunteers</p>
                  <p className="text-[10px] text-blue-700">Awaiting seva allocation</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-foundation-borderMuted shadow-soft text-center">
                  <span className="text-3xl font-display font-bold text-emerald-700">
                    {portalMetrics?.volunteers.approved || 0}
                  </span>
                  <p className="text-xs font-bold text-stone-700 mt-1">Approved Volunteers</p>
                  <p className="text-[10px] text-stone-400">Ready for service shifts</p>
                </div>

                {/* Projects and Tasks */}
                <div className="bg-white p-5 rounded-3xl border border-foundation-borderMuted shadow-soft text-center">
                  <span className="text-3xl font-display font-bold text-indigo-700">
                    {portalMetrics?.projects.active || 0}
                  </span>
                  <p className="text-xs font-bold text-stone-700 mt-1">Active Projects</p>
                  <p className="text-[10px] text-stone-400">Allocated to members</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-foundation-borderMuted shadow-soft text-center">
                  <span className="text-3xl font-display font-bold text-stone-800">
                    {portalMetrics?.tasks.active || 0}
                  </span>
                  <p className="text-xs font-bold text-stone-700 mt-1">Active Tasks</p>
                  <p className="text-[10px] text-stone-400">In progress or assigned</p>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-rose-300 shadow-soft text-center bg-rose-50/30">
                  <span className="text-3xl font-display font-bold text-rose-700">
                    {portalMetrics?.tasks.overdue || 0}
                  </span>
                  <p className="text-xs font-bold text-rose-900 mt-1">Overdue Tasks</p>
                  <p className="text-[10px] text-rose-700">Passed deadline</p>
                </div>
              </div>
            </div>

            {/* Quick Action Matrix */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-3xl p-6 border border-foundation-borderMuted shadow-soft space-y-3">
                <div className="flex items-center space-x-2 text-foundation-forest">
                  <UserCheck className="w-5 h-5" />
                  <h3 className="font-display font-bold text-base">Seva Members</h3>
                </div>
                <p className="text-xs text-stone-600">
                  Manage Seva member registrations, approve credentials, assign tasks, and issue seva credit receipts.
                </p>
                <button
                  onClick={() => setActiveTab('seva_members')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-foundation-forest hover:underline cursor-pointer pt-2"
                >
                  <span>Open Seva Members Manager</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-foundation-borderMuted shadow-soft space-y-3">
                <div className="flex items-center space-x-2 text-amber-700">
                  <Award className="w-5 h-5" />
                  <h3 className="font-display font-bold text-base">Society Membership</h3>
                </div>
                <p className="text-xs text-stone-600">
                  Review formal society applications, check qualifications, and allocate members to organizational projects.
                </p>
                <button
                  onClick={() => setActiveTab('membership')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-amber-800 hover:underline cursor-pointer pt-2"
                >
                  <span>Open Membership Manager</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="bg-white rounded-3xl p-6 border border-foundation-borderMuted shadow-soft space-y-3">
                <div className="flex items-center space-x-2 text-emerald-700">
                  <HeartHandshake className="w-5 h-5" />
                  <h3 className="font-display font-bold text-base">Volunteer Seva</h3>
                </div>
                <p className="text-xs text-stone-600">
                  Coordinate volunteer activities for elder companionship, Gaushala care, and medical camps.
                </p>
                <button
                  onClick={() => setActiveTab('volunteers')}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-800 hover:underline cursor-pointer pt-2"
                >
                  <span>Open Volunteer Manager</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: SEVA MEMBERS MANAGEMENT
           ========================================================================= */}
        {activeTab === 'seva_members' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-foundation-charcoal">
                  Seva Members Management
                </h2>
                <p className="text-xs text-stone-500">
                  Review applicant profiles, approve access, assign tasks, and monitor seva hours.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <button
                  onClick={() => {
                    setNewTask(prev => ({ ...prev, category: 'seva_member' }));
                    setShowTaskModal(true);
                  }}
                  className="px-4 py-2 bg-foundation-forest text-white text-xs font-bold rounded-full shadow hover:bg-foundation-forestLight flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Seva Task</span>
                </button>

                <button
                  onClick={() => setShowSevaRecordModal(true)}
                  className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-full shadow hover:bg-emerald-800 flex items-center space-x-1.5 cursor-pointer"
                >
                  <FileText className="w-4 h-4" />
                  <span>Issue Seva Record / Receipt</span>
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Member ID, Name, or Mobile..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-foundation-warmGray border border-foundation-borderMuted rounded-xl focus:outline-none focus:ring-2 focus:ring-foundation-forest"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-foundation-warmGray border border-foundation-borderMuted rounded-xl focus:outline-none"
              >
                <option value="all">All Application Statuses</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Seva Members Table */}
            {filteredSevaMembers.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-6 text-center">No Seva member records match the filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-foundation-warmGray text-stone-600 font-bold border-b">
                    <tr>
                      <th className="p-3">Member ID</th>
                      <th className="p-3">Full Name & Contact</th>
                      <th className="p-3">Preferences</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredSevaMembers.map(m => (
                      <tr key={m.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold text-foundation-forest">
                          {m.memberId}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-foundation-charcoal">{m.fullName}</p>
                          <p className="text-[11px] text-stone-400">{m.mobile} • {m.email || 'No email'}</p>
                          <p className="text-[10px] text-stone-400">DOB: {m.dob} • Emer: {m.emergencyContact}</p>
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {m.sevaPreferences?.map((p: string) => (
                              <span key={p} className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px]">
                                {p}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            m.applicationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            m.applicationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {m.applicationStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedItemForStatus({ type: 'seva_member', item: m });
                              setNewStatus(m.applicationStatus === 'approved' ? 'suspended' : 'approved');
                              setRejectionReason(m.rejectionReason || '');
                              setAdminNotes(m.adminNotes || '');
                            }}
                            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs cursor-pointer"
                          >
                            Review / Change Status
                          </button>
                          <button
                            onClick={() => handleResetUserPassword(m.memberId || m.userId, m.fullName)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs cursor-pointer border border-amber-200"
                            title="Reset to temporary initial credentials"
                          >
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: SOCIETY MEMBERSHIP MANAGEMENT
           ========================================================================= */}
        {activeTab === 'membership' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-foundation-charcoal">
                  Society Registered Membership
                </h2>
                <p className="text-xs text-stone-500">
                  Review applicant qualifications, verify membership status, and allocate members to strategic projects.
                </p>
              </div>

              <button
                onClick={() => setShowProjectModal(true)}
                className="px-4 py-2 bg-amber-700 text-white text-xs font-bold rounded-full shadow hover:bg-amber-800 flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Project</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Membership ID, Name, or Occupation..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-foundation-warmGray border border-foundation-borderMuted rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-foundation-warmGray border border-foundation-borderMuted rounded-xl focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Society Members Table */}
            {filteredSocietyMembers.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-6 text-center">No membership applications found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-foundation-warmGray text-stone-600 font-bold border-b">
                    <tr>
                      <th className="p-3">Membership ID</th>
                      <th className="p-3">Member Details</th>
                      <th className="p-3">Qualifications & Skills</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredSocietyMembers.map(m => (
                      <tr key={m.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold text-amber-800">
                          {m.membershipId}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-foundation-charcoal">{m.fullName}</p>
                          <p className="text-[11px] text-stone-400">{m.email} • {m.mobile}</p>
                          <p className="text-[10px] text-stone-400">{m.occupation || 'Occupation not stated'}</p>
                        </td>
                        <td className="p-3">
                          <p className="font-semibold text-stone-700">{m.qualifications}</p>
                          <p className="text-[10px] text-stone-400">{m.skills?.join(', ') || 'No skills listed'}</p>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
                            {m.membershipTier || 'Active Member'}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            m.applicationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            m.applicationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {m.applicationStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedItemForStatus({ type: 'society_member', item: m });
                              setNewStatus(m.applicationStatus === 'approved' ? 'suspended' : 'approved');
                              setRejectionReason(m.rejectionReason || '');
                              setAdminNotes(m.adminNotes || '');
                            }}
                            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs cursor-pointer"
                          >
                            Review Application
                          </button>
                          <button
                            onClick={() => handleResetUserPassword(m.membershipId || m.userId, m.fullName)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs cursor-pointer border border-amber-200"
                            title="Reset to temporary initial credentials"
                          >
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 4: VOLUNTEERS MANAGEMENT
           ========================================================================= */}
        {activeTab === 'volunteers' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="text-xl font-display font-bold text-foundation-charcoal">
                  Volunteer Seva Circle
                </h2>
                <p className="text-xs text-stone-500">
                  Review volunteer applicants, verify availability, and assign seva activities.
                </p>
              </div>

              <button
                onClick={() => {
                  setNewTask(prev => ({ ...prev, category: 'volunteer' }));
                  setShowTaskModal(true);
                }}
                className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-full shadow hover:bg-emerald-800 flex items-center space-x-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Assign Volunteer Activity</span>
              </button>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by Volunteer ID, Name, or Skills..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-foundation-warmGray border border-foundation-borderMuted rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs bg-foundation-warmGray border border-foundation-borderMuted rounded-xl focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="pending_approval">Pending Approval</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Volunteers Table */}
            {filteredVolunteers.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-6 text-center">No volunteers found matching search criteria.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-foundation-warmGray text-stone-600 font-bold border-b">
                    <tr>
                      <th className="p-3">Volunteer ID</th>
                      <th className="p-3">Volunteer Details</th>
                      <th className="p-3">Availability</th>
                      <th className="p-3">Preferred Seva</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredVolunteers.map(v => (
                      <tr key={v.id} className="hover:bg-stone-50">
                        <td className="p-3 font-mono font-bold text-emerald-800">
                          {v.volunteerId}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-foundation-charcoal">{v.fullName}</p>
                          <p className="text-[11px] text-stone-400">{v.mobile} • {v.email || 'No email'}</p>
                        </td>
                        <td className="p-3 font-medium text-stone-700">
                          {v.availability}
                        </td>
                        <td className="p-3">
                          <div className="flex flex-wrap gap-1">
                            {v.preferredActivities?.map((a: string) => (
                              <span key={a} className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[10px]">
                                {a}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            v.applicationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                            v.applicationStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                            'bg-amber-100 text-amber-800'
                          }`}>
                            {v.applicationStatus.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            onClick={() => {
                              setSelectedItemForStatus({ type: 'volunteer', item: v });
                              setNewStatus(v.applicationStatus === 'approved' ? 'suspended' : 'approved');
                              setRejectionReason(v.rejectionReason || '');
                              setAdminNotes(v.adminNotes || '');
                            }}
                            className="px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-lg text-xs cursor-pointer"
                          >
                            Review / Change Status
                          </button>
                          <button
                            onClick={() => handleResetUserPassword(v.volunteerId || v.userId, v.fullName)}
                            className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs cursor-pointer border border-amber-200"
                            title="Reset to temporary initial credentials"
                          >
                            Reset Password
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: CENTRAL PROJECTS & TASK MANAGEMENT
           ========================================================================= */}
        {activeTab === 'projects_tasks' && (
          <div className="space-y-6">
            {/* Header with Creation Actions */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-display font-bold text-foundation-charcoal">
                  Central Project & Task Management
                </h2>
                <p className="text-xs text-stone-500">
                  Assign projects to members and define tasks with instructions and deadlines.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="px-4 py-2 bg-amber-700 text-white text-xs font-bold rounded-full shadow hover:bg-amber-800 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Project</span>
                </button>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="px-4 py-2 bg-foundation-forest text-white text-xs font-bold rounded-full shadow hover:bg-foundation-forestLight flex items-center space-x-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Task</span>
                </button>
              </div>
            </div>

            {/* Active Projects List */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-4">
              <h3 className="font-display font-bold text-base text-foundation-charcoal border-b pb-2">
                Active Society Projects ({projectsList.length})
              </h3>

              {projectsList.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-4">No projects created yet. Click "Create Project" above.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectsList.map(p => (
                    <div key={p.id} className="p-4 bg-foundation-warmGray rounded-2xl border space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-foundation-charcoal">{p.title}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900">
                          {p.priority} Priority
                        </span>
                      </div>
                      <p className="text-stone-600">{p.description}</p>
                      <p className="text-[11px] text-stone-500">
                        Lead: <strong>{p.leadMemberName || 'Unassigned'}</strong> • Deadline: {p.deadline}
                      </p>
                      <p className="text-[10px] text-stone-400">
                        Milestones: {p.milestones?.filter((m: any) => m.completed).length || 0} / {p.milestones?.length || 0} completed
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* All Tasks Management Table */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b pb-3">
                <h3 className="font-display font-bold text-base text-foundation-charcoal">
                  All Assigned Tasks & Reports ({tasksList.length})
                </h3>

                <div className="flex items-center space-x-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-1.5 text-xs bg-foundation-warmGray border border-foundation-borderMuted rounded-xl"
                  >
                    <option value="all">All Task Statuses</option>
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted for Verification</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {filteredTasks.length === 0 ? (
                <p className="text-xs text-stone-500 italic py-4">No tasks found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-foundation-warmGray text-stone-600 font-bold border-b">
                      <tr>
                        <th className="p-3">Task Title</th>
                        <th className="p-3">Category</th>
                        <th className="p-3">Assigned Assignee</th>
                        <th className="p-3">Deadline</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Review Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredTasks.map(t => (
                        <tr key={t.id} className="hover:bg-stone-50">
                          <td className="p-3 font-bold text-foundation-charcoal">
                            {t.title}
                          </td>
                          <td className="p-3 capitalize font-semibold text-stone-600">
                            {t.category.replace('_', ' ')}
                          </td>
                          <td className="p-3">
                            <span className="font-bold text-foundation-forest">{t.assignedToName}</span>
                            <span className="block text-[10px] font-mono text-stone-400">{t.assignedToId}</span>
                          </td>
                          <td className="p-3 text-stone-600">
                            {t.deadline}
                          </td>
                          <td className="p-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              t.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                              t.status === 'submitted' ? 'bg-purple-100 text-purple-800' :
                              t.status === 'in_progress' ? 'bg-amber-100 text-amber-800' :
                              'bg-stone-100 text-stone-700'
                            }`}>
                              {t.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => {
                                setSelectedTaskToReview(t);
                                setReviewStatus(t.status === 'submitted' ? 'completed' : t.status);
                                setAdminComments(t.adminComments || '');
                              }}
                              className="px-3 py-1 bg-foundation-forest hover:bg-foundation-forestLight text-white font-bold rounded-lg text-xs cursor-pointer shadow-xs"
                            >
                              Review & Feedback
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: ADMISSION ENQUIRIES & ADMIN APPROVAL MANAGEMENT
           ========================================================================= */}
        {activeTab === 'admissions' && (
          <div className="space-y-6">
            {/* Header & Metrics */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
                <div>
                  <h2 className="text-xl md:text-2xl font-display font-bold text-foundation-charcoal">
                    Admission Enquiry & Evaluation Management
                  </h2>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Review prospective senior resident evaluations, approve/reject admissions, and manage onboarding credentials.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                    {admissions.filter(a => a.status === 'pending_review' || a.status === 'new').length} Pending Action
                  </span>
                </div>
              </div>

              {/* Admission Statistics Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">Total Enquiries</span>
                  <p className="text-xl font-display font-bold text-foundation-charcoal mt-1">{admissions.length}</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">Pending Review</span>
                  <p className="text-xl font-display font-bold text-amber-900 mt-1">
                    {admissions.filter(a => a.status === 'pending_review' || a.status === 'new').length}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">Approved</span>
                  <p className="text-xl font-display font-bold text-emerald-900 mt-1">
                    {admissions.filter(a => a.status === 'approved').length}
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800">More Info Req.</span>
                  <p className="text-xl font-display font-bold text-blue-900 mt-1">
                    {admissions.filter(a => a.status === 'more_info_required').length}
                  </p>
                </div>
                <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800">Not Approved</span>
                  <p className="text-xl font-display font-bold text-rose-900 mt-1">
                    {admissions.filter(a => a.status === 'rejected').length}
                  </p>
                </div>
              </div>

              {/* Search & Filters Bar */}
              <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
                <div className="relative w-full md:w-80">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={admissionSearch}
                    onChange={(e) => setAdmissionSearch(e.target.value)}
                    placeholder="Search by Resident, Reg ID, Guardian Phone..."
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl pl-9 pr-4 py-2 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                    id="admission-search-input"
                  />
                  {admissionSearch && (
                    <button
                      type="button"
                      onClick={() => setAdmissionSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 text-xs">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pending_review', label: 'Pending' },
                    { id: 'approved', label: 'Approved' },
                    { id: 'more_info_required', label: 'More Info' },
                    { id: 'rejected', label: 'Rejected' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setAdmissionFilter(tab.id)}
                      className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                        admissionFilter === tab.id
                          ? 'bg-foundation-forest text-foundation-ivory shadow-xs'
                          : 'bg-foundation-warmGray text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Admission Enquiries List */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-4">
              {(() => {
                const filtered = admissions.filter(adm => {
                  // Status filter
                  if (admissionFilter !== 'all') {
                    if (admissionFilter === 'pending_review') {
                      if (adm.status !== 'pending_review' && adm.status !== 'new' && adm.status !== 'reviewing') return false;
                    } else if (adm.status !== admissionFilter) {
                      return false;
                    }
                  }
                  // Search query
                  if (admissionSearch.trim()) {
                    const q = admissionSearch.trim().toLowerCase();
                    const name = (adm.applicantName || adm.residentName || '').toLowerCase();
                    const guardian = (adm.guardianFirstName || '').toLowerCase();
                    const phone = (adm.guardianPhone || adm.applicantPhone || '');
                    const regId = (adm.registrationId || adm.id || '').toLowerCase();
                    return name.includes(q) || guardian.includes(q) || phone.includes(q) || regId.includes(q);
                  }
                  return true;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="text-center py-12 text-stone-500 text-xs space-y-2">
                      <Heart className="w-8 h-8 text-stone-300 mx-auto" />
                      <p className="font-semibold">No admission records found matching the criteria.</p>
                      <p className="text-[11px] text-stone-400">Try adjusting your search query or status filter.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-3.5">
                    {filtered.map(adm => {
                      const admStatus = adm.status === 'new' ? 'pending_review' : adm.status;
                      return (
                        <div
                          key={adm.id}
                          className="p-5 bg-foundation-warmGray hover:bg-stone-50/80 rounded-2xl border border-foundation-borderMuted transition-all text-xs space-y-3"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b pb-2.5">
                            <div className="flex items-center space-x-2.5">
                              <span className="font-mono font-bold text-foundation-forest px-2.5 py-0.5 bg-emerald-50 rounded-lg border border-emerald-200">
                                {adm.registrationId || adm.id}
                              </span>
                              <h3 className="font-bold text-sm text-foundation-charcoal">
                                {adm.applicantName || adm.residentName}
                              </h3>
                              {adm.dobOrYear && (
                                <span className="text-[11px] text-stone-500">
                                  (DOB/Year: {adm.dobOrYear})
                                </span>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                admStatus === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : admStatus === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : admStatus === 'more_info_required'
                                  ? 'bg-blue-100 text-blue-800 border border-blue-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}>
                                {admStatus.replace('_', ' ')}
                              </span>
                              <span className="text-[10px] text-stone-400">
                                {new Date(adm.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-stone-600 text-[11px]">
                            <div>
                              <p>Guardian: <strong className="text-stone-800">{adm.guardianFirstName || 'N/A'}</strong> ({adm.relationWithResident || 'Guardian'})</p>
                              <p>Contact: <strong className="text-stone-800">{adm.guardianPhone || adm.applicantPhone || 'N/A'}</strong></p>
                            </div>
                            <div>
                              <p>Category: <span className="text-stone-800 font-medium">{adm.admissionCategory || 'Elder Care Sanctuary'}</span></p>
                              <p>Mobility: {adm.mobilityStatus || 'Independent'}</p>
                            </div>
                            <div>
                              <p>Medical: <span className="text-stone-700 italic">{adm.medicalNotes ? adm.medicalNotes.substring(0, 50) + '...' : 'None'}</span></p>
                              {adm.rejectionReason && (
                                <p className="text-rose-700 font-semibold truncate">Reason: {adm.rejectionReason}</p>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-200/60">
                            <div className="flex items-center space-x-2 text-[11px] text-stone-400">
                              <span>History: {adm.statusHistory?.length || 1} update(s)</span>
                              {adm.adminNotes && (
                                <>
                                  <span>•</span>
                                  <span className="text-stone-600 truncate max-w-xs">Note: {adm.adminNotes}</span>
                                </>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleAdminResetAdmissionPassword(adm)}
                                className="px-2.5 py-1 text-[11px] font-semibold text-stone-600 hover:text-foundation-forest border border-stone-300 hover:bg-stone-100 rounded-lg transition-colors"
                                title="Reset applicant password to GuardianName+BirthYear formula"
                              >
                                Reset Pwd
                              </button>
                              <button
                                onClick={() => handleOpenAdmissionModal(adm)}
                                className="px-4 py-1.5 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center space-x-1"
                                id={`review-admission-${adm.registrationId || adm.id}`}
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Review & Decide</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* Admission Review & Decision Modal */}
            {selectedAdmission && (
              <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white rounded-3xl max-w-3xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-stone-200 my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between border-b pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <Heart className="w-5 h-5 text-rose-600" />
                        <h3 className="font-display font-bold text-lg text-foundation-charcoal">
                          Review Admission: {selectedAdmission.applicantName || selectedAdmission.residentName}
                        </h3>
                      </div>
                      <p className="text-xs text-stone-500 font-mono">
                        Registration ID: <strong>{selectedAdmission.registrationId || selectedAdmission.id}</strong> • Status: <span className="uppercase font-bold text-foundation-forest">{selectedAdmission.status}</span>
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedAdmission(null)}
                      className="text-stone-400 hover:text-stone-600 text-lg font-bold p-1"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Feedback Messages */}
                  {admissionActionError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                      <span>{admissionActionError}</span>
                    </div>
                  )}
                  {admissionActionSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>{admissionActionSuccess}</span>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 bg-foundation-warmGray rounded-2xl border space-y-2">
                      <h4 className="font-bold text-foundation-forest border-b pb-1">Senior Resident Details</h4>
                      <p><strong>Full Name:</strong> {selectedAdmission.applicantName || selectedAdmission.residentName}</p>
                      <p><strong>DOB / Birth Year:</strong> {selectedAdmission.dobOrYear || selectedAdmission.residentAge || 'N/A'}</p>
                      <p><strong>Gender:</strong> {selectedAdmission.residentGender || 'Not specified'}</p>
                      <p><strong>Category:</strong> {selectedAdmission.admissionCategory || 'Elder Care Sanctuary'}</p>
                      <p><strong>Mobility:</strong> {selectedAdmission.mobilityStatus || 'Independent'}</p>
                      <p><strong>Medical Background:</strong> {selectedAdmission.medicalNotes || 'None'}</p>
                    </div>

                    <div className="p-4 bg-foundation-warmGray rounded-2xl border space-y-2">
                      <h4 className="font-bold text-foundation-forest border-b pb-1">Guardian & Contact Information</h4>
                      <p><strong>Guardian First Name:</strong> {selectedAdmission.guardianFirstName || 'N/A'}</p>
                      <p><strong>Relation:</strong> {selectedAdmission.relationWithResident || 'Guardian'}</p>
                      <p><strong>Contact Phone:</strong> {selectedAdmission.guardianPhone || selectedAdmission.applicantPhone || 'N/A'}</p>
                      <p><strong>Email:</strong> {selectedAdmission.applicantEmail || 'None'}</p>
                      <p><strong>Residential Address:</strong> {selectedAdmission.address || 'N/A'}</p>
                      <p><strong>Submitted On:</strong> {new Date(selectedAdmission.createdAt).toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {selectedAdmission.additionalMessage && (
                    <div className="p-3.5 bg-stone-50 rounded-2xl border text-xs space-y-1">
                      <span className="font-bold text-stone-700">Enquiry Notes / Communication:</span>
                      <p className="text-stone-600 whitespace-pre-wrap">{selectedAdmission.additionalMessage}</p>
                    </div>
                  )}

                  {/* Status History Timeline */}
                  <div className="space-y-2 text-xs">
                    <h4 className="font-bold text-stone-800 flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-foundation-forest" />
                      <span>Status Change History</span>
                    </h4>
                    <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
                      {selectedAdmission.statusHistory && selectedAdmission.statusHistory.length > 0 ? (
                        selectedAdmission.statusHistory.map((item: any, idx: number) => (
                          <div key={item.id || idx} className="p-2.5 bg-foundation-warmGray rounded-xl border text-[11px] space-y-0.5">
                            <div className="flex items-center justify-between text-stone-500">
                              <span className="font-bold text-foundation-forest uppercase">{item.status.replace('_', ' ')}</span>
                              <span>{new Date(item.date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </div>
                            <p className="text-stone-700">{item.notes}</p>
                            <p className="text-[10px] text-stone-400">By: {item.updatedBy}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-stone-400 italic">No history recorded.</p>
                      )}
                    </div>
                  </div>

                  {/* Decision Formulation Box */}
                  <div className="p-5 bg-stone-50 rounded-3xl border border-stone-200 space-y-4 text-xs">
                    <h4 className="font-bold text-sm text-foundation-charcoal flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-foundation-forest" />
                      <span>Administrative Decision & Action</span>
                    </h4>

                    <div>
                      <label className="block font-bold text-stone-700 mb-1">
                        Internal Notes / Onboarding Instructions (visible to applicant):
                      </label>
                      <textarea
                        rows={2}
                        value={admissionAdminNotes}
                        onChange={(e) => setAdmissionAdminNotes(e.target.value)}
                        placeholder="Add internal remarks, approved room allotment details, or arrival dates..."
                        className="w-full bg-white border border-foundation-borderMuted rounded-xl p-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-blue-900 mb-1">
                        Instructions / Documents to Request (if requesting more information):
                      </label>
                      <input
                        type="text"
                        value={admissionRequestedInfo}
                        onChange={(e) => setAdmissionRequestedInfo(e.target.value)}
                        placeholder="e.g. Please provide recent physician summary and Aadhaar card copies."
                        className="w-full bg-white border border-blue-200 rounded-xl px-3 py-2 text-xs text-foundation-charcoal focus:ring-2 focus:ring-blue-600 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-rose-900 mb-1">
                        Rejection Reason (mandatory if rejecting):
                      </label>
                      <input
                        type="text"
                        value={admissionRejectionReason}
                        onChange={(e) => setAdmissionRejectionReason(e.target.value)}
                        placeholder="e.g. Currently at 100% capacity in assisted living wing; referred to Hingna elder sanctuary."
                        className="w-full bg-white border border-rose-200 rounded-xl px-3 py-2 text-xs text-foundation-charcoal focus:ring-2 focus:ring-rose-600 focus:outline-none"
                      />
                    </div>

                    {/* Rejection Confirmation Step */}
                    {showRejectConfirm && (
                      <div className="p-3 bg-rose-100 border border-rose-300 rounded-2xl text-xs text-rose-950 space-y-2">
                        <div className="flex items-center space-x-2 font-bold text-rose-900">
                          <AlertTriangle className="w-4 h-4 text-rose-700" />
                          <span>Confirmation Required Before Rejection:</span>
                        </div>
                        <p>
                          Are you sure you want to mark this admission enquiry as <strong>Rejected</strong>? The applicant will be notified with the reason provided: "<em>{admissionRejectionReason || 'No reason specified'}</em>".
                        </p>
                        <div className="flex space-x-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowRejectConfirm(false)}
                            className="px-3 py-1 bg-white border rounded-lg text-stone-700 font-semibold"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={isUpdatingAdmission}
                            onClick={() => handleUpdateAdmissionStatus(selectedAdmission.id, 'rejected')}
                            className="px-4 py-1 bg-rose-700 text-white rounded-lg font-bold hover:bg-rose-800"
                          >
                            Yes, Finalize Rejection
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-2.5 pt-2">
                      <button
                        type="button"
                        onClick={() => setSelectedAdmission(null)}
                        className="px-4 py-2 border rounded-full text-stone-600 font-semibold hover:bg-white"
                      >
                        Close
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingAdmission}
                        onClick={() => handleUpdateAdmissionStatus(selectedAdmission.id, 'pending_review')}
                        className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-full transition-colors"
                      >
                        Set Pending
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingAdmission}
                        onClick={() => handleUpdateAdmissionStatus(selectedAdmission.id, 'more_info_required')}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full shadow-xs transition-colors"
                      >
                        Request More Info
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingAdmission}
                        onClick={() => {
                          if (!admissionRejectionReason.trim()) {
                            setAdmissionActionError('Please enter a rejection reason before rejecting.');
                            return;
                          }
                          setShowRejectConfirm(true);
                        }}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-full shadow-xs transition-colors"
                      >
                        Reject Enquiry
                      </button>

                      <button
                        type="button"
                        disabled={isUpdatingAdmission}
                        onClick={() => handleUpdateAdmissionStatus(selectedAdmission.id, 'approved')}
                        className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-full shadow transition-colors flex items-center space-x-1.5"
                      >
                        {isUpdatingAdmission ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Check className="w-3.5 h-3.5" />
                        )}
                        <span>Approve Admission</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 7: DONATIONS
           ========================================================================= */}
        {activeTab === 'donations' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              Donation Pledges & Enquiries
            </h2>
            <div className="space-y-3">
              {donations.map(don => (
                <div key={don.id} className="p-4 bg-foundation-warmGray rounded-2xl border flex items-center justify-between text-xs">
                  <div>
                    <p className="font-bold text-foundation-charcoal">{don.donorName} - {don.donationType}</p>
                    <p className="text-stone-600">Amount/Items: {don.amountOrItems} • Mobile: {don.phone}</p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                    {don.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: CONTACT MESSAGES
           ========================================================================= */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              Website Contact Messages
            </h2>
            <div className="space-y-3">
              {messages.map(msg => (
                <div key={msg.id} className="p-4 bg-foundation-warmGray rounded-2xl border text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foundation-charcoal">{msg.name} ({msg.email})</span>
                    <span className="text-[10px] text-stone-400">{new Date(msg.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-stone-700">{msg.message}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 9: EVENTS MANAGER
           ========================================================================= */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-display font-bold text-foundation-charcoal">Ashram Events</h2>
              <button
                onClick={() => setShowEventModal(true)}
                className="px-4 py-2 bg-foundation-forest text-white text-xs font-bold rounded-full shadow"
              >
                Add Event
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map(evt => (
                <div key={evt.id} className="p-4 bg-foundation-warmGray rounded-2xl border text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-foundation-forest">{evt.title}</span>
                    <button onClick={() => handleDeleteEvent(evt.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-stone-600">{evt.description}</p>
                  <p className="text-[11px] text-stone-400">Date: {evt.date} • Venue: {evt.venue}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 10: GALLERY
           ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <div className="flex items-center justify-between border-b pb-3">
              <h2 className="text-xl font-display font-bold text-foundation-charcoal">Gallery Manager</h2>
              <button
                onClick={() => setShowGalleryModal(true)}
                className="px-4 py-2 bg-foundation-forest text-white text-xs font-bold rounded-full shadow"
              >
                Add Photo / Video
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="relative rounded-2xl overflow-hidden border shadow-sm group">
                  <img src={item.mediaUrl} alt={item.title} className="w-full h-32 object-cover" />
                  <div className="p-2 bg-white text-xs">
                    <p className="font-bold truncate">{item.title}</p>
                    <button
                      onClick={() => handleDeleteGallery(item.id)}
                      className="text-red-600 text-[10px] font-bold mt-1 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 11: AUDIT LOGS
           ========================================================================= */}
        {activeTab === 'audit' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-4">
            <h2 className="text-xl font-display font-bold text-foundation-charcoal border-b pb-3">
              System Audit Logs
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto text-xs">
              {auditLogs.map(log => (
                <div key={log.id} className="p-3 bg-foundation-warmGray rounded-xl border flex items-center justify-between">
                  <div>
                    <span className="font-mono font-bold text-foundation-forest">[{log.action}]</span>{' '}
                    <span className="text-stone-700">{log.details}</span>
                    <p className="text-[10px] text-stone-400">Actor: {log.actorName} • Entity: {log.entity}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 whitespace-nowrap ml-2">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 12: ACCOUNT SECURITY
           ========================================================================= */}
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

            <PasswordField
              label="Current Password *"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
            />

            <PasswordField
              label="New Confidential Password *"
              sublabel="Min 8 characters"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 8 characters)"
            />

            <button
              type="submit"
              className="w-full py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory text-xs font-bold rounded-full shadow transition-all cursor-pointer"
            >
              Rotate Administrator Password
            </button>
          </form>
        )}

        {/* =========================================================================
            STATUS REVIEW MODAL (APPROVE / REJECT WITH REASON)
           ========================================================================= */}
        {selectedItemForStatus && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-foundation-forest">Review Application</span>
                  <h3 className="font-display font-bold text-lg text-foundation-charcoal">
                    {selectedItemForStatus.item.fullName}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedItemForStatus(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Application Decision *</label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 focus:ring-2 focus:ring-foundation-forest"
                  >
                    <option value="approved">Approve & Grant Dashboard Access</option>
                    <option value="under_review">Mark Under Review</option>
                    <option value="rejected">Reject Application</option>
                    <option value="suspended">Suspend Account</option>
                  </select>
                </div>

                {newStatus === 'rejected' && (
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Reason for Rejection *</label>
                    <textarea
                      required
                      rows={2}
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Explain reason to applicant..."
                      className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Internal Administrative Notes</label>
                  <textarea
                    rows={2}
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Internal reference notes..."
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedItemForStatus(null)}
                    className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    className="flex-1 py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-white font-bold rounded-full transition-all shadow cursor-pointer"
                  >
                    Save Decision
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TASK CREATION MODAL
           ========================================================================= */}
        {showTaskModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-display font-bold text-lg text-foundation-charcoal">
                  Assign Task / Activity
                </h3>
                <button onClick={() => setShowTaskModal(false)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Task Category *</label>
                  <select
                    value={newTask.category}
                    onChange={(e: any) => {
                      setNewTask({ ...newTask, category: e.target.value, assignedToId: '', assignedToName: '' });
                    }}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  >
                    <option value="seva_member">Seva Member Task</option>
                    <option value="member">Society Member Project Task</option>
                    <option value="volunteer">Volunteer Activity Shift</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Assign To Eligible Member *</label>
                  <select
                    required
                    value={newTask.assignedToId}
                    onChange={(e) => {
                      const id = e.target.value;
                      let name = '';
                      if (newTask.category === 'seva_member') {
                        const m = sevaMembers.find(sm => sm.memberId === id);
                        name = m ? m.fullName : id;
                      } else if (newTask.category === 'member') {
                        const m = societyMembers.find(sm => sm.membershipId === id);
                        name = m ? m.fullName : id;
                      } else if (newTask.category === 'volunteer') {
                        const v = volunteersList.find(vl => vl.volunteerId === id);
                        name = v ? v.fullName : id;
                      }
                      setNewTask({ ...newTask, assignedToId: id, assignedToName: name });
                    }}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  >
                    <option value="">-- Select Member / Volunteer --</option>
                    {newTask.category === 'seva_member' &&
                      sevaMembers.filter(m => m.applicationStatus === 'approved').map(m => (
                        <option key={m.id} value={m.memberId}>
                          {m.fullName} ({m.memberId})
                        </option>
                      ))}
                    {newTask.category === 'member' &&
                      societyMembers.filter(m => m.applicationStatus === 'approved').map(m => (
                        <option key={m.id} value={m.membershipId}>
                          {m.fullName} ({m.membershipId})
                        </option>
                      ))}
                    {newTask.category === 'volunteer' &&
                      volunteersList.filter(v => v.applicationStatus === 'approved').map(v => (
                        <option key={v.id} value={v.volunteerId}>
                          {v.fullName} ({v.volunteerId})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Task Title *</label>
                  <input
                    type="text"
                    required
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="e.g. Daily Morning Annadanam Coordination"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Detailed task description..."
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e: any) => setNewTask({ ...newTask, priority: e.target.value })}
                      className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Deadline Date *</label>
                    <input
                      type="date"
                      required
                      value={newTask.deadline}
                      onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
                      className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Specific Instructions & Venue</label>
                  <textarea
                    rows={2}
                    value={newTask.instructions}
                    onChange={(e) => setNewTask({ ...newTask, instructions: e.target.value })}
                    placeholder="e.g. Report to Ward 1 by 08:30 AM with resident logsheet"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowTaskModal(false)}
                    className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-white font-bold rounded-full transition-all shadow cursor-pointer"
                  >
                    Assign Task Now
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            TASK REVIEW / VERIFICATION MODAL
           ========================================================================= */}
        {selectedTaskToReview && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-foundation-forest">Review Task Progress</span>
                  <h3 className="font-display font-bold text-lg text-foundation-charcoal">{selectedTaskToReview.title}</h3>
                </div>
                <button onClick={() => setSelectedTaskToReview(null)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3 text-xs bg-foundation-warmGray p-3.5 rounded-2xl border">
                <p>Assignee: <strong>{selectedTaskToReview.assignedToName}</strong> ({selectedTaskToReview.assignedToId})</p>
                <p>Current Status: <strong className="uppercase">{selectedTaskToReview.status}</strong></p>
                {selectedTaskToReview.completionEvidence && (
                  <p>
                    Submitted Evidence: <strong>{selectedTaskToReview.completionEvidence}</strong>
                  </p>
                )}
                {selectedTaskToReview.progressUpdates?.length > 0 && (
                  <div className="pt-2 border-t space-y-1">
                    <span className="font-bold text-stone-600">Member Progress Updates:</span>
                    {selectedTaskToReview.progressUpdates.map((u: any, i: number) => (
                      <p key={i} className="text-stone-600 pl-2">
                        • {new Date(u.date).toLocaleDateString()}: {u.notes} ({u.progressPercent}%)
                      </p>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={handleReviewTask} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Administrative Decision *</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  >
                    <option value="completed">Approve & Mark Completed</option>
                    <option value="in_progress">Keep In Progress</option>
                    <option value="rejected_for_revision">Request Revision / Corrections</option>
                    <option value="cancelled">Cancel Task</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Feedback / Administrative Comments</label>
                  <textarea
                    rows={2}
                    value={adminComments}
                    onChange={(e) => setAdminComments(e.target.value)}
                    placeholder="Enter feedback visible to the assigned member..."
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTaskToReview(null)}
                    className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-white font-bold rounded-full transition-all shadow cursor-pointer"
                  >
                    Save Review Decision
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            PROJECT CREATION MODAL
           ========================================================================= */}
        {showProjectModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-display font-bold text-lg text-foundation-charcoal">
                  Create New Society Project
                </h3>
                <button onClick={() => setShowProjectModal(false)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="e.g. Rural Senior Healthcare & Naturopathy Expansion"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Project Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Comprehensive project scope and goals..."
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Key Objectives (One per line)</label>
                  <textarea
                    rows={2}
                    value={newProject.objectives}
                    onChange={(e) => setNewProject({ ...newProject, objectives: e.target.value })}
                    placeholder="Construct dedicated physiotherapy room&#10;Organize monthly Ayurvedic doctor visits"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Project Lead Member</label>
                    <select
                      value={newProject.leadMemberId}
                      onChange={(e) => {
                        const id = e.target.value;
                        const m = societyMembers.find(sm => sm.membershipId === id);
                        setNewProject({ ...newProject, leadMemberId: id, leadMemberName: m ? m.fullName : id });
                      }}
                      className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                    >
                      <option value="">-- Select Member --</option>
                      {societyMembers.filter(m => m.applicationStatus === 'approved').map(m => (
                        <option key={m.id} value={m.membershipId}>
                          {m.fullName} ({m.membershipId})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Deadline Date *</label>
                    <input
                      type="date"
                      required
                      value={newProject.deadline}
                      onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
                      className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Milestones (One per line)</label>
                  <textarea
                    rows={2}
                    value={newProject.milestones}
                    onChange={(e) => setNewProject({ ...newProject, milestones: e.target.value })}
                    placeholder="Procure Naturopathy equipment&#10;Inaugurate health wing"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProjectModal(false)}
                    className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-full transition-all shadow cursor-pointer"
                  >
                    Create Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================================
            SEVA RECORD / RECEIPT MODAL
           ========================================================================= */}
        {showSevaRecordModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-display font-bold text-lg text-foundation-charcoal">
                  Issue Official Seva Record & Receipt
                </h3>
                <button onClick={() => setShowSevaRecordModal(false)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleIssueSevaRecord} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Select Seva Member *</label>
                  <select
                    required
                    value={newSevaRecord.memberId}
                    onChange={(e) => setNewSevaRecord({ ...newSevaRecord, memberId: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  >
                    <option value="">-- Choose Approved Member --</option>
                    {sevaMembers.filter(m => m.applicationStatus === 'approved').map(m => (
                      <option key={m.id} value={m.memberId}>
                        {m.fullName} ({m.memberId})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Seva Activity Title *</label>
                  <input
                    type="text"
                    required
                    value={newSevaRecord.title}
                    onChange={(e) => setNewSevaRecord({ ...newSevaRecord, title: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Hours Served *</label>
                    <input
                      type="number"
                      min={1}
                      required
                      value={newSevaRecord.hoursSpent}
                      onChange={(e) => setNewSevaRecord({ ...newSevaRecord, hoursSpent: Number(e.target.value) })}
                      className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Activity Date *</label>
                    <input
                      type="date"
                      required
                      value={newSevaRecord.date}
                      onChange={(e) => setNewSevaRecord({ ...newSevaRecord, date: e.target.value })}
                      className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Supervisor Remarks</label>
                  <textarea
                    rows={2}
                    value={newSevaRecord.description}
                    onChange={(e) => setNewSevaRecord({ ...newSevaRecord, description: e.target.value })}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSevaRecordModal(false)}
                    className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-full transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full transition-all shadow cursor-pointer"
                  >
                    Issue Receipt
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Event Form Modal */}
        {showEventModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border space-y-4 text-xs">
              <h3 className="font-display font-bold text-base text-foundation-charcoal">Create Event</h3>
              <form onSubmit={handleCreateEvent} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Event Title"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full p-2 bg-foundation-warmGray border rounded-xl"
                />
                <textarea
                  required
                  placeholder="Description"
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  className="w-full p-2 bg-foundation-warmGray border rounded-xl"
                />
                <input
                  type="date"
                  required
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full p-2 bg-foundation-warmGray border rounded-xl"
                />
                <div className="flex space-x-2 pt-2">
                  <button type="button" onClick={() => setShowEventModal(false)} className="flex-1 py-2 bg-stone-200 rounded-full font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2 bg-foundation-forest text-white rounded-full font-bold">
                    Save Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Gallery Form Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border space-y-4 text-xs">
              <h3 className="font-display font-bold text-base text-foundation-charcoal">Add Gallery Asset</h3>
              <form onSubmit={handleCreateGallery} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Title"
                  value={newGallery.title}
                  onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })}
                  className="w-full p-2 bg-foundation-warmGray border rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Caption"
                  value={newGallery.caption}
                  onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                  className="w-full p-2 bg-foundation-warmGray border rounded-xl"
                />
                <input
                  type="text"
                  required
                  placeholder="Image URL"
                  value={newGallery.mediaUrl}
                  onChange={(e) => setNewGallery({ ...newGallery, mediaUrl: e.target.value })}
                  className="w-full p-2 bg-foundation-warmGray border rounded-xl"
                />
                <div className="flex space-x-2 pt-2">
                  <button type="button" onClick={() => setShowGalleryModal(false)} className="flex-1 py-2 bg-stone-200 rounded-full font-bold">
                    Cancel
                  </button>
                  <button type="submit" className="flex-1 py-2 bg-foundation-forest text-white rounded-full font-bold">
                    Add to Gallery
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
