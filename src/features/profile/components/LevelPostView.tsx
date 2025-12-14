import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Bookmark, Heart, MessageCircle, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/shared/ui/carousel';
import type { CampaignLevelPost, CampaignPostCarouselSlide, Comment } from '@/core/services/campaignManager';

interface LevelPostViewProps {
  post: CampaignLevelPost;
  onClose: () => void;
  onStartGame: (gameId: 'word-connect', levelNumber: number, campaignLevelId: string) => void;
}

function FallbackImage({
  candidates,
  alt,
  className,
}: {
  candidates: string[];
  alt: string;
  className?: string;
}) {
  const [idx, setIdx] = useState(0);
  const src = candidates[idx];
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => {
        if (idx < candidates.length - 1) setIdx(idx + 1);
      }}
    />
  );
}

export function LevelPostView({ post, onClose, onStartGame }: LevelPostViewProps) {
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [commentDraft, setCommentDraft] = useState('');
  const [comments, setComments] = useState<Comment[]>(() => post.comments);

  const startCandidates = useMemo(() => {
    if (post.carousel.startScreenImageCandidates?.length) return post.carousel.startScreenImageCandidates;
    if (post.carousel.startScreenImageUrl) return [post.carousel.startScreenImageUrl];
    return [];
  }, [post.carousel.startScreenImageCandidates, post.carousel.startScreenImageUrl]);

  type ViewSlide =
    | CampaignPostCarouselSlide
    | {
        type: 'start';
        id: 'start';
        imageCandidates: string[];
      };

  const slides: ViewSlide[] = useMemo(() => {
    const base = post.carousel.slides as ViewSlide[];
    if (!startCandidates.length) return base;
    return [...base, { type: 'start', id: 'start', imageCandidates: startCandidates }];
  }, [post.carousel.slides, startCandidates]);

  const isMultiSlide = slides.length > 1;
  const isOnStartSlide = startCandidates.length > 0 && activeSlide === slides.length - 1;

  useEffect(() => {
    if (!carouselApi) return;
    const sync = () => setActiveSlide(carouselApi.selectedScrollSnap());
    sync();
    carouselApi.on('select', sync);
    carouselApi.on('reInit', sync);
    return () => {
      carouselApi.off('select', sync);
      carouselApi.off('reInit', sync);
    };
  }, [carouselApi]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const visibleComments = useMemo(() => {
    if (isCommentsExpanded) return comments;
    return comments.slice(0, 2);
  }, [comments, isCommentsExpanded]);

  const canPostComment = commentDraft.trim().length > 0;

  const handlePostComment = () => {
    if (!canPostComment) return;
    const text = commentDraft.trim();
    setComments((prev) => [
      ...prev,
      {
        id: `local_${Date.now()}`,
        authorId: 'me',
        authorName: 'You',
        text,
        likes: 0,
      },
    ]);
    setCommentDraft('');
    setIsCommentsExpanded(true);
  };

  const renderSlide = (slide: ViewSlide) => {
    if (slide.type === 'start') {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <FallbackImage
            candidates={slide.imageCandidates}
            alt="Start screen"
            className="w-full h-full object-contain"
          />
        </div>
      );
    }

    const candidates =
      slide.imageCandidates?.length ? slide.imageCandidates : slide.imageUrl ? [slide.imageUrl] : [];

    if (slide.type === 'comic') {
      return (
        <div className="w-full h-full bg-black flex items-center justify-center">
          {candidates.length > 0 ? (
            <FallbackImage candidates={candidates} alt={slide.title || ''} className="w-full h-full object-contain" />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
              {slide.title && <h2 className="text-2xl font-bold text-white mb-3">{slide.title}</h2>}
              {slide.beats?.length ? (
                <div className="space-y-2 max-w-md mx-auto">
                  {slide.beats.map((beat, i) => (
                    <p key={i} className="text-white/80 text-base" dir="auto">
                      {beat}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-white/70">Comic slide</p>
              )}
            </div>
          )}
        </div>
      );
    }

    // legacy
    return (
      <div
        className="w-full h-full flex items-center justify-center"
        style={{ backgroundColor: slide.backgroundColor || '#0b0b0f' }}
      >
        {candidates.length > 0 ? (
          <FallbackImage candidates={candidates} alt={slide.title || ''} className="w-full h-full object-contain" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-8">
            {slide.title && (
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4" dir="auto">
                {slide.title}
              </h2>
            )}
            {slide.text && (
              <p className="text-white/85 text-base sm:text-lg max-w-md" dir="auto">
                {slide.text}
              </p>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-white"
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.15 }}
        className="w-full h-full overflow-hidden flex flex-col"
      >
        {/* Top bar (Instagram-like page header) */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-slate-100">
          <div className="mx-auto w-full max-w-[520px] flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="w-9 h-9 -ml-2 rounded-full hover:bg-slate-100 transition-colors flex items-center justify-center flex-shrink-0"
                aria-label="Back"
              >
                <ArrowLeft className="w-5 h-5 text-slate-900" />
              </button>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{post.author.username}</p>
                <p className="text-xs text-slate-500 truncate">{post.location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content container (centered like Instagram feed) */}
        <div className="w-full flex-1 overflow-hidden">
          <div className="mx-auto w-full max-w-[520px] h-full flex flex-col overflow-hidden">
            {/* Carousel media */}
            <div className="bg-black">
              <Carousel setApi={setCarouselApi} opts={{ loop: false, align: 'start' }} className="w-full">
            <CarouselContent className="ml-0">
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="pl-0">
                  <div className="w-full aspect-square">{renderSlide(slide)}</div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {isMultiSlide && (
            <div className="bg-white">
              <div className="flex items-center justify-center gap-1.5 py-2">
                {slides.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full transition-colors ${
                      i === activeSlide ? 'bg-slate-900' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          )}
            </div>

            {/* Post body */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 pt-3 pb-4">
            {/* Start Puzzle CTA (only on the dedicated start slide) */}
            {isOnStartSlide && (
              <div className="mt-2 mb-4">
                <button
                  onClick={() => onStartGame(post.gameId, post.gameLevelNumber, post.campaignLevelId)}
                  className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Start Puzzle
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-4 mb-3">
              <button className="hover:opacity-70 transition-opacity" aria-label="Like">
                <Heart className="w-6 h-6 text-slate-900" />
              </button>
              <button
                onClick={() => setIsCommentsExpanded(true)}
                className="hover:opacity-70 transition-opacity"
                aria-label="Comment"
              >
                <MessageCircle className="w-6 h-6 text-slate-900" />
              </button>
              <button className="hover:opacity-70 transition-opacity" aria-label="Share">
                <Send className="w-6 h-6 text-slate-900" />
              </button>
              <button className="ml-auto hover:opacity-70 transition-opacity" aria-label="Save">
                <Bookmark className="w-6 h-6 text-slate-900" />
              </button>
            </div>

            {/* Likes */}
            <p className="text-sm font-semibold text-slate-900 mb-2">{post.likes} likes</p>

            {/* Caption */}
            <p className="text-sm text-slate-900">
              <span className="font-semibold mr-2">{post.author.username}</span>
              <span dir="auto" className="whitespace-pre-line">
                {post.caption}
              </span>
            </p>

            {/* Comments */}
            {comments.length > 0 && (
              <div className="mt-2">
                <button
                  onClick={() => setIsCommentsExpanded((v) => !v)}
                  className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  {isCommentsExpanded ? 'Hide comments' : `View all ${comments.length} comments`}
                </button>

                <div className="mt-2 space-y-2">
                  {visibleComments.map((comment) => (
                    <div key={comment.id} className="text-sm text-slate-900">
                      <span className="font-semibold mr-2">{comment.authorName}</span>
                      <span dir="auto">{comment.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-400 mt-3 uppercase tracking-wide">{post.timestamp}</p>
              </div>
            </div>

            {/* Add comment */}
            <div className="border-t border-slate-100 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0" />
              <input
                value={commentDraft}
                onChange={(e) => setCommentDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePostComment();
                }}
                className="flex-1 text-sm outline-none placeholder:text-slate-400"
                placeholder="Add a comment..."
              />
              <button
                onClick={handlePostComment}
                disabled={!canPostComment}
                className={`text-sm font-semibold transition-colors ${
                  canPostComment ? 'text-indigo-600 hover:text-indigo-700' : 'text-slate-300'
                }`}
              >
                Post
              </button>
            </div>

            <AnimatePresence>
              {isCommentsExpanded && comments.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="px-4 pb-3 text-sm text-slate-500"
                >
                  No comments yet.
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

