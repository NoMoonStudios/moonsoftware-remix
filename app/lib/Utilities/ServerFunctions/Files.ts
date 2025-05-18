
import { v2 as cloudinary } from 'cloudinary'
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function UploadFile(data: AsyncIterable<Uint8Array>): Promise<string> {
  const chunks = [];
  for await (const chunk of data) chunks.push(chunk);
  const fileBuffer = Buffer.concat(chunks);
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "user-avatars" },
      (error, result) => {
        if (error) return reject(error);
        if (!result?.secure_url) {
          return reject(new Error('Cloudinary upload failed'));
        }
        resolve(result.secure_url);
      }
    );
    Readable.from(fileBuffer).pipe(uploadStream);
  });
}

export async function DeleteFile(url: string): Promise<null | void> {
  if (!url) return null;
  if (!isCloudinaryUrl(url)) return null;
  
  const publicId = extractPublicIdFromUrl(url);
  if (!publicId) return null;
  
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) return reject(error);
      if (result.result !== "ok") {
        return reject(new Error(`Deletion failed: ${result.result}`));
      }
      resolve();
    });
  });
}

// Helper functions
function isCloudinaryUrl(url: string): boolean {
  if (!url) return false;
  return url.includes('res.cloudinary.com');
}

function extractPublicIdFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url);
    const path = urlObj.pathname;
    
    const match = path.match(
      /\/upload\/(?:v\d+\/)?((?:.*\/)?[^/.\s]+)(?:\.\w+)?$/
    );

    if (!match) return null;
    
    const publicId = match[1];
    return publicId || null;
  } catch {
    return null;
  }
}
