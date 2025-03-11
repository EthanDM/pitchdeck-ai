import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Define supported industries to ensure diversity
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

// Helper function to generate startup ideas via OpenAI
async function generateStartupIdeas() {
  const prompt = `
    You are an AI-powered startup idea generator. Your task is to generate **5 innovative, well-structured startup ideas** across different industries.

    ### Instructions:
    - Each startup must be **realistic, modern, and compelling**.
    - Select an industry from this list: **${INDUSTRIES.join(', ')}**
    - Provide **concrete financial projections** based on **realistic benchmarks**.
    - Use JSON format **only**, with company name as the key.

    ### Output Format (JSON Example):
    {
      "Company Name": {
        "businessIdea": "A brief but compelling business idea.",
        "industry": "Industry category",
        "targetMarket": "Who are the customers?",
        "uniqueSellingPoint": "What makes this startup unique?",
        "competitiveAdvantage": "Why will this beat competitors?",
        "financialProjections": {
          "year1": "$X revenue",
          "year3": "$Y revenue",
          "year5": "$Z revenue"
        }
      }
    }
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' }, // Forces JSON output
    max_tokens: 1500,
  })

  return JSON.parse(completion.choices[0].message.content || '{}')
}

// Fallback startup ideas (used only if API call fails)
const FALLBACK_SAMPLES = {
  'AI Resume Screener': {
    businessIdea:
      'An AI-powered resume screening platform that helps companies automatically filter and rank candidates based on job descriptions.',
    industry: 'HR Tech',
    targetMarket: 'Recruiters, Hiring Managers, Enterprises',
    uniqueSellingPoint:
      'Uses advanced NLP to analyze resumes beyond keywords, assessing soft skills and cultural fit.',
    competitiveAdvantage:
      'Faster, unbiased candidate screening compared to manual processes.',
    financialProjections: {
      year1: '$1M revenue',
      year3: '$5M revenue',
      year5: '$15M revenue',
    },
  },
  'GreenCharge EV': {
    businessIdea:
      'A network of AI-optimized EV charging stations that dynamically adjust pricing and energy distribution based on demand.',
    industry: 'CleanTech',
    targetMarket: 'EV owners, fleet operators, municipalities',
    uniqueSellingPoint:
      'Smart AI-driven load balancing reduces energy costs for both users and providers.',
    competitiveAdvantage:
      'Unlike Tesla Superchargers, this is a brand-agnostic solution that works with all EVs.',
    financialProjections: {
      year1: '$3M revenue',
      year3: '$12M revenue',
      year5: '$50M revenue',
    },
  },
  'FitAI Coach': {
    businessIdea:
      'An AI-powered virtual fitness and nutrition coach that provides personalized workout and meal plans based on user data.',
    industry: 'HealthTech',
    targetMarket: 'Fitness enthusiasts, personal trainers, gyms',
    uniqueSellingPoint:
      'AI continuously adapts fitness routines and diets based on progress, health data, and goals.',
    competitiveAdvantage:
      'Unlike generic fitness apps, it leverages AI for real-time adjustments and motivation.',
    financialProjections: {
      year1: '$2M revenue',
      year3: '$8M revenue',
      year5: '$25M revenue',
    },
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
    financialProjections: {
      year1: '$500K revenue',
      year3: '$5M revenue',
      year5: '$20M revenue',
    },
  },
  MetaReal: {
    businessIdea:
      'A virtual reality platform where users can tour and customize real estate properties in 3D before purchasing or renting.',
    industry: 'PropTech',
    targetMarket: 'Homebuyers, realtors, real estate developers',
    uniqueSellingPoint:
      'Immersive virtual tours with AI-driven home customization before purchase.',
    competitiveAdvantage:
      'Unlike traditional real estate listings, buyers can visualize renovations before making a decision.',
    financialProjections: {
      year1: '$10M in transactions',
      year3: '$100M in transactions',
      year5: '$500M in transactions',
    },
  },
} as const

// API Route Handler
export async function GET() {
  try {
    const sampleProjects = await generateStartupIdeas()
    return NextResponse.json(sampleProjects)
  } catch (error) {
    console.error('Error generating sample projects:', error)
    return NextResponse.json(FALLBACK_SAMPLES) // Use fallback if API call fails
  }
}
