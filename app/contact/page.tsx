'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const inputClass = "w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-colors";
  const labelClass = "block text-xs font-medium text-gray-500 mb-1.5";

  return (
    <div>
      {/* Header */}
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Contact Us</h1>
        <p className="text-sm text-gray-500 mt-0.5">Have questions? We'd love to hear from you!</p>
      </div>

      {/* Contact Info Row */}
      <div className="bg-white border-y border-gray-200 px-6 py-5">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Get In Touch</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 rounded-md border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-emerald-600 bg-emerald-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <a href="mailto:contact@consolidationtool.com" className="text-sm font-medium text-gray-900 hover:text-emerald-600 transition-colors">contact@consolidationtool.com</a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-md border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-blue-600 bg-blue-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Phone</p>
              <a href="tel:+1234567890" className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors">+1 (234) 567-890</a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-md border border-gray-100 hover:border-gray-200 transition-colors">
            <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-purple-600 bg-purple-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-medium text-gray-900">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div className="bg-white border-b border-gray-200 px-6 py-5">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Send us a Message</h2>

        {submitted && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-md p-3 flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-emerald-700">Thank you! Your message has been sent successfully.</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-gray-50 border border-gray-200 rounded-md p-4 space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className={labelClass}>Name <span className="text-red-500">*</span></label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="John Doe" className={inputClass} />
              </div>
              <div>
                <label htmlFor="email" className={labelClass}>Email <span className="text-red-500">*</span></label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" className={inputClass} />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className={labelClass}>Subject <span className="text-red-500">*</span></label>
              <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required className={inputClass}>
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="support">Technical Support</option>
                <option value="feedback">Feedback</option>
                <option value="feature">Feature Request</option>
              </select>
            </div>
            <div>
              <label htmlFor="message" className={labelClass}>Message <span className="text-red-500">*</span></label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} placeholder="Tell us how we can help you..." className={inputClass + " resize-none"} />
            </div>
            <div className="flex justify-end pt-2">
              <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
                Send Message
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
