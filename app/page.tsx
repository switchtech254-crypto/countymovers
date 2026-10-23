import type { Metadata } from "next";
import Link from "next/link";
import {
  Truck,
  Package,
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  Users,
  ArrowUpRight,
  ArrowRight,
  Check,
  MessageCircle,
  HeartHandshake,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand } from "@/components/brand";
import { QuoteLink } from "@/components/quote-link";
import { SectionDivider } from "@/components/section-divider";
import { CustomerReviews } from "@/components/customer-reviews";
import { ServiceAreas } from "@/components/service-areas";
import { SiteHeader } from "@/components/home/site-header";
import { ServiceProvider, EnquireLink } from "@/components/home/service-context";
import { FaqList } from "@/components/home/faq-list";
import { Gallery } from "@/components/home/gallery";
import { ContactForm } from "@/components/home/contact-form";
import { CurrentYear } from "@/components/home/current-year";
import { services } from "@/lib/services";
import { EMAIL, IMG, PHONE, PHONE_LINK, WHATSAPP, faqs } from "@/lib/site";
import { WhatsAppIcon } from "@/components/whatsapp-icon";
import { HeroSlides } from "@/components/home/hero-slides";
import { CareSeal } from "@/components/care-seal";
import { ParallaxBg } from "@/components/home/parallax-bg";
import { ScrollReveal } from "@/components/home/scroll-reveal";
import { LegalLinks } from "@/components/legal/legal-links";
import Image from "next/image";

export const metadata: Metadata = {
  title: "County Movers | Home & Office Moving in Nairobi",
  description:
    "Make your next move a smooth one with County Movers in Donholm, Nairobi. Home and office relocation, packing, transport, storage and installation. Request a free quote.",
  openGraph: {
    type: "website",
    title: "County Movers | A smoother move starts here",
    description:
      "Careful packing, reliable transport and a fresh start. Discover County Movers' home and office moving services in Nairobi.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

// Structured data so search engines can show the FAQ answers directly.
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

// Server component: everything below renders to HTML on the server.
// Only the small interactive pieces (header, FAQ, gallery, contact form) are client components.
export default function Page() {
  return (
    <div id="home">
      <ScrollReveal />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c") }}
      />
      <div className="topbar">
        <div className="page-width topbar-inner">
          <span>
            <MapPin size={16} />
            Donholm, Nairobi, Kenya
          </span>
          <div>
            <a href={`mailto:${EMAIL}`}>
              <Mail size={16} />
              {EMAIL}
            </a>
            <a href={PHONE_LINK}>
              <Phone size={15} />
              {PHONE}
            </a>
          </div>
        </div>
      </div>
      <SiteHeader />
      <section className="hero-section">
        <HeroSlides transition="fade" />
        <div className="hero-shade" />
        <div className="page-width hero-content">
  <h1>
    Moving in Nairobi?
    <span>We’ll carry the weight.</span>
  </h1>
  <p className="hero-copy">
    From the first box to the last, County Movers packs, lifts and settles you in, so your
    things arrive the way you left them. Tell us about your move and we’ll send you a free quote.
  </p>
  <div className="hero-actions">
    <QuoteLink>Get My Free Quote</QuoteLink>
    <a className="phone-action" href={PHONE_LINK}>
      <span>
        <Phone size={21} />
      </span>
      {PHONE}
    </a>
  </div>
</div>
<div className="page-width hero-trust">
  <ul>
    {[
      { icon: ShieldCheck, title: "Careful handling", text: "Your belongings matter" },
      { icon: Truck, title: "Home & office moves", text: "Planned around you" },
      { icon: MapPin, title: "Based in Donholm", text: "Nairobi and beyond" },
    ].map((item) => (
      <li key={item.title}>
        <item.icon size={22} />
        <div>
          <strong>{item.title}</strong>
          <small>{item.text}</small>
        </div>
      </li>
    ))}
  </ul>
</div>

      </section>

      <SectionDivider from="deep" to="paper" />
      <ServiceProvider>
        <main>
          <section id="about" className="section-space">
            <div className="page-width about-layout">
              <div className="about-copy">
                <p className="eyebrow">About Us</p>
                <h2>
                  Meet <em>County</em>
                  <br />
                  Movers
                </h2>
                <p className="about-lead">
                  A new home. A new office. A new beginning. At County Movers, we know a move is more
                  than getting your things from A to B.
                </p>
                <p className="about-body">
                  Based in Donholm, Nairobi, we bring a careful, personal approach to packing,
                  transportation and getting you settled. So you can focus on what comes next.
                </p>
                <QuoteLink>Get A Quote</QuoteLink>
              </div>

              <div className="about-collage">
                <div className="about-photo-main">
                 
                  <Image
                    src={IMG.about}
                    alt="A friendly mover carrying packed boxes"
                    width={832}
                    height={1216}
                    loading="lazy"
                  />
                </div>
               
                <Image
                  className="about-photo-sub"
                  src={IMG.team}
                  alt="Movers loading carefully protected furniture"
                  width={1216}
                  height={832}
                  loading="lazy"
                />
                <CareSeal className="about-seal" />
              </div>
            </div>
          </section>

          <SectionDivider from="paper" to="dark" variant="curl" />
          <section id="services" className="services-section">
            <ParallaxBg src={IMG.packing} />
            <div className="page-width services-layout">
              <ol className="service-list">
                {services.map((s, i) => (
                  <li key={s.title} className="service-row">
                    <span className="service-num">{String(i + 1).padStart(2, "0")}</span>
                    <div className="service-body">
                      <h3>{s.title}</h3>
                      <p>{s.text}</p>
                    </div>
                    <EnquireLink service={s.title} />
                  </li>
                ))}
              </ol>
              <div className="section-intro">
                <p className="eyebrow">Our Services</p>
                <h2>
                  From the <em>first box</em>
                  <br />
                  to the final touch.
                </h2>
                <p>Everything your move needs, all in one place.</p>
                <QuoteLink>Plan Your Move</QuoteLink>
              </div>
            </div>
          </section>
          <SectionDivider from="dark" to="paper" />

          
          <section id="why" className="section-space">
            <div className="page-width why-grid">
              <div className="why-photo-wrap">
                <div className="why-photo">
                  
                  <Image
                    src={IMG.team}
                    alt="A team handling furniture together with care"
                    width={1216}
                    height={832}
                    loading="lazy"
                  />
                </div>
                <div className="talk-panel">
                  <h3>Let’s Talk Today</h3>
                  <p>A big move or a small question. We’re here to help.</p>
                  <Button asChild variant="secondary" className="talk-phone">
                    <a href={PHONE_LINK}>
                      <Phone size={16} />
                      {PHONE}
                    </a>
                  </Button>
                </div>
              </div>
              <div>
                <p className="eyebrow">Why Choose Us</p>
                <h2>
                  Quality <em>moving.</em>
                  <br />
                  People you can rely on.
                </h2>
                <p className="section-copy">
                  Your things are part of your story. We treat them with the attention they
                  deserve, making each stage of your move feel a little easier.
                </p>
                <ul className="check-list">
                  {[
                    "Thoughtful packing and careful handling",
                    "Home and office moves, planned around you",
                    "A friendly team from start to finish",
                    "Help unpacking and getting settled",
                    "One team for every stage of your move",
                  ].map((t) => (
                    <li key={t}>
                      <span>
                        <Check size={14} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <SectionDivider from="paper" to="soft" variant="curl" />
          <section id="process" className="section-muted process-section">
            <div className="page-width process-layout">
              <div>
                <p className="eyebrow">The 3-Step Stress-Free Move</p>
                <h2>
                  A simple process.
                  <br />A better <em>moving day.</em>
                </h2>
                <div className="process-steps">
                  {[
                    {
                      icon: Phone,
                      title: "Request Your Quote",
                      text: "Tell us where you’re going, what you’re moving and your preferred date.",
                    },
                    {
                      icon: Package,
                      title: "We Plan & Pack",
                      text: "We work through the details and carefully prepare your belongings for the journey.",
                    },
                    {
                      icon: Truck,
                      title: "Move & Settle In",
                      text: "We transport, unload and help put everything in place at your new address.",
                    },
                  ].map((p, i) => (
                    <div key={p.title} className="process-step">
                      <div className="process-icon">
                        <p.icon size={25} strokeWidth={1.5} />
                      </div>
                      {i < 2 && <ArrowRight className="step-arrow" size={28} />}
                      <h3>{p.title}</h3>
                      <p>{p.text}</p>
                    </div>
                  ))}
                </div>
              </div>
              <Image
                src={IMG.about}
                alt="A mover ready with packed boxes"
                loading="lazy"
                width={832}
                height={1216}
              />
            </div>
          </section>

          <SectionDivider from="soft" to="dark" />
          <CustomerReviews />
          <SectionDivider from="dark" to="paper" variant="curl" />
          <section className="section-space">
            <div className="page-width">
              <div className="center-heading">
                <p className="eyebrow">The County Movers Approach</p>
                <h2>
                  Good moves start with <em>care.</em>
                </h2>
              </div>
              <div className="care-grid">
                {[
                  {
                    icon: HeartHandshake,
                    title: "A personal approach",
                    text: "No two moves are the same. We listen to what you need and plan around your home, your belongings and your next chapter.",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Attention to the details",
                    text: "The corners of your sofa. The glass in your cabinet. The things that matter to you deserve care at every step.",
                  },
                  {
                    icon: Users,
                    title: "Together, all the way",
                    text: "From packing up to settling in, having one team by your side means fewer things for you to juggle on moving day.",
                  },
                ].map((c) => (
                  <article className="care-item" key={c.title}>
                    <c.icon size={30} />
                    <h3>{c.title}</h3>
                    <p>{c.text}</p>
                  </article>
                ))}
              </div>
              <div className="center-action">
                <QuoteLink>Let’s Plan Your Move</QuoteLink>
              </div>
            </div>
          </section>

          <SectionDivider from="paper" to="soft" />
          <section id="gallery" className="section-space section-muted">
            <div className="page-width">
              <div className="center-heading">
                <p className="eyebrow">Moving Gallery</p>
                <h2>
                  A little look at <em>moving day.</em>
                </h2>
              </div>
              <Gallery />
              <p className="image-note">Illustrative moving photography.</p>
            </div>
          </section>

          <SectionDivider from="soft" to="paper" variant="curl" />
          <ServiceAreas />

          <SectionDivider from="paper" to="soft" />
          <section id="faq" className="section-space section-muted">
            <div className="page-width faq-layout">
              <div>
                <p className="eyebrow">FAQ</p>
                <h2>
                  Answers to your
                  <br />
                  moving <em>questions.</em>
                </h2>
                <p className="section-copy">
                  A little clarity before your next chapter. Let’s take the guesswork out of your
                  move.
                </p>
              </div>
              <FaqList faqs={faqs} />
            </div>
          </section>

          <SectionDivider from="soft" to="paper" variant="curl" />
          <section id="contact" className="section-space">
            <div className="page-width contact-layout">
              <ContactForm services={services.map((s) => s.title)} />
              <div className="contact-details">
                <p className="eyebrow">Contact Us</p>
                <h2>
                  Big plans?
                  <br />
                  Let’s get you <em>moving.</em>
                </h2>
                <p className="section-copy">
                  Have a question or ready for a fresh start? Get in touch with County Movers to
                  talk through your move and request a free quote.
                </p>
                <h3>We’re here to help.</h3>
                <a href={PHONE_LINK}>
                  <Phone size={20} />
                  <span>{PHONE}</span>
                </a>
                <a href={`mailto:${EMAIL}`}>
                  <Mail size={20} />
                  <span>{EMAIL}</span>
                </a>
                <p className="contact-address">
                  <MapPin size={20} />
                  Donholm, Nairobi, Kenya
                </p>
                <Button asChild variant="outline" className="whatsapp-button">
                  <a href={WHATSAPP} target="_blank" rel="noreferrer">
                    <WhatsAppIcon size={19} />
                    Chat on WhatsApp
                    <ArrowUpRight size={17} />
                  </a>
                </Button>
              </div>
            </div>
          </section>

          <SectionDivider from="paper" to="dark" />
          <section className="closing-banner">
            <div className="page-width">
              <p className="eyebrow">NEW ADDRESS. SAME PEACE OF MIND.</p>
              <h2>
                Ready to make your <em>next move?</em>
              </h2>
              <p>
                Leave the heavy lifting to County Movers.
                <br />
                Let’s make your next chapter a smooth one.
              </p>
              <div>
                <QuoteLink>Claim Your Free Quote</QuoteLink>
                <Button asChild variant="secondary" className="quote-button">
                  <a href={PHONE_LINK}>
                    <Phone size={17} />
                    {PHONE}
                  </a>
                </Button>
              </div>
            </div>
          </section>
        </main>
      </ServiceProvider>
      <SectionDivider from="dark" to="soft" variant="curl" />
      <footer className="section-muted">
        <div className="page-width footer-grid">
          <div>
            <Brand />
            <p>
              Careful moving. Fresh beginnings.
              <br />
              Home and office moving services,
              <br />
              based in Donholm, Nairobi.
            </p>
          </div>
          <div>
            <h3>Our Services</h3>
            {services.map((s) => (
              <a href="#services" key={s.title}>
                {s.title}
              </a>
            ))}
          </div>
          <div>
            <h3>Explore</h3>
            <a href="#about">About Us</a>
            <a href="#why">Why County Movers</a>
            <a href="#process">Our Process</a>
            <a href="#reviews">Customer Reviews</a>
            <a href="#gallery">Moving Gallery</a>
            <a href="#faq">Your Questions</a>
            <Link href="/quotation">Get A Quote</Link>
          </div>
          <div>
            <h3>Get In Touch</h3>
            <a href={PHONE_LINK}>
              <Phone size={16} />
              {PHONE}
            </a>
            <a href={`mailto:${EMAIL}`}>
              <Mail size={16} />
              {EMAIL}
            </a>
            <a href="#areas">
              <MapPin size={16} />
              Donholm, Nairobi, Kenya
            </a>
            <a href={WHATSAPP} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={16} />
              WhatsApp Us
              <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
        <div className="page-width footer-bottom">
          <span>
            © <CurrentYear /> County Movers. All rights reserved.
          </span>
          <LegalLinks />
          <a href="#home">Back to top ↑</a>
        </div>
        <div className="page-width footer-credit">
          <p>
            Designed &amp; developed by{" "}
            <a href="https://switchtechnologies.africa" target="_blank" rel="noopener noreferrer">
              Switch Technologies Africa
            </a>
          </p>
        </div>
      </footer>
      <a
        href={WHATSAPP}
        className="whatsapp-float"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with County Movers on WhatsApp"
      >
        <WhatsAppIcon size={30} />
      </a>
    </div>
  );
}