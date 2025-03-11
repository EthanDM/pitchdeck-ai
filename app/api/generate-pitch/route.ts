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
    You are a professional startup consultant. Generate a **structured startup pitch deck outline** with 13 slides.

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
    {
      "slides": [
        { "title": "Problem", "content": "Short summary of the problem.", "subSections": ["Why this is a problem", "Existing solutions", "Why those fail"] },
        { "title": "Solution", "content": "Short summary of your startup's solution.", "subSections": ["How it works", "Core benefits", "Why it's better"] },
        { "title": "Go-to-Market (GTM)", "content": "How you will acquire customers.", "subSections": ["Target customers", "Marketing strategy", "Customer retention"] }
      ]
    }
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 1200,
  })

  return JSON.parse(completion.choices[0].message.content || '{}') as PitchDeck
}

// **Step 2: Enrich Each Slide**
async function enrichSlide(slide: Slide): Promise<Slide> {
  const prompt = `
    You are a professional startup consultant. Expand the following **pitch deck slide** into a **detailed, structured** explanation.

    ### Slide Details:
    - Title: ${slide.title}
    - Content Summary: ${slide.content}
    - Key Subsections: ${JSON.stringify(slide.subSections)}

    ### Requirements:
    1. Write **a full-length, engaging slide explanation**.
    2. Answer all **key questions** to ensure depth.
    3. Add **bullet points** for clarity.
    4. Keep it **clear, concise, and startup-friendly**.

    ### Example Output:
    {
      "title": "Problem",
      "content": "Hiring is slow and expensive. Companies waste time filtering resumes manually.",
      "bulletPoints": [
        "Recruiters spend 40% of their time on resume screening.",
        "Hiring delays lead to $1.2M in lost revenue per company annually.",
        "Current solutions fail to assess candidate culture fit."
      ]
    }
  `

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
    max_tokens: 800,
  })

  return JSON.parse(completion.choices[0].message.content || '{}') as Slide
}

export async function POST(req: Request) {
  try {
    const body: BusinessDetails = await req.json()

    // **Step 1: Generate the structured pitch deck outline**
    const pitchDeck = await generatePitchDeckOutline(body)

    // **Step 2: Enrich each slide deeply**
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
