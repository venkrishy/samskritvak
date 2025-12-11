import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

// R2 Configuration
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET = process.env.R2_BUCKET;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL;

if (!R2_ENDPOINT || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET || !R2_PUBLIC_BASE_URL) {
    console.error("❌ Missing Cloudflare R2 environment variables. Please check your .env.local file.");
    console.log("\nRequired variables:");
    console.log("- R2_ENDPOINT");
    console.log("- R2_ACCESS_KEY_ID");
    console.log("- R2_SECRET_ACCESS_KEY");
    console.log("- R2_BUCKET");
    console.log("- R2_PUBLIC_BASE_URL");
    process.exit(1);
}

const s3Client = new S3Client({
    region: "auto",
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

// Image metadata mapping
const imageMetadata = {
    'hero-student-learning.jpg': {
        category: 'hero',
        page: 'homepage',
        alt_text: 'Students learning languages with tutors online',
        description: 'Hero image showing diverse students learning with online tutors'
    },
    'stats-background.jpg': {
        category: 'background',
        page: 'homepage',
        alt_text: 'Abstract gradient background',
        description: 'Background image for stats section'
    },
    'testimonial-avatar-1.jpg': {
        category: 'avatar',
        page: 'homepage',
        alt_text: 'Krista A. - English tutor',
        description: 'Profile photo of English tutor Krista A.'
    },
    'testimonial-avatar-2.jpg': {
        category: 'avatar',
        page: 'homepage',
        alt_text: 'Maria S. - Spanish student',
        description: 'Profile photo of Spanish student Maria S.'
    },
    'tutor-placeholder-1.jpg': {
        category: 'tutor',
        page: 'tutors',
        alt_text: 'Tutor profile photo',
        description: 'Placeholder image for tutor profiles'
    },
    'tutor-placeholder-2.jpg': {
        category: 'tutor',
        page: 'tutors',
        alt_text: 'Tutor profile photo',
        description: 'Placeholder image for tutor profiles'
    },
    'tutor-placeholder-3.jpg': {
        category: 'tutor',
        page: 'tutors',
        alt_text: 'Tutor profile photo',
        description: 'Placeholder image for tutor profiles'
    },
    'teach-hero.jpg': {
        category: 'hero',
        page: 'teach',
        alt_text: 'Tutor teaching online',
        description: 'Hero image for become a tutor page'
    },
    'teach-benefits.jpg': {
        category: 'illustration',
        page: 'teach',
        alt_text: 'Teaching benefits illustration',
        description: 'Illustration showing benefits of teaching online'
    },
    'business-hero.jpg': {
        category: 'hero',
        page: 'business',
        alt_text: 'Corporate language training',
        description: 'Hero image for business training page'
    },
    'business-case-study.jpg': {
        category: 'illustration',
        page: 'business',
        alt_text: 'Business case study illustration',
        description: 'Illustration for business case studies'
    },
    'progress-dashboard.jpg': {
        category: 'screenshot',
        page: 'proven-progress',
        alt_text: 'Learning progress dashboard',
        description: 'Screenshot of learning progress dashboard'
    },
    'progress-stats.jpg': {
        category: 'infographic',
        page: 'proven-progress',
        alt_text: 'Learning statistics infographic',
        description: 'Infographic showing learning statistics'
    }
};

async function uploadFileToR2(filePath, fileName) {
    const fileContent = fs.readFileSync(filePath);
    const contentType = getContentType(filePath);

    const uploadParams = {
        Bucket: R2_BUCKET,
        Key: `images/${fileName}`,
        Body: fileContent,
        ContentType: contentType,
        ACL: 'public-read',
    };

    try {
        await s3Client.send(new PutObjectCommand(uploadParams));
        const publicUrl = `${R2_PUBLIC_BASE_URL}/images/${fileName}`;
        console.log(`✅ Successfully uploaded ${fileName} to R2`);
        return publicUrl;
    } catch (error) {
        console.error(`❌ Error uploading ${fileName} to R2:`, error);
        throw error;
    }
}

function getContentType(filePath) {
    const extname = path.extname(filePath).toLowerCase();
    switch (extname) {
        case '.jpg':
        case '.jpeg':
            return 'image/jpeg';
        case '.png':
            return 'image/png';
        case '.gif':
            return 'image/gif';
        case '.svg':
            return 'image/svg+xml';
        case '.webp':
            return 'image/webp';
        default:
            return 'application/octet-stream';
    }
}

async function uploadAllImages() {
    const imagesDir = './public/images';
    const uploadedImages = [];
    const errors = [];

    console.log('🚀 Starting image upload to R2...\n');

    try {
        // Read all files in the images directory
        const files = fs.readdirSync(imagesDir);
        const imageFiles = files.filter(file => 
            /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(file)
        );

        console.log(`📁 Found ${imageFiles.length} image files to upload\n`);

        for (const fileName of imageFiles) {
            try {
                const filePath = path.join(imagesDir, fileName);
                
                // Upload to R2
                const publicUrl = await uploadFileToR2(filePath, fileName);
                
                // Get metadata for this image
                const metadata = imageMetadata[fileName] || {
                    category: 'general',
                    page: 'general',
                    alt_text: fileName.replace(/\.[^/.]+$/, ""),
                    description: `Image: ${fileName}`
                };

                uploadedImages.push({
                    filename: fileName,
                    url: publicUrl,
                    category: metadata.category,
                    page: metadata.page,
                    alt_text: metadata.alt_text,
                    description: metadata.description,
                    file_size: fs.statSync(filePath).size,
                    mime_type: getContentType(filePath)
                });

                console.log(`✅ ${fileName} - ${publicUrl}\n`);

            } catch (error) {
                console.error(`❌ Failed to upload ${fileName}:`, error.message);
                errors.push({ fileName, error: error.message });
            }
        }

        // Generate summary report
        console.log('\n📊 UPLOAD SUMMARY');
        console.log('==================');
        console.log(`✅ Successfully uploaded: ${uploadedImages.length} images`);
        console.log(`❌ Failed uploads: ${errors.length} images`);
        
        if (uploadedImages.length > 0) {
            console.log('\n📋 SUCCESSFUL UPLOADS:');
            uploadedImages.forEach(img => {
                console.log(`  • ${img.filename} (${img.category}) - ${img.url}`);
            });
        }

        if (errors.length > 0) {
            console.log('\n❌ FAILED UPLOADS:');
            errors.forEach(err => {
                console.log(`  • ${err.fileName}: ${err.error}`);
            });
        }

        // Save results to JSON file
        const results = {
            timestamp: new Date().toISOString(),
            total_images: imageFiles.length,
            successful_uploads: uploadedImages.length,
            failed_uploads: errors.length,
            uploaded_images: uploadedImages,
            errors: errors
        };

        fs.writeFileSync('./upload-results.json', JSON.stringify(results, null, 2));
        console.log('\n💾 Results saved to upload-results.json');

        return results;

    } catch (error) {
        console.error('❌ Fatal error during upload process:', error);
        process.exit(1);
    }
}

// Run the upload process
uploadAllImages()
    .then(results => {
        console.log('\n🎉 Upload process completed!');
        console.log('\n📝 Next steps:');
        console.log('1. Check upload-results.json for URLs');
        console.log('2. Update your components to use the R2 URLs');
        console.log('3. Test your application to see the images');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n💥 Upload process failed:', error);
        process.exit(1);
    });

