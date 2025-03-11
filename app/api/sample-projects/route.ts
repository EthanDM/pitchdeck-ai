import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// Define supported industries for diversity
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

// Generate Startup Ideas with a More Human-Like Response
async function generateStartupIdeas() {
  const prompt = `
    You are a startup idea generator. Create **5 compelling startup ideas** across different industries, making them sound natural and investment-worthy.

    ### Instructions:
    - Choose industries from: **${INDUSTRIES.join(', ')}**
    - Make ideas **modern, realistic, and engaging**.
    - Keep explanations **concise and easy to understand**.
    - Format financial projections as **a short, natural sentence**.
    - Use JSON format **only**, with the company name as the key.

    ### Output Format (JSON Example):
    {
      "Company Name": {
        "businessIdea": "A brief but compelling business idea.",
        "industry": "Industry category",
        "targetMarket": "Who are the customers?",
        "uniqueSellingPoint": "What makes this startup unique?",
        "competitiveAdvantage": "Why will this beat competitors?",
        "financialProjections": "Expected to hit $2M in revenue within the first year, scaling to $10M by year three."
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

// Fallback Startup Ideas (Humanized & Condensed)
const FALLBACK_SAMPLES = {
  'AI Resume Screener': {
    businessIdea:
      'An AI-powered resume screening platform that helps companies automatically filter and rank candidates based on job descriptions.',
    industry: 'HR Tech',
    targetMarket:
      'Recruiters, hiring managers, and enterprises looking to streamline hiring.',
    uniqueSellingPoint:
      'Uses advanced NLP to analyze resumes beyond keywords, assessing soft skills and cultural fit.',
    competitiveAdvantage:
      'Faster, unbiased candidate screening compared to manual processes.',
    financialProjections:
      'Expected to reach $1M in revenue in year one, growing to $5M+ by year three.',
  },
  'GreenCharge EV': {
    businessIdea:
      'A network of AI-optimized EV charging stations that dynamically adjust pricing and energy distribution based on demand.',
    industry: 'CleanTech',
    targetMarket:
      'EV owners, fleet operators, and city infrastructure planners.',
    uniqueSellingPoint:
      'AI-driven load balancing reduces costs and speeds up charging times.',
    competitiveAdvantage:
      'Unlike Tesla Superchargers, this works with all EVs and is optimized for peak energy efficiency.',
    financialProjections:
      'On track to deploy 500 stations in the first year, aiming for $10M+ revenue by year three.',
  },
  'FitAI Coach': {
    businessIdea:
      'An AI-powered virtual fitness and nutrition coach that creates personalized workout and meal plans.',
    industry: 'HealthTech',
    targetMarket: 'Health-conscious individuals, gyms, and personal trainers.',
    uniqueSellingPoint:
      'Real-time AI adjustments based on user progress and health data.',
    competitiveAdvantage:
      'Unlike generic fitness apps, it continuously evolves workouts for optimal results.',
    financialProjections:
      'Expecting 50,000+ users by year one, generating $2M in revenue with steady growth.',
  },
  LegalBot: {
    businessIdea:
      'An AI-driven chatbot that provides instant legal guidance and document drafting for small businesses.',
    industry: 'Legal Tech',
    targetMarket: 'Startup founders, freelancers, and small business owners.',
    uniqueSellingPoint:
      'Affordable, instant legal guidance without the need for a lawyer.',
    competitiveAdvantage:
      'Uses a database of thousands of legal cases and adapts to new regulations.',
    financialProjections:
      'Projected to onboard 100,000 users in two years, reaching $5M in annual revenue.',
  },
  MetaReal: {
    businessIdea:
      'A virtual reality platform where users can tour and customize real estate properties in 3D before purchase.',
    industry: 'PropTech',
    targetMarket: 'Homebuyers, realtors, and real estate developers.',
    uniqueSellingPoint:
      'Immersive VR tours with AI-driven customization options.',
    competitiveAdvantage:
      'Unlike static listings, buyers can visualize modifications before committing.',
    financialProjections:
      'Expected to facilitate $100M in transactions within three years.',
  },
} as const

// API Route Handler
export async function GET() {
  try {
    const sampleProjects = await generateStartupIdeas()
    return NextResponse.json(sampleProjects)
  } catch (error) {
    console.error('Error generating startup ideas:', error)
    return NextResponse.json(FALLBACK_SAMPLES) // Use fallback if API call fails
  }
}
