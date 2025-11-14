import { supabase } from './supabase'

export const STORAGE_BUCKETS = {
  BRAND_IMAGES: 'brand-images',
  SKU_IMAGES: 'sku-images',
  GENERATED_ASSETS: 'generated-assets'
} as const

/**
 * Upload an image file to Supabase Storage
 * @param bucket The storage bucket name
 * @param file The file to upload
 * @param path Optional path within the bucket (e.g., 'brand-1/logo.png')
 * @returns The public URL of the uploaded file
 */
export async function uploadImage(
  bucket: string,
  file: File | Blob,
  path?: string
): Promise<string> {
  try {
    // Generate a unique filename if path not provided
    const fileName = path || `${Date.now()}-${Math.random().toString(36).substring(7)}`
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)

    return publicUrl
  } catch (error) {
    console.error('Error uploading image:', error)
    throw error
  }
}

/**
 * Upload an image from a URL (base64 or remote URL)
 * @param bucket The storage bucket name
 * @param imageUrl The image URL (can be base64 data URI or remote URL)
 * @param path Optional path within the bucket
 * @returns The public URL of the uploaded file
 */
export async function uploadImageFromUrl(
  bucket: string,
  imageUrl: string,
  path?: string
): Promise<string> {
  try {
    // If it's a base64 data URI, convert it to a Blob
    if (imageUrl.startsWith('data:')) {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      return uploadImage(bucket, blob, path)
    }

    // If it's already a Supabase Storage URL, return as-is
    if (imageUrl.includes('supabase.co/storage/v1/object/public/')) {
      return imageUrl
    }

    // Otherwise, fetch from URL and upload
    const response = await fetch(imageUrl)
    const blob = await response.blob()
    return uploadImage(bucket, blob, path)
  } catch (error) {
    console.error('Error uploading image from URL:', error)
    // If upload fails, return original URL as fallback
    return imageUrl
  }
}

/**
 * Delete an image from Supabase Storage
 * @param bucket The storage bucket name
 * @param path The path of the file to delete
 */
export async function deleteImage(bucket: string, path: string): Promise<void> {
  try {
    // Extract path from full URL if needed
    const filePath = path.includes('supabase.co/storage/v1/object/public/')
      ? path.split('/').slice(-1)[0]
      : path

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath])

    if (error) throw error
  } catch (error) {
    console.error('Error deleting image:', error)
    throw error
  }
}

/**
 * List all files in a bucket folder
 * @param bucket The storage bucket name
 * @param folder The folder path
 */
export async function listImages(bucket: string, folder: string = '') {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .list(folder)

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error listing images:', error)
    throw error
  }
}

/**
 * Get the public URL for a file in storage
 * @param bucket The storage bucket name
 * @param path The file path
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

