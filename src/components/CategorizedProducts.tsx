import React from 'react';
import { Product, ProductCategory, CATEGORIES, categorizeProduct } from '@/types/product';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface CategorizedProductsProps {
  products: Product[];
  selectedCategory: ProductCategory | 'All';
  className?: string;
}

const CategorizedProducts: React.FC<CategorizedProductsProps> = ({
  products,
  selectedCategory,
  className
}) => {
  // Categorize products
  const categorizedProducts = products.reduce((acc, product) => {
    const category = product.category || categorizeProduct(product.name);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(product);
    return acc;
  }, {} as Record<ProductCategory, Product[]>);

  // Filter products based on selected category
  const displayProducts = selectedCategory === 'All' 
    ? products 
    : categorizedProducts[selectedCategory] || [];

  // If showing all products, group by category
  if (selectedCategory === 'All') {
    const categoryOrder: ProductCategory[] = [
      'Bulks', 'Lollies', 'Kulfi', 'Kasata', 'Balls', 
      'Jumbo Refill', 'Black Forest', '1/2 Liters', '1 Liter'
    ];

    return (
      <div className={cn("space-y-8", className)}>
        {categoryOrder.map((category) => {
          const categoryProducts = categorizedProducts[category] || [];
          if (categoryProducts.length === 0) return null;

          return (
            <Card key={category} className="bg-card/50 backdrop-blur-sm shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3">
                  <span className="text-2xl">
                    {CATEGORIES[category].icon}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold text-foreground">
                      {category}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {CATEGORIES[category].description}
                    </p>
                  </div>
                  <Badge variant="secondary" className="ml-auto">
                    {categoryProducts.length} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {categoryProducts.map((product, index) => (
                    <div 
                      key={product.id}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      className="animate-bounce-in"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
        
        {/* Show uncategorized products if any */}
        {Object.keys(categorizedProducts).some(cat => 
          !categoryOrder.includes(cat as ProductCategory)
        ) && (
          <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3">
                <span className="text-2xl">📦</span>
                <div>
                  <h3 className="text-xl font-bold text-foreground">
                    Other Products
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Products not yet categorized
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(categorizedProducts)
                  .filter(([cat]) => !categoryOrder.includes(cat as ProductCategory))
                  .flatMap(([, products]) => products)
                  .map((product, index) => (
                    <div 
                      key={product.id}
                      style={{ animationDelay: `${index * 0.1}s` }}
                      className="animate-bounce-in"
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  // Show products for selected category
  return (
    <div className={cn("space-y-6", className)}>
      {displayProducts.length === 0 ? (
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
          <CardContent className="p-8 text-center">
            <div className="text-6xl mb-4">
              {CATEGORIES[selectedCategory].icon}
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">
              No products in {selectedCategory}
            </h3>
            <p className="text-muted-foreground">
              {CATEGORIES[selectedCategory].description}
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <span className="text-2xl">
                {CATEGORIES[selectedCategory].icon}
              </span>
              <div>
                <h3 className="text-xl font-bold text-foreground">
                  {selectedCategory}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {CATEGORIES[selectedCategory].description}
                </p>
              </div>
              <Badge variant="secondary" className="ml-auto">
                {displayProducts.length} items
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayProducts.map((product, index) => (
                <div 
                  key={product.id}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="animate-bounce-in"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CategorizedProducts;
