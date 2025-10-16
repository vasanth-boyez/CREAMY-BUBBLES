import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProductCategory, CATEGORIES } from '@/types/product';
import { cn } from '@/lib/utils';

interface CategoryNavigationProps {
  selectedCategory: ProductCategory | 'All';
  onCategoryChange: (category: ProductCategory | 'All') => void;
  categoryCounts?: Record<ProductCategory, number>;
  className?: string;
  variant?: 'tabs' | 'sidebar' | 'dropdown' | 'scrollable-tabs';
}

const CategoryNavigation: React.FC<CategoryNavigationProps> = ({
  selectedCategory,
  onCategoryChange,
  categoryCounts = {},
  className,
  variant = 'tabs'
}) => {
  const allCategories: (ProductCategory | 'All')[] = ['All', ...Object.keys(CATEGORIES) as ProductCategory[]];

  if (variant === 'sidebar') {
    return (
      <div className={cn("w-64 bg-card/50 backdrop-blur-sm rounded-lg p-4", className)}>
        <h3 className="text-lg font-semibold mb-4 text-foreground">Categories</h3>
        <ScrollArea className="h-[calc(100vh-200px)]">
          <div className="space-y-2">
            {allCategories.map((category) => {
              const isSelected = selectedCategory === category;
              const count = category === 'All' 
                ? Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
                : categoryCounts[category as ProductCategory] || 0;
              
              return (
                <Button
                  key={category}
                  variant={isSelected ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start text-left h-auto p-3",
                    isSelected && "bg-primary text-primary-foreground"
                  )}
                  onClick={() => onCategoryChange(category)}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-3">
                      {category !== 'All' && (
                        <span className="text-lg">
                          {CATEGORIES[category as ProductCategory].icon}
                        </span>
                      )}
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {category === 'All' ? 'All Products' : category}
                        </span>
                        {category !== 'All' && (
                          <span className="text-xs text-muted-foreground">
                            {CATEGORIES[category as ProductCategory].description}
                          </span>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {count}
                    </Badge>
                  </div>
                </Button>
              );
            })}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={cn("relative", className)}>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as ProductCategory | 'All')}
          className="w-full p-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        >
          {allCategories.map((category) => {
            const count = category === 'All' 
              ? Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
              : categoryCounts[category as ProductCategory] || 0;
            
            return (
              <option key={category} value={category}>
                {category === 'All' ? 'All Products' : category} ({count})
              </option>
            );
          })}
        </select>
      </div>
    );
  }

  if (variant === 'scrollable-tabs') {
    return (
      <div className={cn("w-full", className)}>
        <div className="relative">
          <style jsx>{`
            .scrollable-categories::-webkit-scrollbar {
              height: 4px;
            }
            @media (min-width: 640px) {
              .scrollable-categories::-webkit-scrollbar {
                height: 6px;
              }
            }
            @media (min-width: 1024px) {
              .scrollable-categories::-webkit-scrollbar {
                height: 8px;
              }
            }
            @media (min-width: 1280px) {
              .scrollable-categories::-webkit-scrollbar {
                height: 10px;
              }
            }
            .scrollable-categories::-webkit-scrollbar-track {
              background: transparent;
            }
            .scrollable-categories::-webkit-scrollbar-thumb {
              background: rgba(156, 163, 175, 0.3);
              border-radius: 3px;
              transition: background 0.2s ease;
            }
            .scrollable-categories::-webkit-scrollbar-thumb:hover {
              background: rgba(156, 163, 175, 0.5);
            }
            .scrollable-categories {
              scrollbar-width: thin;
              scrollbar-color: rgba(156, 163, 175, 0.3) transparent;
            }
            .fade-left {
              background: linear-gradient(to right, rgba(255, 255, 255, 0.8), transparent);
            }
            .fade-right {
              background: linear-gradient(to left, rgba(255, 255, 255, 0.8), transparent);
            }
          `}</style>
          
          {/* Left fade gradient */}
          <div className="absolute left-0 top-0 bottom-0 w-6 sm:w-8 lg:w-12 xl:w-16 fade-left pointer-events-none z-10" />
          
          {/* Right fade gradient */}
          <div className="absolute right-0 top-0 bottom-0 w-6 sm:w-8 lg:w-12 xl:w-16 fade-right pointer-events-none z-10" />
          
          <div className="scrollable-categories overflow-x-auto overflow-y-hidden pb-2 scroll-smooth">
            <div className="flex space-x-2 sm:space-x-3 lg:space-x-4 xl:space-x-6 px-2 sm:px-4 lg:px-6 min-w-max">
              {allCategories.map((category) => {
                const isSelected = selectedCategory === category;
                const count = category === 'All' 
                  ? Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
                  : categoryCounts[category as ProductCategory] || 0;
                
                return (
                  <Button
                    key={category}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "flex-shrink-0 h-auto py-2 px-4 text-sm sm:py-3 sm:px-6 sm:text-base lg:py-4 lg:px-8 lg:text-lg xl:py-5 xl:px-10 xl:text-xl whitespace-nowrap transition-all duration-200",
                      isSelected && "bg-primary text-primary-foreground shadow-lg scale-105",
                      !isSelected && "hover:bg-accent/50 hover:scale-102"
                    )}
                    onClick={() => onCategoryChange(category)}
                  >
                    <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
                      {category !== 'All' && (
                        <span className="text-base sm:text-lg lg:text-xl xl:text-2xl">
                          {CATEGORIES[category as ProductCategory].icon}
                        </span>
                      )}
                      <span className="font-medium">
                        {category === 'All' ? 'All Products' : category}
                      </span>
                      <Badge 
                        variant={isSelected ? "secondary" : "outline"} 
                        className={cn(
                          "text-xs sm:text-sm lg:text-base font-bold",
                          isSelected && "bg-white/20 text-white border-white/30"
                        )}
                      >
                        {count}
                      </Badge>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default tabs variant
  return (
    <div className={cn("w-full", className)}>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-2">
          {allCategories.map((category) => {
            const isSelected = selectedCategory === category;
            const count = category === 'All' 
              ? Object.values(categoryCounts).reduce((sum, count) => sum + count, 0)
              : categoryCounts[category as ProductCategory] || 0;
            
            return (
              <Button
                key={category}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-shrink-0 h-auto py-2 px-4",
                  isSelected && "bg-primary text-primary-foreground"
                )}
                onClick={() => onCategoryChange(category)}
              >
                <div className="flex items-center gap-2">
                  {category !== 'All' && (
                    <span className="text-sm">
                      {CATEGORIES[category as ProductCategory].icon}
                    </span>
                  )}
                  <span className="font-medium">
                    {category === 'All' ? 'All' : category}
                  </span>
                  <Badge 
                    variant={isSelected ? "secondary" : "outline"} 
                    className="text-xs"
                  >
                    {count}
                  </Badge>
                </div>
              </Button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};

export default CategoryNavigation;
