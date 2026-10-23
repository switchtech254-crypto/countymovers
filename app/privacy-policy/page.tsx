import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { EMAIL, PHONE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy | County Movers",
  description: "How County Movers collects, uses and protects your personal data.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="This policy explains what personal data County Movers collects when you use our website or request a quote, why we collect it, and the rights you have over it."
    >
      <h2>1. Who we are</h2>
      <p>County Movers is a home and office moving company based in Donholm, Nairobi, Kenya. We are the data controller for the personal data described in this policy. You can reach us at <a href={`mailto:${EMAIL}`}>{EMAIL}</a> or on {PHONE}.</p>

      <h2>2. What we collect</h2>
      <ul>
        <li><strong>Details you give us:</strong> your name, phone number, email address, the service you want, where you are moving from and to, your preferred date, and any notes, inventory or other details you add to a quote request.</li>
        <li><strong>Messages:</strong> anything you send us by WhatsApp, phone or email.</li>
        <li><strong>Technical data (only if you allow analytics):</strong> pages visited, device and browser type, and approximate location derived from your IP address.</li>
      </ul>

      <h2>3. How we use it</h2>
      <ul>
        <li>To respond to your enquiry and prepare a quote.</li>
        <li>To plan and carry out your move, and to contact you about it.</li>
        <li>To keep records we are required to keep, for example for accounting.</li>
        <li>To understand and improve how our website is used, if you agree to analytics.</li>
      </ul>

      <h2>4. Our lawful basis</h2>
      <p>Under the Data Protection Act, 2019 of Kenya, we rely on: your consent (for example, analytics cookies and contacting you after an enquiry); steps taken at your request before and during a contract (quotes and moves); legal obligations; and our legitimate interests in running and improving our business, where these do not override your rights.</p>

      <h2>5. WhatsApp and other third parties</h2>
      <p>Our website quote form does not send your details to our server. When you submit it, it opens WhatsApp with your message pre-filled, and nothing is sent until you press send in WhatsApp. Once you do, WhatsApp&rsquo;s own terms and privacy policy apply to that message. Links to other sites are covered by those sites&rsquo; policies, not this one.</p>
      <p>[confirm: if your detailed quotation page stores or emails submissions, name the service you use for that here.]</p>

      <h2>6. Who we share it with</h2>
      <p>We do not sell your personal data. We share it only with people who need it to serve you, such as our moving crews and drivers, and with service providers that help us run the website or communicate with you (for example hosting, email and messaging). We may also disclose it where the law requires.</p>

      <h2>7. International transfers</h2>
      <p>Some providers, such as WhatsApp and website hosts, may process data outside Kenya. Where that happens, we take steps to make sure your data is protected as the Data Protection Act requires.</p>

      <h2>8. How long we keep it</h2>
      <p>We keep personal data only as long as needed to answer your enquiry, carry out your move, and meet legal and accounting requirements. After that we delete it or anonymise it.</p>

      <h2>9. Security</h2>
      <p>We use reasonable technical and organisational measures to protect your data. No online service is completely secure, so please avoid sending sensitive information, such as ID numbers or payment details, through open messages unless we ask for it.</p>

      <h2>10. Your rights</h2>
      <p>You have the right to be informed about how your data is used, to access it, to ask us to correct or delete it, to object to or restrict certain uses, and to withdraw consent at any time. To use any of these rights, email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. If you are unhappy with how we handle your data, you may complain to the Office of the Data Protection Commissioner of Kenya at <a href="https://www.odpc.go.ke" target="_blank" rel="noopener noreferrer">odpc.go.ke</a>.</p>

      <h2>11. Children</h2>
      <p>Our services are for adults. We do not knowingly collect personal data from children through this website.</p>

      <h2>12. Changes to this policy</h2>
      <p>We may update this policy from time to time. The date at the top shows when it was last changed.</p>
    </LegalPage>
  );
}