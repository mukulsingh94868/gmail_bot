"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { ChevronLeft, ChevronDown, HelpCircle } from "lucide-react";
import CandidateHeader from "../CandidateHeader/CandidateHeader";

const faqData = [
  {
    question: "How do I apply for a position using RecruitLoop?",
    answer: [
      "Select your desired job position from the dropdown menu.",
      "Enter the HR's email address in the provided field.",
      "Click \"Send Email\" to open Gmail with a pre-filled application template.",
      "You can also download your resume if required.",
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

const FaqItem = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-slate-200 bg-white transition hover:border-slate-300">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-medium text-slate-900">{question}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${open ? "max-h-60" : "max-h-0"}`}
      >
        <div className="border-t border-slate-100 px-4 pb-4 pt-3">
          <ul className="space-y-1.5">
            {answer.map((line, i) => (
              <li key={i} className="text-sm text-slate-600">
                {answer.length > 1 ? `\u2022 ${line}` : line}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const FaqComponent = () => {
  const router = useRouter();
  const [headerShowModal, setHeaderShowModal] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <CandidateHeader showModal={headerShowModal} setShowModal={setHeaderShowModal} />

      <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <button
            className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-slate-800"
            onClick={() => router.back()}
          >
            <ChevronLeft size={16} />
            Back
          </button>

          <div className="mb-6 flex items-center gap-2">
            <HelpCircle size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold tracking-tight text-slate-900">FAQ / Help</h2>
          </div>

          <div className="space-y-3">
            {faqData.map((faq) => (
              <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FaqComponent;
