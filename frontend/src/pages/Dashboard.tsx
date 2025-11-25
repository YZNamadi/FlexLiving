import { useState, useMemo, useEffect } from "react";
import { Star, TrendingUp, MessageSquare, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ReviewCard } from "@/components/ReviewCard";
import { StatsCard } from "@/components/StatsCard";
import { mockReviews, properties, type Review } from "@/data/mockReviews";
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
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProperty, setFilterProperty] = useState<string>("all");
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("date_desc");

  useEffect(() => {
    const mapping: Record<string, number> = {
      "2B N1 A - 29 Shoreditch Heights": 101,
      "Cosy studio près du Panthéon - The Flex Paris": 104,
      "Amenity-rich flat near City Center": 102,
    };
    const mapListingId = (name: string): number => {
      return mapping[name] ?? properties.find(pr => pr.name === name)?.id ?? properties[0]?.id ?? 101;
    };
    const scaleToFive = (n: number | null | undefined) => {
      if (typeof n !== 'number') return null;
      return Math.round((n / 10) * 10) / 2; // 10-point to 5-star
    };
    fetch("/api/reviews/hostaway")
      .then(r => r.json())
      .then(j => {
        const raw: NormalizedReview[] = j?.data?.reviews || [];
        const rs: Review[] = raw.map((r) => {
          const categoriesArr: Review['reviewCategory'] = Object.entries(r.categories || {}).map(([category, rating]) => ({
            category,
            rating: Math.round(((rating as number) / 10) * 10) / 2,
          }));
          return {
            id: r.id,
            type: r.type,
            status: r.status,
            rating: scaleToFive(r.rating10),
            publicReview: r.text,
            reviewCategory: categoriesArr,
            submittedAt: r.submittedAt,
            guestName: r.guestName || "",
            listingName: r.listingName,
            listingId: mapListingId(r.listingName),
            channel: r.channel,
            approved: !!r.approved,
          };
        });
        setReviews(rs.length ? rs : mockReviews);
      })
      .catch(() => {
        setReviews(mockReviews);
      });
  }, []);

  const handleApprovalToggle = async (id: number) => {
    const target = reviews.find(r => r.id === id);
    const nextApproved = target ? !target.approved : true;
    try {
      await fetch('/api/reviews/approved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, approved: nextApproved })
      });
      const res = await fetch('/api/reviews/hostaway').then(r => r.json());
      const raw: NormalizedReview[] = res?.data?.reviews || [];
      const refreshed: Review[] = raw.map((r) => ({
        id: r.id,
        type: r.type,
        status: r.status,
        rating: typeof r.rating10 === 'number' ? Math.round((r.rating10 / 10) * 10) / 2 : null,
        publicReview: r.text,
        reviewCategory: Object.entries(r.categories || {}).map(([category, rating]) => ({ category, rating: Math.round(((rating as number) / 10) * 10) / 2 })),
        submittedAt: r.submittedAt,
        guestName: r.guestName || "",
        listingName: r.listingName,
        listingId: properties.find(pr => pr.name === r.listingName)?.id || properties[0]?.id || 101,
        channel: r.channel,
        approved: !!r.approved,
      }));
      setReviews(refreshed);
    } catch (e) {
      setReviews(prev => prev.map(r => r.id === id ? { ...r, approved: nextApproved } : r));
    }
  };

  const filteredReviews = useMemo(() => {
    const base = reviews.filter((review) => {
      const matchesSearch = 
        review.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.publicReview.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.listingName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesProperty = filterProperty === "all" || review.listingId === parseInt(filterProperty);
      const matchesChannel = filterChannel === "all" || review.channel === filterChannel;
      
      const reviewRating = review.rating || 
        review.reviewCategory.reduce((acc, cat) => acc + cat.rating, 0) / review.reviewCategory.length;
      const matchesRating = 
        filterRating === "all" ||
        (filterRating === "5" && reviewRating >= 4.5) ||
        (filterRating === "4" && reviewRating >= 3.5 && reviewRating < 4.5) ||
        (filterRating === "3" && reviewRating < 3.5);
      
      const matchesStatus = 
        filterStatus === "all" ||
        (filterStatus === "published" && review.approved) ||
        (filterStatus === "pending" && !review.approved);

      const matchesCategory = 
        filterCategory === "all" || review.reviewCategory.some((c) => c.category === filterCategory);

      const d = new Date(review.submittedAt);
      const matchesStart = !startDate || d >= new Date(startDate);
      const matchesEnd = !endDate || d <= new Date(endDate);

      return matchesSearch && matchesProperty && matchesChannel && matchesRating && matchesStatus && matchesCategory && matchesStart && matchesEnd;
    });

    const sorted = [...base].sort((a, b) => {
      const ar = a.rating || a.reviewCategory.reduce((acc, c) => acc + c.rating, 0) / a.reviewCategory.length;
      const br = b.rating || b.reviewCategory.reduce((acc, c) => acc + c.rating, 0) / b.reviewCategory.length;
      const ad = new Date(a.submittedAt).getTime();
      const bd = new Date(b.submittedAt).getTime();
      if (sortBy === "rating_desc") return br - ar;
      if (sortBy === "rating_asc") return ar - br;
      if (sortBy === "date_asc") return ad - bd;
      return bd - ad;
    });
    return sorted;
  }, [reviews, searchTerm, filterProperty, filterChannel, filterRating, filterStatus, filterCategory, startDate, endDate, sortBy]);

  const stats = useMemo(() => {
    const totalReviews = reviews.length;
    const avgRating = reviews.reduce((acc, r) => {
      const rating = r.rating || r.reviewCategory.reduce((a, c) => a + c.rating, 0) / r.reviewCategory.length;
      return acc + rating;
    }, 0) / totalReviews;
    const publishedReviews = reviews.filter(r => r.approved).length;
    const recentReviews = reviews.filter(r => {
      const reviewDate = new Date(r.submittedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return reviewDate >= thirtyDaysAgo;
    }).length;

    return { totalReviews, avgRating, publishedReviews, recentReviews };
  }, [reviews]);

  const channels = [...new Set(mockReviews.map(r => r.channel))];
  const categories = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach((r) => r.reviewCategory.forEach((c) => set.add(c.category)));
    return Array.from(set);
  }, [reviews]);
  const monthTrends = useMemo(() => {
    const m = new Map<string, { count: number; sum: number }>();
    filteredReviews.forEach((r) => {
      const d = new Date(r.submittedAt);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      const rt = r.rating || r.reviewCategory.reduce((acc, c) => acc + c.rating, 0) / r.reviewCategory.length;
      const v = m.get(key) || { count: 0, sum: 0 };
      v.count += 1;
      v.sum += rt;
      m.set(key, v);
    });
    return Array.from(m.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6)
      .map(([month, v]) => ({ month, count: v.count, avg: v.sum / v.count }));
  }, [filteredReviews]);
  const categoryAverages = useMemo(() => {
    const acc: Record<string, { sum: number; count: number }> = {};
    filteredReviews.forEach((r) => {
      r.reviewCategory.forEach((c) => {
        const v = acc[c.category] || { sum: 0, count: 0 };
        v.sum += c.rating;
        v.count += 1;
        acc[c.category] = v;
      });
    });
    return Object.entries(acc)
      .map(([category, v]) => ({ category, avg: v.count ? v.sum / v.count : 0 }))
      .sort((a, b) => a.avg - b.avg);
  }, [filteredReviews]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Reviews Dashboard</h1>
              <p className="text-muted-foreground mt-1">Manage and monitor your property reviews</p>
            </div>
            <Link to="/">
              <Button variant="outline">View Public Site</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={MessageSquare}
            trend={{ value: 12, label: "vs last month" }}
          />
          <StatsCard
            title="Average Rating"
            value={stats.avgRating.toFixed(1)}
            icon={Star}
            trend={{ value: 5, label: "vs last month" }}
          />
          <StatsCard
            title="Published Reviews"
            value={stats.publishedReviews}
            icon={Award}
          />
          <StatsCard
            title="Recent (30d)"
            value={stats.recentReviews}
            icon={TrendingUp}
            trend={{ value: 8, label: "vs previous 30d" }}
          />
        </div>

        {/* Filters */}
        <div className="bg-card rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lg:col-span-2"
            />
            
            <Select value={filterProperty} onValueChange={setFilterProperty}>
              <SelectTrigger>
                <SelectValue placeholder="All Properties" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Properties</SelectItem>
                {properties.map((prop) => (
                  <SelectItem key={prop.id} value={prop.id.toString()}>
                    {prop.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterChannel} onValueChange={setFilterChannel}>
              <SelectTrigger>
                <SelectValue placeholder="All Channels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Channels</SelectItem>
                {channels.map((channel) => (
                  <SelectItem key={channel} value={channel}>
                    {channel}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterRating} onValueChange={setFilterRating}>
              <SelectTrigger>
                <SelectValue placeholder="All Ratings" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">★ 4.5 - 5.0</SelectItem>
                <SelectItem value="4">★ 3.5 - 4.4</SelectItem>
                <SelectItem value="3">★ Below 3.5</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date_desc">Newest First</SelectItem>
                <SelectItem value="date_asc">Oldest First</SelectItem>
                <SelectItem value="rating_desc">Rating High→Low</SelectItem>
                <SelectItem value="rating_asc">Rating Low→High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Insights</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Recurring Issues</h3>
              <div className="grid gap-2">
                {categoryAverages.slice(0, 4).map((c) => (
                  <div key={c.category} className="flex items-center justify-between">
                    <span className="capitalize">{c.category}</span>
                    <span className="text-sm">{c.avg.toFixed(1)}★</span>
                  </div>
                ))}
                {categoryAverages.length === 0 && (
                  <p className="text-muted-foreground">No categories available</p>
                )}
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Last 6 Months</h3>
              <div className="grid gap-2">
                {monthTrends.map((m) => (
                  <div key={m.month} className="flex items-center justify-between">
                    <span>{m.month}</span>
                    <span className="text-sm">{m.count} • {m.avg.toFixed(1)}★</span>
                  </div>
                ))}
                {monthTrends.length === 0 && (
                  <p className="text-muted-foreground">No recent reviews</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {filteredReviews.length} {filteredReviews.length === 1 ? "Review" : "Reviews"}
            </h2>
          </div>

          <div className="grid gap-4">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onApprovalToggle={handleApprovalToggle}
              />
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No reviews match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
