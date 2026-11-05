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

export function generateAdmissionPassword(residentName: string, dobOrYear?: string): string {
  let year = '1985';
  if (dobOrYear) {
    const match = dobOrYear.match(/(\d{4})/);
    if (match) year = match[1];
    else if (!isNaN(Number(dobOrYear))) year = dobOrYear.trim();
  }
  const rawFirstName = (residentName || '').trim().split(/\s+/)[0];
  const cleanFirstName = rawFirstName.replace(/[^a-zA-Z]/g, '');
  let fourLetters = cleanFirstName.substring(0, 4);
  if (fourLetters.length > 0) {
    fourLetters = fourLetters.charAt(0).toUpperCase() + fourLetters.slice(1).toLowerCase();
    if (fourLetters.length < 4) {
      fourLetters = fourLetters.padEnd(4, 'X');
    }
  } else {
    fourLetters = 'Resi';
  }
  return `${fourLetters}${year}`;
}

export function generateInitialPassword(fullName: string, dobString?: string): string {
  let year = '2000';
  if (dobString) {
    const match = dobString.match(/(\d{4})/);
    if (match) year = match[1];
  }
  const cleanedName = fullName.replace(/\s*\(Guardian:.*\)$/i, '').trim();
  const rawFirst = cleanedName.split(/\s+/)[0] || '';
  const cleanFirst = rawFirst.replace(/[^a-zA-Z]/g, '').toLowerCase();
  let prefix = cleanFirst.length <= 4 ? cleanFirst : cleanFirst.substring(0, 4);
  if (!prefix) prefix = 'ssbm';
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
  residentName?: string;
  residentAge?: number;
  applicantPhone?: string;
  notes?: string;
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
  aliases?: string[];
  initiativeNumber?: string;
  category?: string;
  title: string;
  tagline?: string;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  operationalStatus: 'active' | 'under_expansion' | 'draft';
  location?: string;
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
          registrationId: 'SSBM-ADM-2026-1001',
          applicantName: 'Ramchandra Patil',
          guardianFirstName: 'Suresh',
          guardianPhone: '+91 94221 12345',
          applicantEmail: 'suresh.patil@example.com',
          dobOrYear: '1948',
          address: 'Mahuli, Nagpur',
          admissionCategory: 'Elder Care Sanctuary',
          residentName: 'Ramchandra Patil',
          residentAge: 76,
          residentGender: 'Male',
          relationWithResident: 'Son',
          mobilityStatus: 'Walks with stick, independent for daily routine',
          medicalNotes: 'Mild hypertension, taking regular prescribed medication.',
          additionalMessage: 'Called regarding admission availability for next month.',
          status: 'pending_review',
          notes: 'Called regarding admission availability for next month.',
          statusHistory: [
            {
              id: 'hist_demo_01',
              status: 'pending_review',
              date: new Date(Date.now() - 86400000 * 2).toISOString(),
              updatedBy: 'Guardian',
              notes: 'Initial registration received online.'
            }
          ],
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
          category: 'foundation_visit',
          message: 'Namaste, we would like to visit the SBBM Social Foundation Mahuli center this weekend to understand senior care opportunities.',
          status: 'unread',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        }
      ],
      events: [
        {
          id: 'evt_001',
          title: 'Annual Senior Health & Naturopathy Camp',
          slug: 'annual-senior-health-naturopathy-camp',
          description: 'A dedicated holistic wellness and routine health checkup camp for senior residents and local citizens from Mahuli village.',
          category: 'Healthcare & Wellness',
          date: '2026-11-15',
          time: '09:00 AM - 02:00 PM',
          venue: 'SBBM Social Foundation Hall, Anjikar Bagh, Mahuli',
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
          venue: 'Go-Seva Kendra, SBBM Social Foundation, Mahuli',
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
          venue: 'SBBM Social Foundation Veranda & Garden',
          coverImage: '/assets/images/ashram_building.jpg',
          status: 'completed',
          createdAt: now,
        }
      ],
      gallery_assets: [
        {
          id: 'gal_01',
          title: 'SBBM Social Foundation Main Centre',
          caption: 'Two-story serene foundation building surrounded by mango and neem orchards at Anjikar Bagh.',
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
          slug: 'elderly-care',
          aliases: ['old-age-home', 'senior-care'],
          initiativeNumber: '5.1',
          category: 'Elderly Residential Care',
          title: 'Elderly Care – Vyenkatesh Ashram (Old Age Home)',
          tagline: 'Apno Se Door... Ek Apna Ghar...',
          shortDesc: 'A dignified, loving residential sanctuary for destitute, homeless, or neglected elderly citizens (Aai-Baba) providing food, clothing, shelter, affection, security, and healthcare.',
          fullDesc: 'Initiative 5.1 of SBBM Social Foundation: Operating under the emotional motto "Apno Se Door... Ek Apna Ghar...", Vyenkatesh Ashram at Anjikar Bagh, Mahuli provides a loving, secure, and permanent residential sanctuary for elderly individuals who have been abandoned, widowed, or lack familial care. Residents are treated not as inmates, but with filial reverence as "Aai-Baba". The facility ensures nutritious vegetarian meals, clean living quarters, daily medical checkups, emotional companionship, spiritual satsang, and dignified final rites in accordance with traditional values.',
          benefits: [
            '24/7 safe, clean, and dignified residential accommodation with personal living space',
            'Three nutritious home-cooked vegetarian meals, morning tea, and evening milk daily',
            'Round-the-clock supportive attendants, routine vital checks, and visiting doctor consultations',
            'Spiritual satsang, daily morning garden walks in Anjikar Bagh, and library access',
            'Filial companionship, celebratory festivals, and dignified lifelong care'
          ],
          operationalStatus: 'active',
          location: '434, Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur',
          image: '/assets/images/ashram_building.jpg',
          createdAt: now,
        },
        {
          id: 'srv_02',
          slug: 'social-welfare',
          aliases: ['relief-distribution', 'essential-commodities'],
          initiativeNumber: '5.2',
          category: 'Grassroots Social Welfare',
          title: 'Social Welfare & Essential Commodities Distribution',
          tagline: 'Direct Grassroots Relief for the Vulnerable',
          shortDesc: 'Direct distribution of dry rations, food grains, blankets, and essential relief kits to destitute families, widows, daily-wage laborers, and disaster-affected communities.',
          fullDesc: 'Initiative 5.2 of SBBM Social Foundation: Since December 2014, the foundation has prioritized direct grassroots relief for vulnerable families across Nagpur district and rural tehsils. Interventions include regular dry ration kit drives (containing wheat flour, rice, pulses, cooking oil, spices), winter blanket distributions for homeless citizens, festive cloth donations for children, and extensive emergency food and sanitization relief during disaster and pandemic emergencies.',
          benefits: [
            'Doorstep dry ration kit distribution (wheat flour, rice, dal, cooking oil, spices)',
            'Winter relief drives providing warm blankets to homeless and street dwellers',
            'Festive clothing and footwear distribution for underprivileged children',
            'Emergency disaster and pandemic relief mobilization for daily-wage earners',
            'Targeted support for destitute widows and physically challenged individuals'
          ],
          operationalStatus: 'active',
          location: 'Nagpur District, Suburban Settlements & Rural Tehsils',
          image: '/assets/images/entrance_gate.jpg',
          createdAt: now,
        },
        {
          id: 'srv_03',
          slug: 'education-computer-literacy',
          aliases: ['education', 'computer-literacy'],
          initiativeNumber: '5.3',
          category: 'Education & Digital Skills',
          title: 'Education & Computer Literacy Program',
          tagline: 'Empowering Underprivileged Youth with 21st-Century Digital Skills',
          shortDesc: 'Practical computer education, typing certification, digital literacy, and educational study material distribution for rural and underprivileged students.',
          fullDesc: 'Initiative 5.3 of SBBM Social Foundation: Believing firmly that "Education is Development", SBBM Social Foundation conducts targeted education support and digital literacy programs. The foundation operates computer literacy centers teaching rural students basic computer handling, Marathi/Hindi/English typing, MS Office (Word, Excel, PowerPoint), and internet navigation. Additionally, annual notebook distribution drives, textbook libraries, and career guidance workshops equip rural youth for higher education and competitive employment.',
          benefits: [
            'Hands-on computer fundamentals and typing certification (Marathi, Hindi, English)',
            'Microsoft Office application training (Word, Excel, PowerPoint) for office readiness',
            'Free annual notebook, textbook, and stationery kit distribution drives',
            'Rural student library access and digital learning resources',
            'Educational mentorship and career guidance seminars for youth'
          ],
          operationalStatus: 'active',
          location: 'Nagpur & Surrounding Rural Learning Centers',
          image: '/assets/images/entrance_gate.jpg',
          createdAt: now,
        },
        {
          id: 'srv_04',
          slug: 'child-welfare',
          aliases: ['summer-camps', 'personality-development'],
          initiativeNumber: '5.4',
          category: 'Child Development & Welfare',
          title: 'Child Welfare & Personality Development',
          tagline: 'Nurturing Moral Character, Creative Potential, and Child Rights',
          shortDesc: 'Holistic child development through annual summer camps, moral value education, talent workshops, child rights awareness, and nutritional support.',
          fullDesc: 'Initiative 5.4 of SBBM Social Foundation: Dedicated to the holistic flourishing of the next generation, this initiative organizes engaging summer camps, creative workshops (drawing, drama, elocution), and moral value education classes in rural and suburban Nagpur. The foundation actively conducts child safety and awareness workshops (including POCSO guidelines and child rights), provides nutritional support, and nurtures artistic and sports talents among economically backward children.',
          benefits: [
            'Annual summer camps featuring sports, yoga, arts, and creative expression',
            'Value-based moral education and cultural heritage appreciation classes',
            'Child safety, anti-bullying, and child rights awareness drives',
            'School bag, uniform, and nutrition supplement distributions',
            'Public speaking, elocution, and leadership grooming sessions'
          ],
          operationalStatus: 'active',
          location: 'Nagpur District Schools, Community Centers & Mahuli Campus',
          image: '/assets/images/ashram_building.jpg',
          createdAt: now,
        },
        {
          id: 'srv_05',
          slug: 'women-empowerment',
          aliases: ['shg-development', 'livelihood-training'],
          initiativeNumber: '5.5',
          category: 'Women Empowerment & Livelihoods',
          title: 'Women’s Empowerment & Livelihood Development',
          tagline: 'Promoting Self-Reliance, Dignity, and Financial Independence',
          shortDesc: 'Mobilization and mentoring of Self-Help Groups (SHGs), vocational training in tailoring and crafts, financial literacy, and micro-enterprise development.',
          fullDesc: 'Initiative 5.5 of SBBM Social Foundation: Under the core pillar "Self-Reliance is the Foundation of an Empowered Society", the foundation mobilizes rural and semi-urban women into active Self-Help Groups (SHGs). We provide vocational training in tailoring, garment stitching, handicraft making, and local food processing (pickles, papads, spices). Through banking literacy, micro-savings facilitation, and direct market linkage, women are empowered to generate independent family income and build community leadership.',
          benefits: [
            'Mobilization and structured guidance of Mahila Bachat Gats (Self-Help Groups)',
            'Professional tailoring, sewing, and handicraft training workshops',
            'Financial literacy, micro-credit access, and bank linkage facilitation',
            'Marketing support and exhibition stalls for home-made goods and handicrafts',
            'Legal awareness sessions on women\'s rights and domestic welfare'
          ],
          operationalStatus: 'active',
          location: 'Rural Vidarbha & Semi-Urban Clusters',
          image: '/assets/images/entrance_gate.jpg',
          createdAt: now,
        },
        {
          id: 'srv_06',
          slug: 'healthcare-public-health',
          aliases: ['medical-care', 'health-camps'],
          initiativeNumber: '5.6',
          category: 'Public Health & Preventive Medicine',
          title: 'Healthcare & Public Health Awareness',
          tagline: 'Preventive Medicine, Health Camps, and Community Wellbeing',
          shortDesc: 'Free diagnostic health camps, eye checkups, preventive medicine, hygiene drives, substance de-addiction, and chronic illness awareness.',
          fullDesc: 'Initiative 5.6 of SBBM Social Foundation: Good health is an essential prerequisite for community empowerment. The foundation organizes periodic free medical checkup camps in rural villages and urban slums, offering general health screening, eye checkups with free spectacles, blood pressure and diabetes monitoring, and basic medicine distribution. Extensive public awareness campaigns address substance de-addiction (tobacco/alcohol), menstrual hygiene, tuberculosis (TB) detection, and cancer prevention.',
          benefits: [
            'Free multi-specialty health checkups with qualified visiting medical practitioners',
            'Free vision screening, eye examinations, and spectacles distribution',
            'Tobacco and alcohol de-addiction counseling and youth awareness sessions',
            'Community sanitation, clean water, and menstrual hygiene awareness drives',
            'Chronic disease awareness (Hypertension, Diabetes, TB, and Cancer screening)'
          ],
          operationalStatus: 'active',
          location: 'Village Camps & Slum Clusters across Nagpur District',
          image: '/assets/images/naturopathy.jpg',
          createdAt: now,
        },
        {
          id: 'srv_07',
          slug: 'cow-protection',
          aliases: ['goseva-kendra', 'gaushala'],
          initiativeNumber: '5.7',
          category: 'Animal Welfare & Ecology',
          title: 'Cow Protection & Animal Welfare – Shri Go Seva & Go Sanvardhan Kendra',
          tagline: 'Sanctuary for Indigenous Cattle & Sustainable Ecological Living',
          shortDesc: 'Compassionate sanctuary, veterinary care, nutritious fodder, and dignified lifetime shelter for abandoned, aging, and injured cows at Mahuli Centre.',
          fullDesc: 'Initiative 5.7 of SBBM Social Foundation: Located in the green environment of Anjikar Bagh, Mahuli, Shri Go Seva & Go Sanvardhan Kendra provides ethical shelter, green and dry fodder, freshwater, and veterinary care for indigenous cows. Beyond animal protection, the Kendra serves a vital therapeutic role: elderly ashram residents find companionship and peace interacting with the gentle cattle. Organic cow-dung and gomutra are utilized for natural composting, nourishing the surrounding fruit orchards without chemical pesticides.',
          benefits: [
            'Permanent humane shelter and daily care for indigenous abandoned or aged cows',
            'Nutritious green grass, dry fodder, cattle feed, and clean drinking water',
            'Periodic veterinary checkups, vaccination, and specialized medical treatments',
            'Organic composting and biogas utilizing cow dung for eco-friendly farming',
            'Therapeutic bovine interaction and spiritual Go-Pujan for ashram residents'
          ],
          operationalStatus: 'active',
          location: 'Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur',
          image: '/assets/images/goseva.jpg',
          createdAt: now,
        },
        {
          id: 'srv_08',
          slug: 'natural-therapy',
          aliases: ['naturopathy', 'aarogyam-kendra'],
          initiativeNumber: '5.8',
          category: 'Naturopathy & Holistic Wellness',
          title: 'Natural Therapy & Health Support – Aarogyam Prakritik Chikitsa Kendra',
          tagline: 'Drugless Healing, Naturopathy, and Holistic Rejuvenation (Inaugurated 6 Dec 2018)',
          shortDesc: 'Natural drugless therapy, dietetics, hydrotherapy, mud packs, yoga, and lifestyle disease management established on 6 December 2018.',
          fullDesc: 'Initiative 5.8 of SBBM Social Foundation: Formally inaugurated on 6 December 2018 at Anjikar Bagh, Mahuli, Aarogyam Prakritik Chikitsa Kendra is dedicated to promoting holistic healing without chemical drugs. Emphasizing the body\'s innate power to heal itself, the center offers free natural therapy consultations on weekends/Sundays. Therapies include hydrotherapy (hip baths, spinal baths), mud packs, sun therapy, diet counseling, acupressure, and therapeutic yoga/pranayama to manage joint pain, hypertension, digestive issues, and chronic fatigue.',
          benefits: [
            'Free Sunday naturopathy and holistic health consultation camps',
            'Hydrotherapy, mud packs, steam therapy, and natural detox treatments',
            'Personalized dietary guidelines based on natural wholesome foods',
            'Daily therapeutic yoga, pranayama, and guided relaxation routines',
            'Drugless management of lifestyle ailments (arthritis, diabetes, acidity, stress)'
          ],
          operationalStatus: 'active',
          location: 'Anjikar Bagh, Mansar Mahuli Road, Mahuli, Parseoni, Nagpur',
          image: '/assets/images/naturopathy.jpg',
          createdAt: now,
        }
      ],
      faqs: [
        {
          id: 'faq_01',
          question: 'What is the procedure for admission to the Senior Care Sanctuary?',
          answer: 'Admission requires submitting an initial enquiry form or visiting our office. Because we maintain high care standards and limited capacity, accommodation availability, medical suitability, and admission formalities must be confirmed directly with the management (+91 98908 98081). Submitting an online enquiry does not guarantee immediate admission.',
          category: 'admission',
          orderIndex: 1,
          createdAt: now,
        },
        {
          id: 'faq_02',
          question: 'Where is SBBM Social Foundation located?',
          answer: 'The foundation centre is located at 434, Anjikar Bagh, Mansar Mahuli Road, Village/Post Mahuli, Tehsil Parseoni, District Nagpur, Maharashtra – 441105. The Foundation Head Office is located at C/o Ashvin V. Anjikar, Anjikar House, Panchpaoli, Timki Chimabai Peth, Nagpur – 440018.',
          category: 'ashram_life',
          orderIndex: 2,
          createdAt: now,
        },
        {
          id: 'faq_03',
          question: 'Is SBBM Social Foundation a registered organization?',
          answer: 'Yes, SBBM Social Foundation Society was established in 2015 and is officially registered under the Societies Registration Act (Reg No: 332-15-Nag). It operates as a charitable social welfare society.',
          category: 'admission',
          orderIndex: 3,
          createdAt: now,
        },
        {
          id: 'faq_04',
          question: 'Can families and well-wishers visit the foundation centre?',
          answer: 'Yes, family visits and community well-wishers are welcomed. Prior notification via telephone (+91 98908 98081) is requested to ensure resident rest hours and daily schedules are respected.',
          category: 'ashram_life',
          orderIndex: 4,
          createdAt: now,
        },
        {
          id: 'faq_05',
          question: 'How can I support the foundation through donations or seva?',
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

export function getInitialPasswordCandidates(user: User): string[] {
  const candidates = new Set<string>();
  if (!user) return [];

  let fullName = user.fullName || '';
  let dob = '2000-01-01';

  if (user.role === 'seva_member') {
    const sm = db.get('seva_members').find(x => x.userId === user.id || x.memberId === user.portalId || x.memberId === user.username);
    if (sm) {
      if (sm.fullName) fullName = sm.fullName;
      if (sm.dob) dob = sm.dob;
    }
  } else if (user.role === 'volunteer') {
    const vol = db.get('volunteers').find(x => x.userId === user.id || x.volunteerId === user.portalId || x.volunteerId === user.username);
    if (vol) {
      if (vol.fullName) fullName = vol.fullName;
      if (vol.dob) dob = vol.dob;
    }
  } else if (user.role === 'member') {
    const mem = db.get('society_members').find(x => x.userId === user.id || x.membershipId === user.portalId || x.membershipId === user.username);
    if (mem) {
      if (mem.fullName) fullName = mem.fullName;
      if (mem.dob) dob = mem.dob;
    }
  } else if (user.role === 'admission_applicant') {
    const adm = db.get('admission_enquiries').find(x => x.registrationId === user.portalId || x.registrationId === user.username || x.id === user.portalId);
    if (adm) {
      if (adm.applicantName) fullName = adm.applicantName;
      if (adm.dobOrYear) dob = adm.dobOrYear;
    }
  }

  // Extract year
  const matchYear = (dob || '').match(/(\d{4})/);
  const year = matchYear ? matchYear[1] : '2000';

  // Clean first name (ignoring any guardian annotations like "(Guardian: ...)")
  const cleanedName = fullName.replace(/\s*\(Guardian:.*\)$/i, '').trim();
  const rawFirst = cleanedName.split(/\s+/)[0] || '';
  const cleanFirst = rawFirst.replace(/[^a-zA-Z]/g, '');

  if (cleanFirst.length > 0) {
    const four = cleanFirst.substring(0, 4).padEnd(4, 'X');
    const exactPrefix = cleanFirst.length <= 4 ? cleanFirst : cleanFirst.substring(0, 4);

    // 4-letter variants
    candidates.add(`${four.toUpperCase()}${year}`);                                              // e.g. HARR2000
    candidates.add(`${four.charAt(0).toUpperCase() + four.slice(1).toLowerCase()}${year}`);       // e.g. Harr2000
    candidates.add(`${four.toLowerCase()}${year}`);                                              // e.g. harr2000

    // Exact prefix variants (for short names like "Om" -> "om2004", "OM2004")
    candidates.add(`${exactPrefix.toLowerCase()}${year}`);
    candidates.add(`${exactPrefix.toUpperCase()}${year}`);
    candidates.add(`${exactPrefix.charAt(0).toUpperCase() + exactPrefix.slice(1).toLowerCase()}${year}`);

    // Full first name variants (e.g. "Harry", "Rahul", "Ananya")
    candidates.add(`${cleanFirst.toUpperCase()}${year}`);                                        // e.g. HARRY2000
    candidates.add(`${cleanFirst.charAt(0).toUpperCase() + cleanFirst.slice(1).toLowerCase()}${year}`); // e.g. Harry2000
    candidates.add(`${cleanFirst.toLowerCase()}${year}`);                                        // e.g. harry2000

    // Full name without spaces (e.g. if single word name)
    const allLetters = cleanedName.replace(/[^a-zA-Z]/g, '');
    if (allLetters.length > 0 && allLetters.length <= 10) {
      candidates.add(`${allLetters.toUpperCase()}${year}`);
      candidates.add(`${allLetters.charAt(0).toUpperCase() + allLetters.slice(1).toLowerCase()}${year}`);
      candidates.add(`${allLetters.toLowerCase()}${year}`);
    }
  }

  return Array.from(candidates);
}
