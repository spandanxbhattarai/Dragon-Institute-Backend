import * as repository from '../repository/announcementRepository.js';
import { emailService } from '../services/mailService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import handlebars from 'handlebars';

// Configure Handlebars
handlebars.noConflict();
const { compile } = handlebars;

// Get template path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatePath = path.join(__dirname, '../announcementNotificationTemplate.html');

// Read and compile template

let announcementTemplate;
try {
  const templateContent = fs.readFileSync(templatePath, 'utf8');
  announcementTemplate = compile(templateContent, {
    noEscape: true,       // Allows HTML in templates
    strict: true,         // Ensures variables exist
    preventIndent: true,  // Prevents whitespace issues
    allowProtoMethodsByDefault: true,
    allowProtoPropertiesByDefault: true
  });
} catch (err) {
    console.error('Error loading announcement template:', err);
    throw new Error('Failed to load announcement template');
}

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

const prepareAnnouncementEmailContent = (announcementData) => {
  // Convert Mongoose document to plain object if needed
  const announcement = announcementData.toObject ? announcementData.toObject() : announcementData;

  return {
    subject: `New Announcement: ${announcement.title}`,
    html: announcementTemplate({
      title: announcement.title,
      message: announcement.message,
      priority: announcement.priority || 'medium',
      categories: announcement.categories || [],
      effectiveDate: formatDate(announcement.effectiveDate),
      expirationDate: formatDate(announcement.expirationDate),
      unsubscribeLink: 'https://yourdomain.com/unsubscribe'
    })
  };
};

export const createAnnouncement = async (announcementData) => {
    const announcement = await repository.createAnnouncement(announcementData);
    
    // Send email notification in the background
    try {
       
      const emailContent = prepareAnnouncementEmailContent(announcement);
      console.log(`Announcement email size: ${Buffer.byteLength(emailContent.html, 'utf8')} bytes`);
      emailService.sendBulkEmails({
        target: 'all',
        subject: emailContent.subject,
        body: emailContent.html,
        isHtml: true
      }).catch(err => {
        console.error('Error sending announcement notification emails:', err);
      });
    } catch (err) {
      console.error('Error preparing announcement notification emails:', err);
    }
    
    return announcement;
  };

export const getAnnouncement = async (id) => {
    const announcement = await repository.getAnnouncementById(id);
    if (!announcement) {
        throw new Error('Announcement not found');
    }
    return announcement;
};

export const getAllAnnouncements = async (page, limit) => {
    return await repository.getAllAnnouncements(page, limit);
};

export const updateAnnouncement = async (id, updateData) => {
    const announcement = await repository.updateAnnouncement(id, updateData);
    if (!announcement) {
        throw new Error('Announcement not found or not updated');
    }
    return announcement;
};

export const deleteAnnouncement = async (id) => {
    const announcement = await repository.deleteAnnouncement(id);
    if (!announcement) {
        throw new Error('Announcement not found or not deleted');
    }
    return announcement;
};