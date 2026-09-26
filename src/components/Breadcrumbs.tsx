'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: Props) {
  return (
    <nav className={`flex items-center justify-center gap-2 text-sm font-medium ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 shadow-lg">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const isFirst = index === 0;

          return (
            <li key={index} className="flex items-center gap-2">
              {/* Separator (don't show for first item) */}
              {!isFirst && (
                <ChevronRight size={14} className="text-gray-500" />
              )}

              {item.href && !isLast ? (
                <Link 
                  href={item.href}
                  className="flex items-center gap-1 text-gray-300 hover:text-[#F9C344] transition-colors"
                >
                  {isFirst && <Home size={14} className="mb-0.5" />}
                  <span className={isFirst ? "sr-only md:not-sr-only" : ""}>
                    {item.label}
                  </span>
                </Link>
              ) : (
                <span className="text-[#F9C344] font-bold line-clamp-1 max-w-[200px] truncate" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}