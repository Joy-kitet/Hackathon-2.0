import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json()

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Replace this URL with your actual backend endpoint
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000"

    const response = await fetch(`${BACKEND_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      throw new Error("Backend request failed")
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in analyze API:", error)

    // Fallback mock response for development
    const mockResponse = {
      query: "I have tyre wastes in my compound. Give me steps to dispose them.",
      extracted_waste_items: ["tyre wastes", "scrap tires"],
      items_info: [
        {
          name: "tyre wastes",
          category: "Rubber",
          recyclability: "Recyclable",
          health_risk: null,
          reuse_ideas: [
            "Can be shredded and used as playground surfaces.",
            "Can be used to create rubberized asphalt for roads.",
            "Can be processed into crumb rubber for use in various products",
          ],
        },
        {
          name: "scrap tires",
          category: "Rubber",
          recyclability: "Recyclable",
          health_risk: "May harbor mosquitoes and rodents if not disposed properly",
          reuse_ideas: [
            "Use as makeshift planters for gardens.",
            "Cut into pieces and use as protective barriers around trees or plants.",
            "Donate to a tire recycling center or facility that can repurpose them into other products.",
          ],
        },
      ],
      wealth_ideas: [
        {
          title: "Recycled Rubber Mats",
          description:
            "Collect scrap tires, shred them into smaller pieces, and mix them with other materials (like plastic or fabric) to create rubber mats. These can be sold to homes, businesses, or gyms.",
          required_materials: ["scrap tires", "shredder", "mixing machine", "mold", "adhesive"],
          estimated_value: "Ksh 5,000 - 10,000 per month",
        },
        {
          title: "Rubber Mulch for Gardens",
          description:
            "Shred scrap tires into small pieces to create rubber mulch. This can be sold to gardeners, landscapers, or nurseries as an alternative to traditional wood mulch.",
          required_materials: ["scrap tires", "shredder"],
          estimated_value: "Ksh 3,000 - 7,000 per month",
        },
      ],
      analysis: null,
      quick_answer: null,
    }

    // Simulate API delay for development
    await new Promise((resolve) => setTimeout(resolve, 2000))

    return NextResponse.json(mockResponse)
  }
}
