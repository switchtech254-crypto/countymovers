import { IMG } from "@/lib/site";

export function Brand({ light = false }: { light?: boolean }) {
  return (
    <a
      href="#home"
      className={`brand ${light ? "brand-light" : ""}`}
      aria-label="County Movers home"
    >
      <img src={IMG.logo} alt="County Movers logo" width={54} height={54} />
      <span>
        COUNTY
        <strong>
          MOVERS<span className="brand-dot">.</span>
        </strong>
      </span>
    </a>
  );
}