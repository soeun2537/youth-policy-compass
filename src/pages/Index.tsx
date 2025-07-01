
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Heart, Bell, User, TrendingUp, MapPin, Clock, Star } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPolicies, setFilteredPolicies] = useState<any[]>([]);
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
    },
    {
      id: 13,
      title: "청년 해외진출 지원사업",
      category: "취업지원",
      institution: "외교부",
      deadline: "2025-01-25",
      tags: ["해외취업", "글로벌", "연수"],
      summary: "청년의 해외진출 역량강화 및 글로벌 일자리 창출 지원",
      isNew: true,
      liked: false
    },
    {
      id: 14,
      title: "청년도약계좌",
      category: "생활지원",
      institution: "기획재정부",
      deadline: "상시모집",
      tags: ["저축", "자산형성", "우대금리"],
      summary: "청년층의 중장기 자산형성을 위한 우대금리 적용 저축상품",
      isNew: false,
      liked: true
    },
    {
      id: 15,
      title: "청년 전용 전세자금대출",
      category: "주거지원",
      institution: "주택금융공사",
      deadline: "상시모집",
      tags: ["전세", "대출", "주택"],
      summary: "청년층의 주거안정을 위한 전용 전세자금 대출상품",
      isNew: false,
      liked: false
    },
    {
      id: 16,
      title: "지역주도형 청년일자리 사업",
      category: "취업지원",
      institution: "행정안전부",
      deadline: "2025-02-10",
      tags: ["지역일자리", "청년", "취업"],
      summary: "지역 특성을 반영한 청년 일자리 창출 및 정착 지원",
      isNew: false,
      liked: false
    },
    {
      id: 17,
      title: "청년 소상공인 창업지원",
      category: "창업지원",
      institution: "소상공인시장진흥공단",
      deadline: "2025-03-05",
      tags: ["소상공인", "창업자금", "컨설팅"],
      summary: "청년 소상공인의 성공적인 창업을 위한 자금 및 컨설팅 지원",
      isNew: true,
      liked: false
    },
    {
      id: 18,
      title: "청년 문화누리카드",
      category: "문화/여가",
      institution: "문화체육관광부",
      deadline: "상시모집",
      tags: ["문화", "여가", "바우처"],
      summary: "청년층의 문화향유 기회 확대를 위한 문화바우처 지원",
      isNew: false,
      liked: false
    },
    {
      id: 19,
      title: "청년 건강검진 지원",
      category: "생활지원",
      institution: "보건복지부",
      deadline: "2025-01-30",
      tags: ["건강검진", "의료", "예방"],
      summary: "청년층의 건강관리 및 질병예방을 위한 건강검진비 지원",
      isNew: true,
      liked: true
    },
    {
      id: 20,
      title: "청년 스마트팜 창업지원",
      category: "창업지원",
      institution: "농림축산식품부",
      deadline: "2025-02-25",
      tags: ["스마트팜", "농업기술", "창업"],
      summary: "스마트팜 기술을 활용한 청년 농업 창업 지원 프로그램",
      isNew: false,
      liked: false
    },
    {
      id: 21,
      title: "청년 공공임대주택 특별공급",
      category: "주거지원",
      institution: "LH공사",
      deadline: "2025-01-18",
      tags: ["공공임대", "주택", "특별공급"],
      summary: "청년층 대상 공공임대주택 우선 공급 및 입주 지원",
      isNew: true,
      liked: false
    },
    {
      id: 22,
      title: "청년 평생학습계좌제",
      category: "교육지원",
      institution: "교육부",
      deadline: "상시모집",
      tags: ["평생학습", "교육비", "학습이력"],
      summary: "청년의 지속적인 학습을 위한 교육비 지원 및 학습이력 관리",
      isNew: false,
      liked: false
    },
    {
      id: 23,
      title: "청년 사회적기업 인턴지원",
      category: "취업지원",
      institution: "고용노동부",
      deadline: "2025-02-05",
      tags: ["사회적기업", "인턴", "경험"],
      summary: "사회적기업에서의 청년 인턴십 경험 및 정규직 전환 지원",
      isNew: true,
      liked: false
    },
    {
      id: 24,
      title: "청년 디지털 역량강화 교육",
      category: "교육지원",
      institution: "과학기술정보통신부",
      deadline: "2025-03-20",
      tags: ["디지털", "교육", "역량강화"],
      summary: "4차 산업혁명 시대 청년의 디지털 역량 향상을 위한 교육 지원",
      isNew: false,
      liked: true
    },
    {
      id: 25,
      title: "청년 환경보호 활동 지원",
      category: "문화/여가",
      institution: "환경부",
      deadline: "2025-01-22",
      tags: ["환경", "봉사", "활동비"],
      summary: "청년의 환경보호 활동 참여 및 관련 역량 개발 지원",
      isNew: true,
      liked: false
    },
    {
      id: 26,
      title: "청년 마케팅 스킬업 프로그램",
      category: "교육지원",
      institution: "중소벤처기업부",
      deadline: "2025-02-12",
      tags: ["마케팅", "스킬업", "실무"],
      summary: "청년의 마케팅 실무 역량 강화를 위한 전문교육 프로그램",
      isNew: false,
      liked: false
    },
    {
      id: 27,
      title: "청년 국제교류 프로그램",
      category: "문화/여가",
      institution: "외교부",
      deadline: "2025-01-28",
      tags: ["국제교류", "문화체험", "해외"],
      summary: "청년의 글로벌 감각 향상을 위한 국제교류 및 문화체험 지원",
      isNew: true,
      liked: false
    },
    {
      id: 28,
      title: "청년 자격증 취득 지원",
      category: "교육지원",
      institution: "고용노동부",
      deadline: "상시모집",
      tags: ["자격증", "취득비", "교육"],
      summary: "청년의 취업 경쟁력 향상을 위한 자격증 취득비 지원",
      isNew: false,
      liked: true
    },
    {
      id: 29,
      title: "청년 1인가구 생활용품 지원",
      category: "생활지원",
      institution: "여성가족부",
      deadline: "2025-02-08",
      tags: ["1인가구", "생활용품", "독립"],
      summary: "독립을 시작하는 청년 1인가구의 생활안정을 위한 생활용품 지원",
      isNew: true,
      liked: false
    },
    {
      id: 30,
      title: "청년 심리상담 지원서비스",
      category: "생활지원",
      institution: "보건복지부",
      deadline: "상시모집",
      tags: ["심리상담", "정신건강", "지원"],
      summary: "청년의 정신건강 증진을 위한 전문 심리상담 서비스 제공",
      isNew: false,
      liked: false
    }
  ];

  // 검색 함수
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredPolicies([]);
      return;
    }

    const filtered = allPolicies.filter(policy => {
      const searchText = searchQuery.toLowerCase();
      
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 추천 정책 (기본 3개)
  const recommendedPolicies = allPolicies.slice(0, 3);

  // 표시할 정책 목록 결정
  const displayPolicies = filteredPolicies.length > 0 ? filteredPolicies : recommendedPolicies;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '취업지원': return 'bg-blue-100 text-blue-800';
      case '주거지원': return 'bg-green-100 text-green-800';
      case '창업지원': return 'bg-purple-100 text-purple-800';
      case '교육지원': return 'bg-orange-100 text-orange-800';
      case '생활지원': return 'bg-gray-100 text-gray-800';
      case '문화/여가': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="관심있는 정책을 검색해보세요 (예: 청년 주택, 취업지원)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-12 pr-20 py-3 text-base rounded-xl border-2 focus:border-blue-500 text-gray-900"
              />
              <Button 
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg"
              >
                검색
              </Button>
            </div>
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
              <Card key={policy.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-xs ${getCategoryColor(policy.category)}`}>
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
                  <p className="text-gray-600 text-sm mb-4">
                    {policy.summary}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2 shrink-0" />
                      <span className="truncate">{policy.institution}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2 shrink-0" />
                      {policy.deadline === '상시모집' ? (
                        <span className="text-green-600 font-medium">상시모집</span>
                      ) : (
                        <span>마감: {policy.deadline}</span>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {policy.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {policy.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{policy.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <Button className="w-full group-hover:bg-blue-600 transition-colors">
                      자세히 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
