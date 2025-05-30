import React from 'react';
import Link from 'next/link'; // Import Next.js Link for client-side navigation
import { LucideProps } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType<LucideProps>;
  iconColor?: string;
  trend?: string;
  trendColor?: string;
  valueColor?: string;
  href?: string; // Placeholder link
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  icon: Icon,
  iconColor = 'text-primary',
  trend,
  trendColor,
  valueColor = 'text-foreground',
  href = '#', // Default placeholder link
}) => {
  const cardContent = (
    <>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-200">{title}</p>
        <Icon size={28} className={`${iconColor} group-hover:scale-110 transition-transform duration-200`} />
      </div>
      <div>
        <p className={`text-4xl font-bold ${valueColor} mb-1 group-hover:text-primary transition-colors duration-200`}>{value}</p>
        {trend && (
          <p className={`text-xs ${trendColor || 'text-muted-foreground'} group-hover:text-foreground/80 transition-colors duration-200`}>
            {trend}
          </p>
        )}
      </div>
    </>
  );

  return (
    <Link href={href} passHref>
      <div className="group bg-gray-800/50 p-6 rounded-lg border border-gray-700 shadow-sm hover:shadow-lg hover:border-primary focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background transition-all duration-200 cursor-pointer transform hover:-translate-y-1 focus:outline-none">
        {cardContent}
      </div>
    </Link>
  );
};

export default KpiCard;
