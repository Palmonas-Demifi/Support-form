import React, { useState } from "react";
import "./supportform.css";

function SupportApp() {
  const [formData, setFormData] = useState({
    orderRef: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    issueType: "",
    problem: "",
    contactMethod: "",
    attachment: null,
  });
const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = new FormData();
    for (const key in formData) {
      if (formData[key] !== null) {
        payload.append(key, formData[key]);
      }
    }

    const response = await fetch(import.meta.env.VITE_GAS_WEB_APP_URL, {
      method: "POST",
      body: payload,
    });

    const result = await response.json();

    if (result.ok || result.message) {  // Apps Script might return {message: "..."}
      alert("Support request submitted successfully!");
      e.target.reset();
      setFormData({
        orderRef: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        issueType: "",
        problem: "",
        contactMethod: "",
        attachment: null,
      });
    } else {
      alert("Something went wrong. Please try again.");
    }
  } catch (error) {
    alert("Error submitting form: " + error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <img src="/logo.webp" alt="Palmonas Logo" className="logo" />
        <nav className="nav">
          <a href="/">Home</a>
          
          <button className="ticket-btn">Submit a ticket</button>
        </nav>
      </header>

      {/* Banner */}
      <section className="banner">
        <h1>Submit a Ticket</h1>
      </section>

      {/* Form */}
      <main className="form-container">
        <form onSubmit={handleSubmit} className="ticket-form">
          <label>Email ID *</label>
          <input type="email" name="email" required onChange={handleChange} />

          <label>Contact Number *</label>
          <input type="tel" name="phone" required onChange={handleChange} />

          <label>Order Reference</label>
          <input type="text" name="orderRef" onChange={handleChange} />

          <label>First Name</label>
          <input type="text" name="firstName" onChange={handleChange} />

          <label>Last Name</label>
          <input type="text" name="lastName" onChange={handleChange} />

          <label>Issue Type *</label>
          <select name="issueType" required onChange={handleChange}>
            <option value="">Choose...</option>
            <option>Order Status</option>
            <option>Cancellation</option>
            <option>Return</option>
            <option>Exchange</option>
            <option>Refund Status</option>
            <option>Warranty Claim</option>
            <option>Missing Item</option>
            <option>Damaged Item</option>
            <option>Wrong Item</option>
            <option>Update Address/Contact</option>
            <option>Brand Alliance (Collaboration, PR, Jobs)</option>
          </select>

          <label>Description *</label>
          <textarea
            name="problem"
            rows="5"
            required
            onChange={handleChange}
          ></textarea>

          <label>Preferred Contact Method</label>
          <select name="contactMethod" onChange={handleChange}>
            <option value="">Choose...</option>
            <option>Email</option>
            <option>Phone</option>
          </select>

          <label>Upload File (optional)</label>
          <input type="file" name="attachment" onChange={handleChange} />

          <button type="submit" className="submit-btn" disabled={loading}>
  {loading ? "Submitting..." : "Submit Ticket"}
</button>

        </form>
      </main>
    </div>
  );
}

export default SupportApp;
