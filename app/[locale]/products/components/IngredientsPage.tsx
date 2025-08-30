"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { nagaBalmIngredients } from '../ingredients';
import { useRouter } from 'next/navigation';
import Footer from '../../home/components/Footer';
import Image from 'next/image';

const ITEMS_PER_PAGE = 9;

const IngredientsPage = () => {
  const router = useRouter();
  const gridRef = useRef<HTMLDivElement>(null);
  const didMount = useRef(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<typeof nagaBalmIngredients[0] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique categories
  const categories = ['all', ...new Set(nagaBalmIngredients.map(ing => ing.category))];

  // Filter ingredients based on category and search
  const filteredIngredients = nagaBalmIngredients.filter(ing => {
    const matchesCategory = selectedCategory === 'all' || ing.category === selectedCategory;
    const matchesSearch = ing.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ing.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ing.majorBenefit.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredIngredients.length / ITEMS_PER_PAGE);
  const paginatedIngredients = filteredIngredients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Reset to first page when filters/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchQuery]);

  // Smooth scroll to grid after category changes (NOT search changes)
  useEffect(() => {
    if (didMount.current && gridRef.current) {
      const rect = gridRef.current.getBoundingClientRect();
      const headerOffset = 100;
      const fullyVisible = rect.top >= headerOffset && rect.bottom <= window.innerHeight;

      if (!fullyVisible) {
        const y = rect.top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    } else {
      didMount.current = true;
    }
  }, [selectedCategory]); // Only trigger on category change, not search

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="w-full bg-[#F9461C] text-white py-16 relative">
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-8 left-8 flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">←</span>
          <span className="font-bold">Go Back</span>
        </button>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold mb-4">Discover Ingredients</h1>
            <p className="text-lg opacity-90">Discover what's inside Naga Balm.</p>
          </div>
          <div className="hidden sm:block">
            <Image 
              src="/images/Logo/Naga Balm__Brandmark_White.png" 
              alt="Naga Balm Logo" 
              width={120} 
              height={120} 
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="max-w-6xl mx-auto px-4 py-8" ref={gridRef}>
        <div className="w-full mb-12 space-y-6">
          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search ingredients..."
                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#F9461C] focus:ring-2 focus:ring-[#F9461C] focus:ring-opacity-20 transition-all duration-300 text-base"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#F9461C] transition-colors duration-200"
                  aria-label="Clear search"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex justify-center px-4">
            <div className="w-full sm:w-auto max-w-7xl">
              {/* Mobile: Grid Layout */}
              <div className="grid grid-cols-2 gap-2 sm:hidden bg-gray-50 p-3 rounded-2xl border border-gray-200">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-3 py-2.5 rounded-full font-bold text-xs transition-all duration-300 whitespace-nowrap text-center ${
                      selectedCategory === category
                        ? "bg-[#F9461C] text-white shadow-lg"
                        : "bg-white text-gray-600 hover:bg-gray-100 hover:text-[#F9461C] shadow-sm"
                    } ${category === 'all' ? 'col-span-2' : ''}`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
              
              {/* Desktop: Horizontal Layout */}
              <div className="hidden sm:flex flex-nowrap gap-2 lg:gap-3 xl:gap-4 bg-gray-50 p-2 rounded-full border border-gray-200 justify-center w-full">
                {categories.map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => handleCategoryChange(category)}
                    className={`px-2 md:px-4 lg:px-5 xl:px-6 py-3 rounded-full font-bold text-xs md:text-sm transition-all duration-300 whitespace-nowrap ${
                      selectedCategory === category
                        ? "bg-[#F9461C] text-white shadow-lg scale-105"
                        : "bg-white text-gray-600 hover:bg-gray-100 hover:text-[#F9461C] shadow-sm hover:shadow-md"
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="flex justify-center">
            <div className="text-gray-600 text-sm">
              {searchQuery ? (
                <span>
                  Showing <span className="font-bold text-[#F9461C]">{filteredIngredients.length}</span> ingredients for "
                  <span className="font-medium text-gray-800">{searchQuery}</span>"
                  {selectedCategory !== "all" && (
                    <span> in <span className="font-medium text-[#F9461C]">{selectedCategory}</span></span>
                  )}
                </span>
              ) : (
                <span>
                  Showing <span className="font-bold text-[#F9461C]">{filteredIngredients.length}</span> ingredients
                  {selectedCategory !== "all" && (
                    <span> in <span className="font-medium text-[#F9461C]">{selectedCategory}</span></span>
                  )}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Ingredients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedIngredients.map((ingredient, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border border-gray-200 p-6 cursor-pointer transition-shadow hover:shadow-lg"
              onClick={() => setSelectedIngredient(ingredient)}
            >
              <div className="text-[#F9461C] font-bold text-xl mb-2">{ingredient.name}</div>
              <div className="text-sm text-gray-600 mb-4">{ingredient.category}</div>
              <p className="text-gray-800 mb-4">{ingredient.majorBenefit}</p>
              <div className="flex flex-wrap gap-2">
                <span className="bg-[#FFE6B0] text-[#F9461C] px-3 py-1 rounded-full text-sm">
                  Learn More →
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border border-[#F9461C] text-[#F9461C] bg-white font-bold disabled:opacity-50"
              aria-label="Previous page"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                type="button"
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded font-bold ${
                  currentPage === i + 1
                    ? 'bg-[#F9461C] text-white'
                    : 'bg-white text-[#F9461C] border border-[#F9461C]'
                }`}
                aria-current={currentPage === i + 1 ? 'page' : undefined}
              >
                {i + 1}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 rounded border border-[#F9461C] text-[#F9461C] bg-white font-bold disabled:opacity-50"
              aria-label="Next page"
            >
              &gt;
            </button>
          </div>
        )}
      </div>

      {/* Ingredient Modal */}
      {selectedIngredient && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedIngredient(null)}
        >
          <div
            className="bg-white max-w-3xl w-full rounded-xl overflow-auto max-h-[90vh] p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="absolute top-4 right-4 text-[#F9461C] text-2xl font-bold"
              onClick={() => setSelectedIngredient(null)}
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold text-[#F9461C] mb-4">{selectedIngredient.name}</h2>
            <div className="text-sm text-gray-600 mb-6">{selectedIngredient.category}</div>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold text-lg mb-2">Major Benefit</h3>
                <p className="text-gray-800">{selectedIngredient.majorBenefit}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Minor Benefits</h3>
                <p className="text-gray-800">{selectedIngredient.minorBenefit}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Common Uses</h3>
                <p className="text-gray-800">{selectedIngredient.useCases}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Source</h3>
                <p className="text-gray-800">{selectedIngredient.source}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Khmer Tradition</h3>
                <p className="text-gray-800">{selectedIngredient.khmerTradition}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Scientific Insight</h3>
                <p className="text-gray-800">{selectedIngredient.scientificInsight}</p>
              </div>

              <div>
                <h3 className="font-bold text-lg mb-2">Cultural Fact</h3>
                <p className="text-gray-800">{selectedIngredient.culturalFact}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default IngredientsPage; 