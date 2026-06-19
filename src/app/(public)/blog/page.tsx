import React from "react";
import Link from "next/link";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";

export default function BlogPage() {
  const posts = [
    {
      title: "How Dental Implants Prevent Long-Term Bone Loss",
      summary: "Explore the biological mechanism behind osseointegration and why crowns anchored by titanium posts keep jawbone tissue healthy compared to standard dental bridges.",
      date: "June 15, 2026",
      readTime: "5 min read",
      author: "Dr. Sarah Mitchell",
    },
    {
      title: "Invisalign vs. Brackets: Choosing Orthodontics in 2026",
      summary: "A review of clear aligners versus silver brackets, detailing treatment lengths, hygiene maintenance differences, and dietary considerations for teens and adults.",
      date: "May 28, 2026",
      readTime: "7 min read",
      author: "Dr. Alexander Patel",
    },
    {
      title: "Preventing Decay: The Science of Plaque Scaling & Polishing",
      summary: "Understand why professional scaling is crucial. Learn how calcified tartar can only be scraped off by specialized ultrasound hygiene instruments in-office.",
      date: "April 10, 2026",
      readTime: "4 min read",
      author: "Elena Rostova (Clinical Lead)",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Oral Hygiene & Wellness Blog</h1>
        <p className="text-sm text-muted-foreground mt-3 px-4">
          Stay informed with dental health updates and guides drafted by our orthodontic specialists.
        </p>
      </div>

      <div className="space-y-8">
        {posts.map((post, i) => (
          <div key={i} className="p-6 md:p-8 rounded-xl border border-border bg-card shadow-sm hover:shadow-md transition-all duration-200 space-y-4">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span className="flex items-center space-x-1"><Calendar size={12} /> <span>{post.date}</span></span>
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="flex items-center space-x-1"><Clock size={12} /> <span>{post.readTime}</span></span>
              <span className="h-1.5 w-1.5 rounded-full bg-border" />
              <span className="font-semibold text-primary">By {post.author}</span>
            </div>
            
            <h3 className="text-lg md:text-xl font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
              {post.title}
            </h3>
            
            <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
              {post.summary}
            </p>

            <div className="pt-2">
              <Link href="/book" className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1">
                <span>Read Full Article</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
