export interface BusinessDetails {
  businessIdea: string
  industry: string
  targetMarket: string
  uniqueSellingPoint?: string
  competitiveAdvantage?: string
  financialProjections?: string
}

export interface Slide {
  title: string
  content: string
  subSections: {
    title: string
    content: string
    bulletPoints?: string[]
  }[]
  imagePrompt?: string
}

export interface PitchDeck {
  slides: Slide[]
  businessName: string
  industry: string
}
