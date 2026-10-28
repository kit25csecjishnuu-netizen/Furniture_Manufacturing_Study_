import React, { useState } from 'react';
import { Send, CheckCircle2, Shield, HeartHandshake } from 'lucide-react';

export const EarlyAccessForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('caregiver');
  const [notes, setNotes] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Please provide your name.');
      return;
    }

    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid email address.');
      return;
    }

    setIsSubmitted(true);
  };

  return (
    <section id="contact" className="py-12 md:py-16 bg-stone-50 border-b border-stone-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-700 tracking-wide uppercase mb-1">
            <span>Pilot Deployments &amp; Research</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Join the VoiceBridge Accessibility Pilot
          </h2>
          <p className="text-sm text-stone-600 mt-2 max-w-xl mx-auto">
            Are you a clinic, accessibility educator, caregiver, or Arm developer interested in testing offline speech packages? Connect with our team.
          </p>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
          {isSubmitted ? (
            <div className="py-8 text-center animate-in fade-in duration-300">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Thank You for Supporting VoiceBridge!</h3>
              <p className="text-sm text-stone-600 mt-2 max-w-md mx-auto">
                We have recorded your interest ({email}). Our team will reach out with downloadable test builds and offline Arm APK binaries.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsSubmitted(false);
                  setName('');
                  setEmail('');
                  setNotes('');
                }}
                className="mt-6 px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors"
              >
                Send Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-200">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="form-name" className="block text-xs font-semibold text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    id="form-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Sarah Jenkins"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label htmlFor="form-email" className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    id="form-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. sarah@healthclinic.org"
                    className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="form-role" className="block text-xs font-semibold text-stone-700 mb-1">
                  Your Primary Perspective / Role:
                </label>
                <select
                  id="form-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                >
                  <option value="caregiver">Caregiver / Family Member</option>
                  <option value="individual">Differently Abled Individual (Self-Advocate)</option>
                  <option value="clinician">Speech-Language Pathologist or Clinician</option>
                  <option value="educator">Special Education Teacher</option>
                  <option value="developer">Embedded / Arm Silicon Developer</option>
                  <option value="researcher">Academic Researcher</option>
                </select>
              </div>

              <div>
                <label htmlFor="form-notes" className="block text-xs font-semibold text-stone-700 mb-1">
                  How Would You Like to Use or Test VoiceBridge? (Optional)
                </label>
                <textarea
                  id="form-notes"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Share details on device preferences, regional languages needed, or testing environments..."
                  className="w-full px-3 py-2 text-xs bg-stone-50 border border-stone-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>We respect your privacy. No marketing spam.</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Pilot Access</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
