import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Award, Shield, Calendar, CheckCircle2, AlertCircle, FileText,
  Users, Briefcase, Bell, KeyRound, LogOut, CheckSquare, Clock, ArrowRight,
  TrendingUp, X
} from 'lucide-react';
import { apiRequest, clearAuthToken } from '../../api';
import { PasswordField } from '../../components/ui/PasswordField';

export const MembershipDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'projects' | 'tasks' | 'profile' | 'notifications' | 'security'>('projects');

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
      navigate('/membership/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/membership/login');
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
        setTaskMsg('Project task updated successfully!');
        setTimeout(() => {
          setSelectedTask(null);
          setTaskNotes('');
          setTaskEvidence('');
          setTaskMsg('');
          loadDashboardData();
        }, 1200);
      }
    } catch (err: any) {
      setTaskMsg(err.message || 'Failed to update task.');
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
        Loading Membership Portal...
      </div>
    );
  }

  const user = data?.user;
  const profile = data?.profile;
  const projects = data?.projects || [];
  const tasks = data?.tasks || [];
  const notifications = data?.notifications || [];
  const unreadNotifs = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-foundation-ivory py-8 md:py-12 px-4 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-amber-600 text-white flex items-center justify-center border-2 border-foundation-gold shadow-md shrink-0">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                  Foundation Member
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  {profile?.membershipTier || 'Active Member'}
                </span>
              </div>
              <h1 className="text-2xl font-display font-bold text-foundation-charcoal mt-1">
                {user?.fullName}
              </h1>
              <p className="text-xs text-stone-500 font-mono">
                Membership ID: <strong className="text-amber-800">{user?.portalId}</strong> • Mobile: {user?.mobile}
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
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-600 text-white text-[9px] font-bold flex items-center justify-center">
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
            { id: 'projects', label: `Assigned Projects (${projects.length})` },
            { id: 'tasks', label: `Project Tasks (${tasks.length})` },
            { id: 'profile', label: 'Membership Profile' },
            { id: 'notifications', label: `Announcements (${unreadNotifs} New)` },
            { id: 'security', label: 'Account Security' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-full transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-amber-700 text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-foundation-borderMuted hover:bg-stone-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* =========================================================================
            TAB 1: ASSIGNED PROJECTS
           ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-display font-bold text-foundation-charcoal">
                Assigned Society Projects & Initiatives
              </h2>
              <span className="text-xs text-stone-500">
                Coordinated with Executive Board oversight
              </span>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-foundation-borderMuted space-y-2">
                <Briefcase className="w-8 h-8 text-amber-600 mx-auto" />
                <p className="text-sm font-bold text-stone-700">No Projects Allocated Yet</p>
                <p className="text-xs text-stone-500">
                  The executive board assigns approved members to specific welfare projects (such as elder healthcare, Gaushala expansion, or community camps) based on your skills and expertise.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {projects.map((proj: any) => {
                  const isLead = proj.leadMemberId === user?.id || proj.leadMemberId === user?.portalId;
                  const completedMilestones = proj.milestones?.filter((m: any) => m.completed).length || 0;
                  const totalMilestones = proj.milestones?.length || 0;
                  const progress = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

                  return (
                    <div
                      key={proj.id}
                      className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-5"
                    >
                      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border-b pb-4">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                              {isLead ? 'Project Lead' : 'Team Member'}
                            </span>
                            <span className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full ${
                              proj.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                              proj.priority === 'high' ? 'bg-amber-100 text-amber-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {proj.priority} Priority
                            </span>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700">
                              {proj.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h3 className="font-display font-bold text-xl text-foundation-charcoal mt-1">
                            {proj.title}
                          </h3>
                        </div>

                        <div className="text-left md:text-right text-xs text-stone-500">
                          <p>Start: {proj.startDate || 'Immediate'}</p>
                          <p className="font-bold text-amber-900">Target Deadline: {proj.deadline}</p>
                        </div>
                      </div>

                      <p className="text-xs text-stone-600 leading-relaxed">
                        {proj.description}
                      </p>

                      {/* Objectives */}
                      {proj.objectives && proj.objectives.length > 0 && (
                        <div className="space-y-1">
                          <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500">
                            Key Objectives
                          </span>
                          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-700">
                            {proj.objectives.map((obj: string, i: number) => (
                              <li key={i} className="flex items-center space-x-2 p-2 bg-foundation-warmGray rounded-xl border">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Milestones Progress Bar */}
                      <div className="space-y-2 pt-2 border-t">
                        <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                          <span>Milestone Completion</span>
                          <span>{completedMilestones}/{totalMilestones} ({progress}%)</span>
                        </div>
                        <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-amber-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        {proj.milestones && proj.milestones.length > 0 && (
                          <div className="space-y-1.5 pt-2">
                            {proj.milestones.map((m: any) => (
                              <div key={m.id} className="flex items-center justify-between p-2 bg-foundation-warmGray rounded-xl text-xs">
                                <span className={m.completed ? 'line-through text-stone-400' : 'text-stone-700 font-medium'}>
                                  {m.title}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${m.completed ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'}`}>
                                  {m.completed ? 'Completed' : 'Pending'}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 2: PROJECT TASKS
           ========================================================================= */}
        {activeTab === 'tasks' && (
          <div className="space-y-4">
            <h2 className="text-lg font-display font-bold text-foundation-charcoal">
              Project Work & Task Assignments
            </h2>

            {tasks.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500 italic bg-white rounded-3xl border">
                No individual project tasks assigned to your account.
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
                          'bg-blue-100 text-blue-800'
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
                          <strong className="block text-[11px] text-amber-800 mb-0.5">Instructions:</strong>
                          {task.instructions}
                        </div>
                      )}

                      <div className="text-[11px] text-stone-400 pt-1">
                        Deadline: {task.deadline}
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
                        className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white rounded-full text-xs font-bold transition-all cursor-pointer shadow-sm"
                      >
                        Submit Progress
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 3: MEMBERSHIP PROFILE
           ========================================================================= */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6 max-w-2xl">
            <h2 className="text-lg font-display font-bold text-foundation-charcoal border-b pb-3">
              Membership Profile & Qualifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Full Name</span>
                <span className="font-bold text-foundation-charcoal text-sm">{user?.fullName}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Membership ID</span>
                <span className="font-mono font-bold text-amber-800 text-sm">{user?.portalId}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Education / Qualifications</span>
                <span className="font-medium text-stone-700">{profile?.qualifications || 'Not specified'}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Occupation</span>
                <span className="font-medium text-stone-700">{profile?.occupation || 'Not specified'}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Mobile</span>
                <span className="font-medium text-stone-700">{user?.mobile}</span>
              </div>
              <div className="p-3 bg-foundation-warmGray rounded-xl border">
                <span className="block text-[10px] uppercase font-bold text-stone-400">Email</span>
                <span className="font-medium text-stone-700">{user?.email}</span>
              </div>
            </div>

            <div className="p-3 bg-foundation-warmGray rounded-xl border text-xs">
              <span className="block text-[10px] uppercase font-bold text-stone-400">Residential Address</span>
              <p className="font-medium text-stone-700 mt-1">{profile?.address}</p>
            </div>

            <div className="p-3 bg-foundation-warmGray rounded-xl border text-xs">
              <span className="block text-[10px] uppercase font-bold text-stone-400">Skills & Expertise</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {profile?.skills?.map((s: string) => (
                  <span key={s} className="px-2.5 py-1 bg-white border rounded-full text-xs font-semibold text-amber-900">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-foundation-warmGray rounded-xl border text-xs">
              <span className="block text-[10px] uppercase font-bold text-stone-400">Areas of Interest</span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {profile?.areasOfInterest?.map((a: string) => (
                  <span key={a} className="px-2.5 py-1 bg-white border rounded-full text-xs font-semibold text-stone-700">
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
              Announcements & Project Notifications
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
                      notif.isRead ? 'bg-foundation-warmGray text-stone-600' : 'bg-amber-50/70 border-amber-200 text-stone-800 cursor-pointer'
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
                      <span className="px-2 py-0.5 rounded-full bg-amber-600 text-white text-[9px] font-bold">
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
                Ensure your membership account is secured with a confidential password.
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
              <PasswordField
                accentColor="amber"
                label="Current Password *"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
              />

              <PasswordField
                accentColor="amber"
                label="New Password *"
                sublabel="Min 8 characters"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new strong password"
              />

              <PasswordField
                accentColor="amber"
                label="Confirm New Password *"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />

              <button
                type="submit"
                disabled={isChangingPass}
                className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-full shadow transition-all cursor-pointer disabled:opacity-50"
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
                  <span className="text-[10px] uppercase font-bold text-amber-800">Project Task Update</span>
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
                    <option value="in_progress">In Progress</option>
                    <option value="submitted">Submitted for Verification</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    Progress Percentage: {taskPercent}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={taskPercent}
                    onChange={(e) => setTaskPercent(Number(e.target.value))}
                    className="w-full accent-amber-700"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Progress Notes / Milestones Reached</label>
                  <textarea
                    rows={2}
                    value={taskNotes}
                    onChange={(e) => setTaskNotes(e.target.value)}
                    placeholder="Describe tasks completed, meetings conducted, or deliverables..."
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Evidence / Deliverable Document Link</label>
                  <textarea
                    rows={2}
                    value={taskEvidence}
                    onChange={(e) => setTaskEvidence(e.target.value)}
                    placeholder="Enter notes or document links for board review..."
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
                    className="flex-1 py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-full transition-all shadow"
                  >
                    {isSubmittingTask ? 'Submitting...' : 'Save Task Progress'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mandatory Password Rotation Modal */}
        {showPasswordChangeModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl border-2 border-amber-500/50 space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mx-auto shadow-inner">
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
                <PasswordField
                  accentColor="amber"
                  label="Current Initial Password *"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="e.g. RAHU2003"
                />

                <PasswordField
                  accentColor="amber"
                  label="New Confidential Password *"
                  sublabel="Min 8 characters"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password"
                />

                <PasswordField
                  accentColor="amber"
                  label="Confirm New Password *"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />

                <button
                  type="submit"
                  disabled={isChangingPass}
                  className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-full shadow transition-all cursor-pointer disabled:opacity-50"
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
