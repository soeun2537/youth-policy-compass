import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Search, Plus, Book, User, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface DictionaryTerm {
  id: number;
  term: string;
  definition: string;
  category: string;
}

const initialTerms: DictionaryTerm[] = [
  {
    id: 1,
    term: "청년도약계좌",
    definition: "만 19~34세 청년이 매월 일정 금액을 적립하면 정부가 이자를 지원하는 중장기 자산형성 지원 제도입니다.",
    category: "금융지원"
  },
  {
    id: 2,
    term: "K-스타트업",
    definition: "한국의 스타트업 생태계 활성화를 위한 정부 주도 지원 프로그램으로, 창업 초기부터 성장 단계까지 종합적으로 지원합니다.",
    category: "창업지원"
  },
  {
    id: 3,
    term: "내일채움공제",
    definition: "중소기업에 정규직으로 취업한 청년이 2년 또는 3년간 근속하면 적립금과 이자를 지원받는 제도입니다.",
    category: "취업지원"
  },
  {
    id: 4,
    term: "청약통장",
    definition: "주택을 분양받기 위해 일정 기간 동안 매월 일정 금액을 적립하는 통장으로, 주택 청약 시 우선순위를 결정하는 기준이 됩니다.",
    category: "주거지원"
  },
  {
    id: 5,
    term: "전세자금대출",
    definition: "전세보증금 마련을 위해 금융기관에서 제공하는 대출 상품으로, 주택도시기금이나 은행에서 저금리로 이용할 수 있습니다.",
    category: "주거지원"
  },
  {
    id: 6,
    term: "소상공인",
    definition: "상시 근로자 수가 5명 미만인 사업자 또는 연간 매출액이 업종별 기준 이하인 개인사업자나 법인사업자를 말합니다.",
    category: "창업지원"
  },
  {
    id: 7,
    term: "기초생활수급자",
    definition: "국민기초생활보장법에 따라 생계급여, 의료급여, 주거급여, 교육급여 등을 지원받는 대상자를 의미합니다.",
    category: "생활지원"
  },
  {
    id: 8,
    term: "근로장려금",
    definition: "저소득 근로자 가구의 근로 의욕을 높이고 실질소득을 지원하기 위해 지급하는 환급형 세액공제입니다.",
    category: "생활지원"
  }
];

const Dictionary = () => {
  const [terms, setTerms] = useState<DictionaryTerm[]>(initialTerms);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [newTerm, setNewTerm] = useState("");
  const [newDefinition, setNewDefinition] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const categories = ["전체", "금융지원", "창업지원", "취업지원", "주거지원", "생활지원", "교육지원"];

  const filteredTerms = terms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         term.definition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "전체" || term.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddTerm = () => {
    if (!newTerm.trim() || !newDefinition.trim() || !newCategory.trim()) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive"
      });
      return;
    }

    const newId = Math.max(...terms.map(t => t.id)) + 1;
    const termToAdd: DictionaryTerm = {
      id: newId,
      term: newTerm,
      definition: newDefinition,
      category: newCategory
    };

    setTerms([...terms, termToAdd]);
    setNewTerm("");
    setNewDefinition("");
    setNewCategory("");
    setIsDialogOpen(false);
    
    toast({
      title: "용어 추가 완료",
      description: `'${newTerm}' 용어가 성공적으로 추가되었습니다.`
    });
  };

  // 메인 페이지와 동일한 카테고리 색상 함수
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '취업지원': return 'bg-blue-100 text-blue-800';
      case '주거지원': return 'bg-green-100 text-green-800';
      case '창업지원': return 'bg-purple-100 text-purple-800';
      case '교육지원': return 'bg-orange-100 text-orange-800';
      case '생활지원': return 'bg-gray-100 text-gray-800';
      case '문화/여가': return 'bg-pink-100 text-pink-800';
      case '금융지원': return 'bg-blue-50 text-blue-700'; // 추가: 금융지원은 연파랑
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F8FBFF' }}>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}> <ArrowLeft className="h-5 w-5" /> </Button>
              <h1 className="text-2xl font-bold text-blue-600">용어 사전</h1>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center mb-8 mt-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Book className="h-8 w-8 text-blue-600" />
            <h2 className="text-3xl font-bold text-gray-900">정책 용어 사전</h2>
          </div>
          <p className="text-lg text-gray-600">
            청년 정책과 관련된 어려운 용어들을 쉽게 찾아보세요
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="용어를 검색해보세요..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                용어 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>새 용어 추가</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">용어</label>
                  <Input
                    placeholder="새 용어를 입력하세요"
                    value={newTerm}
                    onChange={(e) => setNewTerm(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">카테고리</label>
                  <select
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value)}
                  >
                    <option value="">카테고리 선택</option>
                    <option value="창업지원">창업지원</option>
                    <option value="취업지원">취업지원</option>
                    <option value="주거지원">주거지원</option>
                    <option value="생활지원">생활지원</option>
                    <option value="교육지원">교육지원</option>
                    <option value="문화/여가">문화/여가</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">정의</label>
                  <Textarea
                    placeholder="용어의 정의를 입력하세요"
                    value={newDefinition}
                    onChange={(e) => setNewDefinition(e.target.value)}
                    rows={4}
                  />
                </div>
                <Button onClick={handleAddTerm} className="w-full">
                  추가하기
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTerms.map((term) => (
            <Card key={term.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{term.term}</CardTitle>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(term.category)}`}>
                    {term.category}
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">{term.definition}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTerms.length === 0 && (
          <div className="text-center py-12">
            <Book className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-400">
              다른 검색어나 카테고리를 시도해보세요
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dictionary;
