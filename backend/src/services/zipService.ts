import axios from 'axios';
import dotenv from 'dotenv';
import fs from 'fs';
import JSZip from 'jszip';
import path from 'path';
import { promisify } from 'util';
import { supabaseAdmin } from './supabase';
dotenv.config();

const STORAGE_URL = process.env.STORAGE_URL;
const STORAGE_API_KEY = process.env.STORAGE_API_KEY;

// Convert fs.readFile to Promise-based version
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

export const createZip = async (
  profileId: string,
  images: string[],
  triggerPhrase: string
) => {
  console.log(`Creating and uploading zip with ${images.length} images for profile ${profileId}`);
  
  // Create a new zip file
  const zip = new JSZip();
  
  // Process each image
  const imagePromises = images.map(async (img, index) => {
    console.log('img', img);
    try {
      // Check if this is a URL or a local file path
      if (img.startsWith('http://') || img.startsWith('https://')) {
        // It's a URL, use axios to download it
        const response = await axios.get(img, { 
          responseType: 'arraybuffer' 
        });
        
        // Improved naming convention for model training
        const fileName = `${triggerPhrase}_${index + 1}.jpg`;
        zip.file(fileName, response.data as ArrayBuffer);
      } else {
        // It's a local file path, read directly from file system
        const fileData = await readFile(img);
        
        // Improved naming convention for model training
        const fileName = `${triggerPhrase}_${index + 1}.jpg`;
        zip.file(fileName, fileData);
        console.log('fileName', fileName);
      }
      return true;
    } catch (error) {
      console.error(`Error processing image ${img}:`, error);
      return false;
    }
  });
  
  // Wait for all images to be processed
  await Promise.all(imagePromises);
  
  // Add a metadata.json file to help with debugging and tracking
  const metadata = {
    triggerPhrase,
    profileId,
    imageCount: images.length,
    created: new Date().toISOString()
  };
  zip.file('metadata.json', JSON.stringify(metadata, null, 2));
  
  // Generate the zip content
  const zipContent = await zip.generateAsync({ type: 'nodebuffer' });
  
  // Define the path where the zip will be saved
  const zipDir = path.join(__dirname, '../../uploads/zips');
  fs.mkdirSync(zipDir, { recursive: true });
  const zipPath = path.join(zipDir, `${triggerPhrase}.zip`);
  
  // Write the zip file
  await writeFile(zipPath, zipContent);
  
  // Return the zip file path or URL
  return {
    zipPath,
    // If you need a URL to access this file later
    zipUrl: `/uploads/zips/${profileId}.zip` 
  };
};

export const uploadZipToStorage = async (zipPath: string, profileId: string, triggerPhrase: string) => {
  const zipContent = await readFile(zipPath);
  const timestamp = Date.now();
  // More descriptive zip file naming
  const fileName = `${triggerPhrase}_${timestamp}.zip`;

  try {
    const { data, error } = await supabaseAdmin.storage
      .from('zips')
      .upload(fileName, zipContent, {
        contentType: 'application/zip',
        upsert: true, // Override if file exists
        cacheControl: 'no-cache' // Add cache control header
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('zips')
      .getPublicUrl(fileName);

    return {
      uploadData: data,
      publicUrl
    };
  } catch (error) {
    console.error('Error uploading zip to storage:', error);
    throw error;
  }
}

// Validate the zip file
export const validateZipFile = async (zipUrl: string): Promise<boolean> => {
  try {
    const response = await axios.get(zipUrl, {
      responseType: 'arraybuffer'
    });
    
    const zip = await JSZip.loadAsync(response.data as ArrayBuffer);
    const fileCount = Object.keys(zip.files).length;
    
    if (fileCount === 0) {
      throw new Error('Zip file is empty.');
    }
    
    console.log(`Zip file validation successful: contains ${fileCount} files.`);
    return true;
  } catch (error) {
    console.error('Zip file validation failed:', error);
    return false;
  }
}; 