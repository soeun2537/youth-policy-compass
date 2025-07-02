export const CATEGORY_COLORS: Record<string, string> = {
  '취업지원': 'bg-blue-100 text-blue-800',
  '주거지원': 'bg-green-100 text-green-800',
  '창업지원': 'bg-purple-100 text-purple-800',
  '교육지원': 'bg-orange-100 text-orange-800',
  '생활지원': 'bg-gray-100 text-gray-800',
  '문화/여가': 'bg-pink-100 text-pink-800',
};

export const CATEGORIES = Object.keys(CATEGORY_COLORS);

export function getCategoryColor(category: string) {
  return CATEGORY_COLORS[category] || 'bg-gray-100 text-gray-800';
}

export const CATEGORY_ICONS: Record<string, string> = {
  '취업지원': '💼',
  '주거지원': '🏠',
  '창업지원': '🚀',
  '교육지원': '📚',
  '생활지원': '🛒',
  '문화/여가': '🎨',
}; 