
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
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-12 pr-20 py-3 text-base rounded-xl border-2 focus:border-blue-500"
        />
        <Button 
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg"
        >
          검색
        </Button>
      </div>

      {/* Quick Filters */}
      {showQuickFilters && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">빠른 필터</span>
            {activeFilters.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4 mr-1" />
                필터 초기화
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2">
            {quickFilters.map((filter) => {
              const isActive = activeFilters.includes(filter);
              return (
                <Badge
                  key={filter}
                  variant={isActive ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    isActive 
                      ? "bg-blue-600 hover:bg-blue-700" 
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => toggleFilter(filter)}
                >
                  {filter}
                </Badge>
              );
            })}
          </div>

          {/* Active Filters Summary */}
          {activeFilters.length > 0 && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">{activeFilters.length}개</span> 필터 적용됨: {activeFilters.join(", ")}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
