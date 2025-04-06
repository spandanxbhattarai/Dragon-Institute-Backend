import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Supabase with error handling
let supabase;
try {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  // Ensure bucket is public (run once when module loads)
  (async () => {
    try {
      await supabase
        .from('buckets')
        .update({ public: true })
        .eq('id', 'user-uploads');
    } catch (bucketError) {
      console.log('Bucket already configured or error:', bucketError.message);
    }
  })();
} catch (initError) {
  console.error('Supabase initialization failed:', initError);
  process.exit(1);
}

// Enhanced allowed formats with MIME type validation
const ALLOWED_FORMATS = {
  images: {
    extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },
  documents: {
    extensions: ['pdf', 'xls', 'xlsx', 'csv'],
    mimeTypes: [
      'application/pdf',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ]
  }
};

// File size limit (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export const uploadToSupabase = async (file) => {
  try {
    if (!file || !file.buffer) {
      throw new Error('No file provided');
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File size exceeds ${MAX_FILE_SIZE/1024/1024}MB limit`);
    }

    // Extract and validate file extension
    const fileExt = file.originalname.split('.').pop().toLowerCase();
    const formatCategory = Object.keys(ALLOWED_FORMATS).find(key => 
      ALLOWED_FORMATS[key].extensions.includes(fileExt)
    );

    if (!formatCategory) {
      throw new Error(`Invalid file format. Allowed: ${Object.values(ALLOWED_FORMATS)
        .flatMap(f => f.extensions)
        .join(', ')}`);
    }

    // Validate MIME type
    if (!ALLOWED_FORMATS[formatCategory].mimeTypes.includes(file.mimetype)) {
      throw new Error(`Invalid MIME type for ${fileExt} files`);
    }

    // Generate sanitized filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const originalName = file.originalname.split('.')[0]
      .replace(/[^a-zA-Z0-9-]/g, '');
    const fileName = `${originalName}-${uniqueSuffix}.${fileExt}`;

    // Upload with retry logic
    let uploadAttempts = 0;
    let uploadError;
    
    while (uploadAttempts < 3) {
      const { error } = await supabase.storage
        .from('user-uploads')
        .upload(fileName, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
          cacheControl: '3600'
        });

      if (!error) break;
      
      uploadError = error;
      uploadAttempts++;
      await new Promise(resolve => setTimeout(resolve, 1000 * uploadAttempts));
    }

    if (uploadError) throw uploadError;

    // Get permanent public URL
    const { data: { publicUrl } } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(fileName);


    return {
      success: true,
      message: "File uploaded successfully",
      data: {
        url: publicUrl,
        public_id: fileName.split('.')[0],
        format: fileExt,
        size: file.size,
        original_filename: file.originalname
      }
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    };
  }
};

export const deleteFromSupabase = async (publicIdWithExt) => {
  try {
    if (!publicIdWithExt) {
      throw new Error('No file identifier provided');
    }

    const { error } = await supabase.storage
      .from('user-uploads')
      .remove([publicIdWithExt]);

    if (error) throw error;

    return {
      success: true,
      message: "File deleted successfully"
    };
  } catch (error) {
    console.error('Deletion error:', error);
    return {
      success: false,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error : undefined
    };
  }
};

// Helper to get file URL by public_id
export const getFileUrl = (publicIdWithExt) => {
  if (!publicIdWithExt) return null;
  
  const { data: { publicUrl } } = supabase.storage
    .from('user-uploads')
    .getPublicUrl(publicIdWithExt);

  return publicUrl;
};