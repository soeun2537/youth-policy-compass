
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
  onView?: (id: number) => void;
}

const PolicyCard = ({ policy, onLike, onView }: PolicyCardProps) => {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case '취업지원': return 'default';
      case '주거지원': return 'secondary';
      case '창업지원': return 'destructive';
      case '교육지원': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group cursor-pointer h-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={getCategoryColor(policy.category)} className="text-xs">
                {policy.category}
              </Badge>
              {policy.isNew && (
                <Badge variant="destructive" className="text-xs">NEW</Badge>
              )}
              {policy.estimatedTime && (
                <Badge variant="outline" className="text-xs text-blue-600">
                  <Timer className="h-3 w-3 mr-1" />
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
      <CardContent className="flex flex-col h-full">
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
              onView?.(policy.id);
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
