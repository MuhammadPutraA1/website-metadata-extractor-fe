"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("http://localhost:3000/extract/website", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to extract data");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-8 flex flex-col items-center">
      <main className="w-full max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-blue-600 sm:text-5xl">
            Website Metadata Extractor
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            Extract title, description, social links, and open graph data easily.
          </p>
        </div>

        <form onSubmit={handleExtract} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-col sm:flex-row gap-4">
          <input
            type="url"
            placeholder="https://example.com"
            className="flex-1 rounded-lg border-gray-300 border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? "Extracting..." : "Extract"}
          </button>
        </form>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-800">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
              <span className="text-gray-300 text-sm font-mono">Result JSON</span>
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
