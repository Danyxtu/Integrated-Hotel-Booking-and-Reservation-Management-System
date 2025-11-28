import React from 'react';

const ImageWithFallback = ({ src, alt, className }) => {
    return (
        <img
            src={src}
            alt={alt}
            className={className}
        />
    );
};

export default ImageWithFallback;
