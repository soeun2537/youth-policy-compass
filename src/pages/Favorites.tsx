import { useNavigate } from "react-router-dom";
import { useFavorites } from "../context/FavoritesContext";
import PolicyCard from "../components/PolicyCard";

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
  const handleView = (policy: any) => {
    // 추후 상세 모달 등 연결 가능
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
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
                policy={{ ...policy, liked: true }}
                onLike={handleLike}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites; 