import React from "react";

const Faq = () => {
  return (
    <div className="faq-section">
      <details className="faq-details">
        <summary className="faq-summary">❓ FAQ / Help</summary>
        <div className="faq-content">
          <b>How do I use the HR Email Bot?</b>
          <ul className="faq-list">
            <li>Select the job position from the dropdown.</li>
            <li>Paste the HR's email address.</li>
            <li>Click "Send Email" to open Gmail with a pre-filled message.</li>
            <li>Download your resume if needed.</li>
          </ul>
          <b>What is Recent Activity?</b>
          <div className="faq-answer">
            Shows the last 5 emails you sent using this bot.
          </div>
          <b>Is my data safe?</b>
          <div className="faq-answer">
            Your email history is stored only in your browser and never sent to
            any server.
          </div>
          <b>Need more help?</b>
          <div className="faq-answer">
            Contact your developer or HR for further assistance.
          </div>
        </div>
      </details>
    </div>
  );
};

export default Faq;
