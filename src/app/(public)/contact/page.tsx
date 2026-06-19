import React from "react";
import { LeadForm } from "@/components/website/LeadForm";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">Contact Apex Dental</h1>
        <p className="text-sm text-muted-foreground mt-3 px-4">
          Reach out to our clinical staff or book a consult instantly using the form below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="p-6 rounded-xl border border-border bg-card space-y-4">
            <h3 className="font-bold text-base text-foreground border-b border-border/40 pb-2">Clinic Information</h3>
            
            <div className="space-y-4 text-xs text-muted-foreground">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Physical Address</h4>
                  <p className="mt-0.5">100 Medical Plaza, Suite 400, Boston, MA 02111</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Phone className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Phone Number</h4>
                  <p className="mt-0.5">Primary: (555) 234-5678</p>
                  <p>Billing: (555) 234-5679</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Mail className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Email Contact</h4>
                  <p className="mt-0.5">Queries: info@apexdentalgrowth.com</p>
                  <p>Billing: billing@apexdentalgrowth.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-foreground">Operating Hours</h4>
                  <p className="mt-0.5">Mon - Fri: 8:00 AM - 6:00 PM</p>
                  <p>Sat: 9:00 AM - 3:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Map placeholder */}
          <div className="p-5 rounded-xl border border-border bg-muted/20 flex flex-col justify-center items-center h-48 text-center text-xs text-muted-foreground border-dashed">
            <MapPin className="h-8 w-8 text-primary/45 mb-2 animate-bounce" />
            <h4 className="font-bold text-foreground">Interactive Medical Map</h4>
            <p className="max-w-[200px] mt-0.5">Conveniently located near Boston Commons with free parking validated for patients.</p>
          </div>

        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-7">
          <LeadForm />
        </div>

      </div>
    </div>
  );
}
