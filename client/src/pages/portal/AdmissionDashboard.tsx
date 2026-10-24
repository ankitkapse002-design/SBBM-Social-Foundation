import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Heart, Shield, Clock, CheckCircle2, AlertCircle, AlertTriangle,
  FileText, Send, LogOut, KeyRound, Bell, MapPin, Phone,
  User, Copy, Check, ChevronRight, RefreshCw, X, MessageSquare, Info
} from 'lucide-react';
import { apiRequest, clearAuthToken } from '../../api';
import { PasswordField } from '../../components/ui/PasswordField';

export const AdmissionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'status' | 'details' | 'history' | 'notifications'>('status');

  // Copy feedback state
  const [hasCopiedId, setHasCopiedId] = useState(false);

  // Additional Information Submission State (when more_info_required)
  const [additionalDetails, setAdditionalDetails] = useState('');
  const [isSubmittingInfo, setIsSubmittingInfo] = useState(false);
  const [infoSubmitMessage, setInfoSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
      navigate('/admission-login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/admission-login');
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setHasCopiedId(true);
    setTimeout(() => setHasCopiedId(false), 2000);
  };

  const handleRespondInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!additionalDetails.trim()) return;

    setIsSubmittingInfo(true);
    setInfoSubmitMessage(null);

    try {
      const res = await apiRequest<{ success: boolean; message: string }>('/portal/admission/respond-info', {
        method: 'POST',
        body: JSON.stringify({ additionalDetails: additionalDetails.trim() }),
      });

      if (res.success) {
        setInfoSubmitMessage({
          type: 'success',
          text: res.message || 'Additional details submitted successfully! Your enquiry is back under Pending Review.'
        });
        setAdditionalDetails('');
        setTimeout(() => {
          loadDashboardData();
        }, 1500);
      }
    } catch (err: any) {
      setInfoSubmitMessage({
        type: 'error',
        text: err.message || 'Failed to submit additional information. Please try again.'
      });
    } finally {
      setIsSubmittingInfo(false);
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
      <div className="min-h-screen bg-foundation-ivory flex items-center justify-center p-4">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-foundation-forest animate-spin mx-auto" />
          <p className="text-xs font-bold text-stone-600">Loading Admission Status...</p>
        </div>
      </div>
    );
  }

  const user = data?.user;
  const enquiry = data?.admissionEnquiry || data?.profile;
  const notifications = data?.notifications || [];
  const status = enquiry?.status || 'pending_review';
  const registrationId = enquiry?.registrationId || user?.portalId || 'N/A';
  const statusHistory = enquiry?.statusHistory || [];

  return (
    <div className="min-h-screen bg-foundation-ivory py-8 md:py-12">
      <div className="max-w-5xl mx-auto px-4 md:px-8 space-y-8">

        {/* Top Navbar / Header */}
        <div className="bg-white rounded-3xl p-5 md:p-6 border border-foundation-borderMuted shadow-soft flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 font-bold shadow-inner flex-shrink-0">
              <Heart className="w-6 h-6 fill-rose-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg md:text-xl font-display font-bold text-foundation-charcoal">
                  {enquiry?.applicantName || user?.fullName || 'Applicant Profile'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border">
                  Admission Enquiry
                </span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-stone-500 pt-0.5">
                <span>Reg ID:</span>
                <span className="font-mono font-bold text-foundation-forest">{registrationId}</span>
                <button
                  type="button"
                  onClick={() => handleCopyId(registrationId)}
                  className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
                  title="Copy Registration ID"
                >
                  {hasCopiedId ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              onClick={() => setShowPasswordChangeModal(true)}
              className="px-3.5 py-2 border border-foundation-borderMuted hover:bg-stone-50 rounded-xl text-xs font-semibold text-stone-700 flex items-center space-x-1.5 transition-colors"
              id="change-password-btn"
            >
              <KeyRound className="w-3.5 h-3.5 text-foundation-forest" />
              <span>Change Password</span>
            </button>
            <button
              onClick={handleLogout}
              className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors"
              id="admission-logout-btn"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Status Hero Card */}
        <div className={`rounded-3xl p-6 md:p-8 border shadow-soft ${
          status === 'approved'
            ? 'bg-emerald-50/70 border-emerald-300'
            : status === 'rejected'
            ? 'bg-rose-50/70 border-rose-300'
            : status === 'more_info_required'
            ? 'bg-blue-50/80 border-blue-300'
            : 'bg-amber-50/70 border-amber-300'
        }`}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b pb-4 border-stone-200/70">
            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                Current Admission Status
              </span>
              <div className="flex items-center space-x-2.5">
                {status === 'approved' && (
                  <>
                    <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                    <span className="text-xl md:text-2xl font-display font-bold text-emerald-900">
                      Approved
                    </span>
                  </>
                )}
                {status === 'rejected' && (
                  <>
                    <AlertCircle className="w-6 h-6 text-rose-600 flex-shrink-0" />
                    <span className="text-xl md:text-2xl font-display font-bold text-rose-900">
                      Not Approved
                    </span>
                  </>
                )}
                {status === 'more_info_required' && (
                  <>
                    <AlertTriangle className="w-6 h-6 text-blue-600 flex-shrink-0" />
                    <span className="text-xl md:text-2xl font-display font-bold text-blue-900">
                      More Information Required
                    </span>
                  </>
                )}
                {status === 'pending_review' && (
                  <>
                    <Clock className="w-6 h-6 text-amber-600 flex-shrink-0" />
                    <span className="text-xl md:text-2xl font-display font-bold text-amber-900">
                      Pending Review
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="text-left md:text-right text-xs text-stone-600 space-y-0.5">
              <p>Submitted On: <strong>{enquiry?.createdAt ? new Date(enquiry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</strong></p>
              <p>Last Decision Update: <strong>{enquiry?.updatedAt ? new Date(enquiry.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}</strong></p>
            </div>
          </div>

          {/* Decision Notes / Explanations */}
          <div className="pt-4 space-y-3 text-xs">
            {status === 'pending_review' && (
              <div className="space-y-2 text-stone-700">
                <p className="font-semibold text-amber-950">
                  Your admission enquiry is currently undergoing formal evaluation by the Ashram Medical and Administrative Council.
                </p>
                <p className="leading-relaxed">
                  Our team carefully evaluates resident health background, mobility assistance requirements, and accommodation availability at Vyenkatesh Ashram, Mahuli. You will be notified here once an administrative decision is recorded.
                </p>
                {enquiry?.adminNotes && (
                  <div className="p-3 bg-white/70 rounded-xl border border-amber-200 text-stone-800">
                    <span className="font-bold text-amber-900 block mb-0.5">Administrative Note:</span>
                    {enquiry.adminNotes}
                  </div>
                )}
              </div>
            )}

            {status === 'approved' && (
              <div className="space-y-3 text-emerald-950">
                <p className="font-semibold text-base">
                  Welcome to Vyenkatesh Ashram Family!
                </p>
                <p className="leading-relaxed">
                  Your admission enquiry for <strong>{enquiry?.applicantName}</strong> has been approved by the ashram administration. Please review the official remarks below and contact the ashram office to finalize resident arrival date and documentation formalities.
                </p>
                {enquiry?.adminNotes && (
                  <div className="p-4 bg-white/80 rounded-2xl border border-emerald-200 text-emerald-950 space-y-1">
                    <span className="font-bold block">Remarks / Admission Instructions:</span>
                    <p className="leading-relaxed">{enquiry.adminNotes}</p>
                  </div>
                )}
                <div className="p-3 bg-emerald-100/60 rounded-xl border border-emerald-200 flex items-center space-x-2 text-emerald-900 font-semibold">
                  <Phone className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Ashram Office Onboarding Contact: +91 98908 98081 / +91 94221 12345</span>
                </div>
              </div>
            )}

            {status === 'rejected' && (
              <div className="space-y-3 text-rose-950">
                <p className="font-semibold text-sm">
                  Notice Regarding Admission Evaluation
                </p>
                <p className="leading-relaxed">
                  After careful evaluation of current ashram capacity, required care level, and medical infrastructure, your admission enquiry could not be approved at this time.
                </p>
                {enquiry?.rejectionReason && (
                  <div className="p-4 bg-white/90 rounded-2xl border border-rose-200 text-rose-950 space-y-1">
                    <span className="font-bold block text-rose-800">Official Reason:</span>
                    <p className="leading-relaxed">{enquiry.rejectionReason}</p>
                  </div>
                )}
                <p className="text-[11px] text-stone-600">
                  If your senior's health situation or care requirements change, or for further guidance regarding rural elder-care alternatives, please contact the ashram administrative office directly.
                </p>
              </div>
            )}

            {status === 'more_info_required' && (
              <div className="space-y-4 text-blue-950">
                <p className="font-semibold text-sm">
                  The administration requires additional information or documents to proceed with evaluation.
                </p>
                {(enquiry?.requestedInfoNotes || enquiry?.adminNotes) && (
                  <div className="p-4 bg-white/90 rounded-2xl border border-blue-200 text-blue-950 space-y-1">
                    <span className="font-bold block text-blue-800">Requested Information / Instructions:</span>
                    <p className="leading-relaxed">{enquiry.requestedInfoNotes || enquiry.adminNotes}</p>
                  </div>
                )}

                {/* Response Form */}
                <form onSubmit={handleRespondInfo} className="bg-white/90 rounded-2xl p-4 border border-blue-200 space-y-3">
                  <h4 className="font-bold text-xs text-blue-900 flex items-center space-x-1.5">
                    <MessageSquare className="w-4 h-4" />
                    <span>Submit Requested Details or Explanations</span>
                  </h4>

                  {infoSubmitMessage && (
                    <div className={`p-2.5 rounded-xl text-xs flex items-center space-x-2 ${
                      infoSubmitMessage.type === 'success'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-rose-50 text-rose-800 border border-rose-200'
                    }`}>
                      {infoSubmitMessage.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                      )}
                      <span>{infoSubmitMessage.text}</span>
                    </div>
                  )}

                  <textarea
                    rows={3}
                    required
                    value={additionalDetails}
                    onChange={(e) => setAdditionalDetails(e.target.value)}
                    placeholder="Provide the requested details (e.g. physician certificate, medication details, identity document references, or clarification)..."
                    className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl p-3 text-xs text-foundation-charcoal focus:ring-2 focus:ring-blue-600 focus:outline-none"
                  />

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={isSubmittingInfo}
                      className="px-5 py-2 bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-bold text-xs rounded-full shadow flex items-center space-x-1.5"
                    >
                      {isSubmittingInfo ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Send className="w-3.5 h-3.5" />
                      )}
                      <span>Submit Details to Admin</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b border-foundation-borderMuted pb-2 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'status'
                ? 'bg-foundation-forest text-foundation-ivory shadow'
                : 'text-stone-600 hover:bg-white'
            }`}
          >
            Overview & Status
          </button>
          <button
            onClick={() => setActiveTab('details')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'details'
                ? 'bg-foundation-forest text-foundation-ivory shadow'
                : 'text-stone-600 hover:bg-white'
            }`}
          >
            Submitted Application Details
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'history'
                ? 'bg-foundation-forest text-foundation-ivory shadow'
                : 'text-stone-600 hover:bg-white'
            }`}
          >
            Decision Timeline ({statusHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-2 rounded-xl transition-all relative ${
              activeTab === 'notifications'
                ? 'bg-foundation-forest text-foundation-ivory shadow'
                : 'text-stone-600 hover:bg-white'
            }`}
          >
            <span>Updates & Notifications</span>
            {notifications.some((n: any) => !n.isRead) && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-2 right-2 animate-ping" />
            )}
          </button>
        </div>

        {/* TAB 1: OVERVIEW & STATUS SUMMARY */}
        {activeTab === 'status' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Quick Summary Card */}
            <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-foundation-borderMuted shadow-soft space-y-5">
              <h3 className="font-display font-bold text-base text-foundation-charcoal border-b pb-2">
                Application Summary
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-foundation-warmGray rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Prospective Resident</span>
                  <p className="font-bold text-sm text-foundation-charcoal">{enquiry?.applicantName || 'N/A'}</p>
                  <p className="text-stone-600">Category: {enquiry?.admissionCategory || 'Elder Care'}</p>
                </div>

                <div className="p-3.5 bg-foundation-warmGray rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Guardian / Contact</span>
                  <p className="font-bold text-sm text-foundation-charcoal">{enquiry?.guardianFirstName} ({enquiry?.relationWithResident || 'Guardian'})</p>
                  <p className="text-stone-600">Phone: {enquiry?.guardianPhone || user?.mobile || 'N/A'}</p>
                </div>

                <div className="p-3.5 bg-foundation-warmGray rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Mobility Assessment</span>
                  <p className="font-semibold text-foundation-charcoal">{enquiry?.mobilityStatus || 'Not specified'}</p>
                </div>

                <div className="p-3.5 bg-foundation-warmGray rounded-xl space-y-1">
                  <span className="text-[10px] uppercase font-bold text-stone-500">DOB / Birth Year</span>
                  <p className="font-semibold text-foundation-charcoal">{enquiry?.dobOrYear || 'N/A'}</p>
                </div>
              </div>

              <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs space-y-1">
                <span className="font-bold text-stone-700">Health / Medical Background:</span>
                <p className="text-stone-600 leading-relaxed">{enquiry?.medicalNotes || 'None recorded'}</p>
              </div>

              {enquiry?.additionalMessage && (
                <div className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs space-y-1">
                  <span className="font-bold text-stone-700">Enquiry Notes / Communication:</span>
                  <p className="text-stone-600 whitespace-pre-wrap leading-relaxed">{enquiry.additionalMessage}</p>
                </div>
              )}
            </div>

            {/* Ashram Help & Information Box */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl p-6 border border-foundation-borderMuted shadow-soft space-y-4 text-xs">
                <div className="flex items-center space-x-2 text-foundation-forest font-bold">
                  <Shield className="w-4 h-4" />
                  <span>Ashram Office Information</span>
                </div>
                <p className="text-stone-600 leading-relaxed">
                  Vyenkatesh Ashram operates with pure seva bhav to support elders in need of dignified living, sattvic nourishment, and peaceful spiritual surroundings.
                </p>
                <div className="space-y-2 pt-2 border-t text-[11px] text-stone-700">
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-stone-400 flex-shrink-0 mt-0.5" />
                    <span>Vyenkatesh Ashram, Village Mahuli, Hingna Road, Dist. Nagpur - 441110</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-stone-400 flex-shrink-0" />
                    <span>Helpline: +91 98908 98081</span>
                  </div>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-3xl p-6 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-emerald-900">
                  <Info className="w-4 h-4" />
                  <span>Next Steps Reminder</span>
                </div>
                <p className="leading-relaxed text-[11px] text-stone-700">
                  Keep your Admission Registration ID ({registrationId}) handy when communicating with our office.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DETAILED APPLICATION VIEW */}
        {activeTab === 'details' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h3 className="font-display font-bold text-base text-foundation-charcoal border-b pb-3">
              Complete Registered Admission Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3">
                <h4 className="font-bold text-foundation-forest border-b pb-1">Resident Details</h4>
                <div className="space-y-1.5 text-stone-700">
                  <p><strong>Resident Full Name:</strong> {enquiry?.applicantName || 'N/A'}</p>
                  <p><strong>Birth Year / DOB:</strong> {enquiry?.dobOrYear || 'N/A'}</p>
                  <p><strong>Gender:</strong> {enquiry?.residentGender || 'Not specified'}</p>
                  <p><strong>Admission Category:</strong> {enquiry?.admissionCategory || 'Elder Care Sanctuary'}</p>
                  <p><strong>Mobility Status:</strong> {enquiry?.mobilityStatus || 'Independent'}</p>
                  <p><strong>Medical Notes:</strong> {enquiry?.medicalNotes || 'None'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-foundation-forest border-b pb-1">Guardian & Contact Information</h4>
                <div className="space-y-1.5 text-stone-700">
                  <p><strong>Guardian First Name:</strong> {enquiry?.guardianFirstName || 'N/A'}</p>
                  <p><strong>Relation with Senior:</strong> {enquiry?.relationWithResident || 'Guardian'}</p>
                  <p><strong>Guardian Phone:</strong> {enquiry?.guardianPhone || 'N/A'}</p>
                  <p><strong>Email Address:</strong> {enquiry?.applicantEmail || user?.email || 'N/A'}</p>
                  <p><strong>Residential Address:</strong> {enquiry?.address || 'N/A'}</p>
                  <p><strong>Registration ID:</strong> <span className="font-mono font-bold text-foundation-forest">{registrationId}</span></p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-foundation-warmGray rounded-2xl border text-xs text-stone-600">
              <p><strong>Security Note:</strong> These records are securely stored in the foundation database. Only authorized Ashram Administrators have permissions to update status or record evaluations.</p>
            </div>
          </div>
        )}

        {/* TAB 3: STATUS CHANGE HISTORY TIMELINE */}
        {activeTab === 'history' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h3 className="font-display font-bold text-base text-foundation-charcoal border-b pb-3">
              Admission Review & Status Timeline
            </h3>

            {statusHistory.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No status changes recorded yet.</p>
            ) : (
              <div className="space-y-4">
                {statusHistory.map((item: any, idx: number) => (
                  <div key={item.id || idx} className="flex items-start space-x-3 text-xs">
                    <div className="w-7 h-7 rounded-full bg-foundation-forest/10 border border-foundation-forest/30 text-foundation-forest flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <div className="flex-1 p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold uppercase tracking-wider text-[11px] text-foundation-forest">
                          Status: {item.status.replace('_', ' ')}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {new Date(item.date).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{item.notes}</p>
                      <p className="text-[10px] text-stone-400">Updated By: {item.updatedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h3 className="font-display font-bold text-base text-foundation-charcoal border-b pb-3 flex items-center space-x-2">
              <Bell className="w-5 h-5 text-foundation-forest" />
              <span>Admission Notifications</span>
            </h3>

            {notifications.length === 0 ? (
              <p className="text-xs text-stone-500 italic">No notifications received yet.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif: any) => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border text-xs space-y-1.5 transition-all ${
                      notif.isRead ? 'bg-foundation-warmGray border-stone-200' : 'bg-emerald-50/60 border-emerald-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-stone-800">{notif.title}</h4>
                      <span className="text-[10px] text-stone-400">
                        {new Date(notif.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                    <p className="text-stone-600 leading-relaxed">{notif.message}</p>
                    {!notif.isRead && (
                      <button
                        onClick={() => markNotificationRead(notif.id)}
                        className="text-[11px] font-bold text-foundation-forest hover:underline pt-1 block"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* Password Rotation Modal */}
      {showPasswordChangeModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 md:p-8 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <KeyRound className="w-5 h-5 text-foundation-forest" />
                <h3 className="font-display font-bold text-base text-foundation-charcoal">
                  Change Password
                </h3>
              </div>
              {!user?.mustChangePassword && (
                <button
                  type="button"
                  onClick={() => setShowPasswordChangeModal(false)}
                  className="text-stone-400 hover:text-stone-600 text-lg font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {user?.mustChangePassword && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900">
                <p className="font-bold">Initial Password Security Update:</p>
                <p className="mt-0.5">For your account security, please replace the initial formula password with your own secure password.</p>
              </div>
            )}

            {passError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800">
                {passError}
              </div>
            )}
            {passSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                {passSuccess}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <PasswordField
                label="Current Password *"
                id="current-password-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current or default initial password"
                required
              />

              <PasswordField
                label="New Password (min 8 characters) *"
                id="new-password-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new secure password"
                required
              />

              <PasswordField
                label="Confirm New Password *"
                id="confirm-password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your new password"
                required
              />

              <div className="flex justify-end space-x-2 pt-2">
                {!user?.mustChangePassword && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordChangeModal(false)}
                    className="px-4 py-2 border rounded-full text-xs font-semibold text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isChangingPass}
                  id="confirm-change-password-btn"
                  className="px-6 py-2 bg-foundation-forest text-foundation-ivory font-bold text-xs rounded-full shadow hover:bg-foundation-forestLight disabled:opacity-50 flex items-center space-x-1.5"
                >
                  {isChangingPass && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
