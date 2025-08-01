"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type LucideIcon } from "lucide-react";

type AlertInfo = {
  icon: LucideIcon;
  title: string;
  description: string;
  variant: "default" | "destructive";
};

interface AlertsSectionProps {
  alerts: AlertInfo[];
}

export function AlertsSection({ alerts }: AlertsSectionProps) {
  if (alerts.length === 0) return null;

  return (
    <div>
      <h2 className="text-xl font-semibold tracking-tight mb-4">
        Critical Alerts
      </h2>
      <div className="grid gap-4 md:grid-cols-2">
        {alerts.map((alert, index) => (
          <Alert key={index} variant={alert.variant}>
            <alert.icon className="h-4 w-4" />
            <AlertTitle>{alert.title}</AlertTitle>
            <AlertDescription>{alert.description}</AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
