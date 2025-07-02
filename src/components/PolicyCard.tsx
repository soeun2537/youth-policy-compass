import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Clock, ExternalLink, Timer } from "lucide-react";

interface Policy {
  id: number;
  title: string;
  category: string;
  institution: string;
  deadline: string;
  tags: string[];
  summary: string;
  isNew?: boolean;
  liked?: boolean;
  estimatedTime?: string;
}

interface PolicyCardProps {
  policy: Policy;
  onLike?: (id: number) => void;
  onView?: (policy: Policy) => void;
}

const PolicyCard = ({ policy, onLike, onView }: PolicyCardProps) => {
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

  return (
    <Card 
      className="hover:shadow-lg transition-all duration-300 group cursor-pointer h-full flex flex-col"
      onClick={() => onView?.(policy)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={`text-xs ${getCategoryColor(policy.category)}`}>
                {policy.category}
              </Badge>
              {policy.isNew && (
                <Badge variant="destructive" className="text-xs">NEW</Badge>
              )}
              {policy.estimatedTime && (
                <Badge variant="outline" className="text-xs text-blue-600 flex items-center gap-1">
                  <Timer className="h-3 w-3" />
                  {policy.estimatedTime}
                </Badge>
              )}
            </div>
            <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
              {policy.title}
            </CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            className={`shrink-0 ${policy.liked ? 'text-red-500' : 'text-gray-400'}`}
            onClick={(e) => {
              e.stopPropagation();
              onLike?.(policy.id);
            }}
          >
            <Heart className={`h-4 w-4 ${policy.liked ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
          {policy.summary}
        </p>
        <div className="space-y-3 mt-auto">
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
          {policy.estimatedTime && (
            <div className="flex items-center text-sm text-blue-600 font-medium">
              <Timer className="h-4 w-4 mr-2 shrink-0" />
              <span>신청 난이도: {policy.estimatedTime}</span>
            </div>
          )}
          <div className="flex flex-wrap gap-1">
            {policy.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
            {policy.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{policy.tags.length - 3}
              </Badge>
            )}
          </div>
          <Button 
            className="w-full group-hover:bg-blue-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onView?.(policy);
            }}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            자세히 보기
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PolicyCard;
