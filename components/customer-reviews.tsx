import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReviewSlider } from "@/components/home/review-slider";
import { reviews } from "@/lib/site";

export function CustomerReviews() {
  return (
    <section id="reviews" className="section-space reviews-section" aria-labelledby="reviews-title">
      <div className="page-width reviews-layout">
        <div>
          <p className="eyebrow">Customer Reviews</p>
          <h2 id="reviews-title">Your move.<br /><em>Your story.</em></h2>
          <p className="reviews-intro">The best part of moving is hearing how the next chapter begins.</p>
          <Button asChild variant="link" className="review-link">
            <a href="#contact">Share your experience <ArrowUpRight size={18} /></a>
          </Button>
        </div>
        <ReviewSlider reviews={reviews} />
      </div>
    </section>
  );
}