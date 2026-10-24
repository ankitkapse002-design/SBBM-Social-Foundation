import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DB_FILE = path.join(__dirname, '../../data/db.json');
const DB_TMP_FILE = path.join(__dirname, '../../data/db.tmp.json');

export type PortalRole = 'admin' | 'member' | 'seva_member' | 'volunteer' | 'admission_applicant';
export type ApplicationStatus = 'pending_approval' | 'under_review' | 'approved' | 'rejected' | 'changes_requested';
export type AccountStatus = 'active' | 'suspended' | 'deactivated' | 'pending';
export type TaskStatus = 'not_started' | 'in_progress' | 'submitted' | 'completed' | 'rejected_for_revision' | 'cancelled';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'urgent';
export type AdmissionStatus = 'pending_review' | 'approved' | 'rejected' | 'more_info_required';

export interface AdmissionStatusHistoryItem {
  id: string;
  status: AdmissionStatus;
  date: string;
  updatedBy: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  mobile: string;
  passwordHash: string;
  role: PortalRole;
  portalId?: string;
  accountStatus?: AccountStatus;
  isVerified: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export function generatePortalId(prefix: 'SM' | 'MEM' | 'VOL' | 'ADM'): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `SSBM-${prefix}-${year}-${randomNum}`;
}

export function generateAdmissionPassword(guardianFirstName: string, dobOrYear?: string): string {
  let year = '1985';
  if (dobOrYear) {
    const match = dobOrYear.match(/(\d{4})/);
    if (match) year = match[1];
    else if (!isNaN(Number(dobOrYear))) year = dobOrYear.trim();
  }
  const cleanName = guardianFirstName.trim().replace(/[^a-zA-Z]/g, '');
  const formattedName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
  return `${formattedName || 'Guardian'}${year}`;
}

export function generateInitialPassword(fullName: string, dobString?: string): string {
  let year = '2000';
  if (dobString) {
    const match = dobString.match(/(\d{4})/);
    if (match) year = match[1];
  }
  const cleanName = fullName.replace(/[^a-zA-Z]/g, '').toUpperCase();
  let prefix = cleanName.substring(0, 4);
  if (prefix.length < 4) {
    prefix = prefix.padEnd(4, 'X');
  }
  return `${prefix}${year}`;
}

export interface SevaMemberProfile {
  id: string;
  userId: string;
  memberId: string;
  fullName: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  profilePhotoUrl?: string;
  sevaPreferences: string[];
  emergencyContact: string;
  bloodGroup?: string;
  notes?: string;
  applicationStatus: ApplicationStatus;
  rejectionReason?: string;
  adminNotes?: string;
  joinedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface SocietyMemberProfile {
  id: string;
  userId: string;
  membershipId: string;
  fullName: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  qualifications: string;
  skills: string[];
  areasOfInterest: string[];
  availability: string;
  occupation?: string;
  membershipTier?: 'Life Member' | 'Patron' | 'Executive Member' | 'Active Member';
  applicationStatus: ApplicationStatus;
  rejectionReason?: string;
  adminNotes?: string;
  joinedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  volunteerId: string;
  fullName: string;
  dob: string;
  mobile: string;
  email: string;
  address: string;
  skills: string[];
  preferredActivities: string[];
  availability: string;
  experience?: string;
  applicationStatus: ApplicationStatus;
  rejectionReason?: string;
  adminNotes?: string;
  joinedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
}

export interface ProjectMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  leadMemberId?: string;
  leadMemberName?: string;
  teamMemberIds: string[];
  priority: PriorityLevel;
  startDate: string;
  deadline: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  milestones: ProjectMilestone[];
  documents?: ProjectDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskProgressUpdate {
  id: string;
  date: string;
  notes: string;
  progressPercent: number;
}

export interface PortalTask {
  id: string;
  title: string;
  description: string;
  category: 'seva_member' | 'member' | 'volunteer';
  assignedToId: string;
  assignedToName: string;
  assignedToRole: string;
  projectId?: string;
  projectTitle?: string;
  priority: PriorityLevel;
  startDate: string;
  deadline: string;
  status: TaskStatus;
  instructions: string;
  attachments?: string[];
  progressUpdates: TaskProgressUpdate[];
  completionEvidence?: string;
  adminComments?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PortalNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'action';
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SevaRecordItem {
  id: string;
  memberId: string;
  userId: string;
  title: string;
  date: string;
  hoursSpent: number;
  location: string;
  supervisorName?: string;
  receiptNumber?: string;
  description: string;
  createdAt: string;
}

export interface MemberProfile {
  id: string;
  userId: string;
  memberId: string;
  address: string;
  emergencyContact: string;
  dateOfBirth?: string;
  bloodGroup?: string;
  status: 'active' | 'pending' | 'suspended';
  notes?: string;
  joinedAt: string;
}

export interface MembershipRequest {
  id: string;
  fullName: string;
  mobile: string;
  email: string;
  address: string;
  occupation: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: string;
  reviewedAt?: string;
}

export interface AdmissionEnquiry {
  id: string;
  registrationId: string;
  applicantName: string;
  guardianFirstName: string;
  guardianPhone: string;
  applicantEmail: string;
  dobOrYear: string;
  address: string;
  admissionCategory: string;
  residentGender: string;
  relationWithResident: string;
  mobilityStatus: string;
  medicalNotes: string;
  additionalMessage: string;
  status: AdmissionStatus;
  adminNotes?: string;
  rejectionReason?: string;
  requestedInfoNotes?: string;
  statusHistory: AdmissionStatusHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface VolunteerEnquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  areasOfInterest: string[];
  availability: string;
  message: string;
  status: 'new' | 'contacted' | 'assigned';
  createdAt: string;
}

export interface DonationEnquiry {
  id: string;
  donorName: string;
  email: string;
  phone: string;
  donationType: string;
  amountOrItems: string;
  panNumber?: string;
  address?: string;
  message?: string;
  status: 'pending' | 'acknowledged' | 'receipt_issued';
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  category: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  coverImage: string;
  status: 'upcoming' | 'completed' | 'archived';
  createdAt: string;
}

export interface GalleryAsset {
  id: string;
  title: string;
  caption: string;
  type: 'photo' | 'video';
  category: 'ashram' | 'residents' | 'goseva' | 'events' | 'naturopathy';
  mediaUrl: string;
  thumbnailUrl?: string;
  status: 'published' | 'draft';
  createdAt: string;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  operationalStatus: 'active' | 'under_expansion' | 'draft';
  image: string;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  orderIndex: number;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorName: string;
  action: string;
  entity: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  member_profiles: MemberProfile[];
  membership_requests: MembershipRequest[];
  admission_enquiries: AdmissionEnquiry[];
  volunteer_enquiries: VolunteerEnquiry[];
  donation_enquiries: DonationEnquiry[];
  contact_messages: ContactMessage[];
  events: EventItem[];
  gallery_assets: GalleryAsset[];
  services: ServiceItem[];
  faqs: FAQItem[];
  audit_logs: AuditLog[];
  seva_members: SevaMemberProfile[];
  society_members: SocietyMemberProfile[];
  volunteers: VolunteerProfile[];
  projects: ProjectItem[];
  portal_tasks: PortalTask[];
  portal_notifications: PortalNotification[];
  seva_records: SevaRecordItem[];
  meta: {
    version: string;
    lastSaved: string;
    initializedAt: string;
  };
}

class Database {
  private data: DatabaseSchema;
  private isSaving = false;

  constructor() {
    this.data = this.loadDatabase();
  }

  private getDefaultData(): DatabaseSchema {
    const bootstrapPasswordHash = bcrypt.hashSync('@Ashvin2824', 10);
    const now = new Date().toISOString();

    return {
      users: [
        {
          id: 'usr_admin_bootstrap_01',
          email: 'ashwin.anjikar@ssbmfoundation.org',
          username: 'ashvin',
          fullName: 'Mr. Ashwin Vyenkatrao Anjikar',
          mobile: '+919890898081',
          passwordHash: bootstrapPasswordHash,
          role: 'admin',
          isVerified: true,
          mustChangePassword: false,
          createdAt: now,
          updatedAt: now,
        }
      ],
      member_profiles: [
        {
          id: 'mp_001',
          userId: 'usr_admin_bootstrap_01',
          memberId: 'SSBM-FND-001',
          address: 'Anjikar House, Panchpaoli, Timki Chimabai Peth, Nagpur – 440018',
          emergencyContact: '+919890898081',
          status: 'active',
          notes: 'Founder & President',
          joinedAt: '2015-08-15T00:00:00.000Z',
        }
      ],
      membership_requests: [],
      admission_enquiries: [
        {
          id: 'adm_demo_01',
          applicantName: 'Suresh Patil',
          applicantPhone: '+91 94221 12345',
          applicantEmail: 'suresh.patil@example.com',
          residentName: 'Ramchandra Patil',
          residentAge: 76,
          residentGender: 'Male',
          relationWithResident: 'Son',
          mobilityStatus: 'Walks with stick, independent for daily routine',
          medicalNotes: 'Mild hypertension, taking regular prescribed medication.',
          status: 'new',
          notes: 'Called regarding admission availability for next month.',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        }
      ],
      volunteer_enquiries: [
        {
          id: 'vol_demo_01',
          fullName: 'Pooja Kulkarni',
          email: 'pooja.k@example.com',
          phone: '+91 98230 55443',
          areasOfInterest: ['Elder Companion', 'Naturopathy & Yoga Assistance', 'Spiritual Sessions'],
          availability: 'Weekends (Saturday & Sunday mornings)',
          message: 'Interested in spending time reading and talking with residents at Mahuli.',
          status: 'new',
          createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
        }
      ],
      donation_enquiries: [
        {
          id: 'don_demo_01',
          donorName: 'Girish Deshmukh',
          email: 'g.deshmukh@example.com',
          phone: '+91 97654 32100',
          donationType: 'gaushala_fodder',
          amountOrItems: '500 kg Dry Fodder / Green Grass for cows',
          panNumber: 'ABCDE1234F',
          address: 'Ramdaspeth, Nagpur',
          message: 'Would like to arrange a delivery of fodder on Sunday in memory of my parents.',
          status: 'pending',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        }
      ],
      contact_messages: [
        {
          id: 'msg_demo_01',
          name: 'Anand Shinde',
          email: 'anand.s@example.com',
          phone: '+91 98220 98765',
          category: 'ashram_visit',
          message: 'Namaste, we would like to visit Vyenkatesh Ashram this weekend to understand the admission process.',
          status: 'unread',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        }
      ],
      events: [
        {
          id: 'evt_001',
          title: 'Annual Senior Health & Naturopathy Camp',
          slug: 'annual-senior-health-naturopathy-camp',
          description: 'A dedicated holistic wellness and routine health checkup camp for ashram residents and local senior citizens from Mahuli village.',
          category: 'Healthcare & Wellness',
          date: '2026-11-15',
          time: '09:00 AM - 02:00 PM',
          venue: 'Vyenkatesh Ashram Hall, Anjikar Bagh, Mahuli',
          coverImage: '/assets/images/naturopathy.jpg',
          status: 'upcoming',
          createdAt: now,
        },
        {
          id: 'evt_002',
          title: 'Gopashtami & Gau-Pujan Mahotsav',
          slug: 'gopashtami-gau-pujan-mahotsav',
          description: 'Special Gau-Pujan and Go-Seva celebration at Go-Seva Kendra with prayers for peace, harmony, and animal welfare.',
          category: 'Spiritual & Go-Seva',
          date: '2026-11-28',
          time: '10:00 AM - 01:00 PM',
          venue: 'Go-Seva Kendra, Vyenkatesh Ashram, Mahuli',
          coverImage: '/assets/images/goseva.jpg',
          status: 'upcoming',
          createdAt: now,
        },
        {
          id: 'evt_003',
          title: 'World Senior Citizens Day Celebration',
          slug: 'world-senior-citizens-day-celebration',
          description: 'A heartwarming celebration with musical bhajans, shared meals, and felicitation of senior residents in dignity and joy.',
          category: 'Community Celebration',
          date: '2026-08-21',
          time: '10:30 AM - 04:00 PM',
          venue: 'Vyenkatesh Ashram Veranda & Garden',
          coverImage: '/assets/images/ashram_building.jpg',
          status: 'completed',
          createdAt: now,
        }
      ],
      gallery_assets: [
        {
          id: 'gal_01',
          title: 'Vyenkatesh Ashram Main Residence',
          caption: 'Two-story serene ashram building surrounded by mango and neem orchards at Anjikar Bagh.',
          type: 'photo',
          category: 'ashram',
          mediaUrl: '/assets/images/ashram_building.jpg',
          status: 'published',
          createdAt: now,
        },
        {
          id: 'gal_02',
          title: 'Grand Entrance Double Gate',
          caption: 'The welcoming stone-pillared wrought iron double entrance gates opening outward into Anjikar Bagh.',
          type: 'photo',
          category: 'ashram',
          mediaUrl: '/assets/images/entrance_gate.jpg',
          status: 'published',
          createdAt: now,
        },
        {
          id: 'gal_03',
          title: 'Go-Seva Kendra Cow Sanctuary',
          caption: 'Clean, airy shelter providing loving care and green fodder to indigenous Gir cows.',
          type: 'photo',
          category: 'goseva',
          mediaUrl: '/assets/images/goseva.jpg',
          status: 'published',
          createdAt: now,
        },
        {
          id: 'gal_04',
          title: 'Morning Naturopathy & Yoga in Garden',
          caption: 'Peaceful morning breathing and gentle yoga sessions amidst green flowering gardens.',
          type: 'photo',
          category: 'naturopathy',
          mediaUrl: '/assets/images/naturopathy.jpg',
          status: 'published',
          createdAt: now,
        }
      ],
      services: [
        {
          id: 'srv_01',
          slug: 'old-age-home',
          title: 'Vyenkatesh Ashram Old-Age Home',
          shortDesc: 'A safe, clean, supportive and dignified residential living environment for senior citizens in need.',
          fullDesc: 'Vyenkatesh Ashram provides seniors with a home of peace, companionship, and respect. Located in the tranquil rural setting of Anjikar Bagh, Mahuli (near Mansar), the ashram offers comfortable living spaces, nutritious vegetarian meals, separate clean restroom facilities, and daily opportunities for social and mental rejuvenation.',
          benefits: [
            'Safe, clean, dignified living environment',
            'Nutritious home-cooked vegetarian meals',
            'Round-the-clock supportive staff and care',
            'Calm rural atmosphere away from city pollution and noise',
            'Spiritual satsang, library and daily recreational activities'
          ],
          operationalStatus: 'active',
          image: '/assets/images/ashram_building.jpg',
          createdAt: now,
        },
        {
          id: 'srv_02',
          slug: 'goseva-kendra',
          title: 'Go-Seva Kendra',
          shortDesc: 'Compassionate care, shelter and nourishment for indigenous cows promoting rural ecological harmony.',
          fullDesc: 'At Vyenkatesh Ashram, our Go-Seva Kendra houses indigenous cattle in a clean, hygienic and naturally ventilated shelter. Cow care provides therapeutic connection for the elderly residents, while offering fresh milk and organic compost for our community garden.',
          benefits: [
            'Ethical, loving care for indigenous cows',
            'Nutritious fresh milk for ashram elders',
            'Therapeutic interaction and companionship for seniors',
            'Organic composting for the ashram garden and fruit trees'
          ],
          operationalStatus: 'active',
          image: '/assets/images/goseva.jpg',
          createdAt: now,
        },
        {
          id: 'srv_03',
          slug: 'naturopathy',
          title: 'Naturopathy & Holistic Wellness',
          shortDesc: 'Gentle yoga, pranayama, herbal remedies and natural lifestyle practices for senior vitality.',
          fullDesc: 'We emphasize natural wellness to promote longevity, joint mobility, and mental peace among our residents. Morning sun exposure, gentle breathing exercises, pure herbal teas, and simple lifestyle alignment support physical and emotional balance.',
          benefits: [
            'Daily morning pranayama and gentle stretching',
            'Herbal garden with Tulsi, Neem, and medicinal plants',
            'Fresh air and sunshine therapy in Anjikar Bagh',
            'Relaxation techniques to alleviate anxiety and loneliness'
          ],
          operationalStatus: 'active',
          image: '/assets/images/naturopathy.jpg',
          createdAt: now,
        },
        {
          id: 'srv_04',
          slug: 'education',
          title: 'Rural Education & Student Welfare',
          shortDesc: 'Promoting education for underprivileged students in rural Vidarbha through study materials and guidance.',
          fullDesc: 'SBBM Social Foundation actively supports rural child and youth development by organizing book distribution drives, educational seminars, and skill training workshops in Nagpur and surrounding rural tehsils.',
          benefits: [
            'Notebook and study material distribution drives',
            'Mentorship and vocational career guidance for youth',
            'Community library access for students',
            'Support for rural school infrastructure'
          ],
          operationalStatus: 'active',
          image: '/assets/images/entrance_gate.jpg',
          createdAt: now,
        },
        {
          id: 'srv_05',
          slug: 'daily-activities',
          title: 'Daily Activities & Cultural Rejuvenation',
          shortDesc: 'Engaging daily routines including bhajan, gardening, indoor games, festival celebrations and walks.',
          fullDesc: 'A purposeful day keeps the mind active and joyful. Our daily schedule includes morning garden walks, community prayer, newspaper reading, board games (carrom, chess), devotional music, and festive gatherings with visiting families and volunteers.',
          benefits: [
            'Scheduled daily routine encouraging active lifestyle',
            'Celebration of all traditional Indian festivals',
            'Interactive storytelling and intergenerational volunteer visits',
            'Peaceful sitting areas under shaded fruit trees'
          ],
          operationalStatus: 'active',
          image: '/assets/images/ashram_building.jpg',
          createdAt: now,
        },
        {
          id: 'srv_06',
          slug: 'medical-care',
          title: 'Basic Healthcare & Routine Monitoring',
          shortDesc: 'Vital sign checks, medicine administration assistance, and access to local medical practitioners.',
          fullDesc: 'We maintain routine health records, organize regular visiting doctor consultations, assist residents with their daily medication schedules, and coordinate with nearby healthcare centers in Parseoni and Nagpur for specialized care.',
          benefits: [
            'Regular blood pressure, sugar, and vital monitoring',
            'Medication administration assistance for all residents',
            'First aid and emergency transport coordination to Nagpur',
            'Periodic specialist health checkup camps on-site'
          ],
          operationalStatus: 'active',
          image: '/assets/images/naturopathy.jpg',
          createdAt: now,
        }
      ],
      faqs: [
        {
          id: 'faq_01',
          question: 'What is the procedure for admission to Vyenkatesh Ashram?',
          answer: 'Admission requires submitting an initial enquiry form or visiting our office. Because we maintain high care standards and limited capacity, accommodation availability, medical suitability, and admission formalities must be confirmed directly with the management (+91 98908 98081). Submitting an online enquiry does not guarantee immediate admission.',
          category: 'admission',
          orderIndex: 1,
          createdAt: now,
        },
        {
          id: 'faq_02',
          question: 'Where is Vyenkatesh Ashram located?',
          answer: 'The ashram is located at 434, Anjikar Bagh, Mansar Mahuli Road, Village/Post Mahuli, Tehsil Parseoni, District Nagpur, Maharashtra – 441105. The Foundation Head Office is located at C/o Ashvin V. Anjikar, Anjikar House, Panchpaoli, Timki Chimabai Peth, Nagpur – 440018.',
          category: 'ashram_life',
          orderIndex: 2,
          createdAt: now,
        },
        {
          id: 'faq_03',
          question: 'Is SBBM Social Foundation a registered organization?',
          answer: 'Yes, SBBM Social Foundation Society was established in 2015 and is officially registered under the Societies Registration Act (Reg No: 332-15-Nag). It operates Vyenkatesh Ashram as a charitable, non-granted old-age home.',
          category: 'admission',
          orderIndex: 3,
          createdAt: now,
        },
        {
          id: 'faq_04',
          question: 'Can families and well-wishers visit the ashram?',
          answer: 'Yes, family visits and community well-wishers are welcomed. Prior notification via telephone (+91 98908 98081) is requested to ensure resident rest hours and daily schedules are respected.',
          category: 'ashram_life',
          orderIndex: 4,
          createdAt: now,
        },
        {
          id: 'faq_05',
          question: 'How can I support the ashram through donations or seva?',
          answer: 'You can support us through direct bank transfer, contributing daily provisions (grains, oil, groceries), medicines, blankets, or green fodder for our Go-Seva Kendra cows. Official receipts are issued for all contributions. Contact our office directly for verified bank account details.',
          category: 'donations',
          orderIndex: 5,
          createdAt: now,
        },
        {
          id: 'faq_06',
          question: 'How can I become a volunteer or member?',
          answer: 'You can submit an online volunteer or membership application through our website. Our team will contact you to discuss your interests, availability, and verify membership eligibility.',
          category: 'membership',
          orderIndex: 6,
          createdAt: now,
        }
      ],
      audit_logs: [
        {
          id: 'log_boot_01',
          actorId: 'usr_admin_bootstrap_01',
          actorName: 'System Bootstrap',
          action: 'SYSTEM_INITIALIZE',
          entity: 'Database',
          details: 'Initialized database with verified SBBM Foundation records and bootstrap administrator.',
          createdAt: now,
        }
      ],
      seva_members: [],
      society_members: [],
      volunteers: [],
      projects: [],
      portal_tasks: [],
      portal_notifications: [],
      seva_records: [],
      meta: {
        version: '1.0.0',
        lastSaved: now,
        initializedAt: now,
      }
    };
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (!parsed.seva_members) parsed.seva_members = [];
        if (!parsed.society_members) parsed.society_members = [];
        if (!parsed.volunteers) parsed.volunteers = [];
        if (!parsed.projects) parsed.projects = [];
        if (!parsed.portal_tasks) parsed.portal_tasks = [];
        if (!parsed.portal_notifications) parsed.portal_notifications = [];
        if (!parsed.seva_records) parsed.seva_records = [];
        if (!parsed.admission_enquiries) parsed.admission_enquiries = [];

        // Backfill and migrate admission enquiries
        parsed.admission_enquiries.forEach((adm: any) => {
          if (!adm.registrationId) {
            adm.registrationId = generatePortalId('ADM');
          }
          if (!adm.applicantName && adm.residentName) {
            adm.applicantName = adm.residentName;
          }
          if (!adm.guardianPhone && adm.applicantPhone) {
            adm.guardianPhone = adm.applicantPhone;
          }
          if (!adm.guardianFirstName) {
            adm.guardianFirstName = adm.applicantName ? adm.applicantName.split(' ')[0] : 'Guardian';
          }
          if (!adm.dobOrYear) {
            adm.dobOrYear = adm.residentAge ? String(new Date().getFullYear() - Number(adm.residentAge)) : '1950';
          }
          if (!adm.address) {
            adm.address = 'Nagpur, Maharashtra';
          }
          if (!adm.admissionCategory) {
            adm.admissionCategory = 'Elder Care Sanctuary';
          }
          if (!adm.additionalMessage && adm.medicalNotes) {
            adm.additionalMessage = adm.medicalNotes;
          }
          if (!['pending_review', 'approved', 'rejected', 'more_info_required'].includes(adm.status)) {
            adm.status = 'pending_review';
          }
          if (!adm.statusHistory || !Array.isArray(adm.statusHistory)) {
            adm.statusHistory = [
              {
                id: `hist_${Date.now()}_init`,
                status: adm.status || 'pending_review',
                date: adm.createdAt || new Date().toISOString(),
                updatedBy: 'System',
                notes: 'Enquiry submitted initially.'
              }
            ];
          }
        });

        return parsed;
      }
    } catch (err) {
      console.error('Error loading db.json, generating default data:', err);
    }
    const defaultData = this.getDefaultData();
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(data: DatabaseSchema): void {
    if (this.isSaving) return;
    this.isSaving = true;
    try {
      data.meta.lastSaved = new Date().toISOString();
      const dir = path.dirname(DB_FILE);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(DB_TMP_FILE, JSON.stringify(data, null, 2), 'utf-8');
      fs.renameSync(DB_TMP_FILE, DB_FILE);
    } catch (err) {
      console.error('Error persisting database:', err);
    } finally {
      this.isSaving = false;
    }
  }

  public get<K extends keyof DatabaseSchema>(collection: K): DatabaseSchema[K] {
    return this.data[collection];
  }

  public save(): void {
    this.saveData(this.data);
  }

  public logAudit(actorId: string, actorName: string, action: string, entity: string, details: string, ip?: string): void {
    const log: AuditLog = {
      id: `log_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      actorId,
      actorName,
      action,
      entity,
      details,
      ipAddress: ip,
      createdAt: new Date().toISOString(),
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs = this.data.audit_logs.slice(0, 500);
    }
    this.save();
  }
}

export const db = new Database();
