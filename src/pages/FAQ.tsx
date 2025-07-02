import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronUp, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const faqData = [
  {
    id: 1,
    category: "일반",
    question: "청년 정책 찾기 서비스는 무료인가요?",
    answer: "네, 저희 서비스는 완전 무료입니다. 회원가입이나 별도 비용 없이 모든 정책 정보를 확인하실 수 있습니다."
  },
  {
    id: 2,
    category: "정책 신청",
    question: "정책 신청은 어떻게 하나요?",
    answer: "각 정책 카드의 '바로가기' 버튼을 클릭하면 해당 정책의 공식 신청 페이지로 이동합니다. 신청 방법과 필요 서류는 각 기관의 안내를 따라주세요."
  },
  {
    id: 3,
    category: "정책 신청",
    question: "여러 정책을 동시에 신청할 수 있나요?",
    answer: "대부분의 정책은 동시 신청이 가능하지만, 일부 정책은 중복 신청이 제한될 수 있습니다. 각 정책의 신청 조건을 반드시 확인해주세요."
  },
  {
    id: 4,
    category: "자격 조건",
    question: "청년의 나이 기준은 어떻게 되나요?",
    answer: "일반적으로 만 19세~34세를 청년으로 분류하지만, 정책에 따라 나이 기준이 다를 수 있습니다. 각 정책의 세부 조건을 확인해주세요."
  },
  {
    id: 5,
    category: "자격 조건",
    question: "소득 기준은 어떻게 확인하나요?",
    answer: "소득 기준은 정책마다 다르며, 보통 중위소득 기준으로 설정됩니다. 정확한 소득 기준은 각 정책의 상세 정보에서 확인하실 수 있습니다."
  },
  {
    id: 6,
    category: "이용 방법",
    question: "맞춤 추천은 어떻게 받나요?",
    answer: "프로필 설정에서 관심 분야를 선택하거나, AI 맞춤 진단을 통해 개인화된 정책 추천을 받으실 수 있습니다."
  },
  {
    id: 7,
    category: "이용 방법",
    question: "알림 기능은 어떻게 사용하나요?",
    answer: "관심있는 정책의 '알림 받기' 버튼을 클릭하면 해당 정책의 마감일이나 변경사항을 알림으로 받아보실 수 있습니다."
  },
  {
    id: 8,
    category: "문제 해결",
    question: "정책 정보가 잘못되었거나 업데이트가 필요한 경우 어떻게 하나요?",
    answer: "정책 정보의 오류나 업데이트가 필요한 경우, 고객센터를 통해 신고해주시면 빠르게 수정하겠습니다."
  },
  {
    id: 9,
    category: "문제 해결",
    question: "사이트가 제대로 작동하지 않아요.",
    answer: "브라우저 캐시를 삭제하거나 다른 브라우저를 사용해보세요. 문제가 지속되면 고객센터로 문의해주세요."
  },
  {
    id: 10,
    category: "기타",
    question: "새로운 정책은 언제 업데이트되나요?",
    answer: "새로운 정책 정보는 매주 정기적으로 업데이트됩니다. 중요한 정책의 경우 실시간으로 반영됩니다."
  }
];

const FAQ = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [showInquiryModal, setShowInquiryModal] = useState(false);
  const [inquiry, setInquiry] = useState({ name: "", email: "", content: "" });

  const categories = ["전체", "일반", "정책 신청", "자격 조건", "이용 방법", "문제 해결", "기타"];

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInquiryChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInquiry(prev => ({ ...prev, [name]: value }));
  };
  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("문의가 접수되었습니다!");
    setShowInquiryModal(false);
    setInquiry({ name: "", email: "", content: "" });
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
              <h1 className="text-2xl font-bold text-blue-600">자주 묻는 질문</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <p className="text-gray-600 mb-6">자주 묻는 질문들을 모아놨습니다. 궁금한 내용을 찾아보세요.</p>
          
          {/* 검색 */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="질문을 검색해보세요..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
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

        {/* FAQ 목록 */}
        <div className="space-y-4">
          {filteredFAQ.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader 
                className="cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => toggleItem(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
                      {item.category}
                    </span>
                    <CardTitle className="text-lg">
                      {item.question}
                    </CardTitle>
                  </div>
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </CardHeader>
              {openItems.includes(item.id) && (
                <CardContent className="pt-0">
                  <div className="border-t pt-4">
                    <p className="text-gray-700 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredFAQ.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            <p className="text-gray-400 text-sm mt-2">다른 검색어를 시도해보세요.</p>
          </div>
        )}

        {/* 문의하기 */}
        <div className="mt-12 text-center bg-blue-50 rounded-lg p-8">
          <h3 className="text-xl font-bold mb-2">찾으시는 답변이 없나요?</h3>
          <p className="text-gray-600 mb-4">언제든지 문의해주세요. 빠르게 도움을 드리겠습니다.</p>
          <Button size="lg" onClick={() => setShowInquiryModal(true)}>
            문의하기
          </Button>
        </div>
      </main>

      {/* 문의하기 모달 */}
      {showInquiryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <form onSubmit={handleInquirySubmit} className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto p-8">
            <h2 className="text-xl font-bold mb-6 text-gray-900">문의하기</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input type="text" name="name" value={inquiry.name} onChange={handleInquiryChange} required className="w-full border rounded-lg px-3 py-2" placeholder="이름을 입력하세요" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input type="email" name="email" value={inquiry.email} onChange={handleInquiryChange} required className="w-full border rounded-lg px-3 py-2" placeholder="이메일을 입력하세요" />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">문의 내용</label>
              <textarea name="content" value={inquiry.content} onChange={handleInquiryChange} required className="w-full border rounded-lg px-3 py-2" rows={5} placeholder="문의하실 내용을 입력하세요" />
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" className="flex-1" onClick={() => setShowInquiryModal(false)}>취소</Button>
              <Button type="submit" className="flex-1">제출</Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default FAQ;
