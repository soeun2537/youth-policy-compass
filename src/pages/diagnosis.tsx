import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { allPolicies } from "../lib/allPolicies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Clock, ArrowLeft, Send, Bot, User } from "lucide-react";

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

// AI 추천 시스템 (실제 AI API 연동 시 이 부분만 교체)
function getAIRecommendation(userMessage: string, userProfile: any) {
  const message = userMessage.toLowerCase();
  let recommendedPolicies: any[] = [];
  let response = "";

  // 키워드 기반 추천 로직
  if (message.includes('취업') || message.includes('일자리') || message.includes('구직')) {
    recommendedPolicies = allPolicies.filter(p => p.category === '취업지원').slice(0, 3);
    response = `${userProfile.name ? userProfile.name + '님, ' : ''}취업 관련 정보를 찾고 계시는군요! 다음과 같은 정책들을 추천드립니다:`;
  } else if (message.includes('주택') || message.includes('집') || message.includes('월세') || message.includes('전세')) {
    recommendedPolicies = allPolicies.filter(p => p.category === '주거지원').slice(0, 3);
    response = `주거 지원 정책을 알아보고 계시는군요! 청년 주거 안정을 위한 정책들을 추천해드릴게요:`;
  } else if (message.includes('창업') || message.includes('사업')) {
    recommendedPolicies = allPolicies.filter(p => p.category === '창업지원').slice(0, 3);
    response = `창업에 관심이 있으시군요! 청년 창업을 지원하는 다양한 정책들이 있습니다:`;
  } else if (message.includes('교육') || message.includes('학습') || message.includes('자격증')) {
    recommendedPolicies = allPolicies.filter(p => p.category === '교육지원').slice(0, 3);
    response = `교육 및 역량강화 정책을 찾고 계시는군요! 다음 정책들을 확인해보세요:`;
  } else if (message.includes('문화') || message.includes('여가') || message.includes('취미')) {
    recommendedPolicies = allPolicies.filter(p => p.category === '문화/여가').slice(0, 3);
    response = `문화생활을 위한 지원을 찾고 계시는군요! 다음과 같은 정책들이 있습니다:`;
  } else if (message.includes('생활') || message.includes('돈') || message.includes('자금') || message.includes('대출')) {
    recommendedPolicies = allPolicies.filter(p => p.category === '생활지원').slice(0, 3);
    response = `생활 안정을 위한 지원 정책들을 추천드릴게요:`;
  } else {
    // 프로필 기반 추천
    if (userProfile.interest && userProfile.interest.length > 0) {
      const matched = allPolicies.filter(p => userProfile.interest.includes(p.category));
      recommendedPolicies = matched.length > 0 ? matched.slice(0, 3) : allPolicies.slice(0, 3);
      response = `${userProfile.name ? userProfile.name + '님의 ' : ''}관심 분야를 기반으로 정책을 추천해드릴게요!`;
    } else {
      recommendedPolicies = allPolicies.slice(0, 3);
      response = "안녕하세요! 어떤 분야의 청년 정책에 관심이 있으신가요? 취업, 주거, 창업, 교육, 생활지원, 문화/여가 등 궁금한 분야를 말씀해주세요!";
    }
  }

  return { response, policies: recommendedPolicies };
}

interface ChatMessage {
  id: number;
  type: 'user' | 'bot';
  message: string;
  policies?: any[];
  timestamp: Date;
}

const Diagnosis = () => {
  const [profile, setProfile] = useState<{ name: string; interest: string[] }>({ name: "", interest: [] });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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
    // 초기 인사 메시지
    if (chatMessages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: 1,
        type: 'bot',
        message: `안녕하세요${profile.name ? ', ' + profile.name + '님' : ''}! 저는 청년정책 추천 AI입니다. 🤖\n\n어떤 분야의 청년 정책에 관심이 있으신가요?\n\n• 취업/일자리 관련\n• 주거 지원\n• 창업 지원\n• 교육/자격증\n• 생활비/대출\n• 문화/여가\n\n관심있는 분야나 궁금한 점을 자유롭게 말씀해주세요!`,
        timestamp: new Date()
      };
      setChatMessages([welcomeMessage]);
    }
  }, [profile.name]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // AI 응답 시뮬레이션 (약간의 지연)
    setTimeout(() => {
      const aiResult = getAIRecommendation(inputMessage, profile);
      
      const botMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'bot',
        message: aiResult.response,
        policies: aiResult.policies,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50/50 to-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}> 
            <ArrowLeft className="h-5 w-5" /> 
          </Button>
          <div className="flex items-center gap-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-bold text-blue-600">AI 맞춤 정책 진단</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* 채팅 영역 */}
          <div className="lg:col-span-2 flex flex-col">
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5 text-blue-600" />
                  AI 정책 상담사
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {/* 메시지 영역 */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {chatMessages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-lg p-3 ${
                        msg.type === 'user' 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        <div className="flex items-start gap-2 mb-2">
                          {msg.type === 'bot' ? (
                            <Bot className="h-4 w-4 mt-0.5 text-blue-600" />
                          ) : (
                            <User className="h-4 w-4 mt-0.5" />
                          )}
                          <div className="text-sm font-medium">
                            {msg.type === 'bot' ? 'AI 상담사' : '나'}
                          </div>
                        </div>
                        <div className="whitespace-pre-wrap text-sm">{msg.message}</div>
                        {/* 추천 정책 카드들 */}
                        {msg.policies && msg.policies.length > 0 && (
                          <div className="mt-4 space-y-3">
                            {msg.policies.map((policy) => (
                              <div key={policy.id} className="bg-white rounded-lg p-3 border shadow-sm">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`text-xs ${getCategoryColor(policy.category)}`}>
                                    {policy.category}
                                  </Badge>
                                  {policy.isNew && <Badge variant="destructive" className="text-xs">NEW</Badge>}
                                </div>
                                <h4 className="font-semibold text-gray-900 text-sm mb-1">{policy.title}</h4>
                                <p className="text-xs text-gray-600 mb-2">{policy.summary}</p>
                                <div className="flex items-center text-xs text-gray-500 mb-1">
                                  <MapPin className="h-3 w-3 mr-1" />
                                  <span>{policy.institution}</span>
                                </div>
                                <div className="flex items-center text-xs text-gray-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {policy.deadline === '상시모집' ? (
                                    <span className="text-green-600 font-medium">상시모집</span>
                                  ) : (
                                    <span>마감: {policy.deadline}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg p-3 flex items-center gap-2">
                        <Bot className="h-4 w-4 text-blue-600" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* 입력 영역 */}
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="궁금한 정책 분야나 상황을 말씀해주세요..."
                    className="flex-1"
                    disabled={isLoading}
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={!inputMessage.trim() || isLoading}
                    className="shrink-0"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 사이드바 - 프로필 정보 */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">내 프로필</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm font-medium text-gray-700">이름</div>
                    <div className="text-sm text-gray-900">{profile.name || '미설정'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-700">관심 분야</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {profile.interest.length > 0 ? (
                        profile.interest.map((interest) => (
                          <Badge key={interest} variant="outline" className="text-xs">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">미설정</span>
                      )}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full"
                    onClick={() => navigate("/")}
                  >
                    프로필 수정
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">추천 질문</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    "취업 준비에 도움되는 정책이 있나요?",
                    "주거비 부담을 줄일 수 있는 방법은?",
                    "창업 자금 지원은 어떤 것들이 있나요?",
                    "자격증 취득 지원 정책이 궁금해요"
                  ].map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      size="sm"
                      className="w-full text-left justify-start h-auto whitespace-normal text-xs p-2"
                      onClick={() => setInputMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Diagnosis;
