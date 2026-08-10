import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { generateDailyContentPackage } from '../services/aiMarketingService';

export default function AiMarketingCenter() {
  const [isAutopilotOn, setIsAutopilotOn] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentPackage, setContentPackage] = useState(null);
  const [error, setError] = useState("");

  const handleGenerateContent = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const data = await generateDailyContentPackage();
      setContentPackage(data);
    } catch (err) {
      setError(err.message || "Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-900">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-white shadow-md flex-shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-blue-600">AI Autopilot</h2>
          <span className="text-xs text-gray-500 font-medium">Stock Scorcher Admin</span>
        </div>
        <nav className="p-4 space-y-2">
          <button className="w-full text-left px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold">📊 Overview</button>
          <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">🧠 AI Content Brain</button>
          <button className="w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">📅 Content Calendar</button>
          <div className="pt-4 mt-4 border-t border-gray-100">
            <Link to="/admin" className="text-sm text-gray-500 hover:text-gray-800 px-4">← Back to Main Admin</Link>
          </div>
        </nav>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Marketing Autopilot</h1>
              <p className="text-gray-500 mt-1">AI-powered content engine for Stock Scorcher.</p>
            </div>
            
            <div className="bg-white p-2 rounded-xl shadow-sm border flex items-center gap-4">
              <span className="font-semibold text-gray-700">System Status:</span>
              <button 
                onClick={() => setIsAutopilotOn(!isAutopilotOn)}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${isAutopilotOn ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${isAutopilotOn ? 'translate-x-9' : 'translate-x-1'}`} />
              </button>
              <span className={`font-bold ${isAutopilotOn ? 'text-green-600' : 'text-gray-500'}`}>
                {isAutopilotOn ? '🟢 ON' : '🔴 OFF'}
              </span>
            </div>
          </div>

          {/* CONTENT GENERATION SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">Today's Generation Queue</h3>
              <button 
                onClick={handleGenerateContent}
                disabled={isGenerating}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {isGenerating ? "🧠 AI is Thinking..." : "⚡ Generate Today's Plan"}
              </button>
            </div>
            
            {error && (
              <div className="p-4 bg-red-50 text-red-600 border-b border-red-100 font-medium">
                {error}
              </div>
            )}

            {!contentPackage && !isGenerating && (
              <div className="p-10 text-center">
                <div className="text-5xl mb-4">🤖</div>
                <h4 className="text-xl font-bold text-gray-700">No content generated for today yet.</h4>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">Click the generate button to let the AI Brain research a topic, write a blog, and script your social media posts.</p>
              </div>
            )}

            {isGenerating && (
              <div className="p-16 text-center">
                <div className="animate-spin text-5xl mb-4">⚙️</div>
                <h4 className="text-xl font-bold text-blue-600 animate-pulse">Analyzing stock market trends & writing content...</h4>
              </div>
            )}

            {/* AI OUTPUT DISPLAY */}
            {contentPackage && !isGenerating && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6 bg-blue-50 p-4 rounded-xl">
                  <div>
                    <h2 className="text-sm text-blue-600 font-bold uppercase tracking-wider">Today's Topic</h2>
                    <h3 className="text-2xl font-black text-gray-900">{contentPackage.topic}</h3>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-500">Quality Score</p>
                    <p className="text-2xl font-black text-green-500">{contentPackage.qualityScore}/100</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* BLOG PREVIEW */}
                  <div className="border rounded-xl p-5 bg-white shadow-sm">
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">✍️ Blog Article</h4>
                    <p className="text-sm font-bold text-gray-500 mb-1">Title: {contentPackage.blog.title}</p>
                    <p className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded inline-block mb-4">{contentPackage.blog.category}</p>
                    <div className="h-48 overflow-y-auto bg-gray-50 p-3 rounded text-sm text-gray-700 border" 
                         dangerouslySetInnerHTML={{ __html: contentPackage.blog.descriptionHtml }} />
                  </div>

                  {/* INSTAGRAM PREVIEW */}
                  <div className="border rounded-xl p-5 bg-white shadow-sm">
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">📸 Instagram Carousel</h4>
                    <p className="text-xs text-gray-500 mb-2">Caption:</p>
                    <p className="text-sm text-gray-700 mb-4 bg-gray-50 p-2 rounded">{contentPackage.instagram.caption}</p>
                    <p className="text-xs text-gray-500 mb-2">Slides ({contentPackage.instagram.carouselSlides.length}):</p>
                    <ul className="text-sm space-y-2">
                      {contentPackage.instagram.carouselSlides.map((slide, idx) => (
                        <li key={idx} className="bg-gray-100 p-2 rounded border-l-4 border-pink-500">{slide}</li>
                      ))}
                    </ul>
                  </div>

                  {/* YOUTUBE SHORT PREVIEW */}
                  <div className="border rounded-xl p-5 bg-white shadow-sm">
                    <h4 className="font-bold text-lg mb-2 flex items-center gap-2">🎥 YouTube Short Script</h4>
                    <p className="text-sm font-bold text-gray-500 mb-2">Title: {contentPackage.youtubeShort.title}</p>
                    <div className="bg-gray-50 p-3 rounded text-sm text-gray-700 border whitespace-pre-wrap h-40 overflow-y-auto">
                      {contentPackage.youtubeShort.script}
                    </div>
                  </div>

                  {/* MESSAGES PREVIEW */}
                  <div className="border rounded-xl p-5 bg-white shadow-sm flex flex-col gap-4">
                    <div>
                      <h4 className="font-bold text-lg mb-1 flex items-center gap-2">✈️ Telegram Broadcast</h4>
                      <p className="bg-blue-50 p-3 rounded text-sm text-gray-800 whitespace-pre-wrap">
                        {contentPackage.telegram.message}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-1 flex items-center gap-2">💬 WhatsApp Message</h4>
                      <p className="bg-green-50 p-3 rounded text-sm text-gray-800 whitespace-pre-wrap">
                        {contentPackage.whatsapp.message}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-4 border-t pt-6">
                  <button onClick={handleGenerateContent} className="px-6 py-2 border rounded-lg text-gray-600 hover:bg-gray-50 font-bold transition">
                    Regenerate Content
                  </button>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition shadow-lg">
                    Approve & Push to Database (Coming Next)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}