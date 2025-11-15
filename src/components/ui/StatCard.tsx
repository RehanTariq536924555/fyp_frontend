
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  className?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard = ({ title, value, icon, className, trend }: StatCardProps) => {
  const formattedValue = typeof value === 'number' 
    ? new Intl.NumberFormat('en-PK', { 
        style: title.toLowerCase().includes('earning') ? 'currency' : 'decimal',
        currency: 'PKR',
        maximumFractionDigits: 0
      }).format(value)
    : value;
    
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "relative overflow-hidden rounded-xl bg-white p-6 shadow-sm border border-border card-hover",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold">{formattedValue}</p>
          
          {trend && (
            <p className={cn(
              "text-xs",
              trend.isPositive ? "text-teal-600" : "text-red-600"
            )}>
              {trend.isPositive ? "↑" : "↓"} {trend.value}% from last month
            </p>
          )}
        </div>
        
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-primary/50 to-primary" />
    </motion.div>
  );
};

export default StatCard;
