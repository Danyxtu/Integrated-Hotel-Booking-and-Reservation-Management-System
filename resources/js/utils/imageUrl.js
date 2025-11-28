/**
 * Get the full URL for an image stored in Supabase
 * 
 * @param {string|null|undefined} imagePath - The image path from the database
 * @param {string|null|undefined} imageUrl - The full image URL (if already available from model)
 * @returns {string} The full URL to the image
 */
export const getImageUrl = (imagePath, imageUrl = null) => {
    // If a full URL is already provided (from model's image_url attribute), use it
    if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('http')) {
        return imageUrl;
    }
    
    // If no image path provided, return placeholder
    if (!imagePath) {
        return "https://via.placeholder.com/600x400?text=LuxStay+Room";
    }
    
    // If already a full URL, return as is
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // Get Supabase project URL from environment
    // This should be your Supabase project URL (e.g., https://xxxxx.supabase.co)
    const supabaseProjectUrl = import.meta.env.VITE_SUPABASE_URL || '';
    
    // Get bucket name from env or use default
    const bucket = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || 'mybucket';
    
    // If we have a Supabase URL configured, construct the full public URL
    if (supabaseProjectUrl) {
        // Clean the path (remove leading/trailing slashes)
        let cleanPath = String(imagePath).replace(/^\/+|\/+$/g, '');
        
        // Remove any existing bucket prefix if present
        cleanPath = cleanPath.replace(new RegExp(`^${bucket}/`), '');
        
        // Remove 'storage/v1/object/public/' if it's already in the path
        cleanPath = cleanPath.replace(/^storage\/v1\/object\/public\/[^\/]+\//, '');
        
        // Construct the full public URL
        // Format: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
        return `${supabaseProjectUrl}/storage/v1/object/public/${bucket}/${cleanPath}`;
    }
    
    // Fallback to local storage path (for development or if Supabase not configured)
    const cleanPath = String(imagePath).replace(/^\/?storage\//, '').replace(/^\/+/, '');
    return `/storage/${cleanPath}`;
};

/**
 * Legacy function name for backward compatibility
 * @deprecated Use getImageUrl instead
 */
export const getImageSrc = getImageUrl;

export default getImageUrl;

