"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import PageHeader from "../ui/PageHeader";

const faqData = [
  {
    question: "How do I apply for a position using RecruitLoop?",
    intro: "RecruitLoop streamlines applications into a focused workflow:",
    answer: [
      { title: "Select a template:", text: "Choose your desired job position from the template dropdown." },
      { title: "Enter recruiter details:", text: "Type the HR's email address in the provided field." },
      { title: "Send in Gmail:", text: "Click \"Open & Send in Gmail\" to open Gmail with a pre-filled application template." },
      { title: "Resume:", text: "You can also download your resume if required." },
    ],
  },
  {
    question: "What does Recent Activity show?",
    answer: ["Displays your most recent applications sent through RecruitLoop, including follow-up status."],
  },
  {
    question: "How is my data handled?",
    answer: ["Your application history is securely stored and never shared with third parties."],
  },
  {
    question: "Where can I get further assistance?",
    answer: ["For support, please contact the RecruitLoop development team."],
  },
];

const FaqItem = ({ id, question, intro, answer, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const isSteps = typeof answer[0] === "object";

  return (
    <div
      className={`rl-card overflow-hidden transition ${open ? "border-brand-200" : "hover:border-brand-200"}`}
    >
      <button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls={`${id}-panel`}
        className="flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-display text-sm font-semibold text-slate-900 sm:text-[15px]">{question}</span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition ${open ? "bg-brand-700 text-white" : "bg-brand-50 text-brand-700"
            }`}
        >
          <ChevronDown size={15} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
        </span>
      </button>
      <div
        id={`${id}-panel`}
        className={`grid transition-all duration-200 ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-brand-100 px-5 pb-5 pt-4 text-sm text-slate-600">
            {intro && <p className="mb-3">{intro}</p>}
            {isSteps ? (
              <ol className="space-y-2">
                {answer.map((step, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-800">
                      {i + 1}
                    </span>
                    <span>
                      <strong className="font-semibold text-slate-900">{step.title}</strong> {step.text}
                    </span>
                  </li>
                ))}
              </ol>
            ) : (
              answer.map((line, i) => <p key={i}>{line}</p>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FaqComponent = () => {
  return (
    <div className="mx-auto">
      <PageHeader
        title="FAQ"
        description="Find clear answers to common questions about using RecruitLoop for outreach and job tracking."
      />
      <div className="space-y-3">
        {faqData.map((faq, i) => (
          <FaqItem key={faq.question} id={`faq-${i}`} defaultOpen={i === 0} {...faq} />
        ))}
      </div>
    </div>
  );
};

export default FaqComponent;
