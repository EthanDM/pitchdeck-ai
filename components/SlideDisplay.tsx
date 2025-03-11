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
      if (e.key === 'Escape' && isFullscreen && onExitFullscreen) {
        onExitFullscreen()
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen, onExitFullscreen])

  if (!pitchDeck) {
    return null
  }

  const containerClasses = isFullscreen
    ? 'fixed inset-0 z-50 bg-gray-900'
    : 'w-full max-w-[1024px] mx-auto'

  return (
    <div className={containerClasses}>
      <div
        className={`relative h-full ${
          !isFullscreen ? 'bg-white rounded-lg shadow-lg' : ''
        }`}
      >
        {/* Controls bar */}
        <div
          className={`
          absolute top-4 right-4 z-10 flex items-center gap-4
          ${isFullscreen ? 'text-white' : 'text-gray-900'}
        `}
        >
          <div className='bg-gray-800/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium'>
            Slide {currentSlide} of {pitchDeck.slides.length}
          </div>
          {isFullscreen && onExitFullscreen && (
            <Button
              variant='outline'
              onClick={onExitFullscreen}
              className='bg-gray-800/10 backdrop-blur-sm hover:bg-gray-800/20'
            >
              Exit Fullscreen
            </Button>
          )}
        </div>

        <Carousel className='w-full h-full' setApi={setApi}>
          <CarouselContent className='h-full'>
            {pitchDeck.slides.map((slide: Slide, index: number) => (
              <CarouselItem key={index} className='h-full'>
                {/* 16:9 aspect ratio container in normal mode, full height in fullscreen */}
                <div
                  className={`relative w-full ${
                    isFullscreen ? 'h-full' : 'pt-[56.25%]'
                  }`}
                >
                  <Card
                    className={`
                    absolute top-0 left-0 w-full h-full overflow-hidden
                    ${isFullscreen ? 'bg-gray-900 text-white border-0' : ''}
                  `}
                  >
                    <div className='h-full flex flex-col'>
                      {/* Header */}
                      <CardHeader
                        className={`
                        flex-none py-8 border-b
                        ${
                          isFullscreen
                            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                            : 'bg-gradient-to-br from-gray-50 to-white'
                        }
                      `}
                      >
                        <CardTitle
                          className={`
                          text-4xl font-bold text-center
                          ${isFullscreen ? 'text-white' : 'text-gray-900'}
                        `}
                        >
                          {slide.title}
                        </CardTitle>
                      </CardHeader>

                      {/* Content area */}
                      <CardContent className='flex-1 p-8 overflow-y-auto'>
                        <div className='max-w-4xl mx-auto space-y-6'>
                          <p
                            className={`
                            text-2xl leading-relaxed
                            ${isFullscreen ? 'text-gray-200' : 'text-gray-700'}
                          `}
                          >
                            {slide.content}
                          </p>
                          {slide.bulletPoints &&
                            slide.bulletPoints.length > 0 && (
                              <ul className='space-y-4 list-none mt-8'>
                                {slide.bulletPoints.map((point, i) => (
                                  <li
                                    key={i}
                                    className='flex items-start space-x-4'
                                  >
                                    <span
                                      className={`
                                    flex-none mt-2 w-2.5 h-2.5 rounded-full
                                    ${
                                      isFullscreen
                                        ? 'bg-blue-400'
                                        : 'bg-blue-500'
                                    }
                                  `}
                                    />
                                    <span
                                      className={`
                                    text-xl
                                    ${
                                      isFullscreen
                                        ? 'text-gray-300'
                                        : 'text-gray-700'
                                    }
                                  `}
                                    >
                                      {point}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons */}
          <div
            className={`
            absolute -left-12 top-1/2 -translate-y-1/2
            ${isFullscreen ? 'left-4' : '-left-12'}
          `}
          >
            <CarouselPrevious
              className={`
              h-12 w-12 opacity-70 hover:opacity-100 transition-opacity
              ${
                isFullscreen
                  ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-600'
                  : ''
              }
            `}
            />
          </div>
          <div
            className={`
            absolute -right-12 top-1/2 -translate-y-1/2
            ${isFullscreen ? 'right-4' : '-right-12'}
          `}
          >
            <CarouselNext
              className={`
              h-12 w-12 opacity-70 hover:opacity-100 transition-opacity
              ${
                isFullscreen
                  ? 'bg-gray-800/50 hover:bg-gray-800/70 border-gray-600'
                  : ''
              }
            `}
            />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
