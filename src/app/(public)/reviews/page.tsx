import React from "react";
import { prisma } from "@/lib/db";
import { ReviewForm } from "@/components/website/ReviewForm";
import { Star, MessageSquare, ShieldCheck, Quote } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  // Fetch approved reviews from the SQLite database
  const dbReviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: { createdAt: "desc" },
  });

  const totalReviews = dbReviews.length;
  const averageRating = totalReviews > 0
    ? (dbReviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews).toFixed(1)
    : "5.0";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Patient Testimonials & Reviews</h1>
        <p className="text-sm text-muted-foreground mt-3 px-4">
          We pride ourselves on providing comfortable, quality dental care. Read reports from our patients or submit your own.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Aggregate Score and Reviews List */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Aggregate Card */}
          <div className="p-6 rounded-xl border border-border bg-card flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-3xl font-extrabold text-foreground">{averageRating} ★</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Average Patient Rating ({totalReviews} verified reviews)</p>
            </div>
            <div className="flex items-center space-x-1 text-amber-400">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="h-5 w-5 fill-current" />
              ))}
            </div>
          </div>

          {/* Testimonial List */}
          <div className="space-y-4">
            {dbReviews.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground bg-muted/20 border border-border rounded-xl">
                No verified reviews found. Be the first to leave one!
              </div>
            ) : (
              dbReviews.map((rev) => (
                <div key={rev.id} className="p-5 rounded-xl border border-border bg-card space-y-3 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute right-4 top-4 text-muted/15 font-serif text-5xl select-none pointer-events-none">
                    <Quote size={40} className="stroke-[1.5px] rotate-180" />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-foreground">{rev.name}</h4>
                    <div className="flex items-center space-x-0.5 text-amber-400">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`h-3.5 w-3.5 ${
                            idx < rev.rating ? "fill-current" : "text-border"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center space-x-1.5 text-[10px] text-emerald-600 font-semibold mt-1">
                    <ShieldCheck size={12} />
                    <span>Verified Patient Checkin</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Side: Form Submitter */}
        <div className="lg:col-span-5">
          <ReviewForm />
        </div>

      </div>
    </div>
  );
}
