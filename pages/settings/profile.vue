<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-white mb-2">Profile Settings</h1>
      <p class="text-slate-300">Manage your personal information</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Avatar -->
      <Card>
        <template #header>
          <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Avatar</h2>
        </template>
        <div class="flex flex-col items-center">
          <div class="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center mb-4">
            <span class="text-4xl font-bold text-white">
              {{ userInitial }}
            </span>
          </div>
          <Button variant="ghost" size="sm" :iconLeft="Upload">
            Change Avatar
          </Button>
        </div>
      </Card>

      <!-- Profile Form -->
      <div class="lg:col-span-2">
        <Card>
          <template #header>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Personal Information</h2>
          </template>
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <Input
              v-model="form.fullName"
              label="Full Name"
              placeholder="John Doe"
              required
              :error="errors.fullName"
            />
            <Input
              v-model="form.email"
              type="email"
              label="Email"
              placeholder="john@example.com"
              required
              :error="errors.email"
              :iconLeft="Mail"
            />
            <Input
              v-model="form.bio"
              label="Bio"
              placeholder="Tell us about yourself"
              hint="Brief description for your profile"
            />
            <Input
              v-model="form.location"
              label="Location"
              placeholder="San Francisco, CA"
              :iconLeft="MapPin"
            />
            <Input
              v-model="form.website"
              type="url"
              label="Website"
              placeholder="https://example.com"
              :iconLeft="Globe"
            />
            <div class="flex justify-end gap-3 pt-4">
              <Button variant="ghost" type="button" @click="handleCancel">
                Cancel
              </Button>
              <Button type="submit" :loading="loading">
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        <!-- Password Change -->
        <Card class="mt-6">
          <template #header>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Change Password</h2>
          </template>
          <form @submit.prevent="handlePasswordChange" class="space-y-6">
            <Input
              v-model="passwordForm.currentPassword"
              type="password"
              label="Current Password"
              required
              :iconLeft="Lock"
            />
            <Input
              v-model="passwordForm.newPassword"
              type="password"
              label="New Password"
              required
              :iconLeft="Lock"
              hint="Must be at least 8 characters"
            />
            <Input
              v-model="passwordForm.confirmPassword"
              type="password"
              label="Confirm New Password"
              required
              :iconLeft="Lock"
              :error="passwordErrors.confirmPassword"
            />
            <div class="flex justify-end">
              <Button type="submit" :loading="passwordLoading">
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Mail, MapPin, Globe, Lock, Upload } from 'lucide-vue-next'

definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

const { user } = useAuth()
const { success, error } = useNotification()

const userInitial = computed(() => {
  const name = user.value?.user_metadata?.full_name
  return name ? name.charAt(0).toUpperCase() : 'U'
})

const form = ref({
  fullName: user.value?.user_metadata?.full_name || '',
  email: user.value?.email || '',
  bio: '',
  location: '',
  website: ''
})

const errors = ref({
  fullName: '',
  email: ''
})

const loading = ref(false)

const handleSubmit = async () => {
  // Validate
  errors.value = {
    fullName: '',
    email: ''
  }

  if (!form.value.fullName) {
    errors.value.fullName = 'Full name is required'
    return
  }

  if (!form.value.email) {
    errors.value.email = 'Email is required'
    return
  }

  loading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    success('Profile updated', 'Your profile has been updated successfully')
  } catch (e) {
    error('Update failed', 'Failed to update profile. Please try again.')
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  form.value = {
    fullName: user.value?.user_metadata?.full_name || '',
    email: user.value?.email || '',
    bio: '',
    location: '',
    website: ''
  }
}

const passwordForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordErrors = ref({
  confirmPassword: ''
})

const passwordLoading = ref(false)

const handlePasswordChange = async () => {
  passwordErrors.value = {
    confirmPassword: ''
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordErrors.value.confirmPassword = 'Passwords do not match'
    return
  }

  if (passwordForm.value.newPassword.length < 8) {
    error('Password too short', 'Password must be at least 8 characters')
    return
  }

  passwordLoading.value = true
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    success('Password updated', 'Your password has been changed successfully')
    passwordForm.value = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  } catch (e) {
    error('Update failed', 'Failed to update password. Please try again.')
  } finally {
    passwordLoading.value = false
  }
}
</script>
