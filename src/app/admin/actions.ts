'use server';

import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

const SETTINGS_PATH = path.join(process.cwd(), 'src/data/settings.json');

// Get only non-sensitive settings (for client use)
export async function getSettings() {
  try {
    const data = await readFile(SETTINGS_PATH, 'utf-8');
    const settings = JSON.parse(data);
    
    // EXCLUDE auth when sending to client
    const { auth, ...publicSettings } = settings;
    return publicSettings;
  } catch (error) {
    console.error('Error reading settings:', error);
    return null;
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
    const data = await readFile(SETTINGS_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading settings:', error);
    return null;
  }
}

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  try {
    const data = await readFile(SETTINGS_PATH, 'utf-8');
    const settings = JSON.parse(data);

    if (settings.auth.email === email && settings.auth.password === password) {
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

  try {
    // We must merge with existing settings to not lose the 'auth' object
    const currentData = await readFile(SETTINGS_PATH, 'utf-8');
    const currentSettings = JSON.parse(currentData);
    
    const updatedSettings = {
      ...currentSettings,
      ...settings,
      auth: currentSettings.auth // MUST preserve auth unless we specifically change it
    };

    await writeFile(SETTINGS_PATH, JSON.stringify(updatedSettings, null, 2), 'utf-8');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
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
    const currentData = await readFile(SETTINGS_PATH, 'utf-8');
    const currentSettings = JSON.parse(currentData);
    
    const updatedSettings = {
      ...currentSettings,
      auth: {
        email: settings.email || currentSettings.auth.email,
        password: settings.password || currentSettings.auth.password
      }
    };

    await writeFile(SETTINGS_PATH, JSON.stringify(updatedSettings, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
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

    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const uploadDir = path.join(process.cwd(), 'public/uploads');

    const { mkdir } = require('fs/promises');
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { success: false, error: 'Failed to upload file' };
  }
}
