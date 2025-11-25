export interface Review {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  privateReview?: string;
  reviewCategory: {
    category: string;
    rating: number;
  }[];
  submittedAt: string;
  guestName: string;
  listingName: string;
  listingId: number;
  channel: string;
  approved?: boolean;
}

export const mockReviews: Review[] = [
  {
    id: 1,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Absolutely stunning property! The location is perfect, right in the heart of Shoreditch. The apartment was spotlessly clean and had everything we needed. The host was incredibly responsive and helpful. Would definitely stay again!",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 5 },
      { category: "value", rating: 5 }
    ],
    submittedAt: "2024-01-15 14:30:00",
    guestName: "Sarah Mitchell",
    listingName: "Luxury 2BR Shoreditch Loft",
    listingId: 101,
    channel: "Airbnb",
    approved: true
  },
  {
    id: 2,
    type: "guest-to-host",
    status: "published",
    rating: 4,
    publicReview: "Great stay overall. The apartment is modern and well-equipped. Only minor issue was the noise from the street on weekend nights, but earplugs solved that. Host was excellent in communication.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 4 },
      { category: "value", rating: 4 }
    ],
    submittedAt: "2024-01-20 10:15:00",
    guestName: "James Chen",
    listingName: "Luxury 2BR Shoreditch Loft",
    listingId: 101,
    channel: "Booking.com",
    approved: true
  },
  {
    id: 3,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Perfect for a family stay! Spacious, comfortable, and the kids loved the area. Close to everything but quiet at night. The host went above and beyond to make our stay comfortable.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 5 },
      { category: "value", rating: 5 }
    ],
    submittedAt: "2024-02-02 16:45:00",
    guestName: "Emma Rodriguez",
    listingName: "Modern 3BR Camden Apartment",
    listingId: 102,
    channel: "Airbnb",
    approved: true
  },
  {
    id: 4,
    type: "guest-to-host",
    status: "published",
    rating: 3,
    publicReview: "The location is good and the apartment has potential, but cleanliness could be better. Found some dust in corners and the bathroom needed attention. Host was responsive when we raised issues.",
    privateReview: "Need to improve cleaning standards before next guest.",
    reviewCategory: [
      { category: "cleanliness", rating: 3 },
      { category: "communication", rating: 4 },
      { category: "location", rating: 5 },
      { category: "value", rating: 3 }
    ],
    submittedAt: "2024-02-10 09:20:00",
    guestName: "Michael Brown",
    listingName: "Modern 3BR Camden Apartment",
    listingId: 102,
    channel: "Airbnb",
    approved: false
  },
  {
    id: 5,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Outstanding! This is exactly what you see in the photos. The rooftop terrace was a highlight - perfect for morning coffee. Highly recommend for couples or small families.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 5 },
      { category: "value", rating: 5 }
    ],
    submittedAt: "2024-02-14 18:00:00",
    guestName: "Lisa Anderson",
    listingName: "Penthouse with Rooftop - King's Cross",
    listingId: 103,
    channel: "Vrbo",
    approved: true
  },
  {
    id: 6,
    type: "guest-to-host",
    status: "published",
    rating: 4,
    publicReview: "Lovely apartment with great amenities. The kitchen is fully stocked which was perfect for us. Only wish the WiFi was faster, but otherwise excellent stay.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 4 },
      { category: "location", rating: 4 },
      { category: "value", rating: 4 }
    ],
    submittedAt: "2024-02-18 11:30:00",
    guestName: "David Park",
    listingName: "Penthouse with Rooftop - King's Cross",
    listingId: 103,
    channel: "Airbnb",
    approved: true
  },
  {
    id: 7,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Incredible value for money! The apartment exceeded our expectations. Clean, modern, and the host's check-in instructions were crystal clear. Will definitely book again on our next London trip.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 4 },
      { category: "value", rating: 5 }
    ],
    submittedAt: "2024-02-22 15:45:00",
    guestName: "Sophie Turner",
    listingName: "Cozy Studio - Notting Hill",
    listingId: 104,
    channel: "Booking.com",
    approved: true
  },
  {
    id: 8,
    type: "guest-to-host",
    status: "published",
    rating: 2,
    publicReview: "Unfortunately, the apartment didn't meet expectations. The heating wasn't working properly during our stay and it took too long to get resolved. The location is good though.",
    privateReview: "Guest complained about heating - maintenance issue needs addressing urgently.",
    reviewCategory: [
      { category: "cleanliness", rating: 4 },
      { category: "communication", rating: 3 },
      { category: "location", rating: 4 },
      { category: "value", rating: 2 }
    ],
    submittedAt: "2024-02-25 08:15:00",
    guestName: "Robert Williams",
    listingName: "Cozy Studio - Notting Hill",
    listingId: 104,
    channel: "Airbnb",
    approved: false
  },
  {
    id: 9,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Best Airbnb experience in London! The apartment is beautiful, the host is professional, and everything was seamless from booking to checkout. The welcome pack was a nice touch!",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 5 },
      { category: "value", rating: 5 }
    ],
    submittedAt: "2024-03-01 19:20:00",
    guestName: "Amanda Foster",
    listingName: "Luxury 2BR Shoreditch Loft",
    listingId: 101,
    channel: "Airbnb",
    approved: true
  },
  {
    id: 10,
    type: "guest-to-host",
    status: "published",
    rating: 4,
    publicReview: "Very good apartment in a prime location. The building is secure and well-maintained. Would have given 5 stars but checkout time was quite early. Otherwise perfect!",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 4 },
      { category: "location", rating: 5 },
      { category: "value", rating: 4 }
    ],
    submittedAt: "2024-03-05 12:00:00",
    guestName: "Thomas Lee",
    listingName: "Modern 3BR Camden Apartment",
    listingId: 102,
    channel: "Vrbo",
    approved: true
  },
  {
    id: 11,
    type: "guest-to-host",
    status: "published",
    rating: 5,
    publicReview: "Spectacular property with stunning views! The rooftop is absolutely worth it. Everything was immaculate and the host provided excellent local recommendations.",
    reviewCategory: [
      { category: "cleanliness", rating: 5 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 5 },
      { category: "value", rating: 5 }
    ],
    submittedAt: "2024-03-08 14:30:00",
    guestName: "Jessica Martinez",
    listingName: "Penthouse with Rooftop - King's Cross",
    listingId: 103,
    channel: "Airbnb",
    approved: true
  },
  {
    id: 12,
    type: "guest-to-host",
    status: "published",
    rating: 4,
    publicReview: "Charming studio in a lovely neighborhood. Perfect for a solo traveler or couple. The local cafes and markets nearby are fantastic. Minor wear and tear but overall great value.",
    reviewCategory: [
      { category: "cleanliness", rating: 4 },
      { category: "communication", rating: 5 },
      { category: "location", rating: 5 },
      { category: "value", rating: 4 }
    ],
    submittedAt: "2024-03-12 10:45:00",
    guestName: "Oliver Thompson",
    listingName: "Cozy Studio - Notting Hill",
    listingId: 104,
    channel: "Booking.com",
    approved: true
  }
];

export const properties = [
  {
    id: 101,
    name: "Luxury 2BR Shoreditch Loft",
    address: "Shoreditch, London",
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1600&q=80",
    averageRating: 4.7,
    totalReviews: 4
  },
  {
    id: 102,
    name: "Modern 3BR Camden Apartment",
    address: "Camden, London",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    imageUrl: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80",
    averageRating: 4.3,
    totalReviews: 3
  },
  {
    id: 103,
    name: "Penthouse with Rooftop - King's Cross",
    address: "King's Cross, London",
    type: "Penthouse",
    bedrooms: 2,
    bathrooms: 2,
    maxGuests: 4,
    imageUrl: "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?auto=format&fit=crop&w=1600&q=80",
    averageRating: 4.7,
    totalReviews: 3
  },
  {
    id: 104,
    name: "Cozy Studio - Notting Hill",
    address: "Notting Hill, London",
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    maxGuests: 2,
    imageUrl: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1600&q=80",
    averageRating: 3.7,
    totalReviews: 3
  }
];
