"""
Disposal & management tips database, keyed by waste category.
"""

TIPS = {
    "E-waste": {
        "icon": "💻",
        "color": "#f59e0b",
        "description": "Electronic waste contains toxic materials like lead, mercury, and cadmium.",
        "disposal": [
            "Drop off at certified e-waste recycling centres (e.g., Best Buy, Staples drop-off programs).",
            "Wipe all personal data before disposing of any device.",
            "Check if the manufacturer has a take-back / trade-in program.",
            "Never throw electronics in regular trash — landfill leaching is hazardous.",
        ],
        "reuse": [
            "Donate working devices to schools or non-profits.",
            "Refurbish old phones/laptops for secondary use.",
            "Strip working components (RAM, SSDs) for parts.",
        ],
        "carbon_saving": "Recycling 1 million laptops saves energy equivalent to electricity used by 3,500 homes per year.",
    },
    "Organic": {
        "icon": "🍂",
        "color": "#22c55e",
        "description": "Organic waste breaks down naturally but releases methane in landfills.",
        "disposal": [
            "Compost at home using a compost bin or pile.",
            "Use municipal green-bin / organic-waste collection services.",
            "Contribute to community garden compost heaps.",
            "Avoid sending food waste to landfill — it produces harmful greenhouse gases.",
        ],
        "reuse": [
            "Turn food scraps into vermicompost (worm farming).",
            "Use fruit/vegetable peels as natural fertiliser.",
            "Brew compost tea as a liquid plant nutrient.",
        ],
        "carbon_saving": "Composting 1 tonne of organic waste prevents ~1 tonne of CO₂-equivalent methane emissions.",
    },
    "Plastic": {
        "icon": "♻️",
        "color": "#3b82f6",
        "description": "Plastics can take 400–1000 years to decompose and harm marine ecosystems.",
        "disposal": [
            "Check the resin code (1–7) on the bottom — codes 1 (PET) and 2 (HDPE) are widely recyclable.",
            "Rinse containers before placing them in the recycling bin.",
            "Take plastic bags to supermarket collection points (not kerbside bins).",
            "Avoid wishful recycling — when in doubt, check your local council guidelines.",
        ],
        "reuse": [
            "Refill water bottles and containers instead of buying new.",
            "Upcycle plastic bottles into plant pots or bird feeders.",
            "Choose products with minimal or compostable packaging.",
        ],
        "carbon_saving": "Recycling 1 tonne of plastic saves around 1.5–2 tonnes of CO₂ versus virgin plastic production.",
    },
    "Metal": {
        "icon": "🔩",
        "color": "#94a3b8",
        "description": "Metals are infinitely recyclable without loss of quality.",
        "disposal": [
            "Place clean aluminium and steel cans in kerbside recycling.",
            "Take large scrap metal to a scrap yard — you can often earn money.",
            "Separate ferrous (iron/steel) from non-ferrous (aluminium, copper) metals.",
            "Do not put metals in general waste — recycling rates for metals are very high.",
        ],
        "reuse": [
            "Repurpose tin cans as storage containers, plant pots, or candle holders.",
            "Donate unwanted metal tools, cookware, and appliances to charity shops.",
            "Sell copper wire and valuable metals to recyclers for cash.",
        ],
        "carbon_saving": "Recycling aluminium uses 95% less energy than producing it from raw ore (bauxite).",
    },
    "Glass": {
        "icon": "🍾",
        "color": "#06b6d4",
        "description": "Glass is 100% recyclable and can be recycled endlessly.",
        "disposal": [
            "Place bottles and jars in bottle banks or kerbside glass bins.",
            "Separate by colour (clear, green, brown) if required by your council.",
            "Remove lids and caps — they are usually a different material.",
            "Broken glass should be wrapped safely before disposal.",
        ],
        "reuse": [
            "Reuse jars for food storage, homemade preserves, or as drinking glasses.",
            "Use old bottles as decorative vases or candle holders.",
            "Crushed glass (cullet) can be used as a sand substitute in construction.",
        ],
        "carbon_saving": "Using recycled glass reduces CO₂ emissions by 315 kg per tonne versus virgin glass production.",
    },
    "General": {
        "icon": "🗑️",
        "color": "#6b7280",
        "description": "Mixed or unclassified waste that may go to landfill.",
        "disposal": [
            "Perform a waste audit — sort before throwing to find recyclables.",
            "Use a landfill diversion strategy: reduce, reuse, recycle, recover.",
            "Check if hazardous items (batteries, chemicals) need special disposal.",
            "Contact your local council for bulk waste collection services.",
        ],
        "reuse": [
            "Donate usable items to charity before discarding.",
            "Explore repair cafes and swap shops in your community.",
            "Buy second-hand to reduce overall waste generation.",
        ],
        "carbon_saving": "Diverting waste from landfill can reduce per-household carbon footprint by up to 10%.",
    },
}

CATEGORIES = list(TIPS.keys())
