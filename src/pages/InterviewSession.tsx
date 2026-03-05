import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2, Send, CheckCircle2, AlertCircle, ArrowRight, Trophy, Star, MessageSquare, RefreshCw } from 'lucide-react';
import { generateInterviewQuestions, evaluateAnswer } from '../services/geminiService';
import { useAuth } from '../context/AuthContext';
import { cn } from '../lib/utils';

interface Evaluation {
  score: number;
  feedback: string;
  improvement: string;
  idealAnswer: string;
}

export default function InterviewSession() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const role = searchParams.get('role') || 'Software Developer';
  const difficulty = searchParams.get('difficulty') || 'medium';

  const [questions, setQuestions] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const qs = await generateInterviewQuestions(role, difficulty);
        setQuestions(qs);
      } catch (error) {
        console.error('Failed to generate questions', error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [role, difficulty]);

  const handleNext = async () => {
    if (!currentAnswer.trim()) return;
    
    setSubmitting(true);
    try {
      const evaluation = await evaluateAnswer(questions[currentStep], currentAnswer, role);
      setEvaluations([...evaluations, evaluation]);
      setAnswers([...answers, currentAnswer]);
      setCurrentAnswer('');
      
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        setIsFinished(true);
      }
    } catch (error) {
      console.error('Evaluation failed', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const totalScore = evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length;
    try {
      const res = await fetch('/api/interview/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          role,
          difficulty,
          questions,
          answers,
          evaluations,
          totalScore
        })
      });
      if (res.ok) {
        navigate('/history');
      }
    } catch (error) {
      console.error('Failed to save interview', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#5A5A40]" />
        <p className="text-[#1A1A1A]/60 font-medium animate-pulse">AI is preparing your interview questions...</p>
      </div>
    );
  }

  if (isFinished) {
    const avgScore = evaluations.reduce((acc, curr) => acc + curr.score, 0) / evaluations.length;
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        <div className="bg-white rounded-[32px] p-12 text-center shadow-xl shadow-black/5">
          <div className="w-20 h-20 bg-yellow-50 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#1A1A1A]">Interview Complete!</h1>
          <p className="text-[#1A1A1A]/60 mt-2 text-lg">Great job! Here's how you performed.</p>
          
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-[#F5F5F0] rounded-3xl">
              <p className="text-sm font-medium text-[#1A1A1A]/40 uppercase tracking-wider">Overall Score</p>
              <p className="text-5xl font-serif font-bold text-[#5A5A40] mt-2">{avgScore.toFixed(1)}<span className="text-2xl text-[#1A1A1A]/20">/10</span></p>
            </div>
            <div className="p-6 bg-[#F5F5F0] rounded-3xl">
              <p className="text-sm font-medium text-[#1A1A1A]/40 uppercase tracking-wider">Questions</p>
              <p className="text-5xl font-serif font-bold text-[#1A1A1A] mt-2">{questions.length}</p>
            </div>
            <div className="p-6 bg-[#F5F5F0] rounded-3xl">
              <p className="text-sm font-medium text-[#1A1A1A]/40 uppercase tracking-wider">Role</p>
              <p className="text-2xl font-bold text-[#1A1A1A] mt-2 truncate">{role}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Detailed Feedback</h2>
          {evaluations.map((evalItem, idx) => (
            <div key={idx} className="bg-white rounded-[24px] p-8 space-y-6 shadow-sm border border-black/5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-bold text-[#5A5A40] uppercase tracking-wider mb-2">Question {idx + 1}</p>
                  <h3 className="text-xl font-medium text-[#1A1A1A]">{questions[idx]}</h3>
                </div>
                <div className="flex items-center gap-2 bg-[#F5F5F0] px-4 py-2 rounded-full">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-bold text-[#1A1A1A]">{evalItem.score}/10</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                    <MessageSquare className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">Feedback</span>
                  </div>
                  <p className="text-[#1A1A1A]/80 leading-relaxed">{evalItem.feedback}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[#1A1A1A]/60">
                    <RefreshCw className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-wider">Improvement</span>
                  </div>
                  <p className="text-[#1A1A1A]/80 leading-relaxed">{evalItem.improvement}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-black/5">
                <p className="text-sm font-bold text-[#1A1A1A]/40 uppercase tracking-wider mb-3">Ideal Answer</p>
                <p className="text-[#1A1A1A]/60 italic leading-relaxed">{evalItem.idealAnswer}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-4 pt-8">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#5A5A40] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#4A4A30] transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            <span>Save to History</span>
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 bg-white text-[#1A1A1A] py-5 rounded-2xl font-bold text-lg hover:bg-black/5 transition-all flex items-center justify-center gap-3 border border-black/5"
          >
            <ArrowRight className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-bold text-[#5A5A40] uppercase tracking-wider">Question {currentStep + 1} of {questions.length}</p>
          <h1 className="text-2xl font-serif font-bold text-[#1A1A1A]">{role} Interview</h1>
        </div>
        <div className="w-32 h-2 bg-black/5 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#5A5A40] transition-all duration-500" 
            style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-[32px] p-10 shadow-xl shadow-black/5 border border-black/5"
        >
          <div className="flex gap-4 mb-6">
            <div className="w-10 h-10 bg-[#5A5A40]/10 rounded-xl flex items-center justify-center text-[#5A5A40] shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-2xl font-medium text-[#1A1A1A] leading-relaxed">
              {questions[currentStep]}
            </h2>
          </div>

          <div className="space-y-4">
            <label className="text-sm font-bold text-[#1A1A1A]/40 uppercase tracking-wider ml-1">Your Answer</label>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-48 bg-[#F5F5F0] border-none rounded-2xl p-6 text-lg focus:ring-2 focus:ring-[#5A5A40] transition-all resize-none"
            />
          </div>

          <div className="flex items-center justify-between mt-8">
            <div className="flex items-center gap-2 text-[#1A1A1A]/40 text-sm">
              <AlertCircle className="w-4 h-4" />
              <span>Take your time to explain clearly.</span>
            </div>
            <button
              onClick={handleNext}
              disabled={!currentAnswer.trim() || submitting}
              className="bg-[#5A5A40] text-white px-10 py-4 rounded-xl font-bold hover:bg-[#4A4A30] transition-all disabled:opacity-50 flex items-center gap-3"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <span>{currentStep === questions.length - 1 ? 'Finish Interview' : 'Next Question'}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
