
import React from 'react';

const QA: React.FC = () => {
  const faqs = [
    {
      q: "What camera gear do you use primarily?",
      a: "I switch between a Sony Alpha A1 for commercial precision and a Leica Q3 for street photography. My go-to lens for everything else is the 35mm f/1.4 GM."
    },
    {
      q: "Do you offer international shipping for prints?",
      a: "Yes! We ship museum-quality prints worldwide. Delivery usually takes 7-14 business days depending on your location and framing choice."
    },
    {
      q: "Can I hire you for commercial or editorial work?",
      a: "Absolutely. I am available for international assignments. Please use the contact form to provide details about your project scope."
    },
    {
      q: "Do you provide high-resolution digital licenses?",
      a: "Digital licenses for commercial use are handled on a case-by-case basis. Please reach out with the intended usage details for a custom quote."
    },
    {
      q: "What printing process do you use?",
      a: "All prints are Giclée prints on 310gsm Hahnemühle Photo Rag archival paper, ensuring a lifespan of 100+ years."
    }
  ];

  return (
    <div className="py-24 px-6 max-w-4xl mx-auto">
      <h2 className="text-5xl font-black mb-16 text-center text-slate-900 uppercase tracking-tighter">Frequently Asked</h2>
      <div className="space-y-12">
        {faqs.map((faq, i) => (
          <div key={i} className="group border-b border-slate-200 pb-12">
            <h3 className="text-2xl font-black mb-6 flex items-center gap-6 group-hover:text-cyan-600 transition-colors text-slate-900 uppercase tracking-tight">
              <span className="text-slate-200 text-3xl font-black tracking-tighter">0{i+1}</span>
              {faq.q}
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed pl-16 font-medium">
              {faq.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QA;
