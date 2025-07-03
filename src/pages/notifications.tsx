import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MapPin, Clock, Timer, Heart, Bell, Target } from "lucide-react";
import PolicyCard from "../components/PolicyCard";
import { allPolicies } from "../lib/allPolicies";
import { Badge } from "@/components/ui/badge";
import { getCategoryColor } from "../lib/categoryColors.ts";

function sortByDeadline(policies: any[]) {
  return policies.slice().sort((a, b) => {
    if (a.deadline === '상시모집' && b.deadline !== '상시모집') return 1;
    if (b.deadline === '상시모집' && a.deadline !== '상시모집') return -1;
    if (a.deadline === '상시모집' && b.deadline === '상시모집') return 0;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
}

const Notifications = () => {
  const [notiPolicyIds, setNotiPolicyIds] = useState<number[]>([]);
  const [notiPolicies, setNotiPolicies] = useState<any[]>([]);
  const [policyTimes, setPolicyTimes] = useState<{[key: string]: string}>({});
  const [likedPolicyIds, setLikedPolicyIds] = useState<number[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<any | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("notiPolicyIds");
    if (saved) {
      const ids = JSON.parse(saved).map((id: string) => Number(id));
      setNotiPolicyIds(ids);
      setNotiPolicies(allPolicies.filter(p => ids.includes(Number(p.id))));
    }
    const savedTimes = localStorage.getItem("policyTimes");
    if (savedTimes) setPolicyTimes(JSON.parse(savedTimes));
    const savedLikes = localStorage.getItem("likedPolicyIds");
    if (savedLikes) setLikedPolicyIds(JSON.parse(savedLikes));
  }, []);

  // 정책별 찜/알림 신청 카운트 계산
  const likeCountMap = (() => {
    const map: Record<number, number> = {};
    allPolicies.forEach(p => { map[p.id] = 0; });
    const saved = localStorage.getItem("likedPolicyIds");
    if (saved) {
      JSON.parse(saved).forEach((id: number) => {
        if (map[id] !== undefined) map[id] += 1;
      });
    }
    return map;
  })();
  const notiCountMap = (() => {
    const map: Record<number, number> = {};
    allPolicies.forEach(p => { map[p.id] = 0; });
    const saved = localStorage.getItem("notiPolicyIds");
    if (saved) {
      JSON.parse(saved).forEach((id: number) => {
        if (map[id] !== undefined) map[id] += 1;
      });
    }
    return map;
  })();

  const getPolicyWithTime = (policy: any) => ({
    ...policy,
    estimatedTime: policyTimes[policy.id] || policy.estimatedTime,
    liked: likedPolicyIds.includes(policy.id),
    likeCount: typeof policy.likeCount === 'number' ? policy.likeCount : (likeCountMap[policy.id] || 0),
    applicationCount: typeof policy.applicationCount === 'number' ? policy.applicationCount : (notiCountMap[policy.id] || 0)
  });

  const handleNotiCancel = (id: number) => {
    const updated = notiPolicyIds.filter(pid => pid !== id);
    setNotiPolicyIds(updated);
    setNotiPolicies(allPolicies.filter(p => updated.includes(Number(p.id))));
    localStorage.setItem("notiPolicyIds", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FBFF' }}>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}> <ArrowLeft className="h-5 w-5" /> </Button>
              <h1 className="text-2xl font-bold text-blue-600">알림 신청한 정책</h1>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-xl font-semibold mb-6">내가 알림 신청한 정책</h2>
        {notiPolicies.length === 0 ? (
          <div className="text-center text-gray-500 py-24">알림 신청한 정책이 없습니다.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortByDeadline(notiPolicies).map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={getPolicyWithTime(policy)}
                onLike={() => {}}
                onView={setSelectedPolicy}
                onNotiCancel={handleNotiCancel}
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
              <div className="text-gray-600 mb-2">{selectedPolicy.summary}</div>
              {/* 기관, 대상, 마감, 신청 난이도 - 설명 바로 아래 */}
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
                {selectedPolicy.tags && selectedPolicy.tags.map((tag: string) => (
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
                  className="flex-1 rounded-lg py-2 font-semibold transition bg-red-100 text-red-600 hover:bg-red-200"
                  onClick={() => { handleNotiCancel(selectedPolicy.id); setSelectedPolicy(null); }}
                >
                  알림 취소
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications; 