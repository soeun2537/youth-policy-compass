import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import Notifications from "./pages/notifications";
import { useState, useEffect } from "react";
import { FavoritesContext } from "./context/FavoritesContext";
import { allPolicies } from "./lib/allPolicies";

const queryClient = new QueryClient();

const App = () => {
  const [likedPolicyIds, setLikedPolicyIds] = useState<number[]>(() => {
    const saved = localStorage.getItem("likedPolicyIds");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("likedPolicyIds", JSON.stringify(likedPolicyIds));
  }, [likedPolicyIds]);

  const handleLike = (id: number) => {
    setLikedPolicyIds((prev) => {
      const isLiked = prev.includes(id);
      return isLiked ? prev.filter((pid) => pid !== id) : [...prev, id];
    });
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <FavoritesContext.Provider value={{ likedPolicyIds, allPolicies, handleLike }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/notifications" element={<Notifications />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FavoritesContext.Provider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
