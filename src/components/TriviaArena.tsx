import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PlayerProfile, TriviaQuestion } from '../types/game';
import { INITIAL_TRIVIA_QUESTIONS, INITIAL_VIET_PHUC_ITEMS } from '../data/gameData';
import { soundEngine } from '../utils/audio';

interface TriviaArenaProps {
  player: PlayerProfile;
  onReward: (exp: number, gold: number, itemId?: string) => void;
  onBack: () => void;
  toast: (msg: string) => void;
}

export const TriviaArena: React.FC<TriviaArenaProps> = ({
  player,
  onReward,
  onBack,
  toast,
}) => {
  const [questionPool, setQuestionPool] = useState<TriviaQuestion[]>([...INITIAL_TRIVIA_QUESTIONS]);
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [totalCorrect, setTotalCorrect] = useState<number>(0);

  const currentQ = questionPool[currentIdx % questionPool.length];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOpt(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;

    if (isCorrect) {
      soundEngine.playCorrect();
      const newStreak = streak + 1;
      setStreak(newStreak);
      setTotalCorrect((c) => c + 1);

      // Reward EXP and Gold
      const expGain = 45 + newStreak * 15;
      const goldGain = 30 + newStreak * 10;

      // Special item reward at milestones
      let rewardItem: string | undefined = undefined;
      if (newStreak === 3 && !player.inventory.includes('non_bai_tho')) {
        rewardItem = 'non_bai_tho';
        confetti({ particleCount: 70, spread: 60 });
        toast('🎉 Đạt mốc 3 câu đúng liên tiếp! Nhận được Nón Bài Thơ Xứ Huế!');
      } else if (newStreak === 5 && !player.inventory.includes('ao_nhat_binh')) {
        rewardItem = 'ao_nhat_binh';
        confetti({ particleCount: 100, spread: 80 });
        toast('👑 Đạt mốc 5 câu đúng! Nhận được Áo Nhật Bình Cung Đình!');
      } else if (newStreak === 8 && !player.inventory.includes('hoang_bao_long_van')) {
        rewardItem = 'hoang_bao_long_van';
        confetti({ particleCount: 150, spread: 100 });
        toast('🐉 Huyền thoại Tri Thức! Mở khóa Hoàng Bào Long Vân!');
      }

      onReward(expGain, goldGain, rewardItem);
    } else {
      soundEngine.playWrong();
      setStreak(0);
      toast('Chưa chính xác! Đọc kỹ phần giải thích để ghi nhớ nhé.');
    }
  };

  const handleNextQuestion = () => {
    soundEngine.playClick();
    setSelectedOpt(null);
    setIsAnswered(false);
    // Move to next question and shuffle slightly if needed
    setCurrentIdx((prev) => (prev + 1) % questionPool.length);
  };

  return (
    <div className="relative w-full h-full bg-[#0c121d] text-[#f0e6d2] overflow-y-auto flex flex-col items-center justify-between p-4 py-6">
      <div className="absolute inset-0 scanlines z-10 pointer-events-none" />
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

      {/* TOP HEADER */}
      <div className="relative z-20 w-full max-w-3xl flex items-center justify-between bg-[#151f2e] border-2 border-[#d4af37] p-3 px-4 shadow-[4px_4px_0_#000] mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🏛️</span>
          <div>
            <h1 className="font-pixel text-xs sm:text-sm text-[#d4af37]">
              ĐẤU TRƯỜNG TRI THỨC ĐẠI VIỆT
            </h1>
            <span className="font-vt text-lg text-slate-300">
              Hỏi đáp văn hóa, lịch sử & nghệ thuật dệt may cổ phục
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 font-pixel text-xs">
          <div className="bg-[#0b0f17] border border-amber-500/60 px-3 py-1 text-amber-300">
            🔥 CHUỖI: {streak}
          </div>
          <button
            onClick={() => {
              soundEngine.playClick();
              onBack();
            }}
            className="pixel-btn bg-[#18202c] hover:bg-[#253245] text-slate-300 border border-slate-600 px-3 py-1 cursor-pointer"
          >
            TRỞ VỀ
          </button>
        </div>
      </div>

      {/* MAIN QUESTION CARD */}
      <div className="relative z-20 w-full max-w-3xl bg-[#141b26] border-3 border-[#d4af37] p-6 shadow-[6px_6px_0_#000] flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Difficulty Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="font-pixel text-[10px] bg-red-950/80 border border-red-500 text-red-300 px-2.5 py-1">
              CHỦ ĐỀ: {currentQ.category}
            </span>
            <span className="font-pixel text-[10px] text-amber-400">
              CÂU HỎI SỐ #{currentIdx + 1}
            </span>
          </div>

          {/* Question Text */}
          <h2 className="font-vt text-2xl sm:text-3xl text-amber-100 font-semibold mb-6 leading-relaxed">
            {currentQ.question}
          </h2>

          {/* 4 Answer Options */}
          <div className="space-y-3">
            {currentQ.options.map((opt, idx) => {
              let optStyle = 'border-slate-700 bg-[#0d141e] hover:border-slate-500 text-slate-200';

              if (isAnswered) {
                if (idx === currentQ.correctIndex) {
                  optStyle = 'border-emerald-500 bg-emerald-950/80 text-emerald-200 shadow-[3px_3px_0_#10b981]';
                } else if (selectedOpt === idx) {
                  optStyle = 'border-rose-500 bg-rose-950/80 text-rose-200 shadow-[3px_3px_0_#ef4444]';
                } else {
                  optStyle = 'border-slate-800 bg-[#080d14] opacity-50 text-slate-400';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`w-full text-left p-3.5 sm:p-4 border-2 font-vt text-xl sm:text-2xl transition-all cursor-pointer flex items-start gap-3 ${optStyle}`}
                >
                  <span className="font-pixel text-xs text-[#d4af37] mt-1 shrink-0">
                    {['A.', 'B.', 'C.', 'D.'][idx]}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Explanation Box when Answered */}
          {isAnswered && (
            <div className="mt-5 p-4 bg-[#0a121c] border-2 border-cyan-500/70 animate-fade-in">
              <div className="flex items-center gap-2 font-pixel text-xs text-cyan-300 mb-1.5">
                <span>💡</span>
                <span>GIẢI THÍCH LỊCH SỬ & VĂN HÓA:</span>
              </div>
              <p className="font-vt text-xl text-slate-200 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-6 pt-4 border-t border-slate-700 flex items-center justify-between">
          <span className="font-pixel text-[10px] text-slate-400">
            Đã trả lời đúng: {totalCorrect} câu
          </span>

          {isAnswered ? (
            <button
              onClick={handleNextQuestion}
              className="pixel-btn bg-[#d13426] hover:bg-[#e04535] text-white border-2 border-black px-6 py-2.5 font-pixel text-xs flex items-center gap-2 cursor-pointer shadow-[3px_3px_0_#000]"
            >
              <span>CÂU TIẾP THEO</span>
              <span>▶</span>
            </button>
          ) : (
            <span className="font-vt text-lg text-amber-300">
              Chọn đáp án để kiểm tra tri thức
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
