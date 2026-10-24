import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Shield, Phone, Mail, MapPin, KeyRound,
  FileText, Clock, Heart, CheckCircle2, AlertCircle, LogOut, Save
} from 'lucide-react';
import { apiRequest, clearAuthToken } from '../../api';
import { PasswordField } from '../../components/ui/PasswordField';

interface UserData {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: string;
  createdAt: string;
}

interface MemberProfile {
  id: string;
  memberId: string;
  address: string;
  emergencyContact: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  status: string;
  joinedAt: string;
}

interface MyEnquiries {
  admissions: any[];
  volunteers: any[];
  donations: any[];
  membershipRequests: any[];
}

export const MemberDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserData | null>(null);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [enquiries, setEnquiries] = useState<MyEnquiries | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'enquiries' | 'security'>('profile');
  const [isLoading, setIsLoading] = useState(true);

  // Profile Edit State
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password Change State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ text: '', isError: false });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const profileRes = await apiRequest<{
        success: boolean;
        user: UserData;
        profile: MemberProfile;
      }>('/member/profile');

      if (profileRes.success) {
        setUser(profileRes.user);
        setProfile(profileRes.profile);
        if (profileRes.profile) {
          setAddress(profileRes.profile.address || '');
          setEmergencyContact(profileRes.profile.emergencyContact || '');
          setBloodGroup(profileRes.profile.bloodGroup || '');
        }
      }

      const enquiriesRes = await apiRequest<{
        success: boolean;
        data: MyEnquiries;
      }>('/member/my-enquiries');

      if (enquiriesRes.success) {
        setEnquiries(enquiriesRes.data);
      }
    } catch (err) {
      clearAuthToken();
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileMsg('');
    try {
      const res = await apiRequest<{ success: boolean; message: string; profile: MemberProfile }>(
        '/member/profile',
        {
          method: 'PUT',
          body: JSON.stringify({ address, emergencyContact, bloodGroup }),
        }
      );
      if (res.success) {
        setProfile(res.profile);
        setProfileMsg('Profile updated successfully.');
      }
    } catch (err: any) {
      setProfileMsg('Failed to update profile: ' + err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingPass(true);
    setPassMsg({ text: '', isError: false });

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
      setPassMsg({ text: err.message || 'Failed to update password.', isError: true });
    } finally {
      setIsChangingPass(false);
    }
  };

  const handleLogout = () => {
    clearAuthToken();
    navigate('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-foundation-ivory flex items-center justify-center p-8">
        <p className="text-xs text-stone-500">Loading member portal...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foundation-ivory py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8 space-y-8">
        {/* Top Profile Summary Bar */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full bg-foundation-forest text-foundation-ivory flex items-center justify-center font-bold text-xl border-2 border-foundation-gold shadow-md">
              {user?.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl md:text-2xl font-display font-bold text-foundation-charcoal">
                  {user?.fullName}
                </h1>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  Verified Member
                </span>
              </div>
              <p className="text-xs text-stone-500">
                Member ID: <strong className="text-foundation-forest">{profile?.memberId || 'PENDING'}</strong> • Joined: {new Date(user?.createdAt || '').toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-2 border-b border-foundation-borderMuted pb-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'profile'
                ? 'bg-foundation-forest text-foundation-ivory shadow'
                : 'bg-white text-stone-700 border border-foundation-borderMuted'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'enquiries'
                ? 'bg-foundation-forest text-foundation-ivory shadow'
                : 'bg-white text-stone-700 border border-foundation-borderMuted'
            }`}
          >
            My Submitted Enquiries
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 rounded-full transition-all ${
              activeTab === 'security'
                ? 'bg-foundation-forest text-foundation-ivory shadow'
                : 'bg-white text-stone-700 border border-foundation-borderMuted'
            }`}
          >
            Security & Password
          </button>
        </div>

        {/* Tab 1: Profile Editor */}
        {activeTab === 'profile' && (
          <form onSubmit={handleUpdateProfile} className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-6">
            <h2 className="text-lg font-display font-bold text-foundation-charcoal border-b border-foundation-borderMuted pb-3">
              Member Account Details
            </h2>

            {profileMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
                {profileMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full bg-stone-100 border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs text-stone-600 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Mobile Number</label>
                <input
                  type="tel"
                  disabled
                  value={user?.mobile || ''}
                  className="w-full bg-stone-100 border border-foundation-borderMuted rounded-xl px-4 py-2 text-xs text-stone-600 cursor-not-allowed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-stone-700 mb-1">Residential Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street, City, District"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Emergency Contact Phone</label>
                <input
                  type="tel"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. +91 98..."
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Blood Group (Optional)</label>
                <input
                  type="text"
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  placeholder="e.g. O+, B+, A+"
                  className="w-full bg-foundation-warmGray border border-foundation-borderMuted rounded-xl px-4 py-2.5 text-xs text-foundation-charcoal focus:ring-2 focus:ring-foundation-forest focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={isSavingProfile}
                className="px-6 py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory text-xs font-bold rounded-full shadow transition-all flex items-center space-x-1.5"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{isSavingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: My Submitted Enquiries */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6">
            {/* Admissions */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-4">
              <h3 className="font-display font-bold text-base text-foundation-charcoal flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-600" />
                <span>Admission Enquiries ({enquiries?.admissions.length || 0})</span>
              </h3>

              {enquiries?.admissions.length === 0 ? (
                <p className="text-xs text-stone-500 italic">No admission enquiries submitted under your account.</p>
              ) : (
                <div className="space-y-3">
                  {enquiries?.admissions.map((adm: any) => (
                    <div key={adm.id} className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foundation-forest">Resident: {adm.residentName} (Age: {adm.residentAge})</span>
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                          Status: {adm.status}
                        </span>
                      </div>
                      <p className="text-stone-600">Mobility: {adm.mobilityStatus} • Relation: {adm.relationWithResident}</p>
                      {adm.notes && <p className="text-foundation-gold font-medium">Office Note: {adm.notes}</p>}
                      <p className="text-[10px] text-stone-400">Ref: {adm.id} • Submitted: {new Date(adm.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Volunteer Seva */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-4">
              <h3 className="font-display font-bold text-base text-foundation-charcoal flex items-center space-x-2">
                <Shield className="w-4 h-4 text-foundation-forest" />
                <span>Volunteer Applications ({enquiries?.volunteers.length || 0})</span>
              </h3>

              {enquiries?.volunteers.length === 0 ? (
                <p className="text-xs text-stone-500 italic">No volunteer applications submitted yet.</p>
              ) : (
                <div className="space-y-3">
                  {enquiries?.volunteers.map((vol: any) => (
                    <div key={vol.id} className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foundation-forest">Availability: {vol.availability}</span>
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {vol.status}
                        </span>
                      </div>
                      <p className="text-stone-600">Interests: {vol.areasOfInterest?.join(', ')}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Donations */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-4">
              <h3 className="font-display font-bold text-base text-foundation-charcoal flex items-center space-x-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span>Support & Contribution Inquiries ({enquiries?.donations.length || 0})</span>
              </h3>

              {enquiries?.donations.length === 0 ? (
                <p className="text-xs text-stone-500 italic">No donation enquiries recorded.</p>
              ) : (
                <div className="space-y-3">
                  {enquiries?.donations.map((don: any) => (
                    <div key={don.id} className="p-4 bg-foundation-warmGray rounded-2xl border border-foundation-borderMuted text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foundation-forest">Type: {don.donationType}</span>
                        <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                          {don.status}
                        </span>
                      </div>
                      <p className="text-stone-600">Items / Amount: {don.amountOrItems}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Security & Password */}
        {activeTab === 'security' && (
          <form onSubmit={handleChangePassword} className="bg-white rounded-3xl p-6 md:p-8 border border-foundation-borderMuted shadow-soft space-y-5 max-w-md">
            <h2 className="text-lg font-display font-bold text-foundation-charcoal border-b border-foundation-borderMuted pb-3">
              Change Account Password
            </h2>

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
              placeholder="Enter current password"
            />

            <PasswordField
              label="New Password *"
              sublabel="Min 8 characters"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new strong password"
            />

            <button
              type="submit"
              disabled={isChangingPass}
              className="w-full py-2.5 bg-foundation-forest hover:bg-foundation-forestLight text-foundation-ivory text-xs font-bold rounded-full shadow transition-all"
            >
              {isChangingPass ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
