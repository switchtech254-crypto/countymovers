import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { EMAIL, PHONE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service | County Movers",
  description: "The terms that apply when you use the County Movers website and moving services.",
};

export default function TermsOfService() {
  return (
    <LegalPage
      title="Terms of Service"
      intro="These terms apply to your use of the County Movers website and to the moving services we offer. Please read them before requesting a quote."
    >
      <h2>1. About these terms</h2>
      <p>County Movers (&ldquo;we&rdquo;, &ldquo;us&rdquo;) is based in Donholm, Nairobi, Kenya. By using this website you agree to these terms. If a written quote or agreement for your move says something different, that document applies to your move.</p>

      <h2>2. Our services</h2>
      <p>We offer residential and office relocation, loading and transportation, installation, storage, furniture handling, and packing and unpacking. Descriptions on this website are general. The exact services, scope and price for your move are the ones confirmed with you.</p>

      <h2>3. Quotes and bookings</h2>
      <ul>
        <li>A quote request on this website is an enquiry. It is not a booking.</li>
        <li>Quotes are based on the information you give us. If the real move differs (more items, different access, a different address or date), the price may change.</li>
        <li>A move is confirmed only when we confirm the date, scope and price with you.</li>
      </ul>

      <h2>4. Your responsibilities</h2>
      <ul>
        <li>Give us accurate information about your belongings, addresses, access and timing.</li>
        <li>Tell us about fragile, high-value or unusually heavy items before the move.</li>
        <li>Do not ask us to move illegal, dangerous, flammable or perishable goods.</li>
        <li>Make sure we can reach both addresses on the agreed day.</li>
      </ul>

      <h2>5. Payment and cancellation</h2>
      <p>Prices, payment terms, and any change or cancellation terms are set out in your confirmed quote. [confirm: add your deposit and cancellation rules here, or reference them in the quote.]</p>

      <h2>6. Loss or damage</h2>
      <p>We take care of your belongings. If something is lost or damaged during your move, tell us as soon as you notice, and within the period stated in your agreement, so we can look into it. Our responsibility for loss or damage is as set out in your confirmed agreement and the law. Nothing in these terms limits any right you have under Kenyan law that cannot be limited.</p>

      <h2>7. Using this website</h2>
      <p>Use the site lawfully and do not try to disrupt it or access it in unauthorised ways. We work to keep the information accurate, but it is provided as general information and may change without notice.</p>

      <h2>8. Intellectual property</h2>
      <p>The content of this website, including text, logo and design, belongs to County Movers or its licensors. You may not copy or reuse it for commercial purposes without our written permission.</p>

      <h2>9. Links to other sites</h2>
      <p>Links such as WhatsApp lead to services we do not control. We are not responsible for their content or practices.</p>

      <h2>10. Changes</h2>
      <p>We may update these terms. The date at the top shows the latest version. Continued use of the website means you accept the updated terms.</p>

      <h2>11. Governing law</h2>
      <p>These terms are governed by the laws of Kenya, and the courts of Kenya have jurisdiction over any dispute, unless the law says otherwise.</p>

      <h2>12. Contact</h2>
      <p>Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or call {PHONE}. See also our <a href="/privacy-policy">Privacy Policy</a> and <a href="/cookie-policy">Cookie Policy</a>.</p>
    </LegalPage>
  );
}