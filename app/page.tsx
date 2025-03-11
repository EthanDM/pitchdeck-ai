'use client'

import { useState } from 'react'
import PitchDeckForm from '@/components/PitchDeckForm'
import SlideDisplay from '@/components/SlideDisplay'
import { Suspense } from 'react'
import type { PitchDeck } from './types/pitch'

export default function Home() {
  const [pitchDeck, setPitchDeck] = useState<PitchDeck | null>(null)

  const handlePitchDeckGenerated = (newPitchDeck: PitchDeck) => {
    setPitchDeck(newPitchDeck)
  }

  return (
    <main className='min-h-screen p-4 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100'>
      <div className='max-w-6xl mx-auto space-y-8'>
        <div className='text-center space-y-4'>
          <h1 className='text-4xl md:text-5xl font-bold text-gray-900'>
            AI Pitch Deck Generator
          </h1>
          <p className='text-lg text-gray-600'>
            Transform your business idea into a professional pitch deck in
            minutes
          </p>
        </div>

        <div className='grid grid-cols-1 gap-8'>
          <Suspense fallback={<div>Loading form...</div>}>
            <PitchDeckForm onPitchDeckGenerated={handlePitchDeckGenerated} />
          </Suspense>

          <Suspense fallback={<div>Loading slides...</div>}>
            <SlideDisplay pitchDeck={pitchDeck} />
          </Suspense>
        </div>
      </div>
    </main>
  )
}
