# Supabase Storage Configuration Guide

This document explains how to configure Supabase Storage for image uploads and rendering in your Laravel application.

## Required Environment Variables

Add the following environment variables to your `.env` file:

### Backend Configuration (Laravel)

```env
# Supabase Storage Configuration (S3-compatible API)
SUPABASE_STORAGE_KEY=your_service_role_key
SUPABASE_STORAGE_SECRET=your_service_role_key
SUPABASE_STORAGE_REGION=us-east-1
SUPABASE_STORAGE_BUCKET=mybucket
SUPABASE_STORAGE_ENDPOINT=https://xxxxx.supabase.co/storage/v1/s3
SUPABASE_STORAGE_URL=https://xxxxx.supabase.co/storage/v1/object/public
```

### Frontend Configuration (React/Vite)

```env
# Supabase Storage Configuration (for frontend)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_STORAGE_BUCKET=mybucket
```

## How to Get These Values

### 1. Supabase Project URL
- Go to your Supabase project dashboard
- Navigate to **Settings** → **API**
- Copy your **Project URL** (e.g., `https://hkesjqamfhhvwfsozgcj.supabase.co`)
- Use this for `SUPABASE_STORAGE_URL` (backend) and `VITE_SUPABASE_URL` (frontend)

### 2. Service Role Key
- In the same **Settings** → **API** page
- Copy your **service_role key** (⚠️ Keep this secret!)
- Use this for both `SUPABASE_STORAGE_KEY` and `SUPABASE_STORAGE_SECRET`

### 3. Storage Bucket Name
- Go to **Storage** in your Supabase dashboard
- Create a bucket (or use existing one)
- Make sure the bucket is **Public**
- Copy the bucket name (e.g., `mybucket`)
- Use this for `SUPABASE_STORAGE_BUCKET` and `VITE_SUPABASE_STORAGE_BUCKET`

### 4. Storage Endpoint
- Construct it as: `{SUPABASE_PROJECT_URL}/storage/v1/s3`
- Example: `https://hkesjqamfhhvwfsozgcj.supabase.co/storage/v1/s3`

### 5. Storage URL (Public URL base)
- Construct it as: `{SUPABASE_PROJECT_URL}/storage/v1/object/public`
- Example: `https://hkesjqamfhhvwfsozgcj.supabase.co/storage/v1/object/public`

## Storage Bucket Setup

1. **Create a Public Bucket:**
   - Go to **Storage** → **Buckets** → **New bucket**
   - Name it (e.g., `mybucket`)
   - Set **Public bucket** to `true` ✅
   - Click **Create bucket**

2. **Set Bucket Policies (if needed):**
   - Go to **Storage** → **Policies**
   - Create policies for public read access if required

## Important Notes

⚠️ **Security Warning:**
- The `service_role` key has admin access to your Supabase project
- Never commit this key to version control
- Keep it in `.env` file only (which should be in `.gitignore`)

✅ **Public Bucket Required:**
- Images must be stored in a **public bucket** for direct URL access
- Private buckets require signed URLs which are more complex

## Configuration Files Updated

The following files have been configured for Supabase:

1. **config/filesystems.php** - Laravel storage disk configuration
2. **app/Models/RoomType.php** - Model now uses Supabase disk for image URLs
3. **resources/js/utils/imageUrl.js** - Frontend utility for constructing image URLs
4. All React components now use the centralized `getImageUrl()` utility

## Testing

After configuration:

1. **Clear config cache:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   ```

2. **Rebuild frontend assets:**
   ```bash
   npm run build
   # or for development
   npm run dev
   ```

3. **Test image upload:**
   - Upload a room type image through the admin panel
   - Check that the image appears correctly on the frontend

4. **Verify storage:**
   - Check your Supabase Storage dashboard
   - Confirm files are being uploaded to the correct bucket
   - Verify URLs are publicly accessible

## Troubleshooting

### Images not rendering:
1. Check that `VITE_SUPABASE_URL` and `VITE_SUPABASE_STORAGE_BUCKET` are set
2. Verify the bucket is public
3. Check browser console for URL errors
4. Ensure frontend assets are rebuilt after `.env` changes

### Upload fails:
1. Verify `SUPABASE_STORAGE_KEY` and `SUPABASE_STORAGE_SECRET` are correct
2. Check `SUPABASE_STORAGE_ENDPOINT` format
3. Verify bucket exists and is accessible
4. Check Laravel logs: `storage/logs/laravel.log`

### URLs incorrect:
1. Verify `SUPABASE_STORAGE_URL` format in `.env`
2. Check `RoomType` model's `getImageUrlAttribute()` method
3. Clear Laravel config cache: `php artisan config:clear`

