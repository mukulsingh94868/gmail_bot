import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-white border-t border-slate-200 py-4 mt-auto text-center shadow-sm">
      <span className="text-slate-600 text-sm">
        Developed by Mukul Singh &mdash;{" "}
        <a
          href="mailto:your@email.com"
          className="text-blue-600 hover:underline"
        >
          mukulsingh94868@email.com
        </a>
      </span>
    </footer>
  );
};

export default Footer;
