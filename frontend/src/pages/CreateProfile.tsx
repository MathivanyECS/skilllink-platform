// src/pages/CreateProfile.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ArrowRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import ProfileForm from './components/auth/ProfileForm';

const CreateProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleProfileComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      {/* Header */}
      <div className="bg-primary-dark-gray border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-green rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-black" />
              </div>
              <span className="text-2xl font-bold text-white">
                Skill<span className="text-primary-green">Link</span>
              </span>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="text-sm text-gray-400 hover:text-primary-green transition-colors"
            >
              Skip for now →
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-4xl">
          {/* Progress Header */}
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-primary-green/10 border border-primary-green/30 rounded-full mb-6">
              <span className="text-primary-green font-semibold text-sm">✨ Step 2 of 2</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Complete Your <span className="text-primary-green">Profile</span>
            </h1>
            <p className="text-xl text-gray-400">
              Tell us about your skills and what you want to learn
            </p>
          </div>

          {/* Profile Form Card */}
          <div className="bg-primary-dark-gray border border-gray-800 rounded-2xl shadow-2xl p-8">
            {user && (
              <div className="mb-6 p-4 bg-primary-green/10 border border-primary-green/30 rounded-xl">
                <p className="text-primary-green text-sm">
                  👋 Welcome, <span className="font-bold">{user.fullName}</span>!
                </p>
              </div>
            )}

            <ProfileForm onComplete={handleProfileComplete} />
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              You can always update your profile later from settings
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProfile;