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
    contactMethod: ""
  });

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [orderIdError, setOrderIdError] = useState("");

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
        subReason: "" // reset subReason when issueType changes
      }));
    } else if (files) {
      setFormData({ ...formData, [name]: files[0] });
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

    let valid = true;

    // ✅ Phone validation
    if (formData.phone.length !== 10) {
      setPhoneError("Phone number must be exactly 10 digits.");
      valid = false;
    } else {
      setPhoneError("");
    }

    // ✅ Order ID validation
    const orderSuffix = formData.orderRef.replace("#PM1570", "");
    if (!formData.orderRef.startsWith("#PM1570") || orderSuffix.length !== 6) {
      setOrderIdError("Enter the last 6 digits of your order ID");
      valid = false;
    } else {
      setOrderIdError("");
    }

    if (!valid) return; // stop submission if errors

    setLoading(true);

    try {
      const payload = new FormData();
      for (const key in formData) {
        if (formData[key] !== null && formData[key] !== "") {
          payload.append(key, formData[key]);
        }
      }

      const response = await fetch(import.meta.env.VITE_GAS_WEB_APP_URL, {
        method: "POST",
        body: payload,
        headers: { Accept: "application/json" },
      });

      let result;
      try {
        result = await response.json();
      } catch {
        result = { message: await response.text() };
      }

      if (result.ok || result.message) {
        alert("Support request submitted successfully!");
        e.target.reset();
        setFormData({
          orderRef: "#PM1570",
          firstName: "",
          email: "",
          phone: "",
          issueType: "",
          subReason: "",
          problem: "",
          contactMethod: ""
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
      </header>

      <div className="main-content">
        {/* Banner */}
        <section className="banner">
          <h1>Submit a Ticket</h1>
        </section>

        {/* Form */}
        <main className="form-container">
          <form onSubmit={handleSubmit} className="ticket-form">
            <label>Registered Email ID *</label>
            <input type="email" name="email" required onChange={handleChange} />

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
            <input type="text" name="firstName" onChange={handleChange} />

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
              onChange={handleChange}
            ></textarea>

            <label>
              Order ID{" "}
              {formData.issueType !== "Brand Alliance (Collaboration, PR, Jobs)" && "*"}
            </label>
            <div className="order-id-field">
              <span className="prefix">#PM1570</span>
              <input
                type="text"
                name="orderRef"
                placeholder="Enter last 6 digits"
                maxLength="6"
                required={formData.issueType !== "Brand Alliance (Collaboration, PR, Jobs)"}
                value={formData.orderRef.replace("#PM1570", "")}
                onChange={handleOrderIdChange}
              />
            </div>
            {orderIdError && <p className="error-text">{orderIdError}</p>}

            <label>Preferred Contact Method</label>
            <select name="contactMethod" onChange={handleChange}>
              <option value="">Choose...</option>
              <option>Email</option>
              <option>Phone</option>
            </select>

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
