/**
 * Get the full URL for an image.
 * Prioritizes a provided full URL, falls back to a placeholder,
 * then assumes a relative path is from Laravel's public storage.
 * 
 * @param {string|null|undefined} imagePath - The image path from the database (e.g., 'room_type_images/abc.jpg')
 * @param {string|null|undefined} imageUrl - The full image URL (if already available from model, e.g., 'http://localhost:8000/storage/room_type_images/abc.jpg')
 * @returns {string} The full URL to the image or a placeholder.
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
    
    // If imagePath is already a full URL (e.g., from an external source or already processed), return as is
    if (typeof imagePath === 'string' && imagePath.startsWith('http')) {
        return imagePath;
    }
    
    // If imagePath is a relative path, assume it's from Laravel's public storage.
    // Prepend /storage/. For example, 'room_type_images/abc.jpg' becomes '/storage/room_type_images/abc.jpg'
    // Ensure only one leading slash and no trailing slashes in the path fragment.
    const cleanPath = String(imagePath).replace(/^\/+|\/+$/g, '');
    return `/storage/${cleanPath}`;
};

/**
 * Legacy function name for backward compatibility
 * @deprecated Use getImageUrl instead
 */
export const getImageSrc = getImageUrl;

export default getImageUrl;

