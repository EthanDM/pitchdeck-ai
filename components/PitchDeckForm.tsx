'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import type { BusinessDetails, PitchDeck } from '@/app/types/pitch'

interface PitchDeckFormProps {
  onPitchDeckGenerated: (pitchDeck: PitchDeck) => void
}

export default function PitchDeckForm({
  onPitchDeckGenerated,
}: PitchDeckFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<BusinessDetails>({
    businessIdea: '',
    industry: '',
    targetMarket: '',
    uniqueSellingPoint: '',
    competitiveAdvantage: '',
    financialProjections: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/generate-pitch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to generate pitch deck')
      }

      const data = await response.json()
      onPitchDeckGenerated(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <Card className='p-6'>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <label htmlFor='businessIdea' className='block text-sm font-medium'>
            Business Idea *
          </label>
          <Textarea
            id='businessIdea'
            name='businessIdea'
            value={formData.businessIdea}
            onChange={handleChange}
            placeholder='Describe your business idea in detail'
            required
            className='min-h-[100px]'
          />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <label htmlFor='industry' className='block text-sm font-medium'>
              Industry *
            </label>
            <Input
              id='industry'
              name='industry'
              value={formData.industry}
              onChange={handleChange}
              placeholder='e.g., Technology, Healthcare'
              required
            />
          </div>

          <div className='space-y-2'>
            <label htmlFor='targetMarket' className='block text-sm font-medium'>
              Target Market *
            </label>
            <Input
              id='targetMarket'
              name='targetMarket'
              value={formData.targetMarket}
              onChange={handleChange}
              placeholder='Who are your customers?'
              required
            />
          </div>
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='uniqueSellingPoint'
            className='block text-sm font-medium'
          >
            Unique Selling Point
          </label>
          <Input
            id='uniqueSellingPoint'
            name='uniqueSellingPoint'
            value={formData.uniqueSellingPoint}
            onChange={handleChange}
            placeholder='What makes your business unique?'
          />
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='competitiveAdvantage'
            className='block text-sm font-medium'
          >
            Competitive Advantage
          </label>
          <Input
            id='competitiveAdvantage'
            name='competitiveAdvantage'
            value={formData.competitiveAdvantage}
            onChange={handleChange}
            placeholder='Your advantages over competitors'
          />
        </div>

        <div className='space-y-2'>
          <label
            htmlFor='financialProjections'
            className='block text-sm font-medium'
          >
            Financial Projections
          </label>
          <Input
            id='financialProjections'
            name='financialProjections'
            value={formData.financialProjections}
            onChange={handleChange}
            placeholder='Expected revenue, growth, etc.'
          />
        </div>

        <Button type='submit' className='w-full' disabled={isLoading}>
          {isLoading ? 'Generating Pitch Deck...' : 'Generate Pitch Deck'}
        </Button>
      </form>
    </Card>
  )
}
