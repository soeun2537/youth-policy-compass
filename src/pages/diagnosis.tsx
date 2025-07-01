import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allPolicies } from "../lib/allPolicies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, ArrowLeft } from "lucide-react";

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

// AI 추천 목업 함수 (실제 AI API 연동 시 이 부분만 교체)
function recommendPoliciesByInterest(interests: string[], policies: any[]) {
  if (!interests || interests.length === 0) return [];
  // 관심분야와 카테고리 일치 정책 우선 추천, 없으면 랜덤 3개
  const matched = policies.filter(p => interests.includes(p.category));
  if (matched.length > 0) return matched.slice(0, 3);
  return policies.slice(0, 3);
}

const Diagnosis = () => {
  const [profile, setProfile] = useState<{ name: string; interest: string[] }>({ name: "", interest: [] });
  const [recommend, setRecommend] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("userProfile");
    if (saved) {
      const parsed = JSON.parse(saved);
      setProfile({
        name: parsed.name || "", 
        interest: Array.isArray(parsed.interest) ? parsed.interest : []
      });
    }
  }, []);

  useEffect(() => {
    if (profile.interest.length > 0) {
      setRecommend(recommendPoliciesByInterest(profile.interest, allPolicies));
    }
  }, [profile]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}> <ArrowLeft className="h-5 w-5" /> </Button>
          <h1 className="text-xl font-bold text-blue-600">맞춤 정책 진단</h1>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{profile.name ? `${profile.name}님을 위한 추천` : "나에게 맞는 정책 추천"}</h2>
          <div className="text-gray-600 mb-2">관심 분야: {profile.interest.length > 0 ? profile.interest.join(", ") : "설정된 관심 분야가 없습니다."}</div>
        </div>
        {recommend.length === 0 ? (
          <div className="text-center text-gray-400 py-24">관심 분야를 프로필에서 먼저 선택해 주세요.</div>
        ) : (
          <div className="space-y-6">
            {recommend.map(policy => (
              <Card key={policy.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={`text-xs ${getCategoryColor(policy.category)}`}>{policy.category}</Badge>
                    {policy.isNew && <Badge variant="destructive" className="text-xs">NEW</Badge>}
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                    {policy.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{policy.summary}</p>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <MapPin className="h-4 w-4 mr-2 shrink-0" />
                    <span className="truncate">{policy.institution}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <Clock className="h-4 w-4 mr-2 shrink-0" />
                    {policy.deadline === '상시모집' ? (
                      <span className="text-green-600 font-medium">상시모집</span>
                    ) : (
                      <span>마감: {policy.deadline}</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {policy.tags && policy.tags.slice(0, 3).map((tag: string) => (
                      <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Diagnosis; 