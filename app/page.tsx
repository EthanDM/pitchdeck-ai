'use client'

import { useState } from 'react'
import PitchDeckForm from '@/components/PitchDeckForm'
import SlideDisplay from '@/components/SlideDisplay'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'
import type { PitchDeck } from './types/pitch'

export default function Home() {
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handlePitchDeckGenerated = (newPitchDeck: PitchDeck) => {
    setPitchDeck(newPitchDeck)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReset = () => {
    setPitchDeck(null)
    setIsFullscreen(false)
  }

  return (
    <main className='min-h-screen bg-gradient-to-br from-gray-50 to-gray-100'>
      <div
        className={`max-w-6xl mx-auto ${isFullscreen ? 'p-0' : 'p-4 md:p-8'}`}
      >
        {!isFullscreen && (
          <div className='text-center space-y-4 mb-8'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-900'>
              AI Pitch Deck Generator
            </h1>
            <p className='text-lg text-gray-600'>
              Transform your business idea into a professional pitch deck in
              minutes
            </p>
          </div>
        )}

        {pitchDeck ? (
          <div className='space-y-6'>
            {!isFullscreen && (
              <div className='flex items-center justify-between'>
                <Button
                  variant='outline'
                  onClick={handleReset}
                  className='text-gray-600'
                >
                  ← Create New Pitch Deck
                </Button>
                <Button
                  variant='outline'
                  onClick={() => setIsFullscreen(true)}
                  className='text-gray-600'
                >
                  Enter Fullscreen Mode
                </Button>
              </div>
            )}
            <Suspense fallback={<div>Loading slides...</div>}>
              <SlideDisplay
                pitchDeck={pitchDeck}
                isFullscreen={isFullscreen}
                onExitFullscreen={() => setIsFullscreen(false)}
              />
            </Suspense>
          </div>
        ) : (
          <div className='max-w-4xl mx-auto'>
            <Suspense fallback={<div>Loading form...</div>}>
              <PitchDeckForm onPitchDeckGenerated={handlePitchDeckGenerated} />
            </Suspense>
          </div>
        )}
      </div>
    </main>
  )
}
