import { Router, Request, Response } from 'express';
import { db, AdmissionEnquiry, VolunteerEnquiry, DonationEnquiry, ContactMessage, MembershipRequest } from '../db';
import { rateLimit } from '../middleware/auth';

export const enquiriesRouter = Router();

// 1. Admission Enquiry
enquiriesRouter.post('/admission', rateLimit(60000, 10), (req: Request, res: Response) => {
  try {
    const {
      applicantName,
      applicantPhone,
      applicantEmail,
      residentName,
      residentAge,
      residentGender,
      relationWithResident,
      mobilityStatus,
      medicalNotes,
    } = req.body;

    if (!applicantName || !applicantPhone || !residentName || !residentAge) {
      res.status(400).json({
        success: false,
        message: 'Applicant name, contact number, resident name, and age are mandatory.'
      });
      return;
    }

    const now = new Date().toISOString();
    const id = `adm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const enquiry: AdmissionEnquiry = {
      id,
      applicantName: applicantName.trim(),
      applicantPhone: applicantPhone.trim(),
      applicantEmail: applicantEmail?.trim() || '',
      residentName: residentName.trim(),
      residentAge: Number(residentAge),
      residentGender: residentGender || 'Not specified',
      relationWithResident: relationWithResident || 'Family / Relative',
      mobilityStatus: mobilityStatus || 'Independent',
      medicalNotes: medicalNotes?.trim() || 'None reported',
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };

    db.get('admission_enquiries').unshift(enquiry);
    db.save();

    db.logAudit(
      'public',
      enquiry.applicantName,
      'ADMISSION_ENQUIRY_SUBMITTED',
      'AdmissionEnquiry',
      `Admission enquiry registered for resident ${residentName} (Ref: ${id})`,
      req.ip
    );

    res.status(201).json({
      success: true,
      referenceId: id,
      message: 'Admission enquiry submitted successfully. Our team will contact you shortly to review accommodation availability.',
      contactNotice: 'For urgent admission queries, you may also reach management directly at +91 98908 98081.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to process admission enquiry: ' + err.message });
  }
});

// 2. Volunteer Enquiry
enquiriesRouter.post('/volunteer', rateLimit(60000, 10), (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, areasOfInterest, availability, message } = req.body;

    if (!fullName || !phone) {
      res.status(400).json({ success: false, message: 'Full name and phone number are required.' });
      return;
    }

    const now = new Date().toISOString();
    const id = `vol_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const enquiry: VolunteerEnquiry = {
      id,
      fullName: fullName.trim(),
      email: email?.trim() || '',
      phone: phone.trim(),
      areasOfInterest: Array.isArray(areasOfInterest) ? areasOfInterest : ['General Seva'],
      availability: availability || 'Flexible',
      message: message?.trim() || '',
      status: 'new',
      createdAt: now,
    };

    db.get('volunteer_enquiries').unshift(enquiry);
    db.save();

    db.logAudit('public', enquiry.fullName, 'VOLUNTEER_ENQUIRY', 'VolunteerEnquiry', `Volunteer signed up: ${fullName}`, req.ip);

    res.status(201).json({
      success: true,
      referenceId: id,
      message: 'Thank you for offering your seva. Our volunteer coordinator will reach out to you.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to submit volunteer application: ' + err.message });
  }
});

// 3. Donation / Support Enquiry
enquiriesRouter.post('/donation', rateLimit(60000, 10), (req: Request, res: Response) => {
  try {
    const { donorName, email, phone, donationType, amountOrItems, panNumber, address, message } = req.body;

    if (!donorName || !phone || !donationType) {
      res.status(400).json({ success: false, message: 'Name, phone number and contribution type are required.' });
      return;
    }

    const now = new Date().toISOString();
    const id = `don_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const enquiry: DonationEnquiry = {
      id,
      donorName: donorName.trim(),
      email: email?.trim() || '',
      phone: phone.trim(),
      donationType: donationType.trim(),
      amountOrItems: amountOrItems?.trim() || 'Not specified',
      panNumber: panNumber?.trim() || '',
      address: address?.trim() || '',
      message: message?.trim() || '',
      status: 'pending',
      createdAt: now,
    };

    db.get('donation_enquiries').unshift(enquiry);
    db.save();

    db.logAudit('public', enquiry.donorName, 'DONATION_ENQUIRY', 'DonationEnquiry', `Donation enquiry registered: ${donationType}`, req.ip);

    res.status(201).json({
      success: true,
      referenceId: id,
      message: 'Thank you for your noble support. An official foundation representative will contact you with bank receipt details.',
      transparencyNotice: 'Official receipts are provided for all charitable contributions.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to record donation enquiry: ' + err.message });
  }
});

// 4. Contact Message
enquiriesRouter.post('/contact', rateLimit(60000, 10), (req: Request, res: Response) => {
  try {
    const { name, email, phone, category, message } = req.body;

    if (!name || !phone || !message) {
      res.status(400).json({ success: false, message: 'Name, phone number and message are required.' });
      return;
    }

    const now = new Date().toISOString();
    const id = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const contactMsg: ContactMessage = {
      id,
      name: name.trim(),
      email: email?.trim() || '',
      phone: phone.trim(),
      category: category || 'general',
      message: message.trim(),
      status: 'unread',
      createdAt: now,
    };

    db.get('contact_messages').unshift(contactMsg);
    db.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been received. Our administrative team will respond promptly.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to send message: ' + err.message });
  }
});

// 5. Official Membership Application
enquiriesRouter.post('/membership-request', rateLimit(60000, 10), (req: Request, res: Response) => {
  try {
    const { fullName, mobile, email, address, occupation, reason } = req.body;

    if (!fullName || !mobile || !email) {
      res.status(400).json({ success: false, message: 'Full name, email, and mobile are required for membership application.' });
      return;
    }

    const now = new Date().toISOString();
    const id = `memreq_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const memReq: MembershipRequest = {
      id,
      fullName: fullName.trim(),
      mobile: mobile.trim(),
      email: email.trim().toLowerCase(),
      address: address?.trim() || '',
      occupation: occupation?.trim() || '',
      reason: reason?.trim() || 'Desire to support elder care and community welfare',
      status: 'pending',
      createdAt: now,
    };

    db.get('membership_requests').unshift(memReq);
    db.save();

    db.logAudit('public', memReq.fullName, 'MEMBERSHIP_APPLICATION', 'MembershipRequest', `Application submitted by ${fullName}`, req.ip);

    res.status(201).json({
      success: true,
      referenceId: id,
      message: 'Membership application submitted successfully. The board reviews applications in accordance with society guidelines.'
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to process membership application: ' + err.message });
  }
});
