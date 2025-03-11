import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey:
    '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',
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
      model: 'gpt-4o-mini',
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

    return NextResponse.json(fallbackSamples)
  }
}
