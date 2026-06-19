"use client";

import React, { useState } from "react";
import { MapPin, ChevronDown, Check } from "lucide-react";

export function FranchiseSelector() {
  const locations = [
    { id: "boston", name: "Apex Boston (HQ)", city: "Boston, MA" },
    { id: "brookline", name: "Apex Brookline", city: "Brookline, MA" },
    { id: "cambridge", name: "Apex Cambridge", city: "Cambridge, MA" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(locations[0]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSelect = (loc: typeof locations[0]) => {
    setSelected(loc);
    setIsOpen(false);
    setIsSimulating(true);

    // Simulate location data loading
    setTimeout(() => {
      setIsSimulating(false);
    }, 800);
  };

  return (
    <div className="px-4 py-2 border-b border-border bg-muted/20 relative">
      <label className="block text-[9px] uppercase tracking-wider text-muted-foreground font-bold mb-1">
        Active Location
      </label>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-foreground transition-all duration-150 cursor-pointer shadow-sm"
      >
        <div className="flex items-center space-x-1.5 min-w-0">
          <MapPin size={12} className="text-primary shrink-0 animate-pulse" />
          <span className="truncate text-left">{selected.name}</span>
        </div>
        <ChevronDown size={12} className="text-muted-foreground shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute left-4 right-4 top-[calc(100%-4px)] z-50 mt-1 rounded-lg border border-border bg-card shadow-lg py-1 animate-in fade-in slide-in-from-top-1 duration-100">
          {locations.map((loc) => (
            <button
              key={loc.id}
              onClick={() => handleSelect(loc)}
              className="w-full text-left px-3 py-1.5 hover:bg-muted text-[11px] flex items-center justify-between transition-colors cursor-pointer text-foreground"
            >
              <div>
                <div className="font-bold">{loc.name}</div>
                <div className="text-[9px] text-muted-foreground">{loc.city}</div>
              </div>
              {selected.id === loc.id && <Check size={12} className="text-primary" />}
            </button>
          ))}
        </div>
      )}

      {isSimulating && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[1px] flex items-center justify-center z-10 transition-opacity">
          <div className="flex items-center space-x-2 text-[10px] font-semibold text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span>Syncing location dataset...</span>
          </div>
        </div>
      )}
    </div>
  );
}
