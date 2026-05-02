import React, { createContext, useContext, useState, useCallback } from 'react'

const ImageStoreContext = createContext(null)

export function ImageStoreProvider({ children }) {
  const [images, setImages] = useState({})

  const uploadImage = useCallback((id, url) => {
    setImages(prev => ({ ...prev, [id]: url }))
  }, [])

  const clearImages = useCallback(() => {
    // Revoke all object URLs to free memory
    Object.values(images).forEach(url => {
      if (url.startsWith('blob:')) {
        URL.revokeObjectURL(url)
      }
    })
    setImages({})
  }, [images])

  return (
    <ImageStoreContext.Provider value={{ images, uploadImage, clearImages }}>
      {children}
    </ImageStoreContext.Provider>
  )
}

export function useImageStore() {
  const ctx = useContext(ImageStoreContext)
  if (!ctx) {
    throw new Error('useImageStore must be used within an ImageStoreProvider')
  }
  return ctx
}
