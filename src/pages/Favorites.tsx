import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import PolicyCard from "../components/PolicyCard";
import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { getCategoryColor } from "../lib/categoryColors.ts";
import { MapPin, Clock, Timer, Heart, Bell, Target } from "lucide-react";

const Favorites = () => {
  const navigate = useNavigate();
  const { likedPolicyIds, allPolicies, handleLike } = useFavorites();
  const likedPolicies = allPolicies.filter((p) => likedPolicyIds.includes(p.id));
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const [notiPolicyIds, setNotiPolicyIds] = useState<string[]>([]);
  const [policyTimes, setPolicyTimes] = useState<{[key: string]: string}>({});

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

  const getPolicyWithCounts = (policy: any) => ({
    ...policy,
    liked: true,
    estimatedTime: policyTimes[policy.id] || policy.estimatedTime,
    likeCount: typeof policy.likeCount === 'number' ? policy.likeCount : (likeCountMap[policy.id] || 0),
    applicationCount: typeof policy.applicationCount === 'number' ? policy.applicationCount : (notiCountMap[policy.id] || 0)
  });

  return (
    <div className="min-h-screen" style={{ background: '#F8FBFF' }}>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-2">
            <button className="bg-transparent border-none p-0 mr-2" onClick={() => navigate("/")}>←</button>
            <h1 className="text-2xl font-bold text-blue-600">찜한 정책 목록</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-semibold mb-6">내가 찜한 정책</h2>
        {likedPolicies.length === 0 ? (
          <div className="text-center text-gray-500 py-24">찜한 정책이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={getPolicyWithCounts(policy)}
                onLike={handleLike}
                onView={setSelectedPolicy}
              />
            ))}
          </div>
        )}
        {/* 상세 모달 */}
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
              
              {/* 좋아요 및 신청 통계 */}
              <div className="flex items-center justify-center gap-6 bg-gray-50 rounded-lg py-3 mb-4">
                <div className="flex items-center gap-2 text-red-600">
                  <Heart className="h-5 w-5" />
                  <span className="font-semibold">{typeof selectedPolicy.likeCount === 'number' ? selectedPolicy.likeCount : (likeCountMap[selectedPolicy.id] || 0)}</span>
                  <span className="text-sm text-gray-600">좋아요</span>
                </div>
                <div className="w-px h-6 bg-gray-300"></div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Bell className="h-5 w-5" />
                  <span className="font-semibold">{typeof selectedPolicy.applicationCount === 'number' ? selectedPolicy.applicationCount : (notiCountMap[selectedPolicy.id] || 0)}</span>
                  <span className="text-sm text-gray-600">알림 신청</span>
                </div>
              </div>
              
              <div className="mb-2 flex items-center text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-2 shrink-0" />
                <span>{selectedPolicy.institution}</span>
              </div>
              {selectedPolicy.target && (
                <div className="mb-2 flex items-center text-sm text-gray-500">
                  <Target className="h-4 w-4 mr-2 shrink-0" />
                  <span>대상: {selectedPolicy.target}</span>
                </div>
              )}
              <div className="mb-2 flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2 shrink-0" />
                {selectedPolicy.deadline === '상시모집' ? (
                  <span className="text-green-600 font-medium">상시모집</span>
                ) : (
                  <span>마감: {selectedPolicy.deadline}</span>
                )}
              </div>
              <div className="mb-4 flex items-center text-sm text-gray-500">
                <div className="flex items-center">
                  <Timer className="h-4 w-4 mr-2 shrink-0" />
                  <span>신청 난이도: {policyTimes[selectedPolicy.id] || policyTimes[String(selectedPolicy.id)] || selectedPolicy.estimatedTime || "미설정"}</span>
                </div>
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
                {notiPolicyIds.includes(selectedPolicy.id) || notiPolicyIds.includes(String(selectedPolicy.id)) ? (
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
      </main>
    </div>
  );
};

export default Favorites; 
