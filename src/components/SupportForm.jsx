import React, { useState } from "react";
import "./supportform.css";

export default function SupportApp() {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    orderRef: "",
    firstName: "",
    lastName: "",
    issueType: "",
    problem: "",
    contactMethod: "",
    attachment: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files ? files[0] : value }));
  };

 


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const response = await fetch(import.meta.env.VITE_GAS_WEB_APP_URL, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.ok) {
        alert("Support request submitted successfully!");
        e.target.reset();
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
        <div className="inner">
          <img
            src="/logo.webp"
            alt="PALMONAS"
            className="logo"
          />
          <nav className="nav">
            <a href="https://palmonas.com/">Home</a>
            <button className="ticket-btn">Submit a ticket</button>
          </nav>
        </div>
      </header>

      {/* Banner (full width) */}
      <section className="banner">
        <div className="inner">
          <h1>Submit a Ticket</h1>
        </div>
      </section>

      {/* Form section */}
      <section className="form-section">
        <div className="inner">
          <form onSubmit={handleSubmit} className="ticket-form">
            {/* row 1 */}
            <div className="field">
              <label>Email ID *</label>
              <input
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className="field">
              <label>Contact Number *</label>
              <input
                type="tel"
                name="phone"
                required
                onChange={handleChange}
              />
            </div>

            {/* row 2 */}
            <div className="field">
              <label>Order Reference</label>
              <input type="text" name="orderRef" onChange={handleChange} />
            </div>
            <div className="field">
              <label>First Name</label>
              <input type="text" name="firstName" onChange={handleChange} />
            </div>

            {/* row 3 */}
            <div className="field">
              <label>Last Name</label>
              <input type="text" name="lastName" onChange={handleChange} />
            </div>
            <div className="field">
              <label>Preferred Contact Method</label>
              <select name="contactMethod" onChange={handleChange}>
                <option value="">Choose…</option>
                <option>Email</option>
                <option>Phone</option>
              </select>
            </div>

            {/* full-width rows */}
            <div className="field full">
              <label>Issue Type *</label>
              <select name="issueType" required onChange={handleChange}>
                <option value="">Choose…</option>
                <option>Order Status</option>
                <option>Cancellation</option>
                <option>Return</option>
                <option>Exchange</option>
                <option>Refund Status</option>
                <option>Warranty Claim</option>
                <option>Missing Item</option>
                <option>Damaged Item</option>
                <option>Wrong Item</option>
                <option>Update address/contact</option>
                <option>Brand Alliance (Collaboration, PR, Jobs)</option>
              </select>
            </div>

            <div className="field full">
              <label>Description *</label>
              <textarea
                name="problem"
                rows="6"
                required
                onChange={handleChange}
              />
            </div>

            <div className="field full">
              <label>Upload File (optional)</label>
              <input type="file" name="attachment" onChange={handleChange} />
            </div>

            <div className="actions full">
              <button type="submit" className="submit-btn">
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
