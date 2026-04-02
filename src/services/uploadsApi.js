import api from './api'

export const uploadsApi = {
  /**
   * Upload multiple property images to media storage.
   * Note: this uploads files only; it does not attach them to a property record.
   * @param {FormData} formData - FormData with files
   * @returns {Promise} - { images, uploadedCount, folder }
   */
  uploadPropertyImages: (formData) => {
    return api.post('/uploads/property/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data.data || res.data)
  },

  /**
   * Upload profile avatar
   * @param {FormData} formData - FormData with file
   * @returns {Promise} - { imageUrl, user }
   */
  uploadProfilePicture: (formData) => {
    return api.post('/uploads/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((res) => res.data.data || res.data)
  },

  /**
   * Delete an uploaded image by Cloudinary publicId.
   * @param {string} publicId - Cloudinary publicId
   * @returns {Promise}
   */
  deletePropertyImage: (publicId) => {
    return api.delete('/uploads/image', { data: { publicId } }).then((res) => res.data.data || res.data)
  },

  /**
   * Alias for deleting image by publicId
   * @param {string} publicId - Cloudinary publicId
   * @returns {Promise}
   */
  deleteProfilePicture: (publicId) => {
    return api.delete('/uploads/image', { data: { publicId } }).then((res) => res.data.data || res.data)
  },

  /**
   * Upload stats for admin dashboards
   * @returns {Promise}
   */
  getUploadStats: () => {
    return api.get('/uploads/stats').then((res) => res.data.data || res.data)
  },
}
