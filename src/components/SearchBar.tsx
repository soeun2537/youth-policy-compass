import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X } from "lucide-react";
import { allPolicies } from "../lib/allPolicies";
import { CATEGORY_ICONS } from "../lib/categoryColors";

interface SearchBarProps {
  onSearch?: (query: string) => void;
  onFilterChange?: (filters: string[]) => void;
  placeholder?: string;
  showQuickFilters?: boolean;
  activeFilters?: string[];
}

const SearchBar = ({ 
  onSearch, 
  onFilterChange, 
  placeholder = "정책을 검색해보세요",
  showQuickFilters = true,
  activeFilters = [],
}: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const quickFilters = [
    "취업지원", "주거지원", "창업지원", "교육지원", "생활지원", "문화/여가"
  ];

  // 자동 완성 추천어 추출
  const getSuggestions = (input: string) => {
    if (!input.trim()) return [];
    const lower = input.toLowerCase();
    const titles = allPolicies
      .map(p => p.title)
      .filter(title => title.toLowerCase().includes(lower));
    const tags = allPolicies
      .flatMap(p => p.tags)
      .filter((tag, i, arr) => tag.toLowerCase().includes(lower) && arr.indexOf(tag) === i);
    const institutions = allPolicies
      .map(p => p.institution)
      .filter((inst, i, arr) => inst.toLowerCase().includes(lower) && arr.indexOf(inst) === i);
    // 중복 제거 및 최대 8개만
    const suggestions = Array.from(new Set([...titles, ...tags, ...institutions])).slice(0, 8);
    return suggestions;
  };
  const suggestions = getSuggestions(searchQuery);

  const handleSearch = () => {
    onSearch?.(searchQuery);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    onSearch?.(suggestion);
  };

  const toggleFilter = (filter: string) => {
    const newFilters = activeFilters.includes(filter)
      ? activeFilters.filter(f => f !== filter)
      : [...activeFilters, filter];
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
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
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          className="pl-12 pr-20 py-6 text-base rounded-xl border-2 focus:border-blue-500"
          onFocus={() => setShowSuggestions(true)}
          autoComplete="off"
        />
        <Button 
          onClick={handleSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-lg ml-2 py-3"
        >
          검색
        </Button>
        {/* 자동 완성 추천어 드롭다운 */}
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute left-0 right-0 top-full z-20 bg-white border border-gray-200 rounded-b-xl shadow-lg max-h-56 overflow-auto mt-1">
            {suggestions.map((s, i) => (
              <li
                key={s + i}
                className="px-4 py-2 cursor-pointer hover:bg-blue-50 text-gray-700 text-base"
                onMouseDown={() => handleSuggestionClick(s)}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Quick Filters */}
      {showQuickFilters && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span></span>
          </div>
          
          <div className="flex flex-wrap gap-3 mt-2">
            {quickFilters.map((filter) => {
              const isActive = activeFilters.includes(filter);
              return (
                <div key={filter}>
                <Badge
                  variant={isActive ? "default" : "outline"}
                    className={`cursor-pointer transition-all flex items-center gap-2 shadow-md px-4 py-2 text-base font-semibold rounded-xl border-2 ${
                    isActive 
                        ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700" 
                        : "bg-white text-gray-700 border-gray-200 hover:bg-blue-50 hover:border-blue-300"
                  }`}
                  onClick={() => toggleFilter(filter)}
                    style={{ boxShadow: isActive ? '0 2px 8px 0 rgba(37, 99, 235, 0.15)' : '0 1px 4px 0 rgba(0,0,0,0.06)' }}
                >
                    <span className="text-lg">{CATEGORY_ICONS[filter]}</span>
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
