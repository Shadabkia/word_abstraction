import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Send, Bookmark } from 'lucide-react';
import { StoryPost } from '@/core/domain/types';
import { type CarouselApi, Carousel, CarouselContent, CarouselItem } from '@/shared/ui/carousel';

interface PostCardProps {
  post: StoryPost;
  authorName: string;
  authorAvatar: string;
}

export function PostCard({ post, authorName, authorAvatar }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const body = post.body;
  const location = post.location ?? 'Tehran, Iran';

  const isCarousel = body?.type === 'carousel' && !!body.slides?.length;
  const carouselCount = body?.slides?.length ?? 0;
  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [carouselIndex, setCarouselIndex] = useState(0);

  useEffect(() => {
    if (!carouselApi) return;
    const sync = () => setCarouselIndex(carouselApi.selectedScrollSnap());
    sync();
    carouselApi.on('select', sync);
    carouselApi.on('reInit', sync);
    return () => {
      carouselApi.off('select', sync);
      carouselApi.off('reInit', sync);
    };
  }, [carouselApi]);

  const mediaContainerClassName = useMemo(() => {
    // Instagram: images size to their natural aspect ratio (not always square).
    if (body?.type === 'image' || body?.type === 'carousel') {
      return 'w-full bg-black relative overflow-hidden';
    }
    // Typography/text posts still feel best as a square “card” in the feed.
    return 'w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center relative overflow-hidden';
  }, [body?.type]);

  return (
    <motion.div 
      className="bg-white border-b border-slate-100 sm:border-2 sm:border-slate-100 sm:rounded-3xl sm:shadow-lg sm:mx-4 mb-4 pb-2 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <motion.div 
          className="flex items-center gap-3"
          whileHover={{ x: 2 }}
        >
          <motion.div 
            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 overflow-hidden ring-2 ring-purple-100 shadow-md"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
              {authorName[0]}
            </div>
          </motion.div>
          <div>
            <div className="text-sm font-bold text-slate-800 leading-none">{authorName}</div>
            <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
              📍 {location}
            </div>
          </div>
        </motion.div>
        <motion.button 
          className="text-slate-400 hover:text-slate-600 p-2"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          •••
        </motion.button>
      </div>

      {/* Body */}
      <motion.div
        className={mediaContainerClassName}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        {/* Carousel */}
        {body?.type === 'carousel' && body.slides && body.slides.length > 0 ? (
          <Carousel setApi={setCarouselApi} opts={{ loop: false, align: 'start' }} className="w-full">
            <CarouselContent className="ml-0">
              {body.slides.map((s, idx) => (
                <CarouselItem key={idx} className="pl-0">
                  <div className="w-full flex items-center justify-center bg-black">
                    <img
                      src={s.src}
                      alt=""
                      className="w-full h-auto max-h-[70vh] object-contain block"
                      loading="lazy"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        ) : body?.type === 'image' && body.src ? (
          <div className="w-full flex items-center justify-center bg-black">
            <img
              src={body.src}
              alt="Post"
              className="w-full h-auto max-h-[70vh] object-contain block"
              loading="lazy"
            />
          </div>
        ) : body?.type === 'html' && body.html ? (
          <div
            className="w-full h-full flex items-center justify-center p-8"
            // Content is authored locally (no user input). Keep HTML simple (no scripts).
            dangerouslySetInnerHTML={{ __html: body.html }}
          />
        ) : body?.type === 'text' && body.text ? (
          <div className="w-full h-full flex items-center justify-center p-10 text-center">
            <p className="text-slate-800 text-xl font-semibold whitespace-pre-line">{body.text}</p>
          </div>
        ) : post.image ? (
          // Legacy fallback
          <div className="w-full flex items-center justify-center bg-black">
            <img
              src={post.image}
              alt="Post"
              className="w-full h-auto max-h-[70vh] object-contain block"
              loading="lazy"
            />
          </div>
        ) : (
          <motion.span
            className="text-slate-300 text-6xl"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            📷
          </motion.span>
        )}

        {/* Carousel indicators (Instagram-like) */}
        {isCarousel && carouselCount > 1 && (
          <>
            {/* Top-right count pill */}
            <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full backdrop-blur pointer-events-none">
              {carouselIndex + 1}/{carouselCount}
            </div>
            {/* Bottom dots */}
            <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-1.5 pointer-events-none">
              {Array.from({ length: carouselCount }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full transition-colors ${
                    i === carouselIndex ? 'bg-white' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Gradient overlay on hover */}
        <motion.div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
      </motion.div>

      {/* Actions */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-5">
          <motion.button 
            className={`transition-colors ${isLiked ? 'text-red-500' : 'text-slate-700 hover:text-red-500'}`}
            onClick={() => setIsLiked(!isLiked)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={isLiked ? { scale: [1, 1.3, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-7 h-7 ${isLiked ? 'fill-current' : ''}`} />
            </motion.div>
          </motion.button>
          <motion.button 
            className="text-slate-700 hover:text-blue-500 transition-colors"
            whileHover={{ scale: 1.2, rotate: -10 }}
            whileTap={{ scale: 0.9 }}
          >
            <MessageCircle className="w-7 h-7" />
          </motion.button>
          <motion.button 
            className="text-slate-700 hover:text-green-500 transition-colors"
            whileHover={{ scale: 1.2, rotate: 10 }}
            whileTap={{ scale: 0.9 }}
          >
            <Send className="w-7 h-7" />
          </motion.button>
        </div>
        <motion.button 
          className={`transition-colors ${isSaved ? 'text-yellow-500' : 'text-slate-700 hover:text-yellow-500'}`}
          onClick={() => setIsSaved(!isSaved)}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bookmark className={`w-7 h-7 ${isSaved ? 'fill-current' : ''}`} />
        </motion.button>
      </div>

      {/* Caption & Comments */}
      <div className="px-4 pb-3">
        <motion.div 
          className="font-bold text-sm mb-2 bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {post.likes.toLocaleString()} likes
        </motion.div>
        <div className="text-sm leading-relaxed">
          <span className="font-bold mr-2 text-slate-900">{authorName}</span>
          <span className="text-slate-700">{post.caption}</span>
        </div>
        
        {post.comments.length > 0 && (
          <motion.button
            className="mt-2 text-slate-400 text-xs hover:text-slate-600 transition-colors"
            whileHover={{ x: 2 }}
          >
            View all {post.comments.length} comments →
          </motion.button>
        )}
        
        <div className="text-[10px] text-slate-400 mt-2 uppercase tracking-wide">
          2 hours ago
        </div>
      </div>
    </motion.div>
  );
}

