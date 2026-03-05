import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Code, Database, Layout, Server, Globe, Sparkles, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';

const roles = [
  { id: 'frontend', title: 'Frontend Developer', icon: Layout, color: 'bg-blue-50 text-blue-600' },
  { id: 'backend', title: 'Backend Developer', icon: Server, color: 'bg-green-50 text-green-600' },
  { id: 'fullstack', title: 'Full Stack Developer', icon: Globe, color: 'bg-purple-50 text-purple-600' },
  { id: 'java', title: 'Java Developer', icon: Code, color: 'bg-orange-50 text-orange-600' },
  { id: 'data', title: 'Data Analyst', icon: Database, color: 'bg-cyan-50 text-cyan-600' },
];

const difficulties = [
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
];

export default function Dashboard() {
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const navigate = useNavigate();

  const handleStart = () => {
    if (!selectedRole) return;
    navigate(`/interview?role=${selectedRole}&difficulty=${selectedDifficulty}`);
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-serif font-bold text-[#1A1A1A]">Start Your Practice</h1>
        <p className="text-[#1A1A1A]/60 mt-2 text-lg">Select a role and difficulty level to begin your AI-powered mock interview.</p>
      </header>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Select Role</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roles.map((role) => (
            <motion.button
              key={role.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole(role.title)}
              className={cn(
                "p-6 rounded-[24px] border-2 text-left transition-all",
                selectedRole === role.title
                  ? "border-[#5A5A40] bg-white shadow-lg shadow-black/5"
                  : "border-transparent bg-white hover:border-[#5A5A40]/30"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", role.color)}>
                <role.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-[#1A1A1A]">{role.title}</h3>
            </motion.button>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-xl font-bold text-[#1A1A1A]">Difficulty Level</h2>
        <div className="flex gap-4">
          {difficulties.map((diff) => (
            <button
              key={diff.id}
              onClick={() => setSelectedDifficulty(diff.id)}
              className={cn(
                "px-8 py-3 rounded-full font-medium transition-all",
                selectedDifficulty === diff.id
                  ? "bg-[#5A5A40] text-white"
                  : "bg-white text-[#1A1A1A]/60 hover:bg-black/5"
              )}
            >
              {diff.label}
            </button>
          ))}
        </div>
      </section>

      <div className="pt-8">
        <button
          onClick={handleStart}
          disabled={!selectedRole}
          className="group relative w-full md:w-auto bg-[#5A5A40] text-white px-12 py-5 rounded-2xl font-bold text-lg hover:bg-[#4A4A30] transition-all disabled:opacity-50 flex items-center justify-center gap-3 overflow-hidden"
        >
          <Sparkles className="w-5 h-5" />
          <span>Start Interview</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
}
