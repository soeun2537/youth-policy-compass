
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { TrendingUp, Users, Heart, FileText, Calendar, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { allPolicies } from "../lib/allPolicies";
import { getCategoryColor } from "../lib/categoryColors.ts";

const Statistics = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [timeRange, setTimeRange] = useState<string>("month");

  // 카테고리별 통계 계산
  const categoryStats = useMemo(() => {
    const stats: Record<string, { count: number; likes: number; applications: number; avgTime: string }> = {};
    
    allPolicies.forEach(policy => {
      if (!stats[policy.category]) {
        stats[policy.category] = { count: 0, likes: 0, applications: 0, avgTime: "0분" };
      }
      stats[policy.category].count += 1;
      stats[policy.category].likes += policy.likeCount || 0;
      stats[policy.category].applications += policy.applicationCount || 0;
    });

    return Object.entries(stats).map(([category, data]) => ({
      category,
      ...data
    }));
  }, []);

  // 파이차트용 데이터
  const pieChartData = categoryStats.map(item => ({
    name: item.category,
    value: item.count,
    color: getCategoryColor(item.category).replace('text-', 'bg-').split(' ')[0]
  }));

  // 인기 정책 TOP 10
  const topPolicies = useMemo(() => {
    return [...allPolicies]
      .sort((a, b) => (b.likeCount || 0) + (b.applicationCount || 0) - (a.likeCount || 0) - (a.applicationCount || 0))
      .slice(0, 10);
  }, []);

  // 최신 정책 (신규 정책)
  const newPolicies = allPolicies.filter(policy => policy.isNew);

  // 마감 임박 정책
  const urgentPolicies = useMemo(() => {
    const now = new Date();
    return allPolicies
      .filter(policy => policy.deadline !== '상시모집')
      .filter(policy => {
        const deadline = new Date(policy.deadline);
        const timeDiff = deadline.getTime() - now.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        return daysDiff <= 30 && daysDiff > 0;
      })
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 5);
  }, []);

  // 차트 설정
  const chartConfig = {
    likes: {
      label: "좋아요",
      color: "#ef4444",
    },
    applications: {
      label: "신청",
      color: "#3b82f6",
    },
    count: {
      label: "정책 수",
      color: "#10b981",
    },
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen" style={{ background: '#F8FBFF' }}>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-2xl font-bold text-blue-600">정책 통계 대시보드</h1>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="week">1주일</SelectItem>
                  <SelectItem value="month">1개월</SelectItem>
                  <SelectItem value="quarter">3개월</SelectItem>
                  <SelectItem value="year">1년</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 전체 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">전체 정책 수</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allPolicies.length}</div>
              <p className="text-xs text-muted-foreground">총 정책 개수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 좋아요</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allPolicies.reduce((sum, policy) => sum + (policy.likeCount || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">누적 좋아요 수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 신청</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allPolicies.reduce((sum, policy) => sum + (policy.applicationCount || 0), 0)}
              </div>
              <p className="text-xs text-muted-foreground">누적 신청 수</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">신규 정책</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newPolicies.length}</div>
              <p className="text-xs text-muted-foreground">이번 달 신규</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">개요</TabsTrigger>
            <TabsTrigger value="categories">카테고리별</TabsTrigger>
            <TabsTrigger value="popular">인기 정책</TabsTrigger>
            <TabsTrigger value="urgent">마감 임박</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 카테고리별 정책 분포 */}
              <Card>
                <CardHeader>
                  <CardTitle>카테고리별 정책 분포</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* 카테고리별 참여도 */}
              <Card>
                <CardHeader>
                  <CardTitle>카테고리별 참여도</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryStats}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="category" 
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="likes" fill="var(--color-likes)" name="좋아요" />
                        <Bar dataKey="applications" fill="var(--color-applications)" name="신청" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>카테고리별 상세 통계</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>카테고리</TableHead>
                      <TableHead>정책 수</TableHead>
                      <TableHead>총 좋아요</TableHead>
                      <TableHead>총 신청</TableHead>
                      <TableHead>평균 참여도</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryStats.map((stat) => (
                      <TableRow key={stat.category}>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(stat.category)}>
                            {stat.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{stat.count}</TableCell>
                        <TableCell>{stat.likes}</TableCell>
                        <TableCell>{stat.applications}</TableCell>
                        <TableCell>
                          {((stat.likes + stat.applications) / stat.count).toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="popular">
            <Card>
              <CardHeader>
                <CardTitle>인기 정책 TOP 10</CardTitle>
                <p className="text-sm text-muted-foreground">좋아요 + 신청 수 기준</p>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>순위</TableHead>
                      <TableHead>정책명</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>좋아요</TableHead>
                      <TableHead>신청</TableHead>
                      <TableHead>총점</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topPolicies.map((policy, index) => (
                      <TableRow key={policy.id}>
                        <TableCell className="font-medium">#{index + 1}</TableCell>
                        <TableCell className="max-w-xs truncate">{policy.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getCategoryColor(policy.category)}>
                            {policy.category}
                          </Badge>
                        </TableCell>
                        <TableCell>{policy.likeCount || 0}</TableCell>
                        <TableCell>{policy.applicationCount || 0}</TableCell>
                        <TableCell className="font-bold">
                          {(policy.likeCount || 0) + (policy.applicationCount || 0)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="urgent">
            <Card>
              <CardHeader>
                <CardTitle>마감 임박 정책</CardTitle>
                <p className="text-sm text-muted-foreground">30일 이내 마감 예정</p>
              </CardHeader>
              <CardContent>
                {urgentPolicies.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">마감 임박 정책이 없습니다.</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>정책명</TableHead>
                        <TableHead>카테고리</TableHead>
                        <TableHead>마감일</TableHead>
                        <TableHead>남은 일수</TableHead>
                        <TableHead>현재 신청</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {urgentPolicies.map((policy) => {
                        const daysLeft = Math.ceil((new Date(policy.deadline).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
                        return (
                          <TableRow key={policy.id}>
                            <TableCell className="max-w-xs truncate">{policy.title}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getCategoryColor(policy.category)}>
                                {policy.category}
                              </Badge>
                            </TableCell>
                            <TableCell>{policy.deadline}</TableCell>
                            <TableCell>
                              <Badge variant={daysLeft <= 7 ? "destructive" : daysLeft <= 14 ? "secondary" : "outline"}>
                                {daysLeft}일
                              </Badge>
                            </TableCell>
                            <TableCell>{policy.applicationCount || 0}명</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Statistics;
