"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

interface ChartProps {
  sourceData: { name: string; value: number }[];
  revenueData: { name: string; amount: number }[];
}

export function OverviewCharts({ sourceData, revenueData }: ChartProps) {
  const COLORS = ["#0d9488", "#4f46e5", "#ec4899", "#f59e0b", "#64748b"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
      {/* Revenue trends chart */}
      <div className="lg:col-span-8 p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col h-[320px]">
        <div className="mb-4">
          <h3 className="text-xs font-bold text-foreground">Clinic Revenue Performance</h3>
          <p className="text-[10px] text-muted-foreground">Historical collections across billing channels</p>
        </div>
        <div className="flex-1 w-full text-xs">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid #cbd5e1",
                  borderRadius: "8px",
                  fontSize: "11px",
                }}
              />
              <Bar dataKey="amount" fill="#0d9488" radius={[4, 4, 0, 0]} name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leads distribution chart */}
      <div className="lg:col-span-4 p-6 rounded-xl border border-border bg-card shadow-sm flex flex-col h-[320px]">
        <div className="mb-4">
          <h3 className="text-xs font-bold text-foreground">Lead Capture Channels</h3>
          <p className="text-[10px] text-muted-foreground">Acquisition metrics by traffic channel</p>
        </div>
        <div className="flex-1 w-full text-xs flex justify-center items-center relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sourceData}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {sourceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} Leads`]} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: "10px", bottom: 0 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
