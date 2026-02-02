import { supabase } from './supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

/**
 * Upload an image to Supabase Storage
 * Images are stored in user-specific folders for easy management
 */
export async function uploadPostImage(
  userId: string,
  imageUri: string
): Promise<string | null> {
  try {
    // Read the file as base64
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Generate unique filename with timestamp
    const fileName = `${userId}/${Date.now()}.jpg`;

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(fileName, decode(base64), {
        contentType: 'image/jpeg',
        upsert: false,
      });

    if (error) {
      console.error('Upload error:', error);
      throw error;
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('post-images')
      .getPublicUrl(data.path);

    return urlData.publicUrl;
  } catch (error) {
    console.error('Image upload error:', error);
    return null;
  }
}

/**
 * Upload an avatar image
 */
export async function uploadAvatar(
  userId: string,
  imageUri: string
): Promise<string | null> {
  try {
    const base64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    // Avatars overwrite the previous one
    const fileName = `${userId}/avatar.jpg`;

    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, decode(base64), {
        contentType: 'image/jpeg',
        upsert: true, // Allow overwriting
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(data.path);

    // Add cache-busting query param
    return `${urlData.publicUrl}?t=${Date.now()}`;
  } catch (error) {
    console.error('Avatar upload error:', error);
    return null;
  }
}

/**
 * Delete an image from storage
 */
export async function deleteImage(
  bucket: string,
  path: string
): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Delete error:', error);
    return false;
  }
}
