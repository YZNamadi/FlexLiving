import { Star, Bed, Users, Bath } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

interface PropertyCardProps {
  id: number;
  name: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests: number;
  imageUrl: string;
  averageRating: number;
  totalReviews: number;
}

export const PropertyCard = ({
  id,
  name,
  address,
  type,
  bedrooms,
  bathrooms,
  maxGuests,
  imageUrl,
  averageRating,
  totalReviews
}: PropertyCardProps) => {
  return (
    <Link to={`/property/${id}`}>
      <Card className="hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-1 line-clamp-1">{name}</h3>
              <p className="text-sm text-muted-foreground">{address}</p>
            </div>
            <div className="flex items-center gap-1 ml-2">
              <Star className="h-4 w-4 fill-primary text-primary" />
              <span className="font-semibold">{averageRating.toFixed(1)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms} bed</span>
            </div>
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms} bath</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{maxGuests} guests</span>
            </div>
          </div>
          
          <div className="mt-3 text-sm text-muted-foreground">
            {totalReviews} reviews
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};