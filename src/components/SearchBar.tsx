import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: string[]) => void;
  placeholder?: string;
  showQuickFilters?: boolean;
}

const SearchBar = ({ 
  onSearch, 
  onFilterChange, 
  placeholder = "정책을 검색해보세요",
  showQuickFilters = true 
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const quickFilters = [
    "취업지원", "주거지원", "창업지원", "교육지원", "생활지원", "문화/여가"
  ];

  const handleSearch = () => {
    onSearch?.(searchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    onFilterChange?.([]);
  };

  return (
    <div className="w-full">
      {/* Search Input */}
      <div className="relative mb-4 flex flex-col gap-0">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-12 pr-20 py-6 text-base rounded-xl border-2 focus:border-blue-500"
        />
        <Button 
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg ml-2 py-3"
        >
          검색
        </Button>
      </div>

      {/* Quick Filters */}
      {showQuickFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span></span>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => {
              const isActive = activeFilters.includes(filter);
              // 카테고리별 이모티콘 매핑
              const filterIcons: Record<string, string> = {
                "취업지원": "💼",
                "주거지원": "🏠",
                "창업지원": "🚀",
                "교육지원": "📚",
                "생활지원": "🛒",
                "문화/여가": "🎨",
              };
              return (
                <div key={filter}>
                  <Badge
                    variant={isActive ? "default" : "outline"}
                    className={`cursor-pointer transition-all flex items-center gap-2 shadow-md px-3 py-2 text-base font-semibold rounded-xl border-2 ${
                      isActive 
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                    onClick={() => toggleFilter(filter)}
                    style={{ boxShadow: isActive ? '0 2px 8px 0 rgba(37, 99, 235, 0.15)' : '0 1px 4px 0 rgba(0,0,0,0.06)' }}
                  >
                    <span className="text-lg">{filterIcons[filter]}</span>
                    <span>{filter}</span>
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
