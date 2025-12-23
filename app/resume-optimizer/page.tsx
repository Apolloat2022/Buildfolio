// BuildFolio: app/resume-optimizer/page.tsx (or components/ResumeOptimizer.tsx)

'use client';
import { useState } from 'react';

export default function ResumeOptimizer() {
  const [resume, setResume] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analyze = async () => {
    if (!resume.trim() || !jobDescription.trim()) {
      alert('Please fill in both fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://resume-optimizer-one-tau.vercel.app/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume, jobDescription })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Resume Optimizer
        </h1>
        <p className="text-center text-gray-300 mb-12">
          Analyze and optimize your resume to match any job description
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Resume Input */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <label className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
              📄 Your Resume
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your complete resume here..."
              className="w-full h-80 bg-black/30 border-2 border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
            />
            <p className="text-gray-400 text-sm mt-2">{resume.length} characters</p>
          </div>

          {/* Job Description Input */}
          <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
            <label className="flex items-center gap-2 text-xl font-semibold mb-4 text-white">
              🎯 Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the target job description here..."
              className="w-full h-80 bg-black/30 border-2 border-white/10 rounded-xl p-4 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
            />
            <p className="text-gray-400 text-sm mt-2">{jobDescription.length} characters</p>
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={analyze}
          disabled={loading}
          className="w-full max-w-md mx-auto block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl py-4 px-8 rounded-full shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Analyzing...' : '✨ Analyze & Optimize'}
        </button>

        {/* Results */}
        {result && (
          <div className="mt-12 space-y-6">
            {/* Score Card */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-8 border-2" style={{borderColor: result.matchScore >= 80 ? '#10b981' : result.matchScore >= 60 ? '#f59e0b' : '#ef4444'}}>
              <div className="flex flex-col items-center">
                <div className="w-48 h-48 rounded-full flex items-center justify-center mb-6" style={{
                  background: `conic-gradient(${result.matchScore >= 80 ? '#10b981' : result.matchScore >= 60 ? '#f59e0b' : '#ef4444'} ${result.matchScore * 3.6}deg, rgba(255,255,255,0.1) 0deg)`
                }}>
                  <div className="w-40 h-40 rounded-full bg-black/50 flex flex-col items-center justify-center">
                    <div className="text-5xl font-bold text-white">{result.matchScore}%</div>
                    <div className="text-gray-300">Match Score</div>
                  </div>
                </div>
                <p className="text-xl text-center text-gray-200">{result.recommendation}</p>
              </div>
            </div>

            {/* Keywords Found & Missing */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">{result.keywords.length}</span>
                  Keywords Found
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.keywords.map((k, i) => (
                    <span key={i} className="bg-green-500/20 border-2 border-green-500 text-green-400 px-4 py-2 rounded-full font-semibold">
                      {k.toUpperCase()}
                    </span>
                  ))}
                </div>
              </div>

              {result.missing.length > 0 && (
                <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
                  <h3 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm">{result.missing.length}</span>
                    Missing Keywords
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {result.missing.map((k, i) => (
                      <span key={i} className="bg-orange-500/20 border-2 border-orange-500 text-orange-400 px-4 py-2 rounded-full font-semibold">
                        {k.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Optimized Resume */}
            <div className="bg-green-500/10 backdrop-blur-lg rounded-2xl p-6 border border-green-500/30">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">📝 Optimization Report</h3>
                <button
                  onClick={() => navigator.clipboard.writeText(result.optimizedResume)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                >
                  📋 Copy
                </button>
              </div>
              <div className="bg-black/40 rounded-xl p-6 max-h-96 overflow-y-auto">
                <pre className="text-gray-200 text-sm whitespace-pre-wrap font-mono">
                  {result.optimizedResume}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}