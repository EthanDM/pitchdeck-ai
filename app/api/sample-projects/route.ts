import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import type { BusinessDetails } from '@/app/types/pitch'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const INDUSTRIES = [
  'AI & Machine Learning',
  'FinTech',
  'HealthTech',
  'EdTech',
  'CleanTech',
  'E-commerce',
  'PropTech',
  'FoodTech',
  'Gaming',
  'Cybersecurity',
] as const

export async function GET() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo-preview',
      messages: [
        {
          role: 'system',
          content:
            'You are a startup idea generator. Generate 5 innovative startup ideas in different industries. Make them realistic, modern, and compelling with clear business models.',
        },
        {
          role: 'user',
          content: `Generate 5 different startup ideas. For each one, provide:
          - A concise business idea
          - Industry (choose from: ${INDUSTRIES.join(', ')})
          - Target market
          - Unique selling point
          - Competitive advantage
          - Financial projections (be specific with numbers)
          
          Format the response as a JSON object with the company name as the key. Make the ideas diverse and innovative.`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const sampleProjects = JSON.parse(
      completion.choices[0].message.content || '{}'
    )

    return NextResponse.json(sampleProjects)
  } catch (error) {
    console.error('Error generating sample projects:', error)

    // Fallback to static samples if API fails
    const fallbackSamples = {
      'AI Resume Screener': {
        businessIdea:
          'An AI-powered resume screening platform that helps companies automatically filter and rank candidates based on job descriptions.',
        industry: 'AI & Machine Learning',
        targetMarket: 'Recruiters, Hiring Managers, Enterprises',
        uniqueSellingPoint:
          'Uses advanced NLP to analyze resumes beyond keywords, assessing soft skills and cultural fit.',
        competitiveAdvantage:
          'Faster, unbiased candidate screening compared to manual processes.',
        financialProjections:
          'Targeting 1,000 company subscriptions in the first year, projected $5M ARR by year 3.',
      },
      // Add 4 more fallback samples...
    }

    return NextResponse.json(fallbackSamples)
  }
}
