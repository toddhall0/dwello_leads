import { useState } from 'react';

function LeadCapture({ onSubmit, onSkip }) {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Please enter your first name';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone is optional but validate if provided
    if (formData.phone && !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate brief processing
    setTimeout(() => {
      onSubmit(formData);
    }, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="w-full max-w-md mx-auto px-4">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sage to-sage-dark rounded-full shadow-lg mb-4">
          <span className="text-3xl">🎉</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-navy mb-3">
          Your perfect neighborhood match is ready!
        </h2>
        <p className="text-navy/60">
          Where should we send your personalized results + a free Phoenix neighborhood guide?
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* First Name */}
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-navy mb-1"
          >
            First Name *
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Your first name"
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-navy placeholder-navy/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors ${
              errors.firstName ? 'border-red-400' : 'border-sand-dark focus:border-terracotta'
            }`}
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-navy mb-1"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-navy placeholder-navy/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors ${
              errors.email ? 'border-red-400' : 'border-sand-dark focus:border-terracotta'
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* Phone (Optional) */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-navy mb-1"
          >
            Phone <span className="text-navy/40">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(555) 123-4567"
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white text-navy placeholder-navy/40 focus:outline-none focus:ring-2 focus:ring-terracotta/20 transition-colors ${
              errors.phone ? 'border-red-400' : 'border-sand-dark focus:border-terracotta'
            }`}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Benefits */}
        <div className="bg-sand-light rounded-lg p-4 mt-6">
          <p className="text-sm text-navy/70 flex items-start gap-2">
            <span className="text-sage flex-shrink-0">✓</span>
            <span>Plus, get insider Phoenix real estate tips and neighborhood updates</span>
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-4 text-lg font-semibold text-white rounded-full shadow-lg transition-all duration-200 ${
            isSubmitting
              ? 'bg-navy/50 cursor-not-allowed'
              : 'bg-gradient-to-r from-terracotta to-terracotta-dark hover:shadow-xl hover:-translate-y-0.5'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Revealing your match...
            </span>
          ) : (
            'Reveal My Match!'
          )}
        </button>
      </form>

      {/* Privacy note */}
      <p className="text-center mt-4 text-xs text-navy/40">
        We respect your privacy. Unsubscribe anytime.
      </p>
    </div>
  );
}

export default LeadCapture;
