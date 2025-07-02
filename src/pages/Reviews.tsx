import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star, ThumbsUp, MessageCircle } from "lucide-react";

const mockReviews = [
  {
    id: 1,
    policyTitle: "청년내일채움공제",
    userName: "김○○",
    rating: 5,
    date: "2024-01-15",
    content: "정말 도움이 많이 됐어요! 신청 과정도 간단하고 지원금도 빠르게 받을 수 있었습니다. 취업 준비하는 청년들에게 강력 추천합니다.",
    category: "취업지원",
    likes: 12,
    replies: 3
  },
  {
    id: 2,
    policyTitle: "청년 전세임대주택",
    userName: "이○○",
    rating: 4,
    date: "2024-01-12",
    content: "주거 문제로 고민이 많았는데 이 정책 덕분에 해결됐어요. 다만 신청 경쟁이 치열해서 여러 번 도전해야 했습니다.",
    category: "주거지원",
    likes: 8,
    replies: 1
  },
  {
    id: 3,
    policyTitle: "창업지원사업",
    userName: "박○○",
    rating: 5,
    date: "2024-01-10",
    content: "창업 아이디어만 있고 자금이 부족했는데 이 정책으로 시작할 수 있었어요. 멘토링 서비스도 정말 유용했습니다!",
    category: "창업지원",
    likes: 15,
    replies: 5
  },
  {
    id: 4,
    policyTitle: "청년 문화예술교육 지원",
    userName: "최○○",
    rating: 4,
    date: "2024-01-08",
    content: "평소 관심있던 분야를 배울 수 있어서 좋았어요. 강의 퀄리티도 높고 비용 부담이 적어서 만족합니다.",
    category: "문화/여가",
    likes: 6,
    replies: 2
  },
  {
    id: 5,
    policyTitle: "청년 구직활동 지원금",
    userName: "정○○",
    rating: 3,
    date: "2024-01-05",
    content: "지원금은 받았지만 금액이 생각보다 적어서 아쉬웠어요. 그래도 구직활동에 조금이나마 도움이 됐습니다.",
    category: "취업지원",
    likes: 4,
    replies: 1
  }
];

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

const renderStars = (rating: number) => {
  return Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
    />
  ));
};

const Reviews = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", policyTitle: "", rating: 0, content: "" });
  
  const categories = ["전체", "취업지원", "주거지원", "창업지원", "교육지원", "생활지원", "문화/여가"];
  
  const filteredReviews = selectedCategory === "전체" 
    ? mockReviews 
    : mockReviews.filter(review => review.category === selectedCategory);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setReviewForm(prev => ({ ...prev, [name]: value }));
  };
  const handleStarClick = (idx: number) => {
    setReviewForm(prev => ({ ...prev, rating: idx + 1 }));
  };
  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("후기가 등록되었습니다!");
    setShowReviewModal(false);
    setReviewForm({ name: "", policyTitle: "", rating: 0, content: "" });
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FBFF' }}>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-blue-600">후기 게시판</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">정책 이용 후기</h2>
          <p className="text-gray-600 mb-6">실제 정책을 이용해본 청년들의 생생한 후기를 확인해보세요.</p>
          
          {/* 카테고리 필터 */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* 후기 목록 */}
        <div className="space-y-6">
          {filteredReviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`text-xs ${getCategoryColor(review.category)}`}>
                        {review.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <CardTitle className="text-lg text-blue-600 mb-1">
                      {review.policyTitle}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{review.userName}</span>
                      <span>•</span>
                      <span>{review.date}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {review.content}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-4 w-4" />
                    <span>{review.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    <span>{review.replies}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 후기 작성 버튼 */}
        <div className="mt-12 text-center">
          <Button size="lg" className="px-8" onClick={() => setShowReviewModal(true)}>
            후기 작성하기
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            정책을 이용해보셨다면 다른 청년들을 위해 후기를 남겨주세요!
          </p>
        </div>
      </main>

      {/* 후기 작성 모달 */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleReviewSubmit} className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">후기 작성하기</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input type="text" name="name" value={reviewForm.name} onChange={handleReviewChange} required className="w-full border rounded-lg px-3 py-2" placeholder="이름을 입력하세요" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">정책명</label>
              <input type="text" name="policyTitle" value={reviewForm.policyTitle} onChange={handleReviewChange} required className="w-full border rounded-lg px-3 py-2" placeholder="정책명을 입력하세요" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">별점</label>
              <div className="flex gap-1 mb-1">
                {[0,1,2,3,4].map(idx => (
                  <span key={idx} onClick={() => handleStarClick(idx)} className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill={reviewForm.rating > idx ? '#facc15' : 'none'} viewBox="0 0 24 24" stroke="#facc15" className="h-6 w-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.29a1 1 0 00.95.69h6.6c.969 0 1.371 1.24.588 1.81l-5.347 3.89a1 1 0 00-.364 1.118l2.036 6.29c.3.921-.755 1.688-1.54 1.118l-5.347-3.89a1 1 0 00-1.176 0l-5.347 3.89c-.784.57-1.838-.197-1.54-1.118l2.036-6.29a1 1 0 00-.364-1.118l-5.347-3.89c-.783-.57-.38-1.81.588-1.81h6.6a1 1 0 00.95-.69l2.036-6.29z" />
                    </svg>
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">후기 내용</label>
              <textarea name="content" value={reviewForm.content} onChange={handleReviewChange} required className="w-full border rounded-lg px-3 py-2" rows={5} placeholder="후기를 입력하세요" />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowReviewModal(false)}>취소</Button>
              <Button type="submit" className="flex-1">제출</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reviews;
