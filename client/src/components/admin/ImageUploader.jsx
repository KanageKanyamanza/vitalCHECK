import React, { useState, useRef } from 'react'
import { Upload, X, Image as ImageIcon, Trash2, Move, Eye } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { uploadApiService } from '../../services/api'
import toast from 'react-hot-toast'

const ImageUploader = ({ 
  images = [], 
  onImagesChange, 
  maxImages = 10,
  showPositionControls = true 
}) => {
  const { t } = useTranslation()
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  // Gérer l'upload de fichiers
  const handleFileUpload = async (files) => {
    if (!files || files.length === 0) return

    // Vérifier le nombre maximum d'images
    if (images.length + files.length > maxImages) {
      toast.error(t('blog.images.maxImages'))
      return
    }

    // Vérifier les types de fichiers
    const validFiles = Array.from(files).filter(file => {
      if (!file.type || !file.type.startsWith('image/')) {
        toast.error(`${file.name} ${t('blog.images.invalidFile')}`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast.error(`${file.name} ${t('blog.images.fileTooLarge')}`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setUploading(true)
    try {
      const formData = new FormData()
      validFiles.forEach(file => {
        formData.append('images', file)
      })

      const response = await uploadApiService.uploadImages(formData)
      
      if (response.data.success) {
        const newImages = response.data.data.map(img => ({
          cloudinaryId: img.id,
          url: img.url,
          alt: '',
          caption: '',
          position: 'inline',
          order: images.length,
          width: img.width,
          height: img.height,
          format: img.format,
          size: img.size
        }))

        onImagesChange([...images, ...newImages])
        toast.success(`${newImages.length} ${t('blog.images.uploadSuccess')}`)
      }
    } catch (error) {
      console.error('Erreur upload:', error)
      toast.error(t('blog.images.uploadError'))
    } finally {
      setUploading(false)
    }
  }

  // Gérer le drop de fichiers
  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  // Gérer le changement de fichier via input
  const handleFileChange = (e) => {
    const files = e.target.files
    handleFileUpload(files)
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Supprimer une image
  const removeImage = async (index) => {
    const image = images[index]
    if (image.cloudinaryId) {
      try {
        await uploadApiService.deleteImage(image.cloudinaryId)
      } catch (error) {
        console.error('Erreur suppression image:', error)
        // Continuer même si la suppression échoue
      }
    }

    const newImages = images.filter((_, i) => i !== index)
    // Réorganiser les ordres
    newImages.forEach((img, i) => {
      img.order = i
    })
    onImagesChange(newImages)
    toast.success(t('blog.images.deleteSuccess'))
  }

  // Changer la position d'une image
  const changePosition = (index, newPosition) => {
    const newImages = [...images]
    newImages[index].position = newPosition
    onImagesChange(newImages)
  }

  // Insérer une image dans le contenu HTML
  const insertImageInContent = (imageIndex, position = 'after') => {
    const image = images[imageIndex]
    if (!image) return

    // Générer le HTML de l'image
    const imageHtml = `
      <div class="blog-image-inserted" data-image-id="${image.cloudinaryId}" style="margin: 20px 0; text-align: center;">
        <img 
          src="${image.url}" 
          alt="${image.alt || ''}" 
          style="max-width: 100%; height: auto; border-radius: 8px;"
        />
        ${image.caption ? `<p style="margin-top: 8px; font-style: italic; color: #666; font-size: 0.9em;">${image.caption}</p>` : ''}
      </div>
    `

    // Retourner l'HTML à insérer
    return imageHtml
  }

  // Réorganiser les images
  const moveImage = (fromIndex, toIndex) => {
    const newImages = [...images]
    const [movedImage] = newImages.splice(fromIndex, 1)
    newImages.splice(toIndex, 0, movedImage)
    
    // Réorganiser les ordres
    newImages.forEach((img, i) => {
      img.order = i
    })
    onImagesChange(newImages)
  }

  // Mettre à jour les métadonnées d'une image
  const updateImageMetadata = (index, field, value) => {
    const newImages = [...images]
    newImages[index][field] = value
    onImagesChange(newImages)
  }

  return (
    <div className="space-y-4">
      {/* Zone d'upload */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver 
            ? 'border-primary-500 bg-primary-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="space-y-2">
          <Upload className="h-8 w-8 text-gray-400 mx-auto" />
          <p className="text-sm text-gray-600">
            {t('blog.images.uploadDescription')}{' '}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              cliquez pour sélectionner
            </button>
          </p>
          <p className="text-xs text-gray-500">
            {t('blog.images.uploadHint')}
          </p>
        </div>

        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">{t('blog.images.uploading')}</p>
          </div>
        )}
      </div>

      {/* Liste des images */}
      {images.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-700">
            Images ({images.length}/{maxImages})
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                {/* Image preview */}
                <div className="relative aspect-video bg-gray-100">
                  <img
                    src={image.url}
                    alt={image.alt || `Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Actions */}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <button
                      type="button"
                      onClick={() => window.open(image.url, '_blank')}
                      className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100"
                      title="Voir en grand"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    {image.position === 'inline' && (
                      <button
                        type="button"
                        onClick={() => {
                          const html = insertImageInContent(index)
                          // Copier le HTML dans le presse-papiers
                          navigator.clipboard.writeText(html)
                          toast.success('HTML de l\'image copié ! Collez-le dans votre contenu.')
                        }}
                        className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100 text-blue-600"
                        title="Copier le HTML pour insérer dans le contenu"
                      >
                        <ImageIcon className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="p-1 bg-white bg-opacity-80 rounded hover:bg-opacity-100 text-red-600"
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Position indicator */}
                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
                      {image.position}
                    </span>
                  </div>
                </div>

                {/* Métadonnées */}
                <div className="p-3 space-y-2">
                  {/* Position */}
                  {showPositionControls && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        {t('blog.images.position')}
                      </label>
                      <select
                        value={image.position}
                        onChange={(e) => changePosition(index, e.target.value)}
                        className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="top">{t('blog.images.positionTop')}</option>
                        <option value="middle">{t('blog.images.positionMiddle')}</option>
                        <option value="bottom">{t('blog.images.positionBottom')}</option>
                        <option value="inline">{t('blog.images.positionInline')}</option>
                        <option value="content-start">{t('blog.images.positionContentStart')}</option>
                        <option value="content-end">{t('blog.images.positionContentEnd')}</option>
                      </select>
                    </div>
                  )}

                  {/* Alt text */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('blog.images.altText')}
                    </label>
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => updateImageMetadata(index, 'alt', e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                      placeholder={t('blog.images.altTextPlaceholder')}
                    />
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      {t('blog.images.caption')}
                    </label>
                    <input
                      type="text"
                      value={image.caption}
                      onChange={(e) => updateImageMetadata(index, 'caption', e.target.value)}
                      className="w-full text-xs border border-gray-300 rounded px-2 py-1"
                      placeholder={t('blog.images.captionPlaceholder')}
                    />
                  </div>

                  {/* Info image */}
                  <div className="text-xs text-gray-500">
                    {image.width} × {image.height} • {image.format?.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageUploader
