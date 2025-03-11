'use client'

import { useEffect, useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import type { PitchDeck, Slide } from '@/app/types/pitch'

interface SlideDisplayProps {
  pitchDeck: PitchDeck | null
  isFullscreen?: boolean
  onExitFullscreen?: () => void
}

export default function SlideDisplay({
  pitchDeck,
  isFullscreen = false,
  onExitFullscreen,
}: SlideDisplayProps) {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    if (!api) {
      return
    }

    api.on('select', () => {
      setCurrentSlide(api.selectedScrollSnap() + 1)
    })
  }, [api])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!api) return

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault()
          api.scrollPrev()
          break
        case 'ArrowRight':
          e.preventDefault()
          api.scrollNext()
          break
        case 'PageUp':
          e.preventDefault()
          api.scrollPrev()
          break
        case 'PageDown':
          e.preventDefault()
          api.scrollNext()
          break
        case 'Space':
          // Only handle space if not in an input/textarea
          if (
            !(
              e.target instanceof HTMLInputElement ||
              e.target instanceof HTMLTextAreaElement
            )
          ) {
            e.preventDefault()
            api.scrollNext()
          }
          break
        case 'Home':
          e.preventDefault()
          api.scrollTo(0)
          break
        case 'End':
          e.preventDefault()
          api.scrollTo(
            pitchDeck?.slides.length ? pitchDeck.slides.length - 1 : 0
          )
          break
        case 'Escape':
          if (isFullscreen && onExitFullscreen) {
            onExitFullscreen()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [api, isFullscreen, onExitFullscreen, pitchDeck?.slides.length])

  if (!pitchDeck) {
    return null
  }

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-gray-900 overflow-hidden'
    : 'w-full max-w-[1024px] mx-auto'

  const progress = (currentSlide / pitchDeck.slides.length) * 100

  return (
    <motion.div
      className={containerClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`relative w-full h-full ${
          !isFullscreen ? 'bg-white rounded-lg shadow-lg' : 'p-safe'
        }`}
      >
        {/* Progress bar */}
        <div className='absolute top-0 left-0 right-0 h-1 bg-gray-200/20 z-20'>
          <motion.div
            className='h-full bg-blue-500/50 backdrop-blur-sm'
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Controls bar */}
        <div
          className={`
          absolute ${isFullscreen ? 'top-6 right-6' : 'top-4 right-4'} z-20 
          flex items-center gap-4 max-w-full
        `}
        >
          <div className='flex items-center gap-2 bg-gray-800/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium'>
            <span className='text-xl font-bold text-gray-100'>
              {currentSlide}
            </span>
            <span className='text-gray-400'>/</span>
            <span className='text-gray-400'>{pitchDeck.slides.length}</span>
          </div>
          {isFullscreen && onExitFullscreen && (
            <Button
              variant='outline'
              onClick={onExitFullscreen}
              className='bg-gray-800/10 backdrop-blur-sm hover:bg-gray-800/20 transition-colors border-gray-700 text-gray-100'
            >
              Exit Fullscreen
            </Button>
          )}
        </div>

        <div className='w-full h-full flex items-center justify-center'>
          <Carousel
            className='w-full h-full'
            setApi={setApi}
            opts={{
              dragFree: false,
              containScroll: 'trimSnaps',
            }}
          >
            <CarouselContent className='h-full'>
              {pitchDeck.slides.map((slide: Slide, index: number) => (
                <CarouselItem key={index} className='h-full'>
                  <motion.div
                    className={`w-full h-full flex items-center justify-center ${
                      isFullscreen ? 'p-12' : ''
                    }`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      className={`
                      w-full ${isFullscreen ? 'h-full' : 'aspect-[16/9]'} 
                      overflow-hidden transition-colors duration-300 relative
                      ${isFullscreen ? 'bg-gray-900 text-white border-0' : ''}
                    `}
                    >
                      <div className='h-full flex flex-col'>
                        <CardHeader
                          className={`
                          flex-none py-8 border-b transition-colors duration-300
                          ${
                            isFullscreen
                              ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700'
                              : 'bg-gradient-to-br from-gray-50 to-white'
                          }
                        `}
                        >
                          <motion.div
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <CardTitle
                              className={`
                              text-4xl font-bold text-center
                              ${isFullscreen ? 'text-white' : 'text-gray-900'}
                            `}
                            >
                              {slide.title}
                            </CardTitle>
                          </motion.div>
                        </CardHeader>

                        <CardContent className='flex-1 p-8 overflow-y-auto'>
                          <motion.div
                            className='max-w-4xl mx-auto space-y-6'
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.3, delay: 0.2 }}
                          >
                            <p
                              className={`
                              text-2xl leading-relaxed transition-colors duration-300
                              ${
                                isFullscreen ? 'text-gray-200' : 'text-gray-700'
                              }
                            `}
                            >
                              {slide.content}
                            </p>
                            {slide.bulletPoints &&
                              slide.bulletPoints.length > 0 && (
                                <motion.ul
                                  className='space-y-4 list-none mt-8'
                                  initial='hidden'
                                  animate='visible'
                                  variants={{
                                    visible: {
                                      transition: { staggerChildren: 0.1 },
                                    },
                                  }}
                                >
                                  {slide.bulletPoints.map((point, i) => (
                                    <motion.li
                                      key={i}
                                      className='flex items-start space-x-4'
                                      variants={{
                                        hidden: { opacity: 0, x: -20 },
                                        visible: { opacity: 1, x: 0 },
                                      }}
                                    >
                                      <span
                                        className={`
                                      flex-none mt-2 w-2.5 h-2.5 rounded-full transition-colors duration-300
                                      ${
                                        isFullscreen
                                          ? 'bg-blue-400'
                                          : 'bg-blue-500'
                                      }
                                    `}
                                      />
                                      <span
                                        className={`
                                      text-xl transition-colors duration-300
                                      ${
                                        isFullscreen
                                          ? 'text-gray-300'
                                          : 'text-gray-700'
                                      }
                                    `}
                                      >
                                        {point}
                                      </span>
                                    </motion.li>
                                  ))}
                                </motion.ul>
                              )}
                          </motion.div>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation buttons with hover effects */}
            <div
              className={`
              absolute -left-12 top-1/2 -translate-y-1/2 transition-all duration-300 z-20
              ${isFullscreen ? 'left-8' : '-left-12'}
            `}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CarouselPrevious
                  className={`
                  h-12 w-12 opacity-70 hover:opacity-100 transition-all duration-300
                  ${
                    isFullscreen
                      ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-600'
                      : ''
                  }
                `}
                />
              </motion.div>
            </div>
            <div
              className={`
              absolute -right-12 top-1/2 -translate-y-1/2 transition-all duration-300 z-20
              ${isFullscreen ? 'right-8' : '-right-12'}
            `}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <CarouselNext
                  className={`
                  h-12 w-12 opacity-70 hover:opacity-100 transition-all duration-300
                  ${
                    isFullscreen
                      ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-600'
                      : ''
                  }
                `}
                />
              </motion.div>
            </div>
          </Carousel>
        </div>

        {/* Keyboard shortcuts help */}
        <div
          className={`
          absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-4 text-sm z-20
          bg-gray-800/10 backdrop-blur-sm px-4 py-2 rounded-full
          ${isFullscreen ? 'text-gray-300' : 'text-gray-600'}
        `}
        >
          <span>← → arrows to navigate</span>
          <span>Space for next</span>
          {isFullscreen && <span>Esc to exit</span>}
        </div>
      </div>
    </motion.div>
  )
}
