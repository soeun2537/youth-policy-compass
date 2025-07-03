import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Clock, Timer, Heart, Bell, Target } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import SearchBar from "@/components/SearchBar";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { allPolicies } from "../lib/allPolicies";
import { CATEGORIES, getCategoryColor } from "../lib/categoryColors.ts";
import PolicyCard from "../components/PolicyCard";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [filteredPolicies, setFilteredPolicies] = useState<any[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const { likedPolicyIds, handleLike } = useFavorites();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditTimeModal, setShowEditTimeModal] = useState(false);
  const [editingTime, setEditingTime] = useState("");
  const [profile, setProfile] = useState({ name: "", email: "", bio: "", interest: [] as string[], birth: "", region: "", job: "", income: "", marital: "", family: "" });

  const [notiPolicyIds, setNotiPolicyIds] = useState<string[]>([]);
  const [policyTimes, setPolicyTimes] = useState<{[key: string]: string}>({});

  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("notiPolicyIds");
    if (saved) setNotiPolicyIds(JSON.parse(saved));

    const savedTimes = localStorage.getItem("policyTimes");
    if (savedTimes) setPolicyTimes(JSON.parse(savedTimes));
  }, []);

  const handleNoti = (id: string) => {
    if (!notiPolicyIds.includes(id)) {
      const updated = [...notiPolicyIds, id];
      setNotiPolicyIds(updated);
      localStorage.setItem("notiPolicyIds", JSON.stringify(updated));
    }
  };

  const handleNotiCancel = (id: string) => {
    const updated = notiPolicyIds.filter(pid => pid !== id);
    setNotiPolicyIds(updated);
    localStorage.setItem("notiPolicyIds", JSON.stringify(updated));
  };

  const handleTimeEdit = (time: string) => {
    if (selectedPolicy) {
      const updated = { ...policyTimes, [selectedPolicy.id]: time };
      setPolicyTimes(updated);
      localStorage.setItem("policyTimes", JSON.stringify(updated));
      setShowEditTimeModal(false);
      setEditingTime("");
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
        interest: Array.isArray(parsed.interest) ? parsed.interest : [],
        birth: parsed.birth || "",
        region: parsed.region || "",
        job: parsed.job || "",
        income: parsed.income || "",
        marital: parsed.marital || "",
        family: parsed.family || ""
      });
    }
  }, []);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSave = () => {
    localStorage.setItem("userProfile", JSON.stringify(profile));
    setShowProfileModal(false);
  };

  const applyFilters = (query: string, filters: string[]) => {
    let filtered = allPolicies;

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
    setShowAll(false);
    applyFilters(searchQuery, filters);
  };

  const getSimilarUsersPolicies = () => {
    if (!profile.interest.length && !profile.job && !profile.income) {
      return allPolicies.slice(0, 3);
    }

    let scored = allPolicies.map(policy => {
      let score = 0;
      
      // 관심 분야 매칭
      if (profile.interest.length > 0 && profile.interest.includes(policy.category)) {
        score += 3;
      }
      
      // 직업 상태별 추천
      if (profile.job === "학생" && policy.tags.some(tag => tag.includes("학생") || tag.includes("대학"))) {
        score += 2;
      }
      if (profile.job === "구직" && policy.category === "취업지원") {
        score += 2;
      }
      
      // 소득 수준별 추천
      if (profile.income === "low" && policy.tags.some(tag => tag.includes("저소득") || tag.includes("지원"))) {
        score += 2;
      }
      
      return { ...policy, score };
    });

    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 4);
  };

  function sortByDeadline(policies: any[]) {
    return policies.slice().sort((a, b) => {
      // '상시모집'은 항상 마지막
      if (a.deadline === '상시모집' && b.deadline !== '상시모집') return 1;
      if (b.deadline === '상시모집' && a.deadline !== '상시모집') return -1;
      if (a.deadline === '상시모집' && b.deadline === '상시모집') return 0;
      // 날짜 비교
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }

  const recommendedPolicies = sortByDeadline(allPolicies.slice(0, 3));
  const similarUsersPolicies = sortByDeadline(getSimilarUsersPolicies());
  const displayPolicies = sortByDeadline(filteredPolicies.length > 0 ? filteredPolicies : recommendedPolicies);

  const getPolicyWithTime = (policy: any) => ({
    ...policy,
    estimatedTime: policyTimes[policy.id] || policy.estimatedTime,
    liked: likedPolicyIds.includes(policy.id),
    likeCount: typeof policy.likeCount === 'number' ? policy.likeCount : (likeCountMap[policy.id] || 0),
    applicationCount: typeof policy.applicationCount === 'number' ? policy.applicationCount : (notiCountMap[policy.id] || 0)
  });

  // 정책별 찜/알림 신청 카운트 계산
  const likeCountMap = useMemo(() => {
    const map: Record<number, number> = {};
    allPolicies.forEach(p => { map[p.id] = 0; });
    const saved = localStorage.getItem("likedPolicyIds");
    if (saved) {
      JSON.parse(saved).forEach((id: number) => {
        if (map[id] !== undefined) map[id] += 1;
      });
    }
    return map;
  }, [allPolicies]);
  const notiCountMap = useMemo(() => {
    const map: Record<number, number> = {};
    allPolicies.forEach(p => { map[p.id] = 0; });
    const saved = localStorage.getItem("notiPolicyIds");
    if (saved) {
      JSON.parse(saved).forEach((id: number) => {
        if (map[id] !== undefined) map[id] += 1;
      });
    }
    return map;
  }, [allPolicies]);

  const [sortType, setSortType] = useState<'default'|'like'|'noti'>("default");

  // 정렬 적용
  const sortedDisplayPolicies = useMemo(() => {
    let arr = [...displayPolicies];
    // 전체보기 아닐 때는 마감된 정책 제외
    if (!showAll) {
      const today = new Date(new Date().toISOString().slice(0,10));
      arr = arr.filter(p => p.deadline === '상시모집' || new Date(p.deadline) >= today);
    }
    if (sortType === 'like') {
      arr.sort((a, b) => {
        const aLike = typeof a.likeCount === 'number' ? a.likeCount : (likeCountMap[a.id] || 0);
        const bLike = typeof b.likeCount === 'number' ? b.likeCount : (likeCountMap[b.id] || 0);
        return bLike - aLike;
      });
    } else if (sortType === 'noti') {
      arr.sort((a, b) => {
        const aNoti = typeof a.applicationCount === 'number' ? a.applicationCount : (notiCountMap[a.id] || 0);
        const bNoti = typeof b.applicationCount === 'number' ? b.applicationCount : (notiCountMap[b.id] || 0);
        return bNoti - aNoti;
      });
    }
    return arr;
  }, [displayPolicies, sortType, likeCountMap, notiCountMap, showAll]);

  const handleAllViewToggle = () => {
    if (showAll) {
      setFilteredPolicies([]);
      setSearchQuery("");
      setActiveFilters([]);
    } else {
      setFilteredPolicies(allPolicies);
      setSearchQuery("");
      setActiveFilters([]);
    }
    setShowAll(!showAll);
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FBFF' }}>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold" style={{ color: '#2463EB' }}>청년정책포털</h1>
            </div>
            <nav className="flex space-x-8 items-center">
              <a href="/" className="text-gray-700 hover:text-blue-600">홈</a>
              <a href="/favorites" className="text-gray-700 hover:text-blue-600">찜한 정책</a>
              <a href="/notifications" className="text-gray-700 hover:text-blue-600">알림 신청한 정책</a>
              <a href="/dictionary" className="text-gray-700 hover:text-blue-600">용어 사전</a>
              <Button
                variant="outline"
                size="sm"
                className="ml-4"
                onClick={() => setShowProfileModal(true)}
              >
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
          
          <div className="max-w-4xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              onFilterChange={handleFilterChange}
              placeholder="관심있는 정책을 검색해보세요 (예: 청년 주택, 취업지원)"
              showQuickFilters={true}
              activeFilters={activeFilters}
            />
            <div className="flex flex-wrap gap-3 justify-start mt-4">
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-base font-semibold shadow-md transition-all
                  ${showAll ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'}`}
                style={{ boxShadow: showAll ? '0 2px 8px 0 rgba(37, 99, 235, 0.15)' : '0 1px 4px 0 rgba(0,0,0,0.06)' }}
                onClick={handleAllViewToggle}
              >
                전체보기
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-base font-semibold shadow-md transition-all
                  ${sortType === 'default' ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'}`}
                style={{ boxShadow: sortType === 'default' ? '0 2px 8px 0 rgba(37, 99, 235, 0.15)' : '0 1px 4px 0 rgba(0,0,0,0.06)' }}
                onClick={() => setSortType('default')}
              >
                기본순
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-base font-semibold shadow-md transition-all
                  ${sortType === 'like' ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'}`}
                style={{ boxShadow: sortType === 'like' ? '0 2px 8px 0 rgba(37, 99, 235, 0.15)' : '0 1px 4px 0 rgba(0,0,0,0.06)' }}
                onClick={() => setSortType('like')}
              >
                찜 많은 순
              </button>
              <button
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-base font-semibold shadow-md transition-all
                  ${sortType === 'noti' ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' : 'bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300'}`}
                style={{ boxShadow: sortType === 'noti' ? '0 2px 8px 0 rgba(37, 99, 235, 0.15)' : '0 1px 4px 0 rgba(0,0,0,0.06)' }}
                onClick={() => setSortType('noti')}
              >
                알림 신청 많은 순
              </button>
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

        {/* Similar Users' Policies Section - 검색/필터 결과가 없을 때만 표시 */}
        {filteredPolicies.length === 0 && !searchQuery.trim() && activeFilters.length === 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">나와 비슷한 청년들이 많이 신청한 정책</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarUsersPolicies.map((policy) => (
                <PolicyCard
                  key={policy.id}
                  policy={getPolicyWithTime(policy)}
                  onLike={handleLike}
                  onView={setSelectedPolicy}
                />
              ))}
            </div>
          </section>
        )}

        {/* Policy Results */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              {filteredPolicies.length > 0 ? 
                `검색 결과 (${filteredPolicies.length}개)` : 
                "맞춤 추천 정책"
              }
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedDisplayPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={getPolicyWithTime(policy)}
                onLike={handleLike}
                onView={setSelectedPolicy}
              />
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
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/notifications")}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">📊</div>
                  <h4 className="font-semibold mb-2 group-hover:text-blue-600">알림 신청 내역</h4>
                  <p className="text-sm text-gray-600">내 알림 신청 현황 확인</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/reviews")}>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">💬</div>
                  <h4 className="font-semibold mb-2 group-hover:text-blue-600">후기 게시판</h4>
                  <p className="text-sm text-gray-600">실제 후기와 정보 공유</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => navigate("/faq")}>
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
              <div className="text-gray-600 mb-2">{selectedPolicy.summary}</div>
              {/* 기관, 대상, 마감, 신청 난이도 - 설명 바로 아래로 이동 */}
              <div className="mb-4 flex flex-col gap-1">
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-2 shrink-0" />
                  <span>{selectedPolicy.institution}</span>
                </div>
                {selectedPolicy.target && (
                  <div className="flex items-center text-sm text-gray-500">
                    <Target className="h-4 w-4 mr-2 shrink-0" />
                    <span>대상: {selectedPolicy.target}</span>
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-2 shrink-0" />
                  {selectedPolicy.deadline === '상시모집' ? (
                    <span className="text-green-600 font-medium">상시모집</span>
                  ) : (
                    <span>마감: {selectedPolicy.deadline}</span>
                  )}
                </div>
                {selectedPolicy.estimatedTime && (
                  <div className="flex items-center text-sm text-blue-600 font-medium mb-1">
                    <Timer className="h-4 w-4 mr-2 shrink-0" />
                    <span>신청 난이도: {selectedPolicy.estimatedTime}</span>
                  </div>
                )}
                {/* 구체적 신청 조건 - 신청 난이도 바로 아래 */}
                {(selectedPolicy.age || selectedPolicy.income || selectedPolicy.region || selectedPolicy.supportAmount) && (
                  <div className="mb-2 p-3 rounded-lg bg-blue-50 text-blue-900 text-sm flex flex-col gap-1">
                    <span className="font-semibold">신청 조건</span>
                    {selectedPolicy.age && <span>연령: {selectedPolicy.age}</span>}
                    {selectedPolicy.income && <span>소득: {selectedPolicy.income}</span>}
                    {selectedPolicy.region && <span>거주지: {selectedPolicy.region}</span>}
                    {selectedPolicy.supportAmount && <span>지원 금액: {selectedPolicy.supportAmount}</span>}
                  </div>
                )}
              </div>
              {/* 해시태그 */}
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
                {notiPolicyIds.includes(selectedPolicy.id) ? (
                  <button
                    className="flex-1 rounded-lg py-2 font-semibold transition bg-red-100 text-red-600 hover:bg-red-200"
                    onClick={() => handleNotiCancel(selectedPolicy.id)}
                  >
                    알림 취소
                  </button>
                ) : (
                  <button
                    className="flex-1 rounded-lg py-2 font-semibold transition bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => handleNoti(selectedPolicy.id)}
                  >
                    알림 받기
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 프로필 설정 모달 */}
        {showProfileModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full p-8 relative animate-fade-in" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
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
                  <label className="block text-sm font-medium mb-1">생년월일</label>
                  <input
                    type="date"
                    name="birth"
                    value={profile.birth}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="생년월일을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">거주지</label>
                  <input
                    type="text"
                    name="region"
                    value={profile.region}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="예: 서울특별시"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">직업</label>
                  <select
                    name="job"
                    value={profile.job}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="학생">학생</option>
                    <option value="취업">취업</option>
                    <option value="구직">구직</option>
                    <option value="기타">기타</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">소득 수준</label>
                  <select
                    name="income"
                    value={profile.income}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="low">저소득</option>
                    <option value="middle">중간소득</option>
                    <option value="high">고소득</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">관심 분야</label>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
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
                <div>
                  <label className="block text-sm font-medium mb-1">혼인 여부</label>
                  <select
                    name="marital"
                    value={profile.marital}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="미혼">미혼</option>
                    <option value="기혼">기혼</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">가족형태</label>
                  <select
                    name="family"
                    value={profile.family}
                    onChange={handleProfileChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">선택하세요</option>
                    <option value="1인가구">1인가구</option>
                    <option value="2인가구">2인가구</option>
                    <option value="3인가구">3인가구</option>
                    <option value="4인가구">4인가구</option>
                    <option value="5인 이상">5인 이상</option>
                    <option value="한부모가정">한부모가정</option>
                    <option value="조손가정">조손가정</option>
                    <option value="기타">기타</option>
                  </select>
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
