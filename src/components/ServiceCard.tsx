import { ArrowUpRight } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href?: string;
  index?: number;
}

export default function ServiceCard({ icon, title, description, href = '/services', index = 0 }: ServiceCardProps) {
  return (
    <a
      href={href}
      className="group card-modern p-7 block relative overflow-hidden"
    >
      {/* Gradient accent top border */}
      <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-primary via-secondary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-[20px]" />

      {/* Subtle background on hover */}
      <span className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] to-secondary/[0.05] opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[20px]" />

      <div className="relative z-10">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:from-primary/15 group-hover:to-secondary/15 transition-all duration-300">
          {icon}
        </div>

        {/* Title + arrow */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-serif text-[1.0625rem] font-semibold text-text-primary leading-snug">{title}</h3>
          <ArrowUpRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
        </div>

        <p className="text-sm text-text-secondary leading-relaxed">{description}</p>

        {/* Learn more link */}
        <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
          Learn more <ArrowUpRight className="w-3 h-3" />
        </span>
      </div>
    </a>
  );
}
