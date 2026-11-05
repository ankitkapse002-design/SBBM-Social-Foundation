import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import {
  db, AdmissionEnquiry, VolunteerEnquiry, DonationEnquiry,
  ContactMessage, MembershipRequest, User, generatePortalId,
  generateAdmissionPassword
} from '../db';
import { rateLimit } from '../middleware/auth';

export const enquiriesRouter = Router();

// 1. Admission Enquiry Registration & Account Creation
enquiriesRouter.post('/admission', rateLimit(60000, 15), (req: Request, res: Response) => {
  try {
    const {
      applicantName,
      guardianFirstName,
      guardianPhone,
      applicantPhone,
      applicantEmail,
      dobOrYear,
      residentAge,
      address,
      admissionCategory,
      residentGender,
      relationWithResident,
      mobilityStatus,
      medicalNotes,
      additionalMessage,
    } = req.body;

    const resolvedApplicantName = (applicantName || req.body.residentName || '').trim();
    const resolvedGuardianPhone = (guardianPhone || applicantPhone || '').trim();
    const resolvedGuardianFirstName = (guardianFirstName || (req.body.applicantName ? req.body.applicantName.split(' ')[0] : 'Guardian')).trim();
    const resolvedDobOrYear = (dobOrYear || (residentAge ? String(new Date().getFullYear() - Number(residentAge)) : '1950')).trim();
    const resolvedAddress = (address || 'Nagpur, Maharashtra').trim();
    const resolvedCategory = (admissionCategory || 'Elder Care Sanctuary').trim();

    if (!resolvedApplicantName || !resolvedGuardianFirstName || !resolvedGuardianPhone || !resolvedDobOrYear || !resolvedAddress) {
      res.status(400).json({
        success: false,
        message: 'Applicant name, guardian first name, guardian mobile number, birth year/DOB, and address are required.',
      });
      return;
    }

    const cleanPhone = resolvedGuardianPhone.replace(/\D/g, '');
    const cleanApplicantLower = resolvedApplicantName.toLowerCase();
    const existing = db.get('admission_enquiries').find(e => {
      const ePhone = (e.guardianPhone || '').replace(/\D/g, '');
      const eName = (e.applicantName || '').toLowerCase();
      return ePhone === cleanPhone && eName === cleanApplicantLower;
    });

    if (existing) {
      res.status(400).json({
        success: false,
        message: `An admission enquiry for ${resolvedApplicantName} with guardian phone ${resolvedGuardianPhone} has already been received under Registration ID: ${existing.registrationId || existing.id}. Our office will contact you regarding review status.`,
        existingRegistrationId: existing.registrationId || existing.id,
      });
      return;
    }

    const now = new Date().toISOString();
    const registrationId = generatePortalId('ADM');
    const enquiryId = `adm_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const enquiry: AdmissionEnquiry = {
      id: enquiryId,
      registrationId,
      applicantName: resolvedApplicantName,
      guardianFirstName: resolvedGuardianFirstName,
      guardianPhone: resolvedGuardianPhone,
      applicantEmail: (applicantEmail || '').trim(),
      dobOrYear: resolvedDobOrYear,
      address: resolvedAddress,
      admissionCategory: resolvedCategory,
      residentGender: residentGender || 'Not specified',
      relationWithResident: relationWithResident || 'Guardian / Family',
      mobilityStatus: mobilityStatus || 'Independent with daily routine',
      medicalNotes: medicalNotes?.trim() || 'None reported',
      additionalMessage: additionalMessage?.trim() || '',
      status: 'pending_review',
      statusHistory: [
        {
          id: `hist_${Date.now()}_init`,
          status: 'pending_review',
          date: now,
          updatedBy: 'Guardian / Applicant',
          notes: 'Enquiry submitted via public admission form. Pending administrative review.'
        }
      ],
      createdAt: now,
      updatedAt: now,
    };

    db.get('admission_enquiries').unshift(enquiry);
    db.save();

    db.logAudit(
      'public',
      enquiry.guardianFirstName,
      'ADMISSION_ENQUIRY_SUBMITTED',
      'AdmissionEnquiry',
      `Admission enquiry registered for resident ${resolvedApplicantName} (Reg ID: ${registrationId})`,
      req.ip
    );

    res.status(201).json({
      success: true,
      registrationId,
      referenceId: registrationId,
      status: 'pending_review',
      applicantName: resolvedApplicantName,
      guardianFirstName: resolvedGuardianFirstName,
      message: `Admission enquiry submitted successfully! Your Admission Reference ID is ${registrationId}. Our administrative team will review the details and contact the guardian directly.`,
      contactNotice: 'For urgent admission queries, contact our office directly at +91 98908 98081 or +91 93261 72824.'
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
