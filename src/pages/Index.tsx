
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Bell, User, TrendingUp, MapPin, Clock, Star } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import SearchBar from "@/components/SearchBar";
import PolicyCard from "@/components/PolicyCard";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPolicies, setFilteredPolicies] = useState<any[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const isMobile = useIsMobile();

  // 확장된 목업 데이터
  const allPolicies = [
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
    },
    {
      id: 4,
      title: "청년 취업 성공 패키지",
      category: "취업지원",
      institution: "고용노동부",
      deadline: "2025-03-30",
      tags: ["취업", "구직활동", "상담"],
      summary: "개인별 취업 역량에 따른 단계별 취업지원 서비스",
      isNew: false,
      liked: false
    },
    {
      id: 5,
      title: "청년 월세 한시 특별지원",
      category: "주거지원",
      institution: "국토교통부",
      deadline: "2025-01-15",
      tags: ["월세", "주거", "지원금"],
      summary: "청년 월세 부담 완화를 위한 월세 지원금 제공",
      isNew: true,
      liked: true
    },
    {
      id: 6,
      title: "청년 내일채움공제",
      category: "취업지원",
      institution: "고용노동부",
      deadline: "상시모집",
      tags: ["정규직", "장기근속", "적립"],
      summary: "중소기업 정규직 취업 청년의 장기근속과 목돈 마련 지원",
      isNew: false,
      liked: false
    },
    {
      id: 7,
      title: "청년 창업사관학교",
      category: "창업지원",
      institution: "중소벤처기업부",
      deadline: "2025-02-28",
      tags: ["창업교육", "인큐베이팅", "네트워킹"],
      summary: "체계적인 창업교육과 멘토링을 통한 성공 창업 지원",
      isNew: false,
      liked: false
    },
    {
      id: 8,
      title: "K-학자금 든든학자금",
      category: "교육지원",
      institution: "한국장학재단",
      deadline: "2025-02-20",
      tags: ["학자금", "대출", "저금리"],
      summary: "대학생 및 대학원생 대상 저금리 학자금 대출 지원",
      isNew: false,
      liked: false
    },
    {
      id: 9,
      title: "청년 문화예술 활동 지원",
      category: "문화/여가",
      institution: "문화체육관광부",
      deadline: "2025-01-20",
      tags: ["문화", "예술", "활동비"],
      summary: "청년 문화예술인의 창작활동 및 역량강화 지원",
      isNew: true,
      liked: false
    },
    {
      id: 10,
      title: "청년 생활안정자금 대출",
      category: "생활지원",
      institution: "서울시",
      deadline: "상시모집",
      tags: ["생활자금", "대출", "저금리"],
      summary: "청년의 생활안정을 위한 저금리 생활자금 대출",
      isNew: false,
      liked: true
    },
    {
      id: 11,
      title: "청년 농업인 정착지원",
      category: "창업지원",
      institution: "농림축산식품부",
      deadline: "2025-03-15",
      tags: ["농업", "정착", "창업"],
      summary: "청년 농업인의 안정적 농업 정착을 위한 종합 지원",
      isNew: false,
      liked: false
    },
    {
      id: 12,
      title: "청년 직업훈련 생계비 지원",
      category: "교육지원",
      institution: "고용노동부",
      deadline: "2025-04-30",
      tags: ["직업훈련", "생계비", "교육"],
      summary: "직업훈련 참여 청년의 생계비 부담 완화 지원",
      isNew: true,
      liked: false
    }
  ];

  // 검색 함수
  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredPolicies([]);
      return;
    }

    const filtered = allPolicies.filter(policy => {
      const searchText = query.toLowerCase();
      
      // 제목, 요약, 태그, 기관명에서 검색
      const titleMatch = policy.title.toLowerCase().includes(searchText);
      const summaryMatch = policy.summary.toLowerCase().includes(searchText);
      const tagsMatch = policy.tags.some(tag => tag.toLowerCase().includes(searchText));
      const institutionMatch = policy.institution.toLowerCase().includes(searchText);
      const categoryMatch = policy.category.toLowerCase().includes(searchText);

      return titleMatch || summaryMatch || tagsMatch || institutionMatch || categoryMatch;
    });

    setFilteredPolicies(filtered);
  };

  // 필터 변경 함수
  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    
    if (filters.length === 0) {
      // 필터가 없으면 검색 결과만 보여줌
      if (searchQuery.trim()) {
        handleSearch(searchQuery);
      } else {
        setFilteredPolicies([]);
      }
      return;
    }

    // 현재 정책 목록에서 필터링
    const currentPolicies = searchQuery.trim() ? filteredPolicies : allPolicies;
    const filtered = currentPolicies.filter(policy => 
      filters.includes(policy.category)
    );
    
    setFilteredPolicies(filtered);
  };

  // 추천 정책 (기본 3개)
  const recommendedPolicies = allPolicies.slice(0, 3);

  // 표시할 정책 목록 결정
  const displayPolicies = filteredPolicies.length > 0 ? filteredPolicies : recommendedPolicies;

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
          <div className="max-w-2xl mx-auto">
            <SearchBar 
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              placeholder="관심있는 정책을 검색해보세요 (예: 청년 주택, 취업지원)"
            />
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

        {/* Policy Results */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {filteredPolicies.length > 0 ? 
                `검색 결과 (${filteredPolicies.length}개)` : 
                "맞춤 추천 정책"
              }
            </h3>
            <Button variant="outline">
              <TrendingUp className="h-4 w-4 mr-2" />
              전체보기
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayPolicies.map((policy) => (
              <PolicyCard 
                key={policy.id} 
                policy={policy}
                onLike={(id) => console.log('Liked policy:', id)}
                onView={(id) => console.log('View policy:', id)}
              />
            ))}
          </div>

          {filteredPolicies.length === 0 && searchQuery.trim() && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">다른 검색어로 시도해보세요.</p>
            </div>
          )}
        </section>

        {/* Quick Access - 검색 결과가 없을 때만 표시 */}
        {filteredPolicies.length === 0 && (
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
        )}
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
