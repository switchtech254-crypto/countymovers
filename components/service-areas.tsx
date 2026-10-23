import { MapPin, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const nairobiAreas = [
  "Donholm", "Embakasi", "Buruburu", "Umoja",
  "Kilimani", "Kileleshwa", "Westlands", "Lavington",
  "Karen", "Lang’ata", "South B", "South C",
];
const kenyaAreas = [
  "Ruiru", "Thika", "Kiambu", "Kitengela",
  "Athi River", "Machakos", "Nakuru", "Naivasha",
  "Mombasa", "Kisumu", "Eldoret", "Nyeri",
];

export function ServiceAreas() {
  return (
    <section id="areas" className="section-space service-areas" aria-labelledby="areas-title">
      <div className="page-width">
        <div className="center-heading">
          <p className="eyebrow">Locations</p>
          <h2 id="areas-title">Areas We <em>Serve</em></h2>
        </div>
        {[
          { title: "In & around Nairobi", areas: nairobiAreas },
          { title: "Across Kenya", areas: kenyaAreas },
        ].map((group) => (
          <div className="area-group" key={group.title}>
            <h3>{group.title}</h3>
            <ul className="area-grid">
              {group.areas.map((area) => (
                <li key={area} className={area === "Donholm" ? "area-home" : ""}>
                  <span className="area-pin"><MapPin size={17} strokeWidth={1.8} aria-hidden="true" /></span>
                  {area}
                </li>
              ))}
            </ul>
          </div>
        ))}
        <p className="area-note">Moving to one of these destinations or somewhere else? Get in touch to confirm availability for your location.</p>
        <div className="center-action">
          <Button asChild className="quote-button">
            <a href="#contact">Enquire About Your Area <ArrowUpRight size={18} /></a>
          </Button>
        </div>
      </div>
    </section>
  );
}