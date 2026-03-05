import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar, ChevronRight, Star, Briefcase, Loader2, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface Interview {
  id: number;
  role: string;
  difficulty: string;
  totalScore: number;
  date: string;
  questions: string[];
  evaluations: any[];
}

export default function HistoryPage() {
  const [history, setHistory] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/interview/history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        setHistory(data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 animate-spin text-[#5A5A40]" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-serif font-bold text-[#1A1A1A] dark:text-[#F5F5F0]">Interview History</h1>
        <p className="text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60 mt-2 text-lg">Review your past performances and track your progress.</p>
      </header>

      {history.length === 0 ? (
        <div className="bg-white dark:bg-[#141414] rounded-[32px] p-12 text-center border border-black/5 dark:border-white/5 transition-colors duration-300">
          <div className="w-16 h-16 bg-[#F5F5F0] dark:bg-[#1A1A1A] rounded-full flex items-center justify-center mx-auto mb-4 text-[#1A1A1A]/20 dark:text-[#F5F5F0]/20 transition-colors duration-300">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-[#F5F5F0]">No interviews yet</h3>
          <p className="text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60 mt-2">Complete your first interview to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {history.map((interview) => (
            <motion.div
              key={interview.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-[#141414] rounded-[24px] p-6 border border-black/5 dark:border-white/5 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5 transition-all group cursor-pointer"
              onClick={() => setSelectedInterview(selectedInterview?.id === interview.id ? null : interview)}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F0] dark:bg-[#1A1A1A] rounded-2xl flex items-center justify-center text-[#5A5A40] dark:text-[#A8A880] transition-colors duration-300">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#1A1A1A] dark:text-[#F5F5F0]">{interview.role}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-xs text-[#1A1A1A]/40 dark:text-[#F5F5F0]/40 font-medium uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {new Date(interview.date).toLocaleDateString()}
                      </div>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                        interview.difficulty === 'hard' ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400' :
                        interview.difficulty === 'medium' ? 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' :
                        'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      )}>
                        {interview.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs font-bold text-[#1A1A1A]/40 dark:text-[#F5F5F0]/40 uppercase tracking-wider">Score</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-xl font-serif font-bold text-[#1A1A1A] dark:text-[#F5F5F0]">{interview.totalScore?.toFixed(1)}</span>
                    </div>
                  </div>
                  <ChevronRight className={cn(
                    "w-6 h-6 text-[#1A1A1A]/20 dark:text-[#F5F5F0]/20 transition-transform",
                    selectedInterview?.id === interview.id && "rotate-90"
                  )} />
                </div>
              </div>

              {/* Expanded Details */}
              {selectedInterview?.id === interview.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-8 pt-8 border-t border-black/5 dark:border-white/5 space-y-6"
                >
                  {interview.questions.map((q, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm font-medium text-[#1A1A1A]/80 dark:text-[#F5F5F0]/80 flex-1">
                          <span className="font-bold text-[#5A5A40] dark:text-[#A8A880] mr-2">{idx + 1}.</span>
                          {q}
                        </p>
                        <span className="text-xs font-bold text-[#5A5A40] dark:text-[#A8A880] bg-[#F5F5F0] dark:bg-[#1A1A1A] px-2 py-1 rounded-lg transition-colors duration-300">
                          {interview.evaluations[idx].score}/10
                        </span>
                      </div>
                      <div className="pl-6 border-l-2 border-[#F5F5F0] dark:border-[#1A1A1A]">
                        <p className="text-sm text-[#1A1A1A]/60 dark:text-[#F5F5F0]/60 italic">"{interview.evaluations[idx].feedback}"</p>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
