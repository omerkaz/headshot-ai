import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { prepareProfileToLora } from '../services/prepareProfileService';

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create temporary directory for uploads if it doesn't exist
    const uploadDir = path.join(__dirname, '../../uploads/temp');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with profileId prefix to group files
    const profileId = req.params.profileId;
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname) || '.jpg';
    console.log('`${profileId}-${uniqueSuffix}${extension}`', `${profileId}-${uniqueSuffix}${extension}`);
    cb(null, `${profileId}-${uniqueSuffix}${extension}`);
  }
});

// Configure upload middleware
const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 20 // Max 20 files per upload
  },
  fileFilter: (req, file, cb) => {
    // Accept only images
    const filetypes = /jpeg|jpg|png|heic|heif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    console.log('extname', extname);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

const router = express.Router();

/**
 * @route POST /api/profiles/:profileId/prepare
 * @desc Prepare a profile for Lora training by creating a zip of images
 * @access Private
 */
router.post('/:profileId/prepare', upload.array('images'), async (req, res) => {
  try {
    const { profileId, triggerPhrase } = req.params;
    
    if (!profileId) {
      return res.status(400).json({ error: 'Profile ID is required' });
    }
    
    const uploadedFiles = req.files as Express.Multer.File[];
    
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ 
        success: false,
        error: 'No images uploaded' 
      });
    }

    console.log(`Received ${uploadedFiles.length} images for profile ${profileId}`);
    
    // Get list of file paths to pass to the service
    const imagePaths = uploadedFiles.map(file => file.path);
    
    // Pass uploaded image paths to the preparation service
    const preparedProfile = await prepareProfileToLora(profileId, imagePaths);
    
    return res.status(200).json({
      success: true,
      data: preparedProfile
    });
  } catch (error) {
    console.error('Error preparing profile:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred'
    });
  } finally {
    // Clean up temporary files (optional - you may want to keep them until processing completes)
    // This assumes prepareProfileToLora creates a zip and doesn't need the originals after completion
    if (req.files && Array.isArray(req.files)) {
      const uploadedFiles = req.files as Express.Multer.File[];
      uploadedFiles.forEach(file => {
        try {
          fs.unlinkSync(file.path);
          // IMPORTANT: IS THAT WORKING, CHECK THAT 
          const zipDir = path.join(__dirname, '../../uploads/zips');
          fs.rmSync(zipDir, { recursive: true, force: true });
        } catch (err) {
          console.error(`Failed to delete temporary file ${file.path}:`, err);
        }
      });
    }
  }
});

export default router; 