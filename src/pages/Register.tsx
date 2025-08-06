import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Play, Lock, Mail, User, AlertCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

interface RegisterForm {
  displayName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register: registerUser, isLoading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>()
  
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser({
        displayName: data.displayName,
        username: data.username,
        email: data.email,
        password: data.password
      })
      toast.success('Account created successfully!')
      navigate('/')
    } catch (error) {
      toast.error('Failed to create account. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl flex items-center justify-center">
                <Play size={24} className="text-white ml-1" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl blur-md opacity-50 group-hover:opacity-75 transition-opacity" />
            </div>
            <span className="text-2xl font-bold gradient-text">VideoStream</span>
          </Link>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Create Account</h1>
            <p className="text-gray-400">Join VideoStream and start sharing your content</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Display Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('displayName', {
                    required: 'Display name is required',
                    minLength: {
                      value: 2,
                      message: 'Display name must be at least 2 characters'
                    }
                  })}
                  className="input-field pl-12"
                  placeholder="Enter your display name"
                />
                <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.displayName && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle size={16} />
                  {errors.displayName.message}
                </motion.p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register('username', {
                    required: 'Username is required',
                    pattern: {
                      value: /^[a-zA-Z0-9_]+$/,
                      message: 'Username can only contain letters, numbers, and underscores'
                    },
                    minLength: {
                      value: 3,
                      message: 'Username must be at least 3 characters'
                    }
                  })}
                  className="input-field pl-12"
                  placeholder="Choose a unique username"
                />
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">@</span>
              </div>
              {errors.username && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle size={16} />
                  {errors.username.message}
                </motion.p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field pl-12"
                  placeholder="Enter your email"
                />
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle size={16} />
                  {errors.email.message}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters'
                    },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                    }
                  })}
                  className="input-field pl-12 pr-12"
                  placeholder="Create a strong password"
                />
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle size={16} />
                  {errors.password.message}
                </motion.p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) => value === password || 'Passwords do not match'
                  })}
                  className="input-field pl-12 pr-12"
                  placeholder="Confirm your password"
                />
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-1 text-sm text-red-400 flex items-center gap-1"
                >
                  <AlertCircle size={16} />
                  {errors.confirmPassword.message}
                </motion.p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                required
                className="w-4 h-4 mt-0.5 bg-dark-surface border border-dark-border rounded focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-gray-300">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-400 hover:text-primary-300 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-400 hover:text-primary-300 transition-colors">
                  Privacy Policy
                </Link>
              </span>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary-400 hover:text-primary-300 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>&copy; 2024 VideoStream. All rights reserved.</p>
        </motion.div>
      </div>

      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary-600/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-64 h-64 bg-secondary-600/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  )
}

export default Register