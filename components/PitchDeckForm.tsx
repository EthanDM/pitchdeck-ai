'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import type { BusinessDetails, PitchDeck } from '@/app/types/pitch'

// Example projects data
const DEMO_PROJECTS = {
  'AI Resume Screener': {
    businessIdea:
      'An AI-powered resume screening platform that helps companies automatically filter and rank candidates based on job descriptions.',
    industry: 'HR Tech',
    targetMarket: 'Recruiters, Hiring Managers, Enterprises',
    uniqueSellingPoint:
      'Uses advanced NLP to analyze resumes beyond keywords, assessing soft skills and cultural fit.',
    competitiveAdvantage:
      'Faster, unbiased candidate screening compared to manual processes.',
    financialProjections:
      'Targeting 1,000 company subscriptions in the first year, projected $5M ARR by year 3.',
  },
  'GreenCharge EV': {
    businessIdea:
      'A network of AI-optimized EV charging stations that dynamically adjust pricing and energy distribution based on demand.',
    industry: 'Clean Energy, Electric Vehicles',
    targetMarket: 'EV owners, fleet operators, municipalities',
    uniqueSellingPoint:
      'Smart AI-driven load balancing reduces energy costs for both users and providers.',
    competitiveAdvantage:
      'Unlike Tesla Superchargers, this is a brand-agnostic solution that works with all EVs.',
    financialProjections:
      'First-year deployment of 500 stations, scaling to 5,000 nationwide in five years.',
  },
  'FitAI Coach': {
    businessIdea:
      'An AI-powered virtual fitness and nutrition coach that provides personalized workout and meal plans based on user data.',
    industry: 'Health & Wellness',
    targetMarket: 'Fitness enthusiasts, personal trainers, gyms',
    uniqueSellingPoint:
      'AI continuously adapts fitness routines and diets based on progress, health data, and goals.',
    competitiveAdvantage:
      'Unlike generic fitness apps, it leverages AI for real-time adjustments and motivation.',
    financialProjections:
      'Subscription-based model with 50,000 users in year one, reaching $10M ARR by year three.',
  },
  LegalBot: {
    businessIdea:
      'An AI-driven chatbot that provides instant legal guidance and document drafting for startups and small businesses.',
    industry: 'Legal Tech',
    targetMarket: 'Startup founders, freelancers, small business owners',
    uniqueSellingPoint:
      'Instant, affordable legal guidance without expensive hourly lawyer fees.',
    competitiveAdvantage:
      'Trained on thousands of real legal cases and constantly updated with new regulations.',
    financialProjections:
      'Initial freemium model with paid consultations, targeting 100,000+ users within two years.',
  },
  MetaReal: {
    businessIdea:
      'A virtual reality platform where users can tour and customize real estate properties in 3D before purchasing or renting.',
    industry: 'PropTech, VR/AR',
    targetMarket: 'Homebuyers, realtors, real estate developers',
    uniqueSellingPoint:
      'Immersive virtual tours with AI-driven home customization before purchase.',
    competitiveAdvantage:
      'Unlike traditional real estate listings, buyers can visualize renovations before making a decision.',
    financialProjections:
      'Partnering with major real estate agencies to generate $50M in transactions in year one.',
  },
} as const

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

  const handleDemoClick = (projectName: keyof typeof DEMO_PROJECTS) => {
    setFormData(DEMO_PROJECTS[projectName])
  }

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
      {/* Demo Project Buttons */}
      <div className='mb-8'>
        <h2 className='text-lg font-semibold mb-3 text-gray-700'>
          Try a Demo Project:
        </h2>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3'>
          {(
            Object.keys(DEMO_PROJECTS) as Array<keyof typeof DEMO_PROJECTS>
          ).map((projectName) => (
            <Button
              key={projectName}
              variant='outline'
              className='w-full text-sm h-auto py-2 px-3'
              onClick={() =>
                handleDemoClick(projectName as keyof typeof DEMO_PROJECTS)
              }
            >
              {projectName}
            </Button>
          ))}
        </div>
      </div>

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
