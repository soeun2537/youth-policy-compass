import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import PolicyCard from "../components/PolicyCard";
import { allPolicies } from "../lib/allPolicies";

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
                onView={() => {}}
                onNotiCancel={handleNotiCancel}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Notifications; 