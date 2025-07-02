import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Bell, User, TrendingUp, MapPin, Clock, Bot } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SearchBar from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { allPolicies } from "../lib/allPolicies";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<any[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { likedPolicyIds, handleLike } = useFavorites();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const quickFilters = [
    "취업지원", "주거지원", "창업지원", "교육지원", "생활지원", "문화/여가"
  ];
  const [profile, setProfile] = useState({ name: "", email: "", bio: "", interest: [] as string[] });

  const [notiPolicyIds, setNotiPolicyIds] = useState<string[]>([]);
  useEffect(() => {
    const saved = localStorage.getItem("notiPolicyIds");
    if (saved) setNotiPolicyIds(JSON.parse(saved));
  }, []);
  const handleNoti = (id: string) => {
    if (!notiPolicyIds.includes(id)) {
      const updated = [...notiPolicyIds, id];
      setNotiPolicyIds(updated);
      localStorage.setItem("notiPolicyIds", JSON.stringify(updated));
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile({
        name: parsed.name || "",
        email: parsed.email || "",
        bio: parsed.bio || "",
        interest: Array.isArray(parsed.interest) ? parsed.interest : []
      });
    }
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setShowProfileModal(false);
  };

  // 검색 및 필터링 함수
  const applyFilters = (query: string, filters: string[]) => {
    let filtered = allPolicies;

    // 검색어 필터링
    if (query.trim()) {
      const searchText = query.toLowerCase();
      filtered = filtered.filter(policy => {
        const titleMatch = policy.title.toLowerCase().includes(searchText);
        const summaryMatch = policy.summary.toLowerCase().includes(searchText);
        const tagsMatch = policy.tags.some(tag => tag.toLowerCase().includes(searchText));
        const institutionMatch = policy.institution.toLowerCase().includes(searchText);
        const categoryMatch = policy.category.toLowerCase().includes(searchText);

        return titleMatch || summaryMatch || tagsMatch || institutionMatch || categoryMatch;
      });
    }

    // 카테고리 필터링
    if (filters.length > 0) {
      filtered = filtered.filter(policy => filters.includes(policy.category));
    }

    setFilteredPolicies(filtered);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, activeFilters);
  };

  const handleFilterChange = (filters: string[]) => {
    setActiveFilters(filters);
    applyFilters(searchQuery, filters);
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
              <Button variant="ghost" size="sm" onClick={() => navigate("/diagnosis")}>
                <Bot className="h-4 w-4 mr-2" />
                AI 진단
              </Button>
              <Button variant="ghost" size="sm" onClick={() => navigate("/notifications")}>
                <Bell className="h-4 w-4 mr-2" />
                알림
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/favorites")}
              >
                <Heart className="h-4 w-4 mr-2" />
                찜목록
              </Button>
              <Button variant="outline" size="sm" onClick={() => setShowProfileModal(true)}>
                <User className="h-4 w-4 mr-2" />
                프로필 설정
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 w-full h-full z-0"
          style={{
            background: "linear-gradient(110deg, #2563eb 0%, #4f46e5 35%, #7c3aed 65%, #a78bfa 100%)",
            opacity: 0.97,
            filter: "blur(0px)",
          }}
        />
        <div className="absolute inset-0 w-full h-full z-0"
          style={{
            background: "radial-gradient(circle at 70% 30%, rgba(255,255,255,0.10) 0%, transparent 70%)"
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-4 drop-shadow-lg text-white">
            나에게 맞는 청년정책을<br />쉽고 빠르게 찾아보세요
          </h2>
          <p className="text-xl mb-8 drop-shadow text-white">
            복잡한 정책 정보를 한 곳에서, 맞춤형 추천으로 더 간편하게
          </p>
          
          {/* Search Bar with Filters */}
          <div className="max-w-4xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              placeholder="관심있는 정책을 검색해보세요 (예: 청년 주택, 취업지원)"
              showQuickFilters={true}
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
            <Button variant="outline" onClick={() => {
              setFilteredPolicies(allPolicies);
              setSearchQuery("");
              setActiveFilters([]);
            }}>
              <TrendingUp className="h-4 w-4 mr-2" />
              전체보기
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                      className={`shrink-0 ${likedPolicyIds.includes(policy.id) ? 'text-red-500' : 'text-gray-400'}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(policy.id);
                      }}
                    >
                      <Heart className={`h-4 w-4 ${likedPolicyIds.includes(policy.id) ? 'fill-current' : ''}`} />
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
                    
                    <Button className="w-full group-hover:bg-blue-600 transition-colors" onClick={() => setSelectedPolicy(policy)}>
                      자세히 보기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredPolicies.length === 0 && (searchQuery.trim() || activeFilters.length > 0) && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
              <p className="text-gray-400 text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
            </div>
          )}
        </section>

        {/* Quick Access - 검색/필터 결과가 없을 때만 표시 */}
        {filteredPolicies.length === 0 && !searchQuery.trim() && activeFilters.length === 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">빠른 접근</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/diagnosis")}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">🤖</div>
                  <h4 className="font-semibold mb-2 group-hover:text-blue-600">AI 맞춤 진단</h4>
                  <p className="text-sm text-gray-600">AI와 대화하며 맞춤 정책 찾기</p>
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

        {/* 정책 상세 모달 */}
        {selectedPolicy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setSelectedPolicy(null)}
                aria-label="닫기"
              >
                ×
              </button>
              <div className="mb-4 flex items-center gap-2">
                <Badge className={`text-xs ${getCategoryColor(selectedPolicy.category)}`}>{selectedPolicy.category}</Badge>
                {selectedPolicy.isNew && <Badge variant="destructive" className="text-xs">NEW</Badge>}
              </div>
              <h2 className="text-2xl font-bold mb-2">{selectedPolicy.title}</h2>
              <div className="text-gray-600 mb-4">{selectedPolicy.summary}</div>
              <div className="mb-2 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2 shrink-0" />
                <span>{selectedPolicy.institution}</span>
              </div>
              <div className="mb-2 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2 shrink-0" />
                {selectedPolicy.deadline === '상시모집' ? (
                  <span className="text-green-600 font-medium">상시모집</span>
                ) : (
                  <span>마감: {selectedPolicy.deadline}</span>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedPolicy.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-6">
                <a
                  href={selectedPolicy.url || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg py-2 text-center font-semibold transition"
                >
                  바로가기
                </a>
                <button
                  className={`flex-1 rounded-lg py-2 font-semibold transition ${notiPolicyIds.includes(selectedPolicy.id) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  onClick={() => handleNoti(selectedPolicy.id)}
                  disabled={notiPolicyIds.includes(selectedPolicy.id)}
                >
                  {notiPolicyIds.includes(selectedPolicy.id) ? '알림 신청됨' : '알림 받기'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 프로필 설정 모달 */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 relative animate-fade-in">
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
                onClick={() => setShowProfileModal(false)}
                aria-label="닫기"
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4">프로필 설정</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">이름</label>
                  <input
                    type="text"
                    name="name"
                    value={profile.name}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이름을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">이메일</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이메일을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">관심 분야</label>
                  <div className="flex flex-wrap gap-2">
                    {quickFilters.map((cat) => (
                      <label key={cat} className={`flex items-center gap-1 px-3 py-2 rounded-xl border-2 cursor-pointer text-base font-semibold transition ${profile.interest.includes(cat) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'}`}>
                        <input
                          type="checkbox"
                          name="interest"
                          value={cat}
                          checked={profile.interest.includes(cat)}
                          onChange={e => {
                            setProfile(prev => ({
                              ...prev,
                              interest: e.target.checked
                                ? [...prev.interest, cat]
                                : prev.interest.filter((v: string) => v !== cat)
                            }));
                          }}
                          className="accent-blue-600 mr-1"
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">자기소개</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="간단한 자기소개를 입력하세요"
                    rows={3}
                  />
                </div>
                <button
                  className="w-full bg-blue-600 text-white rounded-lg py-2 font-semibold hover:bg-blue-700 transition"
                  onClick={handleProfileSave}
                >
                  저장하기
                </button>
              </div>
            </div>
          </div>
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
