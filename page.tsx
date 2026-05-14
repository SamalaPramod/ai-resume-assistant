export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-[#0f172a] text-white p-6 md:p-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
        <div>
          <h1 className="text-5xl font-black tracking-tight">
            AI Resume Dashboard
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Build ATS-friendly resumes using AI
          </p>
        </div>

        <div className="flex gap-4">
          <button className="bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-2xl border border-slate-700 transition">
            Upgrade
          </button>

          <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-6 py-3 rounded-2xl font-bold transition">
            Logout
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* ATS Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">
              ATS Score
            </h2>

            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-sm">
              Excellent
            </div>
          </div>

          <div className="text-6xl font-black text-cyan-400 mb-4">
            85%
          </div>

          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden mb-4">
            <div className="bg-cyan-400 h-full w-[85%] rounded-full" />
          </div>

          <p className="text-slate-400">
            Your resume is optimized for most ATS systems.
          </p>
        </div>

        {/* Upload */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">
            Upload Resume
          </h2>

          <div className="border-2 border-dashed border-slate-700 hover:border-cyan-400 transition rounded-3xl h-[220px] flex flex-col items-center justify-center text-center px-6 cursor-pointer bg-slate-950">
            <div className="text-5xl mb-4">📄</div>

            <p className="text-lg font-semibold mb-2">
              Drag & Drop Resume
            </p>

            <p className="text-slate-400 text-sm">
              Upload PDF or DOCX files
            </p>
          </div>
        </div>

        {/* AI Suggestions */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-7 shadow-xl">
          <h2 className="text-2xl font-bold mb-6">
            AI Suggestions
          </h2>

          <div className="space-y-4">
            <div className="bg-slate-800 rounded-2xl p-4">
              <p className="font-medium">
                ✔ Add React & TypeScript keywords
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4">
              <p className="font-medium">
                ✔ Improve project achievements
              </p>
            </div>

            <div className="bg-slate-800 rounded-2xl p-4">
              <p className="font-medium">
                ✔ Add measurable impact metrics
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Resume History */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Resume History
            </h2>

            <p className="text-slate-400 mt-2">
              Manage your generated resumes
            </p>
          </div>

          <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-5 py-3 rounded-2xl font-bold transition">
            + Create Resume
          </button>
        </div>

        <div className="space-y-5">
          {/* Resume Item */}
          <div className="bg-slate-800 hover:bg-slate-700 transition rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Software Engineer Resume
              </h3>

              <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                <span>Last edited 2 hours ago</span>
                <span>•</span>
                <span>ATS Score: 85%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="bg-slate-900 px-5 py-3 rounded-2xl border border-slate-600 hover:border-cyan-400 transition">
                Edit
              </button>

              <button className="bg-cyan-400 text-black px-5 py-3 rounded-2xl font-bold hover:bg-cyan-300 transition">
                View
              </button>
            </div>
          </div>

          {/* Resume Item */}
          <div className="bg-slate-800 hover:bg-slate-700 transition rounded-3xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                Frontend Developer Resume
              </h3>

              <div className="flex flex-wrap gap-3 text-sm text-slate-400">
                <span>Last edited yesterday</span>
                <span>•</span>
                <span>ATS Score: 81%</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button className="bg-slate-900 px-5 py-3 rounded-2xl border border-slate-600 hover:border-cyan-400 transition">
                Edit
              </button>

              <button className="bg-cyan-400 text-black px-5 py-3 rounded-2xl font-bold hover:bg-cyan-300 transition">
                View
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
