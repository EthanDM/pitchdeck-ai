import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import type { BusinessDetails, PitchDeck, Slide } from '@/app/types/pitch'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

// **Step 1: Generate Pitch Deck Structure**
async function generatePitchDeckOutline(
  body: BusinessDetails
): Promise<PitchDeck> {
  const prompt = `
    Create a startup pitch deck outline and return it as a JSON object.

    ### Business Details:
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

    ### Required Slides:
    Generate a 13-slide pitch deck with these sections:
    1. Title
    2. Problem
    3. Solution
    4. How It Works
    5. Market
    6. Revenue Model
    7. Projections
    8. Traction
    9. Go-to-Market (GTM)
    10. Competition
    11. Team
    12. Ask (Funding needs)
    13. Thank You

    Return a JSON object with this exact structure:
    {
      "slides": [
        {
          "title": "string",
          "content": "string",
          "bulletPoints": ["string", "string"]
        }
      ]
    }
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are a pitch deck expert. Return only valid JSON in the specified format.',
      },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  })

  return JSON.parse(completion.choices[0].message.content || '{}') as PitchDeck
}

// **Step 2: Enrich Each Slide**
async function enrichSlide(slide: Slide): Promise<Slide> {
  const prompt = `
    Enhance this pitch deck slide and return it as a JSON object.

    Current slide:
    - Title: ${slide.title}
    - Content: ${slide.content}
    ${
      slide.bulletPoints
        ? `- Bullet Points: ${JSON.stringify(slide.bulletPoints)}`
        : ''
    }

    Make the content more engaging and detailed while maintaining clarity.
    Add or improve bullet points to highlight key information.

    Return a JSON object with this exact structure:
    {
      "title": "string",
      "content": "string",
      "bulletPoints": ["string", "string", "string"]
    }
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content:
          'You are a pitch deck expert. Return only valid JSON in the specified format.',
      },
      { role: 'user', content: prompt },
    ],
    response_format: { type: 'json_object' },
  })

  return JSON.parse(completion.choices[0].message.content || '{}') as Slide
}

export async function POST(req: Request) {
  try {
    const body: BusinessDetails = await req.json()

    // **Step 1: Generate the initial pitch deck**
    const pitchDeck = await generatePitchDeckOutline(body)

    // **Step 2: Enrich each slide**
    const enrichedSlides = await Promise.all(pitchDeck.slides.map(enrichSlide))

    return NextResponse.json({ slides: enrichedSlides })
  } catch (error) {
    console.error('Error generating pitch deck:', error)
    return NextResponse.json(
      { error: 'Failed to generate pitch deck' },
      { status: 500 }
    )
  }
}
