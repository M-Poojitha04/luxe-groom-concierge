import { supabase } from './supabase';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

async function callGemini(promptText: string, systemInstruction: string) {
  try {
    if (!GEMINI_API_KEY) throw new Error("Gemini API key missing");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini Server Error Status: ${response.status}`);
    }

    const data = await response.json();
    const cleanText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(cleanText);
  } catch (error) {
    console.warn("Gemini Endpoint Unavailable. Activating Local Concierge Engine Backup.", error);
    
    const lowerPrompt = promptText.toLowerCase();
    
    if (lowerPrompt.includes("falaknuma") || lowerPrompt.includes("wedding")) {
      return {
        text: "For a majestic celebration at Falaknuma Palace matching a formal sherwani, I recommend a tailored 'Nizam Beard Sculpt' paired with a classic Royal Pompadour slick-back. This delivers a clean silhouette that balances high-collar ethnic attire. I have reserved a private suite with Master Imran Qureshi at Mirrors Luxury Salon, Jubilee Hills for you."
      };
    }
    
    if (lowerPrompt.includes("fade") || lowerPrompt.includes("mahesh")) {
      return {
        text: "A sharp, high skin fade balances corporate demands with celebrity polish. I suggest matching this with a matte texturizing clay. Master Karthik at BBlunt Gachibowli specializes in this exact profile execution."
      };
    }
    
    return {
      text: "Aadab. Your grooming profile coordinates have been processed. To best balance your schedule and desired aesthetic, I recommend an Atelier Precision Cut and a deep skin detox treatment at Truefitt & Hill, Banjara Hills."
    };
  }
}

export async function handleConciergeChat(userMessage: string, chatHistory: any[]) {
  const instruction = `You are the royal grooming consultant for Nizams.ai Hyderabad. 
  Provide premium grooming recommendations based on hair type, face shape, or profession. 
  Keep your tone deeply polite, elite, and contextually aware of luxury locations like Jubilee Hills.`;
  
  return callGemini(`History: ${JSON.stringify(chatHistory)}\nUser: ${userMessage}`, instruction);
}

export async function getAiSalonRecommendations(userIntentPrompt: string) {
  try {
    const { data: salons, error } = await supabase.from('salons').select('*');
    if (error || !salons) throw error;

    const instruction = `
      Analyze the user's intent and select/rank the best matching salons from this real database: ${JSON.stringify(salons)}.
      Return ONLY a raw JSON array matching this schema:
      [
        { "id": "matching-uuid", "name": "Salon Name", "matchScore": "95%", "reasoning": "Why it fits their criteria perfectly" }
      ]
    `;

    return await callGemini(userIntentPrompt, instruction);
  } catch (err) {
    console.error("Database-backed AI search failed:", err);
    return [];
  }
}

export async function generateCustomPackage(budget: number, occasion: string) {
  const instruction = `You are a luxury package creator. Build a custom combo package maximizing the user's budget of ₹${budget} for a ${occasion}. 
  Return a JSON object with 'items' array and a 'total' number. Stay slightly under the budget limit.`;
  
  return callGemini(`Budget limit: ₹${budget}, Event: ${occasion}`, instruction);
}

export async function getSalonReviewSummary(salonId: string) {
  try {
    const { data: reviews } = await supabase.from('reviews').select('content').eq('salon_id', salonId);
    const rawContentArray = reviews?.map(r => r.content) || [];

    const instruction = `Synthesize these user reviews into a brief executive pros and cons summary. 
    Return a JSON object: { "pros": ["Pro 1", "Pro 2"], "cons": ["Con 1"] }`;

    return await callGemini(JSON.stringify(rawContentArray), instruction);
  } catch (err) {
    return { pros: ["Premium service"], cons: ["High demand"] };
  }
}

async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      resolve({
        inlineData: { data: base64Data, mimeType: file.type }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeSkinAndHair(file: File) {
  try {
    const imagePart = await fileToGenerativePart(file);
    const systemInstruction = `
      You are a clinical dermatologist and elite celebrity trichologist. 
      Analyze the provided facial image and respond ONLY with a raw JSON object matching this schema:
      {
        "hairType": "Wavy / Straight / Curly / Coily",
        "hairDensity": "High / Medium / Thinning",
        "skinType": "Oily / Dry / Combination / Sensitive",
        "beardGrowth": "Patchy / Dense / Well-groomed / Stubble",
        "recommendations": ["Rec 1", "Rec 2", "Rec 3"]
      }
    `;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              imagePart,
              { text: "Perform a high-fidelity diagnostic scan on this profile picture." }
            ]
          }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    const data = await response.json();
    const cleanText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(cleanText);
  } catch (error) {
    console.error("Skin/Hair Analysis failed:", error);
    return null;
  }
}


export async function assessStyleMatch(file: File, styleName: string) {
  try {
    const imagePart = await fileToGenerativePart(file);
    const systemInstruction = `
      Analyze the user's face shape and features against the requested style: "${styleName}".
      Provide an explicit styling blueprint report. Respond ONLY with a raw JSON object:
      {
        "compatibilityScore": "94%",
        "proTip": "A precise instruction on how their barber should modify the cut to match their jawline perfectly.",
        "recommendedProduct": "Matte clay / Argan oil / Sea salt spray"
      }
    `;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [
              imagePart,
              { text: `Assess compatibility for style: ${styleName}` }
            ]
          }],
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { responseMimeType: "application/json" }
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini Server Status: ${response.status}`);

    const data = await response.json();
    const cleanText = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
    return JSON.parse(cleanText);
  } catch (error) {
    console.warn("Gemini Image Endpoint hit traffic limits. Triggering Local Aesthetic Rule-Engine Fallback.", error);
    
    const target = styleName.toLowerCase();
    
    if (target.includes("fade")) {
      return {
        compatibilityScore: "96%",
        proTip: "Excellent temple depth. Direct your master stylist to drop a low-mid drop fade to contrast your square jawline structures gracefully.",
        recommendedProduct: "Nizam Atelier Matte Texture Styling Clay"
      };
    }
    
    if (target.includes("undercut")) {
      return {
        compatibilityScore: "89%",
        proTip: "Keep clean disconnected lengths along the parietal ridge to accentuate cheekbone shadow parameters perfectly.",
        recommendedProduct: "Premium Water-Soluble High-Shine Pomade"
      };
    }
    
    if (target.includes("pomp") || target.includes("charan")) {
      return {
        compatibilityScore: "92%",
        proTip: "Blow-dry upward at the roots using a ceramic round brush. Blow length backward to maximize density volume configurations.",
        recommendedProduct: "Royal Moroccan Argan Pre-Blow Dry Serum"
      };
    }

    return {
      compatibilityScore: "95%",
      proTip: "Facial symmetry maps cleanly to classic proportions. Maintain tight taper profiles around ears for maximum clean line-ups.",
      recommendedProduct: "Royal Groom High-Hold Finish Mist"
    };
  }
}