
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
}

export function StatsCard({ title, value, icon, trend, className }: StatsCardProps) {
  return (
    <Card className={cn("overflow-hidden card-hover animate-scale-in", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="h-5 w-5 text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={cn(
            "mt-2 text-xs flex items-center", 
            trend.positive ? "text-bakra-500" : "text-red-500"
          )}>
            <span className="mr-1">
              {trend.positive ? "↑" : "↓"}
            </span>
            <span>
              {trend.value}% {trend.positive ? "increase" : "decrease"}
            </span>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
