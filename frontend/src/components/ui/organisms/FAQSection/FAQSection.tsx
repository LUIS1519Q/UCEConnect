import { SearchBar } from "../../molecules/SearchBar";
import { FAQItem } from "../../molecules/FAQItem";

import type { FAQSectionProps } from "./FAQSection.types";

export default function FAQSection({
  faqs,
}: FAQSectionProps) {
  return (
    <div className="space-y-6">
      <SearchBar placeholder="Search help topics..." />

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem
            key={`${faq.question}-${index}`}
            {...faq}
          />
        ))}
      </div>
    </div>
  );
}