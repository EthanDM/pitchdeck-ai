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
    <div className='w-full max-w-4xl mx-auto'>
      <Carousel className='w-full'>
        <CarouselContent>
          {pitchDeck.slides.map((slide: Slide, index: number) => (
            <CarouselItem key={index}>
              <Card className='p-6'>
                <CardHeader>
                  <CardTitle className='text-2xl font-bold text-center'>
                    {slide.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                  <p className='text-gray-700'>{slide.content}</p>
                  {slide.bulletPoints && slide.bulletPoints.length > 0 && (
                    <ul className='list-disc list-inside space-y-2'>
                      {slide.bulletPoints.map((point, i) => (
                        <li key={i} className='text-gray-600'>
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
