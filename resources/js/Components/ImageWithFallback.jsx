import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

const ImageWithFallback = ({ src, alt, className, fallbackComponent, loadingComponent }) => {
    const [imageSrc, setImageSrc] = useState(src);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Reset state if src changes
    React.useEffect(() => {
        setImageSrc(src);
        setIsLoading(true);
        setHasError(false);
    }, [src]);

    const handleLoad = () => {
        setIsLoading(false);
        setHasError(false);
    };

    const handleError = () => {
        setIsLoading(false);
        setHasError(true);
        // Optionally set a blank or specific error image if needed,
        // but for a fallback component, it might be better to let it be handled by the parent
        setImageSrc('');
    };

    if (hasError || !imageSrc) {
        return fallbackComponent || (
            <div className={`h-full w-full bg-gray-200 flex flex-col items-center justify-center text-gray-500 ${className}`}>
                <ImageOff className="w-8 h-8 mb-2" />
                <span>No Image</span>
            </div>
        );
    }

    if (isLoading) {
        return loadingComponent || (
            <div className={`h-full w-full bg-gray-100 flex items-center justify-center text-gray-400 ${className}`}>
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="ml-2">Loading...</span>
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt}
            className={className}
            onLoad={handleLoad}
            onError={handleError}
        />
    );
};

export default ImageWithFallback;