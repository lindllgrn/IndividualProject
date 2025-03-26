// src/pages/ContactPage.tsx
import React, { useState } from "react";

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    setIsFormSubmitted(true); // Show success message after submission
  };

  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      
      {isFormSubmitted ? (
        <div className="success-message">
          <h2>Thank you for contacting us!</h2>
          <p>We will get back to you as soon as possible.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="contact-form">
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Subject:
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Send Message</button>
        </form>
      )}
    </div>
  );
};

export default ContactPage;
