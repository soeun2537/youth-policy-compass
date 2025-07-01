
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Bell, User, TrendingUp, MapPin, Clock, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const isMobile = useIsMobile();

  // 추천 정책 데이터 (실제로는 API에서 가져올 데이터)
  const recommendedPolicies = [
    {
      id: 1,
      title: "청년 디지털 일자리 사업",
      category: "취업지원",
      institution: "과학기술정보통신부",
      deadline: "2025-01-31",
      tags: ["IT", "교육지원", "취업"],
      summary: "청년층 대상 디지털 분야 직업훈련 및 취업 연계 프로그램",
      isNew: true,
      liked: false
    },
    {
      id: 2,
      title: "청년 주택드림 청약통장",
      category: "주거지원",
      institution: "국토교통부",
      deadline: "상시모집",
      tags: ["주택", "청약", "저축"],
      summary: "청년층 대상 주택 마련을 위한 우대금리 청약저축",
      isNew: false,
      liked: true
    },
    {
      id: 3,
      title: "K-스타트업 그랜드 챌린지",
      category: "창업지원",
      institution: "중소벤처기업부",
      deadline: "2025-02-15",
      tags: ["창업", "투자", "멘토링"],
      summary: "혁신 아이디어를 가진 청년 창업가 대상 사업화 지원",
      isNew: true,
      liked: false
    }
  ];

  const quickCategories = [
    { name: "취업지원", icon: "💼", count: 127 },
    { name: "주거지원", icon: "🏠", count: 84 },
    { name: "창업지원", icon: "🚀", count: 56 },
    { name: "교육지원", icon: "📚", count: 93 },
    { name: "생활지원", icon: "💡", count: 71 },
    { name: "문화/여가", icon: "🎭", count: 42 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">청년정책 찾기</h1>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                알림
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                찜목록
              </Button>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                프로필 설정
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4">
            나에게 맞는 청년정책을<br />쉽고 빠르게 찾아보세요
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            복잡한 정책 정보를 한 곳에서, 맞춤형 추천으로 더 간편하게
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="관심있는 정책을 검색해보세요 (예: 청년 주택, 취업지원)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg bg-white text-gray-900 rounded-xl shadow-lg border-0 focus:ring-2 focus:ring-blue-400"
              />
              <Button 
                size="lg" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-lg"
              >
                검색
              </Button>
            </div>
          </div>

          {/* Quick Categories */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {quickCategories.map((category) => (
              <Button
                key={category.name}
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-full"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <Badge variant="secondary" className="ml-2 bg-white/20 text-white">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">473</div>
              <div className="text-gray-600">등록된 정책 수</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">12,847</div>
              <div className="text-gray-600">이용자 수</div>
            </CardContent>
          </Card>
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">89%</div>
              <div className="text-gray-600">만족도</div>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Policies */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">맞춤 추천 정책</h3>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              전체보기
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {recommendedPolicies.map((policy) => (
              <Card key={policy.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge 
                          variant={policy.category === '취업지원' ? 'default' : 
                                 policy.category === '주거지원' ? 'secondary' : 'outline'}
                          className="text-xs"
                        >
                          {policy.category}
                        </Badge>
                        {policy.isNew && (
                          <Badge variant="destructive" className="text-xs">NEW</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                        {policy.title}
                      </CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`shrink-0 ${policy.liked ? 'text-red-500' : 'text-gray-400'}`}
                    >
                      <Heart className={`h-4 w-4 ${policy.liked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {policy.summary}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      {policy.institution}
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      {policy.deadline === '상시모집' ? (
                        <span className="text-green-600 font-medium">상시모집</span>
                      ) : (
                        <span>마감: {policy.deadline}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {policy.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 group-hover:bg-blue-600 transition-colors">
                    자세히 보기
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quick Access */}
        <section className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">빠른 접근</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">🎯</div>
                <h4 className="font-semibold mb-2 group-hover:text-blue-600">맞춤 진단</h4>
                <p className="text-sm text-gray-600">나에게 맞는 정책 찾기</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">📊</div>
                <h4 className="font-semibold mb-2 group-hover:text-blue-600">신청 현황</h4>
                <p className="text-sm text-gray-600">내 신청 내역 확인</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">💬</div>
                <h4 className="font-semibold mb-2 group-hover:text-blue-600">후기 게시판</h4>
                <p className="text-sm text-gray-600">실제 후기와 정보 공유</p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">❓</div>
                <h4 className="font-semibold mb-2 group-hover:text-blue-600">FAQ</h4>
                <p className="text-sm text-gray-600">자주 묻는 질문</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="mb-2">청년 지원 정책 찾기 서비스</p>
            <p className="text-sm">정확하고 신뢰할 수 있는 정책 정보를 제공합니다</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
