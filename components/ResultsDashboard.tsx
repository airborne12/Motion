import React from 'react';
import { AnalysisResult } from '../types';
import { SentimentGauge } from './SentimentGauge';
import { TrendingUp, Hash, ExternalLink } from 'lucide-react';

interface ResultsDashboardProps {
  result: AnalysisResult;
  companyName: string;
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({ result, companyName }) => {
  const { data, sources } = result;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column (Sentiment & Tags) - Spans 4 columns */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Sentiment Gauge Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-1 backdrop-blur-sm overflow-hidden relative">
          {/* Blue highlight border effect on focus if desired, simply using border-slate-800 for now */}
           <div className="bg-slate-950/50 rounded-xl p-6 h-72 relative flex flex-col items-center justify-center border border-slate-800/50">
             <SentimentGauge score={data.score} sentiment={data.sentiment} />
           </div>
        </div>
        
        {/* Trending Tags Card */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-5">
            <Hash className="w-4 h-4 text-blue-500" />
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Trending Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.trendingHashtags.length > 0 ? (
              data.trendingHashtags.map((tag, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors cursor-default">
                  {tag}
                </span>
              ))
            ) : (
              <span className="text-slate-600 text-xs italic">No trending tags found.</span>
            )}
          </div>
        </div>

      </div>

      {/* Right Column (Market Pulse) - Spans 8 columns */}
      <div className="lg:col-span-8">
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm h-full">
          
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-purple-500" />
            <h3 className="text-sm font-bold text-purple-400 uppercase tracking-widest">Market Pulse: {companyName}</h3>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <p className="text-slate-200 text-lg leading-relaxed">
              {data.summary}
            </p>
          </div>

          {/* Key Insights */}
          <div className="mb-8">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Key Insights</h4>
            <ul className="space-y-3">
              {data.keyPoints.map((point, idx) => (
                <li key={idx} className="flex items-start gap-3 group">
                  <span className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 group-hover:bg-blue-400 transition-colors"></span>
                  <span className="text-slate-300 text-base leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>

           {/* Sources (Subtle footer) */}
           {sources.length > 0 && (
             <div className="pt-6 border-t border-slate-800/50">
               <div className="flex flex-wrap gap-x-6 gap-y-2">
                 {sources.slice(0, 4).map((source, idx) => (
                   <a 
                     key={idx} 
                     href={source.uri} 
                     target="_blank" 
                     rel="noreferrer"
                     className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-400 transition-colors"
                   >
                     <ExternalLink className="w-3 h-3" />
                     <span className="truncate max-w-[150px]">{source.title}</span>
                   </a>
                 ))}
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
};