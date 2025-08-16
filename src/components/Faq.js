import React from "react";

const Faq = () => {
  return (
    <div className="faq-section">
      <details className="faq-details">
        <summary className="faq-summary">❓ FAQ / Help</summary>
        <div className="faq-content">
          <b>How do I apply for a position using RecruitLoop?</b>
          <ul className="faq-list">
            <li>Select your desired job position from the dropdown menu.</li>
            <li>Enter the HR's email address in the provided field.</li>
            <li>
              Click "Send Email" to open Gmail with a pre-filled application
              template.
            </li>
            <li>You can also download your resume if required.</li>
          </ul>
          <b>What does Recent Activity show?</b>
          <div className="faq-answer">
            Displays your most recent applications sent through RecruitLoop.
          </div>
          <b>How is my data handled?</b>
          <div className="faq-answer">
            Your application history is securely stored and never shared with
            third parties.
          </div>
          <b>Where can I get further assistance?</b>
          <div className="faq-answer">
            For support, please contact the RecruitLoop development team.
          </div>
        </div>
      </details>
    </div>
  );
};

export default Faq;
