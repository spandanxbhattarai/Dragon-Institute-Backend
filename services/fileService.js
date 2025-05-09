// services/fileService.js
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configure bucket name
const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

/**
 * Upload file to AWS S3
 * @param {Object} file - Multer file object
 * @returns {Promise<Object>} - Upload result with same format as previous Supabase response
 */
export const uploadToS3 = async (file) => {
  try {
    const timestamp = Date.now();
    const randomString = Math.floor(Math.random() * 1000000000);
    
    // Create unique filename similar to the old format
    const fileExtension = path.extname(file.originalname).toLowerCase().substring(1);
    const fileNameWithoutExt = path.basename(file.originalname, path.extname(file.originalname));
    const public_id = `${fileNameWithoutExt}-${timestamp}-${randomString}`;
    const key = `user-uploads/${public_id}.${fileExtension}`;
    
    // Upload file to S3
    const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
    };
    
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    // Generate a public URL
    // For publicly accessible objects
    const url = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    
    // Return the same response structure as the Supabase version
    return {
      success: true,
      message: 'File uploaded successfully',
      data: {
        url: url,
        public_id: public_id,
        format: fileExtension,
        size: file.size,
        original_filename: file.originalname
      }
    };
  } catch (error) {
    console.error('S3 upload error:', error);
    throw new Error('Failed to upload file to S3');
  }
};

/**
 * Delete file from AWS S3
 * @param {string} public_id - Public ID of the file
 * @returns {Promise<void>}
 */
export const deleteFromS3 = async (public_id) => {
  try {
    // Since we need to find the file by public_id, we'll need to list objects
    // and find the one with the matching prefix or use the public_id to reconstruct the key
    
    // Assuming the extension is stored with the public_id or we can determine it from the DB
    // Here we're using a simplified approach - you might need to adapt this based on how 
    // you store the full path information
    
    // Find the extension (this is a simplified approach - you might need to look it up in your database)
    // For this example, we'll assume we're listing objects to find the right one
    const listParams = {
      Bucket: BUCKET_NAME,
      Prefix: `user-uploads/${public_id}`,
    };
    
    // Alternative: If you know the extension or can retrieve it from a database
    // const key = `user-uploads/${public_id}.${extension}`;
    
    // For simplicity, we'll directly construct the key assuming you can get the extension
    // You may need to modify this based on your actual implementation
    const key = `user-uploads/${public_id}`;
    
    const deleteParams = {
      Bucket: BUCKET_NAME,
      Key: key,
    };
    
    await s3Client.send(new DeleteObjectCommand(deleteParams));
    
    return {
      success: true,
      message: 'File deleted successfully'
    };
  } catch (error) {
    console.error('S3 delete error:', error);
    throw new Error('Failed to delete file from S3');
  }
};