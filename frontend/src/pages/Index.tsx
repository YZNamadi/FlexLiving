import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PropertyCard } from "@/components/PropertyCard";
import { properties } from "@/data/mockReviews";
import { Building2 } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
        <div className="container mx-auto px-4 py-24">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <Building2 className="h-12 w-12" />
              <span className="text-2xl font-bold">Flex Living</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Premium Properties in Central London
            </h1>
            <p className="text-xl mb-8 text-primary-foreground/90">
              Discover carefully curated apartments and penthouses in the heart of London's most vibrant neighborhoods.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button size="lg" variant="secondary">
                  Manager Dashboard
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
                Explore Properties
              </Button>
            </div>
          </div>
        </div>
        
        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="hsl(var(--background))"/>
          </svg>
        </div>
      </section>

      {/* Properties Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
          <p className="text-lg text-muted-foreground">
            Browse our selection of premium properties with verified guest reviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 mt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <span className="font-semibold">Flex Living</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Flex Living. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
