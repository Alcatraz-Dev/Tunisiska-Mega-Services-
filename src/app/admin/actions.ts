'use server';

import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { client } from '@/lib/sanity';

const SETTINGS_PATH = path.join(process.cwd(), 'src/data/settings.json');

// Helper to get local settings if Sanity is not available
async function getLocalSettings() {
  try {
    const data = await readFile(SETTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

// Get only non-sensitive settings (for client use)
export async function getSettings() {
  try {
    // Try Sanity first
    let settings = await client.fetch('*[_type == "settings"][0]');
    
    // Fallback to local file if Sanity has no data yet
    if (!settings) {
      settings = await getLocalSettings();
    }
    
    if (!settings) return null;

    // EXCLUDE auth when sending to client
    const { auth, ...publicSettings } = settings;
    return publicSettings;
  } catch (error) {
    console.error('Error reading settings from Sanity:', error);
    // Ultimate fallback to local
    return await getLocalSettings();
  }
}

// Get full settings including auth (only for authenticated admin actions)
export async function getAdminSettings() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    throw new Error('Unauthorized access');
  }

  try {
    let settings = await client.fetch('*[_type == "settings"][0]');
    if (!settings) {
      settings = await getLocalSettings();
    }
    return settings;
  } catch (error) {
    console.error('Error reading settings:', error);
    return await getLocalSettings();
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    let settings = await client.fetch('*[_type == "settings"][0]');
    if (!settings) {
      settings = await getLocalSettings();
    }

    if (settings && settings.auth && settings.auth.email === email && settings.auth.password === password) {
      const cookieStore = await cookies();
      cookieStore.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 // 24 hours
      });
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  } catch (error) {
    return { success: false, error: 'Authentication failed' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  revalidatePath('/admin');
  return { success: true };
}

export async function saveSettings(settings: any) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  if (!process.env.SANITY_API_TOKEN) {
    return { success: false, error: 'SANITY_API_TOKEN is missing in environment variables' };
  }

  try {
    // We must merge with existing settings to not lose the 'auth' object
    let currentSettings = await client.fetch('*[_type == "settings"][0]');
    if (!currentSettings) {
      currentSettings = await getLocalSettings();
    }
    
    const updatedSettings = {
      _id: 'settings',
      _type: 'settings',
      ...currentSettings,
      ...settings,
      auth: currentSettings?.auth || settings.auth // Preserve auth
    };

    // Remove Sanity system fields if they were in currentSettings
    const { _createdAt, _updatedAt, _rev, ...cleanSettings } = updatedSettings;

    await client.createOrReplace(cleanSettings);
    
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error saving settings to Sanity:', error);
    return { success: false, error: 'Failed to save settings' };
  }
}

export async function updateAuth(settings: any) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    let currentSettings = await client.fetch('*[_type == "settings"][0]');
    if (!currentSettings) {
      currentSettings = await getLocalSettings();
    }
    
    const updatedSettings = {
      _id: 'settings',
      _type: 'settings',
      ...currentSettings,
      auth: {
        email: settings.email || currentSettings?.auth?.email,
        password: settings.password || currentSettings?.auth?.password
      }
    };

    const { _createdAt, _updatedAt, _rev, ...cleanSettings } = updatedSettings;
    await client.createOrReplace(cleanSettings);
    
    return { success: true };
  } catch (error) {
    console.error('Error updating auth in Sanity:', error);
    return { success: false, error: 'Failed to update credentials' };
  }
}

export async function uploadFile(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  const file = formData.get('file') as File;
  if (!file) {
    return { success: false, error: 'No file uploaded' };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Option 1: Upload to Sanity (Recommended for production)
    const asset = await client.assets.upload('image', buffer, {
      filename: file.name
    });

    return { success: true, url: asset.url };

    /* 
    // Fallback for local dev only if you REALLY want local files
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');
    const { mkdir } = require('fs/promises');
    await mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);
    return { success: true, url: `/uploads/${filename}` };
    */
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}

export async function migrateSettingsToSanity() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  
  if (!session || session.value !== 'true') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const localSettings = await getLocalSettings();
    if (!localSettings) {
      return { success: false, error: 'No local settings found to migrate' };
    }

    const migrationData = {
      _id: 'settings',
      _type: 'settings',
      ...localSettings
    };

    // Remove any potential auth if you want a clean start, 
    // but here we keep it as it's defined in the local file.
    
    await client.createOrReplace(migrationData);
    revalidatePath('/');
    
    return { success: true, message: 'Settings successfully migrated to Sanity!' };
  } catch (error) {
    console.error('Migration error:', error);
    return { success: false, error: 'Migration failed. Check your Sanity configuration and API token.' };
  }
}
