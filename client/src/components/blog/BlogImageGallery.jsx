import React from 'react'
import { ImageIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const BlogImageGallery = ({ images = [], className = '' }) => {
  const { t } = useTranslation()
  
  if (!images || images.length === 0) {
    return null
  }

  // Grouper les images par position
  const imagesByPosition = {
    top: images.filter(img => img.position === 'top'),
    'content-start': images.filter(img => img.position === 'content-start'),
    middle: images.filter(img => img.position === 'middle'),
    bottom: images.filter(img => img.position === 'bottom'),
    'content-end': images.filter(img => img.position === 'content-end'),
    inline: images.filter(img => img.position === 'inline')
  }

  // Composant pour afficher un groupe d'images
  const ImageGroup = ({ images, position, title }) => {
    if (images.length === 0) return null

    return (
      <div className={`blog-images-${position} ${className}`}>
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {title}
          </h3>
        )}
        <div className={`grid gap-4 ${
          images.length === 1 
            ? 'grid-cols-1' 
            : images.length === 2 
              ? 'grid-cols-1 md:grid-cols-2' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
        }`}>
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              
              {/* Légende */}
              {image.caption && (
                <p className="text-sm text-gray-600 mt-2 text-center italic">
                  {image.caption}
                </p>
              )}
              
              {/* Overlay pour zoom */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 rounded-lg flex items-center justify-center">
                <button
                  onClick={() => window.open(image.url, '_blank')}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100"
                  title="Voir en grand"
                >
                  <ImageIcon className="h-5 w-5 text-gray-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Images en haut */}
      <ImageGroup 
        images={imagesByPosition.top} 
        position="top"
        title={null}
      />

      {/* Images au début du contenu */}
      <ImageGroup 
        images={imagesByPosition['content-start']} 
        position="content-start"
        title={null}
      />

      {/* Images au milieu */}
      <ImageGroup 
        images={imagesByPosition.middle} 
        position="middle"
        title={null}
      />

      {/* Images en bas */}
      <ImageGroup 
        images={imagesByPosition.bottom} 
        position="bottom"
        title={null}
      />

      {/* Images à la fin du contenu */}
      <ImageGroup 
        images={imagesByPosition['content-end']} 
        position="content-end"
        title={null}
      />

      {/* Images inline - à afficher dans le contenu */}
      {imagesByPosition.inline.length > 0 && (
        <div className="blog-images-inline">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {imagesByPosition.inline.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                
                {/* Légende */}
                {image.caption && (
                  <p className="text-sm text-gray-600 mt-2 text-center italic">
                    {image.caption}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogImageGallery
