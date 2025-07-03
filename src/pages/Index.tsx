import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Search, Filter, User, Bell, MessageSquare, BookOpen, HelpCircle, MapPin, Clock, ExternalLink, Timer, BarChart3 } from "lucide-react";
import { allPolicies } from "../lib/allPolicies";
import { getCategoryColor } from "../lib/categoryColors.ts";
import PolicyCard from "../components/PolicyCard";

const Index = () => {
  const [policies, setPolicies] = useState(allPolicies);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const navigate = useNavigate();

  const categories = ["전체", ...Array.from(new Set(allPolicies.map((policy) => policy.category)))];

  useEffect(() => {
    let filteredPolicies = allPolicies;

    if (searchQuery) {
      filteredPolicies = filteredPolicies.filter((policy) =>
        policy.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== "전체") {
      filteredPolicies = filteredPolicies.filter(
        (policy) => policy.category === selectedCategory
      );
    }

    setPolicies(filteredPolicies);
  }, [searchQuery, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FBFF' }}>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">청년정책 플랫폼</h1>
            </div>
            <nav className="flex space-x-4">
              <Button variant="ghost" onClick={() => navigate("/favorites")}>
                <Heart className="h-4 w-4 mr-2" />
                찜한 정책
              </Button>
              <Button variant="ghost" onClick={() => navigate("/notifications")}>
                <Bell className="h-4 w-4 mr-2" />
                알림 신청
              </Button>
              <Button variant="ghost" onClick={() => navigate("/diagnosis")}>
                <User className="h-4 w-4 mr-2" />
                맞춤 진단
              </Button>
              <Button variant="ghost" onClick={() => navigate("/reviews")}>
                <MessageSquare className="h-4 w-4 mr-2" />
                후기
              </Button>
              <Button variant="ghost" onClick={() => navigate("/dictionary")}>
                <BookOpen className="h-4 w-4 mr-2" />
                용어사전
              </Button>
              <Button variant="ghost" onClick={() => navigate("/statistics")}>
                <BarChart3 className="h-4 w-4 mr-2" />
                통계
              </Button>
              <Button variant="ghost" onClick={() => navigate("/faq")}>
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQ
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="relative w-full max-w-md">
            <Input
              type="text"
              placeholder="정책 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <Button variant="outline" onClick={() => setIsFilterOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            필터
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      </main>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>필터 설정</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-3 gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => handleCategoryChange(category)}
                  className="text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
