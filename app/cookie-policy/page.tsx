import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { CookieSettingsButton } from "@/components/cookie-settings-button";
import { EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Policy | County Movers",
  description: "How County Movers uses cookies and similar storage on its website.",
};

export default function CookiePolicy() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="This page explains what cookies and similar browser storage we use, why, and how you can control them."
    >
      <h2>1. What are cookies?</h2>
      <p>Cookies are small files that a website saves in your browser. Similar technologies, such as local storage, do the same job. We use the word &ldquo;cookies&rdquo; for all of them on this page.</p>

      <h2>2. What we use</h2>
      <div className="legal-table-wrap">
        <table>
          <thead>
            <tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><code>cm-cookie-consent</code></td>
              <td>Essential (local storage)</td>
              <td>Remembers the choice you made in the cookie popup.</td>
              <td>12 months, or until you clear your browser data</td>
            </tr>
            <tr>
              <td>Analytics</td>
              <td>Optional</td>
              <td>Counts visits and shows which pages are used. Only loaded if you accept.</td>
              <td>Set by the analytics provider</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>[confirm: this table lists only what the site uses today. If you add an analytics tool, a map, a video embed or a chat widget, list its cookies here and load it only after consent.]</p>

      <h2>3. Essential and optional storage</h2>
      <p>Essential storage is needed for the site to work and does not need your consent. Optional storage, such as analytics, is only used if you accept it. You can say no and still use the whole site.</p>

      <h2>4. Managing your choices</h2>
      <p>You can change your mind at any time:</p>
      <p><CookieSettingsButton /></p>
      <p>You can also block or delete cookies in your browser settings. Doing so may reset your cookie choice or stop parts of the site working as expected.</p>

      <h2>5. Third-party links</h2>
      <p>When you tap a WhatsApp, phone or email link, you leave our site and that service&rsquo;s own policies apply.</p>

      <h2>6. Questions</h2>
      <p>Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. For how we handle personal data in general, see our <a href="/privacy-policy">Privacy Policy</a>.</p>
    </LegalPage>
  );
}