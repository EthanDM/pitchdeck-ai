'use client'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { PitchDeck, Slide } from '@/app/types/pitch'

interface SlideDisplayProps {
  pitchDeck: PitchDeck | null
}

export default function SlideDisplay({ pitchDeck }: SlideDisplayProps) {
  if (!pitchDeck) {
    return null
  }

  return (
    <div className='w-full max-w-[1024px] mx-auto'>
      <div className='relative bg-white rounded-lg shadow-lg'>
        {/* Slide counter */}
        <div className='absolute top-4 right-4 z-10 bg-gray-800/10 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium'>
          Slide <span className='text-gray-900'>{pitchDeck.slides.length}</span>
        </div>

        <Carousel className='w-full'>
          <CarouselContent>
            {pitchDeck.slides.map((slide: Slide, index: number) => (
              <CarouselItem key={index}>
                {/* 16:9 aspect ratio container */}
                <div className='relative w-full pt-[56.25%]'>
                  <Card className='absolute top-0 left-0 w-full h-full overflow-hidden'>
                    <div className='h-full flex flex-col'>
                      {/* Header takes up 20% of height */}
                      <CardHeader className='flex-none py-8 bg-gradient-to-br from-gray-50 to-white border-b'>
                        <CardTitle className='text-3xl font-bold text-center text-gray-900'>
                          {slide.title}
                        </CardTitle>
                      </CardHeader>

                      {/* Content area takes up remaining height */}
                      <CardContent className='flex-1 p-8 overflow-y-auto'>
                        <div className='max-w-3xl mx-auto space-y-6'>
                          <p className='text-xl leading-relaxed text-gray-700'>
                            {slide.content}
                          </p>
                          {slide.bulletPoints &&
                            slide.bulletPoints.length > 0 && (
                              <ul className='space-y-3 list-none'>
                                {slide.bulletPoints.map((point, i) => (
                                  <li
                                    key={i}
                                    className='flex items-start space-x-3'
                                  >
                                    <span className='flex-none mt-1.5 w-2 h-2 rounded-full bg-blue-500' />
                                    <span className='text-lg text-gray-700'>
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

          {/* Larger, more visible navigation buttons */}
          <div className='absolute -left-12 top-1/2 -translate-y-1/2'>
            <CarouselPrevious className='h-12 w-12 opacity-70 hover:opacity-100 transition-opacity' />
          </div>
          <div className='absolute -right-12 top-1/2 -translate-y-1/2'>
            <CarouselNext className='h-12 w-12 opacity-70 hover:opacity-100 transition-opacity' />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
