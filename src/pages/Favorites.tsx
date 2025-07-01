import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Clock, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import { useEffect } from "react";

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

const Favorites = () => {
  const navigate = useNavigate();
  const { likedPolicyIds, allPolicies, handleLike } = useFavorites();
  const likedPolicies = allPolicies.filter((p) => likedPolicyIds.includes(p.id));

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 gap-2">
            <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
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
              <Card key={policy.id} className="hover:shadow-lg transition-all duration-300 group cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={`text-xs ${getCategoryColor(policy.category)}`}>{policy.category}</Badge>
                        {policy.isNew && <Badge variant="destructive" className="text-xs">NEW</Badge>}
                      </div>
                      <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">
                        {policy.title}
                      </CardTitle>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className={`shrink-0 text-red-500`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(policy.id);
                      }}
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{policy.summary}</p>
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
                        <Badge key={tag} variant="outline" className="text-xs">#{tag}</Badge>
                      ))}
                      {policy.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{policy.tags.length - 3}</Badge>
                      )}
                    </div>
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

export default Favorites; 