import React, { useState } from "react";
import "./supportform.css";

function SupportApp() {
  const [formData, setFormData] = useState({
    orderRef: "#PM1570", // ✅ prefix prefilled
    firstName: "",
    email: "",
    phone: "",
    issueType: "",
    subReason: "",
    problem: "",
    contactMethod: "",
    media: null, // ✅ file attachment
  });

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [orderIdError, setOrderIdError] = useState("");
  const [formError, setFormError] = useState("");

  // Sub-reason mapping
  const subReasons = {
    Return: [
      "Damaged Item",
      "Wrong Item",
      "Missing Item",
      "Size Issue",
      "Did not meet expectations",
    ],
    Exchange: [
      "Damaged Item",
      "Wrong Item",
      "Missing Item",
      "Size Issue",
      "Did not meet expectations",
    ],
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "phone") {
      const digitsOnly = value.replace(/\D/g, "");
      setFormData({ ...formData, phone: digitsOnly });
      return;
    }

    if (name === "issueType") {
      setFormData((prev) => ({
        ...prev,
        issueType: value,
        subReason: "", // reset subReason when issueType changes
      }));
    } else if (files) {
      setFormData({ ...formData, [name]: files[0] }); // ✅ handle file input
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleOrderIdChange = (e) => {
    const digitsOnly = e.target.value.replace(/\D/g, ""); // only numbers
    const fullOrderId = "#PM1570" + digitsOnly;
    setFormData({ ...formData, orderRef: fullOrderId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    // final validation before submit
    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    }
    if (
      !formData.orderRef.startsWith("#PM1570") ||
      formData.orderRef.length !== 13
    ) {
      setOrderIdError("Order ID must start with #PM1570 and end with 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const payload = new FormData();
      payload.append("email", formData.email);
      payload.append("contact_number", formData.phone);
      payload.append("full_name", formData.firstName);
      payload.append("issue_type", formData.issueType);
      payload.append("sub_reason", formData.subReason);
      payload.append("description", formData.problem);
      payload.append("order_id", formData.orderRef);
      payload.append("preferred_contact_method", formData.contactMethod);
      if (formData.media) {
        payload.append("media", formData.media);
      }

      const response = await fetch(
        "https://utils.palmonas.com/api/submit-support-request",
        {
          method: "POST",
          body: payload,
        }
      );

      let result;
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        result = { message: await response.text() };
      }

      console.log("Response:", result);

      if (response.ok) {
        alert("✅ Support request submitted successfully!");
        e.target.reset();
        setFormData({
          orderRef: "#PM1570",
          firstName: "",
          email: "",
          phone: "",
          issueType: "",
          subReason: "",
          problem: "",
          contactMethod: "",
          media: null,
        });
      } else {
        setFormError("❌ Error: " + (result.message || JSON.stringify(result)));
      }
    } 
    
    // catch (error) {
    //   setFormError("❌ Error submitting form: " + error.message);
    // } 
    
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <header className="header">
        <img src="/logo.webp" alt="Palmonas Logo" className="logo" />
      </header>

      <div className="main-content">
        {/* Banner */}
        <section className="banner">
          <h1>Submit a Ticket</h1>
        </section>

        {/* Form */}
        <main className="form-container">
          <form onSubmit={handleSubmit} className="ticket-form">
            {formError && <p className="error-text">{formError}</p>}

            <label>Registered Email ID *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <label>Registered Contact Number *</label>
            <input
              type="tel"
              name="phone"
              required
              maxLength="10"
              placeholder="Enter 10-digit number"
              value={formData.phone}
              onChange={handleChange}
            />
            {phoneError && <p className="error-text">{phoneError}</p>}

            <label>Full Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />

            <label>Issue Type *</label>
            <select
              name="issueType"
              required
              value={formData.issueType}
              onChange={handleChange}
            >
              <option value="">Choose...</option>
              <option>Order Status</option>
              <option>Cancellation</option>
              <option>Return</option>
              <option>Exchange</option>
              <option>Refund Status</option>
              <option>Warranty Claim</option>
              <option>Update Address/Contact</option>
              <option>Brand Alliance (Collaboration, PR, Jobs)</option>
            </select>

            {/* Dynamic Sub Reason */}
            {subReasons[formData.issueType] && (
              <>
                <label>Sub Reason *</label>
                <select
                  name="subReason"
                  required
                  value={formData.subReason}
                  onChange={handleChange}
                >
                  <option value="">Choose...</option>
                  {subReasons[formData.issueType].map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </>
            )}

            <label>Description *</label>
            <textarea
              name="problem"
              rows="5"
              required
              value={formData.problem}
              onChange={handleChange}
            ></textarea>

            <label>
              Order ID{" "}
              {formData.issueType !==
                "Brand Alliance (Collaboration, PR, Jobs)" && "*"}
            </label>
            <div className="order-id-field">
              <span className="prefix">#PM1570</span>
              <input
                type="text"
                name="orderRef"
                placeholder="Enter last 6 digits"
                maxLength="6"
                required={
                  formData.issueType !==
                  "Brand Alliance (Collaboration, PR, Jobs)"
                }
                value={formData.orderRef.replace("#PM1570", "")}
                onChange={handleOrderIdChange}
              />
            </div>
            {orderIdError && <p className="error-text">{orderIdError}</p>}

            <label>Preferred Contact Method</label>
            <select
              name="contactMethod"
              value={formData.contactMethod}
              onChange={handleChange}
            >
              <option value="">Choose...</option>
              <option>Email</option>
              <option>Phone</option>
            </select>

            <label>Attach File (optional)</label>
            <input type="file" name="media" onChange={handleChange} />

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? "Submitting..." : "Submit Ticket"}
            </button>
          </form>
        </main>
      </div>

      {/* Loader Modal */}
      {loading && (
        <div className="loader-modal">
          <div className="loader"></div>
          <p className="loader-text">Submitting your request. </p>
          <p className="loader-text">Please don't press back button.</p>
        </div>
      )}
    </div>
  );
}

export default SupportApp;
