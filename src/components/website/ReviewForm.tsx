"use client";

import React, { useState, useTransition } from "react";
import { submitReviewAction } from "@/lib/lead-actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Star, CheckCircle2, MessageSquare } from "lucide-react";
import confetti from "canvas-confetti";

export function ReviewForm() {
  const [isPending, startTransition] = useTransition();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [state, setState] = useState<{ success?: boolean; message?: string; error?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("rating", rating.toString());

    startTransition(async () => {
      const res = await submitReviewAction(null, formData);
      setState(res);
      if (res.success) {
        confetti({
          particleCount: 50,
          spread: 40,
          origin: { y: 0.8 },
          colors: ["#14b8a6", "#fbbf24"],
        });
        (e.target as HTMLFormElement).reset();
        setRating(5);
      }
    });
  };

  return (
    <Card className="border-border bg-card shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-primary font-bold">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span>Write Patient Testimonial</span>
        </CardTitle>
        <CardDescription>
          Share your dental checkup or treatment experience.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {state.success ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <CheckCircle2 className="h-12 w-12 text-emerald-500 animate-bounce" />
            <h4 className="font-bold text-foreground text-sm">Review Submitted!</h4>
            <p className="text-xs text-muted-foreground max-w-xs">{state.message}</p>
            <Button
              variant="outline"
              size="sm"
              className="text-[10px]"
              onClick={() => setState({})}
            >
              Submit Another Testimonial
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {state.error && (
              <div className="p-3 text-xs bg-destructive/10 text-destructive border border-destructive/20 rounded-lg">
                {state.error}
              </div>
            )}
            
            {/* Rating Stars Selection */}
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold leading-none text-muted-foreground">
                Your Rating
              </label>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none cursor-pointer"
                  >
                    <Star
                      className={`h-6 w-6 transition-colors duration-150 ${
                        (hoverRating || rating) >= star
                          ? "fill-amber-400 text-amber-400"
                          : "text-border"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <Input
              name="name"
              label="Your Name / Initial"
              placeholder="e.g. Robert D. or Anonymous"
              required
            />
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-semibold leading-none text-muted-foreground">
                Review Feedback
              </label>
              <textarea
                name="comment"
                placeholder="How was your procedure? Share your clinical experience, doctor care, or schedule convenience..."
                required
                className="flex min-h-[90px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary text-foreground"
              />
            </div>

            <Button
              type="submit"
              className="w-full text-xs py-2.5 font-bold"
              isLoading={isPending}
            >
              Submit Testimonial
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
