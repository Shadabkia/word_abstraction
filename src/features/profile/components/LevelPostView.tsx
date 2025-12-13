import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, MessageCircle, Send, Bookmark, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface PostSlide {
  type: 'cover' | 'story' | 'game';
  image?: string;
  title?: string;
  text?: string;
  backgroundColor?: string;
}

interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  likes: number;
}

interface CampaignLevelPost {
  levelId: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  location: string;
  timestamp: string;
  slides: PostSlide[];
  caption: string;
  likes: number;
  comments: Comment[];
  gameId: string;
  gameLevelNumber: number;
}

interface LevelPostViewProps {
  post: CampaignLevelPost;
  onClose: () => void;
  onStartGame: (gameId: string, levelNumber: number) => void;
}

export function LevelPostView({ post, onClose, onStartGame }: LevelPostViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showComments, setShowComments] = useState(false);

  const nextSlide = () => {
    if (currentSlide < post.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const currentSlideData = post.slides[currentSlide];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black"
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/60 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400" />
            <div>
              <p className="text-white font-semibold text-sm">{post.author.name}</p>
              <p className="text-white/70 text-xs">{post.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Progress Indicators */}
        <div className="flex gap-1 mt-4">
          {post.slides.map((_, index) => (
            <div
              key={index}
              className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: index <= currentSlide ? '100%' : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Slide Content */}
      <div className="h-full flex items-center justify-center relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center px-8"
            style={{ backgroundColor: currentSlideData.backgroundColor || '#000' }}
          >
            {currentSlideData.type === 'cover' && (
              <div className="text-center space-y-6">
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl font-black text-white"
                  dir="rtl"
                >
                  {currentSlideData.title}
                </motion.h1>
                {currentSlideData.text && (
                  <motion.p
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-white/80 max-w-md mx-auto"
                    dir="rtl"
                  >
                    {currentSlideData.text}
                  </motion.p>
                )}
              </div>
            )}

            {currentSlideData.type === 'story' && (
              <div className="max-w-xl space-y-4">
                {currentSlideData.image && (
                  <div className="w-full aspect-square bg-slate-800 rounded-2xl mb-6" />
                )}
                <p className="text-white text-lg leading-relaxed" dir="rtl">
                  {currentSlideData.text}
                </p>
              </div>
            )}

            {currentSlideData.type === 'game' && (
              <div className="text-center space-y-8 relative z-50">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="text-6xl mb-4">🧩</div>
                  <h2 className="text-3xl font-bold text-white mb-2">Ready to Play?</h2>
                  <p className="text-white/70 mb-8">Connect the words to reveal the memory</p>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onStartGame(post.gameId, post.gameLevelNumber);
                  }}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white text-xl py-7 px-12 rounded-full shadow-2xl font-bold cursor-pointer relative z-50"
                >
                  Start Puzzle
                </motion.button>

                <p className="text-white/50 text-sm mt-4">
                  Level {post.gameLevelNumber} • Word Connect
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {currentSlide > 0 && (
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-[60]"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
        )}

        {currentSlide < post.slides.length - 1 && (
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-colors z-10"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        )}

        {/* Tap Areas for Navigation - Only show if not on game slide */}
        {currentSlideData.type !== 'game' && (
          <div className="absolute inset-0 flex pointer-events-none">
            <div className="flex-1 pointer-events-auto" onClick={prevSlide} />
            <div className="flex-1 pointer-events-auto" onClick={nextSlide} />
          </div>
        )}
      </div>

      {/* Footer - Only show on first slide */}
      {currentSlide === 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pb-8"
        >
          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-4">
            <button className="hover:scale-110 transition-transform">
              <Heart className="w-7 h-7 text-white" />
            </button>
            <button
              onClick={() => setShowComments(!showComments)}
              className="hover:scale-110 transition-transform"
            >
              <MessageCircle className="w-7 h-7 text-white" />
            </button>
            <button className="hover:scale-110 transition-transform">
              <Send className="w-7 h-7 text-white" />
            </button>
            <button className="ml-auto hover:scale-110 transition-transform">
              <Bookmark className="w-7 h-7 text-white" />
            </button>
          </div>

          {/* Likes */}
          <p className="text-white font-semibold text-sm mb-2">{post.likes} likes</p>

          {/* Caption */}
          <p className="text-white text-sm">
            <span className="font-semibold mr-2">{post.author.username}</span>
            <span dir="rtl">{post.caption}</span>
          </p>

          {/* View Comments */}
          {post.comments.length > 0 && (
            <button
              onClick={() => setShowComments(!showComments)}
              className="text-white/60 text-sm mt-2 hover:text-white transition-colors"
            >
              View all {post.comments.length} comments
            </button>
          )}

          <p className="text-white/40 text-xs mt-2 uppercase">{post.timestamp}</p>
        </motion.div>
      )}

      {/* Comments Sheet */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[70vh] overflow-y-auto z-30"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Comments</h3>
                <button onClick={() => setShowComments(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>

              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-300 to-slate-400 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold mr-2">{comment.authorName}</span>
                      <span dir="rtl">{comment.text}</span>
                    </p>
                    <p className="text-xs text-slate-400 mt-1">{comment.likes} likes</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

