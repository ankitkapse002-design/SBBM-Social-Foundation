import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake, Shield, Calendar, CheckCircle2, AlertCircle, FileText,
  Clock, MapPin, Bell, KeyRound, LogOut, Heart, ArrowRight, User, X
} from 'lucide-react';
import { apiRequest, clearAuthToken } from '../../api';

export const VolunteerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'activities' | 'history' | 'profile' | 'notifications' | 'security'>('activities');

  // Task Update Modal State
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [taskNotes, setTaskNotes] = useState('');
  const [taskPercent, setTaskPercent] = useState<number>(50);
  const [taskStatus, setTaskStatus] = useState<string>('in_progress');
  const [taskEvidence, setTaskEvidence] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [taskMsg, setTaskMsg] = useState('');

  // Password Rotation Modal State
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest<any>('/portal/dashboard-data');
      if (res.success) {
        setData(res);
        if (res.user?.mustChangePassword) {
          setShowPasswordChangeModal(true);
        }
      }
    } catch (err) {
      clearAuthToken();
      navigate('/volunteer/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/volunteer/login');
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    setIsSubmittingTask(true);
    setTaskMsg('');
    try {
      const res = await apiRequest<any>(`/portal/tasks/${selectedTask.id}/progress`, {
        method: 'POST',
        body: JSON.stringify({
          notes: taskNotes,
          progressPercent: Number(taskPercent),
          status: taskStatus,
          completionEvidence: taskEvidence,
        }),
      });
      if (res.success) {
        setTaskMsg('Volunteer report submitted successfully!');
        setTimeout(() => {
          setSelectedTask(null);
          setTaskNotes('');
          setTaskEvidence('');
          setTaskMsg('');
          loadDashboardData();
        }, 1200);
      }
    } catch (err: any) {
      setTaskMsg(err.message || 'Failed to submit report.');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    if (newPassword.length < 8) {
      setPassError('New password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    setIsChangingPass(true);
    try {
      const res = await apiRequest<any>('/auth/change-password', {
        method: 'POST',
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.success) {
        setPassSuccess('Password updated successfully!');
        setTimeout(() => {
          setShowPasswordChangeModal(false);
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          setPassSuccess('');
          loadDashboardData();
        }, 1500);
      }
    } catch (err: any) {
      setPassError(err.message || 'Failed to update password.');
    } finally {
      setIsChangingPass(false);
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await apiRequest(`/portal/notifications/${id}/read`, { method: 'PUT' });
      loadDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-foundation-ivory flex items-center justify-center p-8 text-xs text-stone-600">
        Loading Volunteer Portal...
      </div>
    );
  }

  const user = data?.user;
  const profile = data?.profile;
  const tasks = data?.tasks || [];
  const history = data?.sevaRecords || [];
  const notifications = data?.notifications || [];
  const unreadNotifs = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-foundation-ivory py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center border-2 border-emerald-300 shadow-md shrink-0">
              <HeartHandshake className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Volunteer Portal
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Verified Seva Volunteer
                </span>
              </div>
              <h1 className="text-2xl font-display font-bold text-foundation-charcoal mt-1">
                {user?.fullName}
              </h1>
              <p className="text-xs text-stone-500 font-mono">
                Volunteer ID: <strong className="text-emerald-800">{user?.portalId}</strong> • Availability: {profile?.availability || 'Weekends'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setActiveTab('notifications')}
              className="relative p-2.5 rounded-xl border hover:bg-stone-50 text-stone-600 cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadNotifs}
                </span>
              )}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'activities', label: `Assigned Activities (${tasks.length})` },
            { id: 'history', label: `Participation History (${history.length})` },
            { id: 'profile', label: 'Volunteer Profile' },
            { id: 'notifications', label: `Calls for Seva (${unreadNotifs} New)` },
            { id: 'security', label: 'Account Security' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-foundation-borderMuted hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =========================================================================
            TAB 1: ASSIGNED ACTIVITIES & SEVA TASKS
           ========================================================================= */}
        {activeTab === 'activities' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-foundation-charcoal">
                Assigned Volunteer Activities & Tasks
              </h2>
              <span className="text-xs text-stone-500">
                Review instructions, report progress, and log attendance
              </span>
            </div>

            {tasks.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-foundation-borderMuted space-y-2">
                <HeartHandshake className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-stone-700">No Volunteer Activities Scheduled</p>
                <p className="text-xs text-stone-500">
                  You will be notified when special events, health checkup camps, or routine elder care shifts are assigned to you by the ashram seva coordinator.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-3xl p-6 border border-foundation-borderMuted shadow-soft space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                          'bg-emerald-100 text-emerald-800'
                        }`}>
                          {task.priority} Priority
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>

                      <h3 className="font-display font-bold text-base text-foundation-charcoal">
                        {task.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed">{task.description}</p>

                      {task.instructions && (
                        <div className="p-3 bg-foundation-warmGray rounded-xl text-xs text-stone-700 border">
                          <strong className="block text-[11px] text-emerald-800 mb-0.5">Instructions & Venue:</strong>
                          {task.instructions}
                        </div>
                      )}

                      <div className="text-[11px] text-stone-400 pt-1 flex items-center space-x-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Scheduled Date / Deadline: {task.deadline}</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">
                        {task.progressUpdates?.length || 0} updates logged
                      </span>
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setTaskStatus(task.status);
                          setTaskEvidence(task.completionEvidence || '');
                        }}
                        className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Submit Completion Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: PARTICIPATION HISTORY
           ========================================================================= */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-lg font-display font-bold text-foundation-charcoal border-b pb-3">
              Volunteer Participation History & Hours
            </h2>

            {history.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4">No verified participation history recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {history.map((item: any) => (
                  <div key={item.id} className="p-4 bg-foundation-warmGray rounded-2xl border flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-foundation-charcoal">{item.title}</p>
                      <p className="text-stone-500">{item.description}</p>
                      <p className="text-[11px] text-stone-400">Date: {item.date} • {item.hoursSpent} hours</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">
                      Verified
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: VOLUNTEER PROFILE
           ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6 max-w-2xl">
            <h2 className="text-lg font-display font-bold text-foundation-charcoal border-b pb-3">
              Volunteer Profile & Preferences
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Full Name</span>
                <span className="font-bold text-foundation-charcoal text-sm">{user?.fullName}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Volunteer ID</span>
                <span className="font-mono font-bold text-emerald-800 text-sm">{user?.portalId}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Availability</span>
                <span className="font-medium text-stone-700">{profile?.availability || 'Weekends'}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Mobile</span>
                <span className="font-medium text-stone-700">{user?.mobile}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Email</span>
                <span className="font-medium text-stone-700">{user?.email}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Date of Birth</span>
                <span className="font-medium text-stone-700">{profile?.dob || 'Not provided'}</span>
              </div>
            </div>

            <div className="p-3 bg-foundation-warmGray rounded-xl border text-xs">
              <span className="block text-[10px] uppercase font-bold text-stone-400">Residential Address</span>
              <p className="font-medium text-stone-700 mt-1">{profile?.address}</p>
            </div>

            <div className="p-3 bg-foundation-warmGray rounded-xl border text-xs">
              <span className="block text-[10px] uppercase font-bold text-stone-400">Preferred Volunteer Activities</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {profile?.preferredActivities?.map((a: string) => (
                  <span key={a} className="px-2.5 py-1 bg-white border rounded-full text-xs font-semibold text-emerald-900">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: NOTIFICATIONS
           ========================================================================= */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-4 max-w-2xl">
            <h2 className="text-lg font-display font-bold text-foundation-charcoal border-b pb-3">
              Volunteer Calls & Announcements
            </h2>

            {notifications.length === 0 ? (
              <p className="text-xs text-stone-500 italic py-4">No notifications at this time.</p>
            ) : (
              <div className="space-y-2">
                {notifications.map((notif: any) => (
                  <div
                    key={notif.id}
                    onClick={() => !notif.isRead && markNotificationRead(notif.id)}
                    className={`p-4 rounded-2xl border text-xs transition-colors flex items-start justify-between gap-3 ${
                      notif.isRead ? 'bg-foundation-warmGray text-stone-600' : 'bg-emerald-50/70 border-emerald-200 text-stone-800 cursor-pointer'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-foundation-charcoal">{notif.title}</p>
                      <p className="text-stone-600 mt-0.5 leading-relaxed">{notif.message}</p>
                      <span className="text-[10px] text-stone-400 mt-1 block">
                        {new Date(notif.createdAt).toLocaleString()}
                      </span>
                    </div>
                    {!notif.isRead && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-bold">
                        NEW
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 5: ACCOUNT SECURITY
           ========================================================================= */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-5 max-w-md">
            <div className="border-b pb-3">
              <h2 className="text-lg font-display font-bold text-foundation-charcoal">
                Account Security & Password
              </h2>
              <p className="text-xs text-stone-500">
                Ensure your volunteer account is secured with a confidential password.
              </p>
            </div>

            {passError && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {passError}
              </div>
            )}
            {passSuccess && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                {passSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Current Password *</label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">New Password * (Min 8 characters)</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPass}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full shadow transition-all cursor-pointer disabled:opacity-50"
              >
                {isChangingPass ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </div>
        )}

        {/* Task Update Modal */}
        {selectedTask && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl border space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800">Volunteer Activity Report</span>
                  <h3 className="font-display font-bold text-lg text-foundation-charcoal">{selectedTask.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {taskMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                  {taskMsg}
                </div>
              )}

              <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Update Status *</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value)}
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  >
                    <option value="in_progress">In Progress / Ongoing</option>
                    <option value="submitted">Completed & Submitted for Verification</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Activity Completion: {taskPercent}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={taskPercent}
                    onChange={(e) => setTaskPercent(Number(e.target.value))}
                    className="w-full accent-emerald-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Activity Notes / Hours Served</label>
                  <textarea
                    rows={2}
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    placeholder="Describe your seva contribution, hours served, or interactions..."
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Evidence / Photo / Attendance Notes</label>
                  <textarea
                    rows={2}
                    value={taskEvidence}
                    onChange={(e) => setTaskEvidence(e.target.value)}
                    placeholder="Enter attendance notes or link to activity evidence..."
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div className="flex space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTask(null)}
                    className="flex-1 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-full transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingTask}
                    className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full transition-all shadow"
                  >
                    {isSubmittingTask ? 'Submitting...' : 'Submit Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mandatory Password Rotation Modal */}
        {showPasswordChangeModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-emerald-500/50 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-inner">
                <KeyRound className="w-7 h-7" />
              </div>

              <div className="text-center space-y-1">
                <h3 className="font-display font-bold text-lg text-foundation-charcoal">
                  Mandatory Password Setup
                </h3>
                <p className="text-xs text-stone-500">
                  You are logged in with your initial credential. For security compliance, please set your confidential permanent password.
                </p>
              </div>

              {passError && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                  {passError}
                </div>
              )}
              {passSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                  {passSuccess}
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">Current Initial Password *</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="e.g. POOJ1998"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">New Confidential Password * (Min 8 chars)</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new strong password"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Confirm New Password *</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-full shadow transition-all cursor-pointer disabled:opacity-50"
                >
                  {isChangingPass ? 'Saving New Password...' : 'Save and Continue to Dashboard'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
