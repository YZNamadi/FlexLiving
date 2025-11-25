import { useParams, Link } from "react-router-dom";
import { Star, MapPin, Bed, Users, Bath, Wifi, Tv, Coffee, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { properties, mockReviews, type Review } from "@/data/mockReviews";
import { useEffect, useState } from "react";
type NormalizedReview = {
  id: number;
  type: string;
  status: string;
  rating10: number | null;
  text: string;
  categories: Record<string, number>;
  submittedAt: string;
  guestName: string | null;
  listingName: string;
  channel: string;
  approved: boolean;
};

export default function PropertyDetails() {
  const { id } = useParams();
  const property = properties.find((p) => p.id === parseInt(id || "0"));
  const [propertyReviews, setPropertyReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchApproved = async () => {
      try {
        const hostaway = await fetch('/api/reviews/hostaway').then(r => r.json());
        const raw: NormalizedReview[] = hostaway?.data?.reviews || [];
        const reviews: Review[] = raw.map((r) => ({
          id: r.id,
          type: r.type,
          status: r.status,
          rating: typeof r.rating10 === 'number' ? Math.round((r.rating10 / 10) * 10) / 2 : null,
          publicReview: r.text,
          reviewCategory: Object.entries(r.categories || {}).map(([category, rating]) => ({ category, rating: Math.round(((rating as number) / 10) * 10) / 2 })),
          submittedAt: r.submittedAt,
          guestName: r.guestName || "",
          listingName: r.listingName,
          listingId: ({
            "2B N1 A - 29 Shoreditch Heights": 101,
            "Cosy studio près du Panthéon - The Flex Paris": 104,
            "Amenity-rich flat near City Center": 102,
          } as Record<string, number>)[r.listingName] || properties.find(pr => pr.name === r.listingName)?.id || properties[0]?.id || 101,
          channel: r.channel,
          approved: !!r.approved,
        }));
        setPropertyReviews(reviews.filter(r => r.listingId === parseInt(id || '0') && r.approved));
      } catch {
        setPropertyReviews(mockReviews.filter(r => r.listingId === parseInt(id || '0') && r.approved));
      }
    };
    fetchApproved();
  }, [id]);

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Property not found</h1>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const averageRating = propertyReviews.length > 0
    ? propertyReviews.reduce((acc, r) => {
        const rating = r.rating || r.reviewCategory.reduce((a, c) => a + c.rating, 0) / r.reviewCategory.length;
        return acc + rating;
      }, 0) / propertyReviews.length
    : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-5 w-5" />
              <span>Back to Properties</span>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline">Manager Dashboard</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Image */}
        <div className="aspect-[21/9] rounded-xl overflow-hidden bg-muted mb-8">
          <img
            src={property.imageUrl}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Property Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{property.name}</h1>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-5 w-5" />
                    <span>{property.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-6 w-6 fill-primary text-primary" />
                  <span className="text-2xl font-bold">{averageRating.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 text-lg">
                <div className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-muted-foreground" />
                  <span>{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="h-5 w-5 text-muted-foreground" />
                  <span>{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-muted-foreground" />
                  <span>Up to {property.maxGuests} Guests</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* About */}
            <div>
              <h2 className="text-2xl font-bold mb-4">About this property</h2>
              <p className="text-muted-foreground leading-relaxed">
                Experience luxury living in the heart of {property.address.split(",")[0]}. This beautifully appointed {property.type.toLowerCase()} 
                offers modern amenities, stunning design, and the perfect location for your London stay. Whether you're here for business 
                or pleasure, you'll find everything you need for a comfortable and memorable experience.
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { icon: Wifi, label: "High-speed WiFi" },
                  { icon: Tv, label: "Smart TV" },
                  { icon: Coffee, label: "Coffee Machine" },
                  { icon: Bath, label: "Premium Toiletries" },
                ].map((amenity) => (
                  <div key={amenity.label} className="flex items-center gap-3">
                    <amenity.icon className="h-5 w-5 text-primary" />
                    <span>{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Reviews Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Guest Reviews</h2>
                <Badge variant="secondary" className="text-base px-4 py-1">
                  {propertyReviews.length} {propertyReviews.length === 1 ? "Review" : "Reviews"}
                </Badge>
              </div>

              {propertyReviews.length > 0 ? (
                <div className="space-y-6">
                  {/* Rating Breakdown */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-muted/50 rounded-lg">
                    {["cleanliness", "communication", "location", "value"].map((category) => {
                      const avgCategoryRating = propertyReviews.reduce((acc, r) => {
                        const cat = r.reviewCategory.find(c => c.category === category);
                        return acc + (cat?.rating || 0);
                      }, 0) / propertyReviews.length;
                      
                      return (
                        <div key={category} className="text-center">
                          <div className="text-2xl font-bold mb-1">{avgCategoryRating.toFixed(1)}</div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {category}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Review Cards */}
                  <div className="space-y-4">
                    {propertyReviews.map((review) => (
                      <Card key={review.id}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="font-semibold text-lg">{review.guestName}</h3>
                              <p className="text-sm text-muted-foreground">
                                {new Date(review.submittedAt).toLocaleDateString("en-US", {
                                  month: "long",
                                  year: "numeric"
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-primary text-primary" />
                              <span className="font-semibold">
                                {(review.rating || 
                                  review.reviewCategory.reduce((a, c) => a + c.rating, 0) / review.reviewCategory.length
                                ).toFixed(1)}
                              </span>
                            </div>
                          </div>
                          <p className="text-foreground leading-relaxed">{review.publicReview}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 bg-muted/50 rounded-lg">
                  <p className="text-muted-foreground">No reviews yet for this property</p>
                </div>
              )}
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <div className="text-3xl font-bold mb-1">£250 <span className="text-lg font-normal text-muted-foreground">/ night</span></div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 fill-primary text-primary" />
                      <span className="font-semibold">{averageRating.toFixed(1)}</span>
                      <span className="text-muted-foreground">({propertyReviews.length} reviews)</span>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-3">
                    <Button className="w-full" size="lg">Check Availability</Button>
                    <Button variant="outline" className="w-full" size="lg">Contact Host</Button>
                  </div>

                  <p className="text-sm text-muted-foreground text-center">
                    You won't be charged yet
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
