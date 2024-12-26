import { supabase } from '@/utils/supabase'

// Function to update the user's profile information
export const updateUserProfile = async (updates) => {
  try {
    const { data, error } = await supabase.auth.updateUser({
      data: updates,
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Error updating user profile:', error.message)
    throw error
  }
}

// Function to change the user's profile picture
export const changeProfilePicture = async (file) => {
  try {
    const user = supabase.auth.user()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const filePath = `public/${user.id}/profile-picture.png`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    })

    if (uploadError) {
      throw uploadError
    }

    const { publicURL, error: urlError } = supabase.storage.from('avatars').getPublicUrl(filePath)

    if (urlError) {
      throw urlError
    }

    await updateUserProfile({ avatar_url: publicURL })
  } catch (error) {
    console.error('Error changing profile picture:', error.message)
    throw error
  }
}

// Function to delete the user's account
export const deleteUserAccount = async () => {
  try {
    const user = supabase.auth.user()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const { error } = await supabase.auth.api.deleteUser(user.id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Error deleting user account:', error.message)
    throw error
  }
}
