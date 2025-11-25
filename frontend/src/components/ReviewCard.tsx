import { Star, Calendar, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Review } from "@/data/mockReviews";

interface ReviewCardProps {
  review: Review;
  onApprovalToggle?: (id: number) => void;
}

export const ReviewCard = ({ review, onApprovalToggle }: ReviewCardProps) => {
  const averageRating = review.rating || 
    review.reviewCategory.reduce((acc, cat) => acc + cat.rating, 0) / review.reviewCategory.length;

  const getChannelColor = (channel: string) => {
    const colors: Record<string, string> = {
      "Airbnb": "bg-[#FF5A5F] text-white",
      "Booking.com": "bg-[#003580] text-white",
      "Vrbo": "bg-[#0D2852] text-white"
    };
    return colors[channel] || "bg-muted text-muted-foreground";
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return "text-success";
    if (rating >= 3.5) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="hover:shadow-md transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{review.guestName}</h3>
              <Badge className={getChannelColor(review.channel)}>
                {review.channel}
              </Badge>
              {review.approved !== undefined && (
                <Badge variant={review.approved ? "default" : "secondary"}>
                  {review.approved ? "Published" : "Pending"}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{review.listingName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{new Date(review.submittedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`flex items-center gap-1 font-bold text-xl ${getRatingColor(averageRating)}`}>
              <Star className="h-5 w-5 fill-current" />
              <span>{averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-foreground leading-relaxed">{review.publicReview}</p>
          
          {review.privateReview && (
            <div className="bg-muted/50 p-3 rounded-md">
              <p className="text-sm text-muted-foreground italic">
                <span className="font-medium">Internal Note:</span> {review.privateReview}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {review.reviewCategory.map((cat) => (
              <div
                key={cat.category}
                className="flex items-center gap-1 bg-muted px-3 py-1 rounded-full text-xs"
              >
                <span className="capitalize">{cat.category.replace(/_/g, " ")}</span>
                <span className={`font-semibold ${getRatingColor(cat.rating)}`}>
                  {cat.rating}/5
                </span>
              </div>
            ))}
          </div>

          {onApprovalToggle && (
            <div className="pt-3 border-t flex gap-2">
              <Button
                size="sm"
                variant={review.approved ? "outline" : "default"}
                onClick={() => onApprovalToggle(review.id)}
                className="flex-1"
              >
                {review.approved ? (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Unpublish
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Publish to Website
                  </>
                )}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};