
import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface LineChartProps {
  title: string;
  data: Array<{
    name: string;
    value: number;
  }>;
  color?: string;
}

export function LineChart({ title, data, color = "#3d8f62" }: LineChartProps) {
  // Create formatted data with animation delays
  const formattedData = useMemo(() => {
    return data.map((item, index) => ({
      ...item,
      animationDuration: 1000,
      animationDelay: index * 100,
    }));
  }, [data]);

  return (
    <Card className="animate-fade-up overflow-hidden card-hover">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 pb-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart
              data={formattedData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.1)" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
              />
              <Tooltip 
                contentStyle={{ 
                  background: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                }}
                itemStyle={{ color: 'var(--foreground)' }}
                labelStyle={{ color: 'var(--muted-foreground)', fontWeight: 500 }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                dot={{ stroke: color, strokeWidth: 2, r: 4, fill: 'var(--background)' }}
                activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                isAnimationActive={true}
              />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
