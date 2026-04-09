"use client";

import { useEffect, useState, useReducer } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { loadProfile, saveProfile, UserProfile as SurveyProfile } from "@/lib/matching";

interface ExtendedProfile {
  id: string;
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    bio: string;
    avatar?: string;
  };
  education: {
    level: string;
    major: string;
    university: string;
    gpa: number;
    graduationYear: number;
  };
  skills: string[];
  languages: Array<{ language: string; proficiency: string }>;
  preferences: {
    targetCountries: string[];
    opportunityTypes: string[];
    salaryRange: { min: number; max: number };
  };
  documents: Array<{ name: string; type: string; uploadDate: string }>;
}

const getInitialProfile = (): ExtendedProfile => {
  const surveyData = loadProfile();
  
  if (!surveyData) {
    // Return empty profile if no survey data exists
    return {
      id: "1",
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        avatar: undefined
      },
      education: {
        level: "",
        major: "",
        university: "",
        gpa: 0,
        graduationYear: 0
      },
      skills: [],
      languages: [],
      preferences: {
        targetCountries: [],
        opportunityTypes: [],
        salaryRange: { min: 0, max: 0 }
      },
      documents: []
    };
  }

  // Map survey data to extended profile structure
  return {
    id: "1",
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      location: "Algiers, Algeria", // Default location
      bio: `${surveyData.level} student in ${surveyData.field} looking for ${surveyData.goal} opportunities.`,
      avatar: undefined
    },
    education: {
      level: surveyData.level === "L3" ? "Bachelor's" : 
             surveyData.level === "L2" ? "Associate's" :
             surveyData.level === "L1" ? "High School" :
             surveyData.level === "Master" ? "Master's" : "PhD",
      major: surveyData.field,
      university: "",
      gpa: 0,
      graduationYear: 0
    },
    skills: surveyData.field === "Computer Science" ? 
      ["JavaScript", "Python", "React", "Node.js", "Machine Learning", "Data Analysis"] :
      surveyData.field === "Engineering" ?
      ["CAD", "MATLAB", "SolidWorks", "Project Management", "Quality Control"] :
      surveyData.field === "Law" ?
      ["Legal Research", "Case Analysis", "Contract Drafting", "Public Speaking", "Legal Writing"] :
      ["Excel", "PowerPoint", "Financial Analysis", "Marketing", "Business Strategy"],
    languages: [
      { language: "Arabic", proficiency: "Native" },
      { language: "French", proficiency: surveyData.english === "C2" ? "Fluent" : surveyData.english === "C1" ? "Advanced" : "Intermediate" },
      { language: "English", proficiency: surveyData.english === "C2" ? "Fluent" : surveyData.english === "C1" ? "Advanced" : surveyData.english === "B2" ? "Upper-Intermediate" : surveyData.english === "B1" ? "Intermediate" : "Basic" }
    ],
    preferences: {
      targetCountries: ["Canada", "France", "Germany", "USA"], // Default preferences
      opportunityTypes: surveyData.goal === "study" ? ["Bachelor's Program", "Master's Program", "PhD Program"] : ["Internship", "Research Position"],
      salaryRange: { min: 30000, max: 80000 }
    },
    documents: []
  };
};

// Inline Profile Section Component
function ProfileSection({ 
  title, 
  children, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel 
}: { 
  title: string; 
  children: React.ReactNode; 
  isEditing: boolean; 
  onEdit: () => void; 
  onSave: () => void; 
  onCancel: () => void; 
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-xl text-navy">{title}</h3>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="btn btn-primary btn-sm"
              >
                Save
              </button>
              <button
                onClick={onCancel}
                className="btn btn-outline btn-sm"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="btn btn-outline btn-sm"
            >
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="animate-slide-up">
        {children}
      </div>
    </div>
  );
}

// Inline Skill Tag Component
function SkillTag({ skill, isEditing, onRemove }: { 
  skill: string; 
  isEditing: boolean; 
  onRemove?: () => void; 
}) {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      onRemove?.();
      setIsRemoving(false);
    }, 200);
  };

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
        isEditing 
          ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
          : 'bg-gray-100 text-gray-700 border border-gray-200'
      } ${isRemoving ? 'opacity-50 scale-95' : ''}`}
    >
      <span>{skill}</span>
      {isEditing && onRemove && (
        <button
          onClick={handleRemove}
          className="text-emerald-600 hover:text-emerald-700 transition-colors"
          title="Remove skill"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}

function profileReducer(state: ExtendedProfile, action: any) {
  switch (action.type) {
    case 'UPDATE_PERSONAL_INFO':
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload }
      };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: { ...state.education, ...action.payload }
      };
    case 'ADD_SKILL':
      return {
        ...state,
        skills: [...state.skills, action.payload]
      };
    case 'REMOVE_SKILL':
      return {
        ...state,
        skills: state.skills.filter((skill: string) => skill !== action.payload)
      };
    case 'UPDATE_PREFERENCES':
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload }
      };
    case 'ADD_DOCUMENT':
      return {
        ...state,
        documents: [...state.documents, action.payload]
      };
    case 'REMOVE_DOCUMENT':
      return {
        ...state,
        documents: state.documents.filter((doc: { name: string }) => doc.name !== action.payload)
      };
    default:
      return state;
  }
}

export default function ProfilePage() {
  const [profile, dispatch] = useReducer(profileReducer, getInitialProfile());
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [completion, setCompletion] = useState(0);

  useEffect(() => {
    // Calculate profile completion
    const fields = [
      profile.personalInfo.firstName,
      profile.personalInfo.lastName,
      profile.personalInfo.email,
      profile.personalInfo.location,
      profile.education.level,
      profile.education.major,
      profile.education.university,
      profile.skills.length > 0,
      profile.languages.length > 0,
      profile.preferences.targetCountries.length > 0,
      profile.documents.length > 0
    ];
    
    const filledFields = fields.filter(field => field).length;
    const completionPercentage = Math.round((filledFields / fields.length) * 100);
    setCompletion(completionPercentage);

    // Save to localStorage
    localStorage.setItem('aosep_extended_profile', JSON.stringify(profile));
  }, [profile]);

  const handleSave = (section: string, data: any) => {
    switch (section) {
      case 'personalInfo':
        dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: data });
        break;
      case 'education':
        dispatch({ type: 'UPDATE_EDUCATION', payload: data });
        break;
      case 'preferences':
        dispatch({ type: 'UPDATE_PREFERENCES', payload: data });
        break;
    }
    setIsEditing(null);
  };

  const handleAddSkill = (skill: string) => {
    if (skill && !profile.skills.includes(skill)) {
      dispatch({ type: 'ADD_SKILL', payload: skill });
    }
  };

  const handleRemoveSkill = (skill: string) => {
    dispatch({ type: 'REMOVE_SKILL', payload: skill });
  };

  const handleAddDocument = (document: { name: string; type: string }) => {
    const newDoc = {
      ...document,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    dispatch({ type: 'ADD_DOCUMENT', payload: newDoc });
  };

  const handleRemoveDocument = (documentName: string) => {
    dispatch({ type: 'REMOVE_DOCUMENT', payload: documentName });
  };

  return (
    <div className="page-enter">
      <Navbar />
      <div className="px-6 py-8 max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-soft">
            <div className="flex items-center gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-navy rounded-full flex items-center justify-center text-white text-3xl font-serif shadow-soft">
                  {profile.personalInfo.firstName[0] || 'A'}{profile.personalInfo.lastName[0] || 'U'}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-emerald rounded-full flex items-center justify-center text-white shadow-medium hover:shadow-strong transition-shadow">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              
              {/* Info */}
              <div className="flex-1">
                <h1 className="font-serif text-3xl text-navy mb-2">
                  {profile.personalInfo.firstName} {profile.personalInfo.lastName}
                </h1>
                <p className="text-gray-600 mb-4">{profile.personalInfo.bio}</p>
                
                {/* Completion Progress */}
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">Profile Completion</span>
                      <span className="text-sm font-semibold text-navy">{completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-emerald h-2 rounded-full transition-all duration-300"
                        style={{ width: `${completion}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard" className="btn btn-outline btn-sm">
            📊 View Dashboard
          </Link>
          <Link href="/home" className="btn btn-primary btn-sm">
            🎯 Browse Opportunities
          </Link>
        </div>

        {/* Profile Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Personal Information */}
          <ProfileSection
            title="Personal Information"
            isEditing={isEditing === 'personalInfo'}
            onEdit={() => setIsEditing('personalInfo')}
            onSave={() => setIsEditing(null)}
            onCancel={() => setIsEditing(null)}
          >
            {isEditing === 'personalInfo' ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    value={profile.personalInfo.firstName}
                    onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { firstName: e.target.value } })}
                    className="form-control"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    value={profile.personalInfo.lastName}
                    onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { lastName: e.target.value } })}
                    className="form-control"
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={profile.personalInfo.email}
                  onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { email: e.target.value } })}
                  className="form-control"
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={profile.personalInfo.phone}
                  onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { phone: e.target.value } })}
                  className="form-control"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={profile.personalInfo.location}
                  onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { location: e.target.value } })}
                  className="form-control"
                />
                <textarea
                  placeholder="Bio"
                  value={profile.personalInfo.bio}
                  onChange={(e) => dispatch({ type: 'UPDATE_PERSONAL_INFO', payload: { bio: e.target.value } })}
                  className="form-control"
                  rows={3}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Email:</span>
                  <span className="text-sm text-gray-900">{profile.personalInfo.email || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Phone:</span>
                  <span className="text-sm text-gray-900">{profile.personalInfo.phone || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Location:</span>
                  <span className="text-sm text-gray-900">{profile.personalInfo.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-gray-500">Bio:</span>
                  <span className="text-sm text-gray-900 flex-1">{profile.personalInfo.bio}</span>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Academic Background */}
          <ProfileSection
            title="Academic Background"
            isEditing={isEditing === 'education'}
            onEdit={() => setIsEditing('education')}
            onSave={() => setIsEditing(null)}
            onCancel={() => setIsEditing(null)}
          >
            {isEditing === 'education' ? (
              <div className="space-y-4">
                <select
                  value={profile.education.level}
                  onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', payload: { level: e.target.value } })}
                  className="form-control"
                >
                  <option value="">Select Education Level</option>
                  <option value="High School">High School</option>
                  <option value="Associate's">Associate's</option>
                  <option value="Bachelor's">Bachelor's</option>
                  <option value="Master's">Master's</option>
                  <option value="PhD">PhD</option>
                </select>
                <input
                  type="text"
                  placeholder="Major"
                  value={profile.education.major}
                  onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', payload: { major: e.target.value } })}
                  className="form-control"
                />
                <input
                  type="text"
                  placeholder="University"
                  value={profile.education.university}
                  onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', payload: { university: e.target.value } })}
                  className="form-control"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="GPA"
                    value={profile.education.gpa}
                    onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', payload: { gpa: parseFloat(e.target.value) } })}
                    className="form-control"
                    step="0.1"
                    min="0"
                    max="4"
                  />
                  <input
                    type="number"
                    placeholder="Graduation Year"
                    value={profile.education.graduationYear}
                    onChange={(e) => dispatch({ type: 'UPDATE_EDUCATION', payload: { graduationYear: parseInt(e.target.value) } })}
                    className="form-control"
                    min="2024"
                    max="2030"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Level:</span>
                  <span className="text-sm text-gray-900">{profile.education.level || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Major:</span>
                  <span className="text-sm text-gray-900">{profile.education.major}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">University:</span>
                  <span className="text-sm text-gray-900">{profile.education.university || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">GPA:</span>
                  <span className="text-sm text-gray-900">{profile.education.gpa || "Not specified"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">Graduation:</span>
                  <span className="text-sm text-gray-900">{profile.education.graduationYear || "Not specified"}</span>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Skills & Languages */}
          <ProfileSection
            title="Skills & Languages"
            isEditing={isEditing === 'skills'}
            onEdit={() => setIsEditing('skills')}
            onSave={() => setIsEditing(null)}
            onCancel={() => setIsEditing(null)}
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Technical Skills</h4>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.skills.map((skill) => (
                    <SkillTag
                      key={skill}
                      skill={skill}
                      isEditing={isEditing === 'skills'}
                      onRemove={() => handleRemoveSkill(skill)}
                    />
                  ))}
                </div>
                {isEditing === 'skills' && (
                  <input
                    type="text"
                    placeholder="Add a skill..."
                    className="form-control"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddSkill((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Languages</h4>
                <div className="space-y-2">
                  {profile.languages.map((lang) => (
                    <div key={lang.language} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{lang.language}</span>
                      <span className="text-sm text-gray-600">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </ProfileSection>

          {/* Preferences */}
          <ProfileSection
            title="Preferences"
            isEditing={isEditing === 'preferences'}
            onEdit={() => setIsEditing('preferences')}
            onSave={() => setIsEditing(null)}
            onCancel={() => setIsEditing(null)}
          >
            {isEditing === 'preferences' ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Countries</label>
                  <select
                    multiple
                    value={profile.preferences.targetCountries}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                      dispatch({ type: 'UPDATE_PREFERENCES', payload: { targetCountries: values } });
                    }}
                    className="form-control"
                    size={4}
                  >
                    <option value="Canada">Canada</option>
                    <option value="France">France</option>
                    <option value="Germany">Germany</option>
                    <option value="USA">USA</option>
                    <option value="UK">United Kingdom</option>
                    <option value="Australia">Australia</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Sweden">Sweden</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Opportunity Types</label>
                  <select
                    multiple
                    value={profile.preferences.opportunityTypes}
                    onChange={(e) => {
                      const values = Array.from(e.target.selectedOptions, (option: HTMLOptionElement) => option.value);
                      dispatch({ type: 'UPDATE_PREFERENCES', payload: { opportunityTypes: values } });
                    }}
                    className="form-control"
                    size={4}
                  >
                    <option value="Internship">Internship</option>
                    <option value="Bachelor's Program">Bachelor's Program</option>
                    <option value="Master's Program">Master's Program</option>
                    <option value="PhD Program">PhD Program</option>
                    <option value="Exchange Program">Exchange Program</option>
                    <option value="Research">Research Position</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range (USD)</label>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Min"
                      value={profile.preferences.salaryRange.min}
                      onChange={(e) => dispatch({ 
                        type: 'UPDATE_PREFERENCES', 
                        payload: { 
                          salaryRange: { 
                            ...profile.preferences.salaryRange, 
                            min: parseInt(e.target.value) 
                          } 
                        } 
                      })}
                      className="form-control"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      value={profile.preferences.salaryRange.max}
                      onChange={(e) => dispatch({ 
                        type: 'UPDATE_PREFERENCES', 
                        payload: { 
                          salaryRange: { 
                            ...profile.preferences.salaryRange, 
                            max: parseInt(e.target.value) 
                          } 
                        } 
                      })}
                      className="form-control"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Target Countries:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.preferences.targetCountries.map((country: string) => (
                      <span key={country} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">
                        {country}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Opportunity Types:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profile.preferences.opportunityTypes.map((type: string) => (
                      <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Salary Range:</span>
                  <span className="text-sm text-gray-900">
                    ${profile.preferences.salaryRange.min.toLocaleString()} - ${profile.preferences.salaryRange.max.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </ProfileSection>

          {/* Documents */}
          <ProfileSection
            title="Documents"
            isEditing={isEditing === 'documents'}
            onEdit={() => setIsEditing('documents')}
            onSave={() => setIsEditing(null)}
            onCancel={() => setIsEditing(null)}
          >
            <div className="space-y-3">
              {profile.documents.map((doc) => (
                <div key={doc.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center text-white">
                      📄
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                      <p className="text-xs text-gray-500">{doc.type} • {doc.uploadDate}</p>
                    </div>
                  </div>
                  {isEditing === 'documents' && (
                    <button
                      onClick={() => handleRemoveDocument(doc.name)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m0 0v-6m0 0h4m-4 0h4" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
              
              {isEditing === 'documents' && (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <svg className="w-12 h-12 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-sm text-gray-600 mb-2">Drop files here or click to upload</p>
                  <button className="btn btn-outline btn-sm">Choose Files</button>
                </div>
              )}
            </div>
          </ProfileSection>
        </div>
      </div>
      <Footer />
    </div>
  );
}
