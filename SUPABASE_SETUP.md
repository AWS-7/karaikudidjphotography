# DJ Photography - Supabase Setup Guide

## Phase 2: Backend + Database + Integration - COMPLETE

---

## Overview

This document contains all the necessary steps to set up Supabase for the DJ Photography website.

---

## 1. Supabase Project Setup

### Create Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign up / Log in
3. Click "New Project"
4. Name: `dj-photography-karaikudi`
5. Choose region closest to your users (Mumbai for India)
6. Wait for project creation

### Get Credentials
1. Go to Project Settings → API
2. Copy `URL` → set as `VITE_SUPABASE_URL`
3. Copy `anon public` key → set as `VITE_SUPABASE_ANON_KEY`

---

## 2. Database Setup

### Run SQL Migration

Go to SQL Editor in Supabase Dashboard and run the contents of `/supabase/setup.sql`:

```bash
# File location:
supabase/setup.sql
```

This creates:
- `events` table
- `gallery_images` table  
- `packages` table
- RLS policies for all tables
- Default packages data
- Indexes for performance

---

## 3. Storage Setup

### Create Bucket
1. Go to Storage in Supabase Dashboard
2. Click "New Bucket"
3. Name: `gallery`
4. ✅ Toggle "Public bucket" ON
5. Click "Create"

### Storage Policies

Add the following policy to allow authenticated users to upload:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'gallery');

-- Allow authenticated users to delete their own files
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'gallery');
```

---

## 4. Authentication Setup

### Enable Email/Password Auth
1. Go to Authentication → Providers
2. Enable "Email" provider
3. Disable "Confirm email" (for easier testing)
4. Disable "Enable Signup" (to prevent public registration)

### Create Admin User
1. Go to Authentication → Users
2. Click "Add User"
3. Enter email and password for Dass
4. Recommended credentials:
   - Email: `admin@djphotography.com`
   - Password: Strong password

---

## 5. Environment Configuration

### Copy Environment File
```bash
cp .env.example .env
```

### Set Variables
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

---

## 6. Features Implemented

### Frontend Integration
- ✅ `GallerySection.tsx` - Fetches events from Supabase
- ✅ `GalleryEvent.tsx` - Fetches single event with images
- ✅ `Admin.tsx` - Full CRUD operations with auth

### Custom Hooks
- `useAuth.ts` - Authentication management
- `useEvents.ts` - Events CRUD
- `useImages.ts` - Image uploads
- `usePackages.ts` - Packages CRUD

### Toast Notifications
- Context-based toast system
- Success/error/loading states

---

## 7. Security Features

### Row Level Security (RLS)
All tables have RLS enabled with the following policies:

- **Public**: Read-only access to events, images, packages
- **Authenticated**: Full CRUD access for admin operations

### Admin Panel Protection
- Login required for `/admin`
- Supabase Auth integration
- Toast notifications for feedback

---

## 8. File Structure

```
src/
├── lib/
│   └── supabase.ts          # Supabase client
├── types/
│   └── database.ts          # TypeScript types
├── hooks/
│   ├── useAuth.ts           # Auth hook
│   ├── useEvents.ts         # Events hook
│   ├── useImages.ts         # Images hook
│   └── usePackages.ts       # Packages hook
├── contexts/
│   └── ToastContext.tsx     # Toast notifications
└── pages/
    ├── Admin.tsx            # Admin panel
    ├── GalleryEvent.tsx     # Event gallery
    └── ...

supabase/
└── setup.sql                # Database migration
```

---

## 9. API Functions Reference

### Events
```typescript
import { useEvents, createEvent, updateEvent, deleteEvent } from './hooks/useEvents';

// Fetch all events
const { events, loading, error, refetch } = useEvents();

// Fetch single event
const { event, loading, error } = useEvent(slug);

// Create event
await createEvent({
  event_name: 'Wedding',
  slug: 'wedding-event',
  category: 'Wedding',
  event_date: 'January 2024',
  location: 'Karaikudi',
  description: 'Optional',
  cover_image: 'https://...'
});

// Delete event (also deletes associated images)
await deleteEvent(id);
```

### Images
```typescript
import { useImageUpload, deleteImage } from './hooks/useImages';

// Upload images
const { uploadImages, uploading, progress } = useImageUpload();
await uploadImages(files, eventId, eventSlug);

// Delete image
await deleteImage(imageId, storagePath);
```

### Packages
```typescript
import { usePackages, updatePackage } from './hooks/usePackages';

// Fetch packages
const { packages, loading } = usePackages();

// Update package
await updatePackage(id, { price: 80000 });
```

---

## 10. Next Steps

### For Production:
1. Set up custom domain in Supabase
2. Configure email templates
3. Set up backups
4. Monitor storage usage
5. Add rate limiting if needed

### Optional Enhancements:
- Image optimization before upload
- CDN for faster image delivery
- Analytics tracking
- Contact form integration

---

## Support

For issues with Supabase integration:
1. Check browser console for errors
2. Verify environment variables
3. Check Supabase Dashboard logs
4. Review RLS policies

---

**Phase 2 Status: ✅ COMPLETE**

The backend is now fully functional and integrated with the React frontend!
