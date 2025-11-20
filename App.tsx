import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { ResultsDashboard } from './components/ResultsDashboard';
import { analyzeXSentiment } from './services/geminiService';
import { AnalysisResult } from './types';
import { Activity, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [searchedCompany, setSearchedCompany] = useState<string>("");

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setResult(null);
    setSearchedCompany(query);

    try {
      const data = await analyzeXSentiment(query);
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while analyzing sentiment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30 pb-20">
      
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-blue-900/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-purple-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center mb-10 space-y-6">
          
          {/* Logo Icon */}
          <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl backdrop-blur-sm">
             <Activity className="w-8 h-8 text-blue-500" />
          </div>

          {/* Description */}
          <div className="max-w-2xl">
            <p className="text-slate-400 text-lg">
              Analyze real-time investment sentiment from X (Twitter) discussions using AI-powered search grounding.
            </p>
          </div>

          {/* Search Bar - Centered */}
          <div className="w-full max-w-2xl">
            <SearchBar onSearch={handleSearch} isLoading={loading} />
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative w-16 h-16 mb-4">
               <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
               <div className="absolute inset-2 border-t-2 border-purple-500 rounded-full animate-spin reverse"></div>
            </div>
            <p className="text-slate-500 text-sm animate-pulse tracking-wider uppercase">Analyzing Market Sentiment...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-950/20 border border-red-900/40 rounded-xl p-4 flex items-center gap-3 text-red-300 mb-10">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Results Dashboard */}
        {!loading && !error && result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ResultsDashboard result={result} companyName={searchedCompany} />
          </div>
        )}

        {/* Empty State / Feature Highlights */}
        {!loading && !result && !error && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center opacity-50">
             {/* Placeholder for initial state if needed, keeping it clean for now as per screenshot which focuses on results */}
          </div>
        )}

      </div>
    </div>
  );
};

export default App;