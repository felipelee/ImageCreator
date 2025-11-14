import { NextRequest, NextResponse } from 'next/server'

interface GenerateContentRequest {
  brandKnowledge?: {
    brandVoice?: string
    information?: string
  }
  productInformation?: string
  skuName?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateContentRequest = await request.json()
    const { brandKnowledge, productInformation, skuName } = body

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.' },
        { status: 500 }
      )
    }

    // Build the prompt for AI generation
    const prompt = buildPrompt(brandKnowledge, productInformation, skuName)

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using gpt-4o-mini for cost efficiency, can be changed to gpt-4o
        messages: [
          {
            role: 'system',
            content: `You are an expert copywriter specializing in social media ad content. Your writing style is:

- CONVERSATIONAL & FRIENDLY: Write like you're talking to a close friend, not a corporate robot. Use natural, everyday language.
- HUMAN & RELATABLE: Avoid corporate jargon, buzzwords, and marketing speak. Be genuine and authentic.
- SIMPLE & CLEAR: Use short sentences. Break down complex ideas into simple terms anyone can understand. If a 12-year-old can't understand it, simplify it.
- COMPELLING BUT NOT PUSHY: Be persuasive without being salesy. Focus on real benefits, not hype.
- CASUAL TONE: Use contractions (don't, can't, you're). Write in a relaxed, approachable way.
- BENEFIT-FOCUSED: Explain what it actually does for them in plain language, not technical features.

Think: "How would I explain this to my best friend over coffee?" That's your tone.

Always return valid JSON only, no markdown formatting.`
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.9, // Higher temperature for more natural, conversational tone
        response_format: { type: 'json_object' }
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', errorData)
      return NextResponse.json(
        { error: `OpenAI API error: ${response.statusText}. ${errorData}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Check if we got a valid response
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid OpenAI response:', data)
      return NextResponse.json(
        { error: 'Invalid response from OpenAI. Please try again.' },
        { status: 500 }
      )
    }
    
    let generatedContent
    try {
      generatedContent = JSON.parse(data.choices[0].message.content)
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', data.choices[0].message.content)
      return NextResponse.json(
        { error: 'Failed to parse AI response. The AI may have returned invalid format. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: `Failed to generate content: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}

function buildPrompt(
  brandKnowledge?: { brandVoice?: string; information?: string },
  productInformation?: string,
  skuName?: string
): string {
  let prompt = `Generate comprehensive ad copy for a social media post generator. 

`

  if (brandKnowledge?.information) {
    prompt += `BRAND CONTEXT:\n${brandKnowledge.information}\n\n`
  }

  if (brandKnowledge?.brandVoice) {
    prompt += `BRAND VOICE & TONE:\n${brandKnowledge.brandVoice}\n\n`
  }

  if (productInformation) {
    prompt += `PRODUCT INFORMATION:\n${productInformation}\n\n`
  }

  if (skuName) {
    prompt += `PRODUCT NAME: ${skuName}\n\n`
  }

  prompt += `Generate copy for ALL of the following ad layouts. Each layout has specific context and examples. Return ONLY valid JSON matching this exact structure:

{
  "compare": {
    "_context": "Comparison layout showing YOUR PRODUCT vs COMPETITOR. Left side is YOUR product (e.g., Natural Peptides), right side is THEIR product (e.g., Synthetic Alternatives). This is NOT 'us vs supplements' - it's specifically comparing your product type to synthetic alternatives or competitors. IMPORTANT: Row labels must be SHORT - max 6-8 words, ideally 4-6 words. Long text will overflow and look bad.",
    "_examples": {
      "headline": "COMPARE THE DIFFERENCE",
      "leftLabel": "Natural Peptides",
      "rightLabel": "Synthetic Alternatives",
      "row1_label": "No DIY math or mixing",
      "row2_label": "Plain-language instructions",
      "row3_label": "No research chemical loopholes",
      "row4_label": "Independent lab COAs you can verify"
    },
    "headline": "comparison headline (3-8 words, uppercase style)",
    "leftLabel": "left side label - YOUR product name/type (2-4 words, e.g., 'Natural Peptides')",
    "rightLabel": "right side label - THEIR product/competitor (2-4 words, e.g., 'Synthetic Alternatives', NOT 'supplements')",
    "row1_label": "first comparison point highlighting YOUR advantage (4-6 words MAX - must fit on one line, keep it short!)",
    "row2_label": "second comparison point highlighting YOUR advantage (4-6 words MAX - must fit on one line, keep it short!)",
    "row3_label": "third comparison point highlighting YOUR advantage (4-6 words MAX - must fit on one line, keep it short!)",
    "row4_label": "fourth comparison point highlighting YOUR advantage (4-8 words MAX - can wrap to 2 lines if needed, but prefer shorter)",
    "promoBadge": "promotional badge (2-4 words, optional)"
  },
  "testimonial": {
    "_context": "Customer testimonial layout with photo background and quote panel. Authentic customer voice.",
    "_examples": {
      "quote": "This product has completely changed my life...",
      "name": "- Customer Name",
      "ratingLabel": "★★★★★",
      "ctaStrip": "TRY FOR 50% OFF | USE CODE SAVE50"
    },
    "quote": "customer testimonial quote (10-25 words, authentic and specific)",
    "name": "customer name (e.g., 'Sarah M.' or 'John D.')",
    "ratingLabel": "rating text (e.g., '★★★★★', '5/5 Stars', '10/10')",
    "ctaStrip": "call to action strip (5-12 words, promotional)"
  },
  "benefits": {
    "_context": "Benefits layout with pack image and callout bullets. Highlights key product benefits with stats.",
    "_examples": {
      "headline": "Train Harder, Bounce Back Faster",
      "bullet1": "54% better overall performance*",
      "bullet2": "47% less muscle fatigue*",
      "bullet3": "4X more muscle protein synthesis*",
      "bullet4": "144% stronger strength recovery vs whey*"
    },
    "headline": "benefits headline (4-8 words, action-oriented)",
    "bullet1": "first benefit with stat if available (4-10 words, can include percentages)",
    "bullet2": "second benefit with stat if available (4-10 words, can include percentages)",
    "bullet3": "third benefit with stat if available (4-10 words, can include percentages)",
    "bullet4": "fourth benefit with stat if available (4-12 words, can include percentages)"
  },
  "stat97": {
    "_context": "Big stat layout featuring a large percentage and ingredient callouts. Showcases key statistic prominently.",
    "_examples": {
      "value": "100%",
      "headline": "Naturally sourced Bioactive Precision Peptides™",
      "ingredient1": "Citric Acid",
      "ingredient2": "Pomelo Extract",
      "ingredient3": "L-Theanine",
      "ingredient4": "Methylcobalamin"
    },
    "value": "statistic value (e.g., '97%', '100%', '4X')",
    "headline": "stat headline (6-12 words, descriptive)",
    "ingredient1": "first ingredient name (actual ingredient from product)",
    "ingredient2": "second ingredient name (actual ingredient from product)",
    "ingredient3": "third ingredient name (actual ingredient from product)",
    "ingredient4": "fourth ingredient name (actual ingredient from product)"
  },
  "stats": {
    "_context": "Multi stats layout with lifestyle background. Shows multiple statistics about user outcomes/results.",
    "_examples": {
      "headline": "People who take Make Wellness peptides are:",
      "stat1_value": "78%",
      "stat1_label": "MORE LIKELY TO WAKE UP ACTUALLY RESTED",
      "stat2_value": "71%",
      "stat2_label": "MORE LIKELY TO FEEL IN CONTROL OF CRAVINGS",
      "stat3_value": "69%",
      "stat3_label": "MORE LIKELY TO FEEL STEADY, ALL-DAY ENERGY",
      "disclaimer": "*Based on a 60-day study showing benefits from daily use."
    },
    "headline": "stats headline (6-15 words, sets up the statistics)",
    "stat1_value": "first stat value (e.g., '78%', '4X', '2.5X')",
    "stat1_label": "first stat label (uppercase, 4-10 words, outcome-focused)",
    "stat2_value": "second stat value (e.g., '71%', '3X')",
    "stat2_label": "second stat label (uppercase, 4-10 words, outcome-focused)",
    "stat3_value": "third stat value (e.g., '69%', '2X')",
    "stat3_label": "third stat label (uppercase, 4-10 words, outcome-focused)",
    "disclaimer": "disclaimer text (8-25 words, study/research context)"
  },
  "badges": {
    "_context": "Badges layout showcasing multiple product badges or certifications. Visual badge display.",
    "_examples": {
      "headline": "Badges headline",
      "badge1": "First badge",
      "badge2": "Second badge",
      "badge3": "Third badge",
      "badge4": "Fourth badge",
      "badge5": "Fifth badge"
    },
    "headline": "badges headline (4-8 words)",
    "badge1": "first badge text (2-4 words, short and punchy)",
    "badge2": "second badge text (2-4 words, short and punchy)",
    "badge3": "third badge text (2-4 words, short and punchy)",
    "badge4": "fourth badge text (2-4 words, short and punchy)",
    "badge5": "fifth badge text (2-4 words, short and punchy)"
  },
  "promo": {
    "_context": "Product promo layout with stats and promotional badge. Features product at angle with key statistics and discount offer.",
    "_examples": {
      "headline": "Peptide fuel. Not another pre-workout.",
      "stat1_value": "47%",
      "stat1_label": "LESS MUSCLE FATIGUE*",
      "stat2_value": "4X",
      "stat2_label": "MORE MUSCLE PROTEIN SYNTHESIS THAN WHEY*",
      "stat3_value": "144%",
      "stat3_label": "BETTER STRENGTH RECOVERY VS WHEY*",
      "badgeNote": "First Time Order?",
      "badge": "Unlock 10% OFF at checkout"
    },
    "headline": "promo headline (4-10 words, punchy and product-focused)",
    "stat1_value": "first stat value (e.g., '47%', '4X', '2.5X')",
    "stat1_label": "first stat label (uppercase, 3-8 words, benefit-focused)",
    "stat2_value": "second stat value (e.g., '4X', '144%')",
    "stat2_label": "second stat label (uppercase, 4-10 words, comparison-focused if applicable)",
    "stat3_value": "third stat value (e.g., '144%', '3X')",
    "stat3_label": "third stat label (uppercase, 4-10 words, comparison-focused if applicable)",
    "badge": "promotional badge text (4-10 words, discount/offer)",
    "badgeNote": "badge note text (2-5 words, question or hook)"
  },
  "bottle": {
    "_context": "Bottle list layout with hand holding product image. Shows product benefits in list format with titles and detailed descriptions.",
    "_examples": {
      "headline": "Stronger, Longer",
      "benefit1": "Stronger muscles",
      "benefit1_detail": "SUPPORTS MUSCLE PROTEIN SYNTHESIS AND LEAN MUSCLE REPAIR",
      "benefit2": "Faster recovery",
      "benefit2_detail": "SUPPORTS MUSCLE STRENGTH RECOVERY BETWEEN WORKOUTS",
      "benefit3": "Healthy aging",
      "benefit3_detail": "HELPS MAINTAIN NAD+ LEVELS TO SUPPORT LONG-TERM MUSCLE FUNCTION"
    },
    "headline": "bottle list headline (2-6 words, short and impactful)",
    "benefit1": "first benefit title (2-4 words, concise)",
    "benefit1_detail": "first benefit detail (uppercase, 6-12 words, technical but clear)",
    "benefit2": "second benefit title (2-4 words, concise)",
    "benefit2_detail": "second benefit detail (uppercase, 6-12 words, technical but clear)",
    "benefit3": "third benefit title (2-4 words, concise)",
    "benefit3_detail": "third benefit detail (uppercase, 6-12 words, technical but clear)",
    "benefit4": "fourth benefit title (2-4 words, optional)",
    "benefit4_detail": "fourth benefit detail (uppercase, 6-12 words, optional)"
  },
  "ingredients": {
    "_context": "Ingredients layout showcasing key product ingredients. Clean ingredient display.",
    "_examples": {
      "headline": "Key Ingredients",
      "ingredient1": "Citric Acid",
      "ingredient2": "Pomelo Extract",
      "ingredient3": "L-Theanine",
      "ingredient4": "Methylcobalamin"
    },
    "headline": "ingredients headline (3-8 words)",
    "ingredient1": "first ingredient name (actual ingredient from product)",
    "ingredient2": "second ingredient name (actual ingredient from product)",
    "ingredient3": "third ingredient name (actual ingredient from product)",
    "ingredient4": "fourth ingredient name (actual ingredient from product)"
  },
  "timeline": {
    "_context": "Timeline/journey layout showing product usage milestones over time. Shows progression of benefits.",
    "_examples": {
      "headline": "Feel the change",
      "milestone1_time": "7 Days",
      "milestone1_title": "Smoother, more stable energy during the day",
      "milestone2_time": "14 Days",
      "milestone2_title": "Improved focus and mental clarity",
      "milestone3_time": "30 Days",
      "milestone3_title": "Noticeable improvements in overall wellness"
    },
    "headline": "timeline headline (2-6 words, emotional/transformational)",
    "subhead": "timeline subhead (optional, 4-12 words)",
    "milestone1_time": "first milestone time (e.g., '7 Days', 'Week 1', 'Day 7')",
    "milestone1_title": "first milestone title (6-15 words, specific benefit)",
    "milestone1_detail": "first milestone detail (optional, 8-20 words)",
    "milestone2_time": "second milestone time (e.g., '14 Days', 'Week 2')",
    "milestone2_title": "second milestone title (6-15 words, specific benefit)",
    "milestone2_detail": "second milestone detail (optional, 8-20 words)",
    "milestone3_time": "third milestone time (e.g., '30 Days', 'Month 1')",
    "milestone3_title": "third milestone title (6-15 words, specific benefit)",
    "milestone3_detail": "third milestone detail (optional, 8-20 words)"
  },
  "usefor": {
    "headline": "use for headline (max 8 words)",
    "item1": "first use case (max 6 words)",
    "item2": "second use case (max 6 words)",
    "item3": "third use case (max 6 words)",
    "item4": "fourth use case (max 6 words)",
    "badge": "badge text (max 4 words)"
  },
  "poweredby": {
    "headline": "powered by headline (max 8 words)",
    "subhead": "powered by subhead (max 10 words)",
    "badge1": "first badge (max 3 words)",
    "badge2": "second badge (max 3 words)",
    "badge3": "third badge (max 3 words)",
    "badge4": "fourth badge (max 3 words)",
    "badge5": "fifth badge (max 3 words)",
    "badge6": "sixth badge (max 3 words)"
  },
  "price": {
    "headline": "price headline (max 8 words)",
    "oldPrice": "old price like '$99'",
    "newPrice": "new price like '$79'",
    "oldLabel": "old price label (max 4 words)",
    "newLabel": "new price label (max 4 words)",
    "benefit1": "first benefit (max 6 words)",
    "benefit2": "second benefit (max 6 words)",
    "benefit3": "third benefit (max 6 words)",
    "benefit4": "fourth benefit (max 6 words)",
    "benefit5": "fifth benefit (max 6 words)",
    "benefit6": "sixth benefit (max 6 words)",
    "disclaimer": "price disclaimer (max 15 words)"
  },
  "priceComparison": {
    "_context": "Price comparison showing value of single product vs buying multiple supplements. Left is supplement pile with higher total cost, center is your single product with lower highlighted price, right lists what it replaces.",
    "_examples": {
      "headline": "FIT replaced the pile of supplements I'd been taking for years.",
      "priceLeft": "$225",
      "labelLeft": "Total per month",
      "priceCenter": "$79",
      "labelCenter": "Total per month",
      "benefit1": "Multivitamin & mineral",
      "benefit2": "Pre & Probiotic",
      "benefit3": "Greens Superfood",
      "benefit4": "Stress Adaptogen",
      "benefit5": "Immune Support",
      "benefit6": "Cognitive Support",
      "disclaimer": "Based on current available data for average industry prices"
    },
    "headline": "price comparison headline (8-15 words, conversational - e.g., 'This one product replaced the 6 supplements I was taking')",
    "priceLeft": "competitor/alternatives total price (e.g., '$225')",
    "labelLeft": "left price label (max 4 words, e.g., 'Total per month')",
    "priceCenter": "your product price (e.g., '$79')",
    "labelCenter": "center price label (max 4 words, e.g., 'Total per month')",
    "benefit1": "first thing your product replaces (max 5 words)",
    "benefit2": "second thing your product replaces (max 5 words)",
    "benefit3": "third thing your product replaces (max 5 words)",
    "benefit4": "fourth thing your product replaces (max 5 words)",
    "benefit5": "fifth thing your product replaces (max 5 words)",
    "benefit6": "sixth thing your product replaces (max 5 words)",
    "disclaimer": "price disclaimer/source (max 12 words)"
  },
  "lineup": {
    "headline": "lineup headline (max 8 words)",
    "stat": "statistic value",
    "statDetail": "stat detail (max 8 words)",
    "cta": "call to action (max 6 words)",
    "disclaimer": "disclaimer (max 12 words)"
  },
  "hand": {
    "headline": "hand layout headline (max 8 words)",
    "stat": "statistic value",
    "badge": "badge text (max 4 words)",
    "badgeDetail": "badge detail (max 6 words)",
    "disclaimer": "disclaimer (max 12 words)"
  },
  "celebrity": {
    "quote": "celebrity quote (max 20 words)",
    "mediaLogo": "media outlet name"
  },
  "singleStat": {
    "stat": "statistic value",
    "headline": "single stat headline (max 10 words)",
    "subhead": "single stat subhead (max 12 words)",
    "disclaimer": "disclaimer (max 15 words)"
  },
  "statement": {
    "_context": "Bold statement ad with punchy message, product, and benefits. Eye-catching layout designed to stop scrollers.",
    "_examples": {
      "statement": "What if getting healthier was this easy?",
      "benefit1": "Science-backed",
      "benefit2": "No artificial ingredients",
      "benefit3": "Results you can feel",
      "cta": "TRY IT NOW • SAVE 25%"
    },
    "statement": "bold question or statement (6-12 words, thought-provoking, e.g., 'What if...?', 'Ready to...?', 'The secret to...')",
    "benefit1": "first benefit or feature (2-4 words, short and punchy)",
    "benefit2": "second benefit or feature (2-4 words, short and punchy)",
    "benefit3": "third benefit or feature (2-4 words, short and punchy)",
    "cta": "call to action text (4-8 words, uppercase style, promotional, e.g., 'SHOP NOW • SAVE 25%')"
  },
  "beforeAfter": {
    "_context": "Before/After transformation split screen showing problem vs solution with product.",
    "_examples": {
      "headline": "The Transformation",
      "beforeLabel": "BEFORE",
      "beforeText": "Feeling tired and sluggish throughout the day",
      "afterLabel": "AFTER",
      "afterText": "Sustained energy and mental clarity all day long"
    },
    "headline": "headline (2-5 words, e.g., 'The Transformation', 'See The Difference')",
    "beforeLabel": "before label (1-2 words, uppercase, e.g., 'BEFORE', 'THE PROBLEM')",
    "beforeText": "before description (6-12 words, describe the problem or starting point)",
    "afterLabel": "after label (1-2 words, uppercase, e.g., 'AFTER', 'THE RESULT')",
    "afterText": "after description (6-12 words, describe the positive outcome)"
  },
  "problemSolution": {
    "_context": "Problem → Product → Solution flow layout showing problem, your product, and the solution it provides.",
    "_examples": {
      "problemLabel": "THE PROBLEM",
      "problemText": "You're tired of products that don't deliver",
      "solutionLabel": "THE SOLUTION",
      "solutionText": "Real results from science-backed ingredients"
    },
    "problemLabel": "problem label (1-3 words, uppercase, e.g., 'THE PROBLEM', 'THE ISSUE')",
    "problemText": "problem description (6-10 words, describe the pain point)",
    "solutionLabel": "solution label (1-3 words, uppercase, e.g., 'THE SOLUTION', 'THE ANSWER')",
    "solutionText": "solution description (6-10 words, how your product solves it)"
  },
  "featureGrid": {
    "_context": "4-feature grid showcasing key product features with icons, titles, and descriptions.",
    "_examples": {
      "headline": "Why You'll Love It",
      "feature1_icon": "⚡",
      "feature1_title": "Fast Acting",
      "feature1_desc": "Feel the difference in minutes",
      "feature2_icon": "🔬",
      "feature2_title": "Science-Backed",
      "feature2_desc": "Clinically proven ingredients",
      "feature3_icon": "🌱",
      "feature3_title": "All Natural",
      "feature3_desc": "No artificial ingredients",
      "feature4_icon": "✓",
      "feature4_title": "Easy to Use",
      "feature4_desc": "Simple daily routine"
    },
    "headline": "headline (3-6 words, e.g., 'Why You'll Love It', 'What Makes Us Different')",
    "feature1_icon": "emoji icon for feature 1 (single emoji)",
    "feature1_title": "feature 1 title (2-4 words)",
    "feature1_desc": "feature 1 description (4-6 words)",
    "feature2_icon": "emoji icon for feature 2 (single emoji)",
    "feature2_title": "feature 2 title (2-4 words)",
    "feature2_desc": "feature 2 description (4-6 words)",
    "feature3_icon": "emoji icon for feature 3 (single emoji)",
    "feature3_title": "feature 3 title (2-4 words)",
    "feature3_desc": "feature 3 description (4-6 words)",
    "feature4_icon": "emoji icon for feature 4 (single emoji)",
    "feature4_title": "feature 4 title (2-4 words)",
    "feature4_desc": "feature 4 description (4-6 words)"
  },
  "socialProof": {
    "_context": "Multiple customer reviews with ratings showcasing social proof and testimonials.",
    "_examples": {
      "headline": "Real People. Real Results.",
      "review1_rating": "★★★★★",
      "review1_quote": "Game changer! I feel amazing.",
      "review1_name": "- Jessica M.",
      "review2_rating": "★★★★★",
      "review2_quote": "Best purchase I've made all year.",
      "review2_name": "- David L.",
      "review3_rating": "★★★★★",
      "review3_quote": "Actually works. No gimmicks.",
      "review3_name": "- Sarah K."
    },
    "headline": "headline (3-6 words, e.g., 'Real People. Real Results.', 'What Customers Say')",
    "review1_rating": "rating (e.g., '★★★★★', '5/5')",
    "review1_quote": "review 1 quote (5-10 words, authentic customer voice)",
    "review1_name": "review 1 name (e.g., '- Jessica M.', '- David L.')",
    "review2_rating": "rating (e.g., '★★★★★', '5/5')",
    "review2_quote": "review 2 quote (5-10 words, authentic customer voice)",
    "review2_name": "review 2 name (e.g., '- Jessica M.', '- David L.')",
    "review3_rating": "rating (e.g., '★★★★★', '5/5')",
    "review3_quote": "review 3 quote (5-10 words, authentic customer voice)",
    "review3_name": "review 3 name (e.g., '- Jessica M.', '- David L.')"
  },
  "ingredientHero": {
    "_context": "Spotlight on one key ingredient with large name, tagline, and benefits. Deep dive into hero ingredient.",
    "_examples": {
      "ingredientName": "L-THEANINE",
      "tagline": "The focus and calm amino acid",
      "benefit1": "Boosts energy",
      "benefit2": "Supports recovery",
      "benefit3": "Enhances focus",
      "productBadge": "INSIDE"
    },
    "ingredientName": "ingredient name (1-3 words, uppercase, actual ingredient name)",
    "tagline": "ingredient tagline (4-8 words, what it does in simple terms)",
    "benefit1": "benefit 1 (2-3 words, short benefit)",
    "benefit2": "benefit 2 (2-3 words, short benefit)",
    "benefit3": "benefit 3 (2-3 words, short benefit)",
    "productBadge": "product badge text (1-2 words, e.g., 'INSIDE', 'FEATURED')"
  }
}

CRITICAL WRITING INSTRUCTIONS:

TONE & STYLE:
- Write like you're texting a friend, not writing a press release
- Use simple, everyday words. Avoid: "leverage", "optimize", "utilize", "synergize", "revolutionary", "cutting-edge"
- Instead use: "use", "help", "make", "get", "try", "works", "actually helps"
- Keep sentences short and punchy. One idea per sentence.
- Use contractions: "don't", "can't", "you're", "it's", "we've"
- Be specific and concrete, not vague: "helps you sleep better" not "optimizes your rest cycle"
- Write in active voice: "This helps you" not "This has been shown to help"
- Use "you" and "your" - talk directly to the person reading it

CONTENT GUIDELINES:
- Match the brand voice and tone exactly as provided
- Use ONLY the product-specific information provided - do not make assumptions
- For comparison layouts: leftLabel is YOUR product (e.g., "Natural Peptides"), rightLabel is THEIR product/competitor (e.g., "Synthetic Alternatives") - NOT generic terms like "supplements"
- Use actual ingredient names from the product information provided
- Make copy compelling but natural - like a friend recommending something they love
- Follow word count ranges strictly (minimum and maximum)
- Use the examples as style guides but create original content
- For stats: use realistic percentages/numbers if provided in product info, otherwise use appropriate ranges
- For testimonials: create authentic-sounding quotes that sound like real people talking, not marketing copy
- Explain benefits in plain English: "You'll have more energy" not "Enhanced vitality optimization"

EXAMPLES OF GOOD TONE:
✅ "This stuff actually works. I have way more energy now."
✅ "No complicated math. Just mix and go."
✅ "You'll feel the difference in a week."
✅ "Real ingredients. No weird chemicals."

EXAMPLES OF BAD TONE (AVOID):
❌ "Revolutionary breakthrough technology"
❌ "Optimize your wellness journey"
❌ "Cutting-edge formulation"
❌ "Synergistic blend of premium ingredients"

TECHNICAL REQUIREMENTS:
- Return ONLY the JSON object, no markdown, no code blocks, no explanations
- Do NOT include the "_context" or "_examples" fields in your response - only include the actual data fields`

  return prompt
}

