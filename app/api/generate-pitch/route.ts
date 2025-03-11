import { OpenAI } from 'openai'
import { NextResponse } from 'next/server'
import type { BusinessDetails, PitchDeck } from '@/app/types/pitch'

const openai = new OpenAI({
  apiKey:
    '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',
})

export async function POST(req: Request) {
  try {
    const body: BusinessDetails = await req.json()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional pitch deck creator. Create a structured pitch deck with 10-13 slides based on the business details provided. Format the response as JSON with slides array containing title, content, and optional bulletPoints for each slide.',
        },
        {
          role: 'user',
          content: `Create a pitch deck for the following business:
            Business Idea: ${body.businessIdea}
            Industry: ${body.industry}
            Target Market: ${body.targetMarket}
            ${
              body.uniqueSellingPoint
                ? `Unique Selling Point: ${body.uniqueSellingPoint}`
                : ''
            }
            ${
              body.competitiveAdvantage
                ? `Competitive Advantage: ${body.competitiveAdvantage}`
                : ''
            }
            ${
              body.financialProjections
                ? `Financial Projections: ${body.financialProjections}`
                : ''
            }`,
        },
      ],
      response_format: { type: 'json_object' },
    })

    const pitchDeck = JSON.parse(
      completion.choices[0].message.content || '{}'
    ) as PitchDeck

    return NextResponse.json(pitchDeck)
  } catch (error) {
    console.error('Error generating pitch deck:', error)
    return NextResponse.json(
      { error: 'Failed to generate pitch deck' },
      { status: 500 }
    )
  }
}
