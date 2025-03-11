import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import type { BusinessDetails, PitchDeck, Slide } from '@/app/types/pitch'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!, // Use env variable
})

async function generateDetailedPitchDeck(
  body: BusinessDetails
): Promise<PitchDeck> {
  const prompt = `
    You are a professional pitch deck generator. Create a structured startup pitch deck with 13 slides.
    
    ### Inputs:
    - Business Idea: ${body.businessIdea}
    - Industry: ${body.industry}
    - Target Market: ${body.targetMarket}
    ${
      body.uniqueSellingPoint
        ? `- Unique Selling Point: ${body.uniqueSellingPoint}`
        : ''
    }
    ${
      body.competitiveAdvantage
        ? `- Competitive Advantage: ${body.competitiveAdvantage}`
        : ''
    }
    ${
      body.financialProjections
        ? `- Financial Projections: ${body.financialProjections}`
        : ''
    }

    ### Output Format:
    Return a JSON object structured like this:
    {
      "slides": [
        { "title": "Title", "content": "Short overview of the business idea." },
        { "title": "Problem", "content": "Clear problem the startup solves." },
        { "title": "Solution", "content": "How the product/service addresses the problem." },
        { "title": "How It Works", "content": "Step-by-step explanation of how the business functions.", "bulletPoints": ["Step 1", "Step 2"] },
        { "title": "Market", "content": "Market size, trends, and target demographics." },
        { "title": "Revenue Model", "content": "How the company makes money." },
        { "title": "Projections", "content": "Revenue estimates over the next few years." },
        { "title": "Traction", "content": "Existing milestones, user growth, early revenue." },
        { "title": "Go-to-Market (GTM)", "content": "Marketing and user acquisition strategy." },
        { "title": "Competition", "content": "Major competitors and differentiation." },
        { "title": "Team", "content": "Founding team and key members." },
        { "title": "Ask", "content": "Funding amount and what it will be used for." },
        { "title": "Thank You", "content": "Final closing statement." }
      ]
    }
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 1000,
  })

  return JSON.parse(completion.choices[0].message.content || '{}') as PitchDeck
}

// OPTIONAL: Chain additional calls for key sections
async function enrichSlide(slide: Slide): Promise<Slide> {
  const prompt = `
    You are a startup consultant. Provide an **expanded** version of the following pitch deck slide:
    Title: ${slide.title}
    Existing Content: ${slide.content}

    ### Requirements:
    - Expand and clarify the explanation.
    - Provide 2-4 bullet points for structure (if applicable).
    
    Output JSON:
    {
      "title": "${slide.title}",
      "content": "...",
      "bulletPoints": ["...", "..."]
    }
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 500,
  })

  return JSON.parse(completion.choices[0].message.content || '{}') as Slide
}

export async function POST(req: Request) {
  try {
    const body: BusinessDetails = await req.json()

    // Generate the base pitch deck
    const pitchDeck = await generateDetailedPitchDeck(body)

    // Optionally enrich key slides (Problem, Solution, GTM, etc.)
    const slidesToEnhance = ['Problem', 'Solution', 'Go-to-Market (GTM)']
    for (let slide of pitchDeck.slides) {
      if (slidesToEnhance.includes(slide.title)) {
        slide = await enrichSlide(slide)
      }
    }

    return NextResponse.json(pitchDeck)
  } catch (error) {
    console.error('Error generating pitch deck:', error)
    return NextResponse.json(
      { error: 'Failed to generate pitch deck' },
      { status: 500 }
    )
  }
}
