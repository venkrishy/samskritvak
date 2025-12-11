#!/usr/bin/env node

/**
 * Cloudflare R2 Upload Script
 * Uploads images to Cloudflare R2 bucket using AWS SDK
 */

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_BASE_URL) {
  console.error('❌ Missing required environment variables in .env.local');
  console.error('Required: R2_ENDPOINT, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_BASE_URL');
  process.exit(1);
}

// Initialize S3 client for R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

/**
 * Upload a single file to R2
 * @param {string} filePath - Local file path
 * @param {string} key - S3 key (path in bucket)
 * @returns {Promise<string>} - Public URL
 */
async function uploadFile(filePath, key) {
  try {
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);
    
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
      ACL: 'public-read', // Make publicly accessible
    });

    await s3Client.send(command);
    const publicUrl = `${R2_PUBLIC_BASE_URL}/${key}`;
    console.log(`✅ Uploaded: ${filePath} → ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`❌ Failed to upload ${filePath}:`, error.message);
    throw error;
  }
}

/**
 * Get content type based on file extension
 * @param {string} filePath 
 * @returns {string}
 */
function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.gif': 'image/gif',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Upload all images from a directory
 * @param {string} imagesDir - Directory containing images
 */
async function uploadAllImages(imagesDir = './public/images') {
  if (!fs.existsSync(imagesDir)) {
    console.log(`📁 Creating directory: ${imagesDir}`);
    fs.mkdirSync(imagesDir, { recursive: true });
    return;
  }

  const files = fs.readdirSync(imagesDir);
  const imageFiles = files.filter(file => 
    /\.(jpg|jpeg|png|webp|svg|gif)$/i.test(file)
  );

  if (imageFiles.length === 0) {
    console.log(`📁 No images found in ${imagesDir}`);
    console.log('💡 Place your generated images in this directory and run the script again');
    return;
  }

  console.log(`📤 Uploading ${imageFiles.length} images to R2...`);
  
  const results = [];
  for (const file of imageFiles) {
    const filePath = path.join(imagesDir, file);
    const key = `images/${file}`;
    
    try {
      const publicUrl = await uploadFile(filePath, key);
      results.push({ file, url: publicUrl });
    } catch (error) {
      console.error(`Failed to upload ${file}`);
    }
  }

  // Generate URLs file for easy access
  const urlsFile = path.join(imagesDir, 'uploaded-urls.json');
  fs.writeFileSync(urlsFile, JSON.stringify(results, null, 2));
  console.log(`📄 URLs saved to: ${urlsFile}`);
  
  return results;
}

/**
 * Upload a single file by path
 * @param {string} filePath - Full path to file
 */
async function uploadSingleFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    return;
  }

  const fileName = path.basename(filePath);
  const key = `images/${fileName}`;
  
  try {
    const publicUrl = await uploadFile(filePath, key);
    return publicUrl;
  } catch (error) {
    console.error(`Failed to upload ${filePath}`);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    // Upload all images from default directory
    uploadAllImages();
  } else if (args[0] === '--dir' && args[1]) {
    // Upload all images from specified directory
    uploadAllImages(args[1]);
  } else {
    // Upload single file
    uploadSingleFile(args[0]);
  }
}

module.exports = {
  uploadFile,
  uploadAllImages,
  uploadSingleFile,
};

