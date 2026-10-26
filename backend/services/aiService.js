/**
 * FitLife Pro AI Service
 * Supports Google Gemini API with seamless deterministic fallback when no API key is configured.
 * Strictly adheres to wellness guidance boundaries: NO medical diagnoses, NO medication advice.
 */

// Deterministic wellness expert rule engine
function generateDeterministicResponse(query, userContext) {
  const q = query.toLowerCase();
  const { goal, calories, water, activity, diet, sleepTarget } = userContext;

  if (q.includes('meal') || q.includes('breakfast') || q.includes('lunch') || q.includes('dinner') || q.includes('food') || q.includes('eat') || q.includes('protein') || q.includes('diet')) {
    let mealIdea = '';
    if (diet === 'Vegetarian' || diet === 'Vegan') {
      mealIdea = `• **High-Protein Breakfast:** Rolled oats (60g) cooked in soy or almond milk with 1 scoop plant protein, chia seeds, and berries (~420 kcal, 28g protein).\n• **Balanced Lunch:** Quinoa or brown rice with 150g grilled paneer/tofu, stir-fried broccoli, and yellow dal (~550 kcal, 32g protein).\n• **Light Dinner:** Mixed sprout salad with avocado, diced cucumber, bell peppers, and roasted pumpkin seeds (~380 kcal, 18g protein).`;
    } else {
      mealIdea = `• **High-Protein Breakfast:** 3 eggs (2 whole, 1 white) scrambled with spinach, whole wheat toast, and 1/2 sliced avocado (~400 kcal, 26g protein).\n• **Balanced Lunch:** Grilled chicken breast (150g) with brown basmati rice, steamed asparagus, and light olive oil drizzle (~520 kcal, 38g protein).\n• **Nutrient-Dense Dinner:** Baked salmon fillet with roasted sweet potatoes and a crisp mixed green salad (~480 kcal, 34g protein).`;
    }

    return {
      reply: `### Personalized Nutrition Guidance\n\nBased on your active goal (**${goal || 'Fitness'}**) and daily target of **${calories || 2000} kcal**:\n\n${mealIdea}\n\n**Key Nutrition Rule:** Prioritize 1.6–2.0g of protein per kg of body weight to support lean recovery, and consume fibrous complex carbohydrates before intense training.\n\n*Note: Nutritional estimates are general guidelines and not clinical dietary prescriptions.*`,
      isAIGenerated: false,
      mode: 'deterministic-fallback',
      statusMessage: 'Processed via FitLife Pro Science-Based Deterministic Engine (Gemini API key not configured in backend).'
    };
  }

  if (q.includes('workout') || q.includes('exercise') || q.includes('training') || q.includes('gym') || q.includes('routine') || q.includes('muscle') || q.includes('strength')) {
    return {
      reply: `### Structured Training Blueprint\n\nFor your goal (**${goal || 'Build Strength'}**) and activity profile (**${activity || 'Active'}**):\n\n1. **Dynamic Warm-Up (5-8 mins):** Arm swings, leg kicks, bodyweight squats, and cat-cow spine mobility.\n2. **Compound Movement:** 3–4 working sets of squats, push-ups/bench press, or barbell rows with 2 minutes rest between sets.\n3. **Accessory Work:** 3 sets of 10-12 reps targeting smaller muscle groups (e.g. dumbbell shoulder presses, lunges, lat pulldowns).\n4. **Core Finisher:** 3 sets of 45-second forearm planks and hanging knee raises.\n5. **Cooldown:** 5 minutes of low-intensity walking and static hamstring/chest stretching.\n\n*Pro Tip:* Aim for progressive overload by adding either 1 rep or 2% weight every 1–2 weeks.`,
      isAIGenerated: false,
      mode: 'deterministic-fallback',
      statusMessage: 'Processed via FitLife Pro Science-Based Deterministic Engine (Gemini API key not configured in backend).'
    };
  }

  if (q.includes('water') || q.includes('hydrat') || q.includes('drink')) {
    return {
      reply: `### Hydration Strategy\n\nYour target fluid intake is **${water || 2500} ml/day**:\n\n• **Morning Kickstart:** Drink 400–500ml of room-temperature water upon waking to replenish fluids lost during overnight sleep.\n• **Pre-Workout:** Consume 250ml 30 minutes before training to prime blood volume and joint lubrication.\n• **Intra-Workout:** Sip 150ml every 15–20 minutes during vigorous exercise.\n• **Pacing Rule:** Spread water intake evenly across your waking hours rather than chugging large amounts at once.\n\n*Health Reminder:* Listen to your body and adjust for hot weather or intense perspiration. If you have medical fluid restrictions, follow your physician's advice.*`,
      isAIGenerated: false,
      mode: 'deterministic-fallback',
      statusMessage: 'Processed via FitLife Pro Science-Based Deterministic Engine (Gemini API key not configured in backend).'
    };
  }

  if (q.includes('sleep') || q.includes('recovery') || q.includes('tired') || q.includes('rest')) {
    return {
      reply: `### Rest & Sleep Optimization\n\nTargeting **${sleepTarget || 8} hours** of restorative sleep each night:\n\n• **Circadian Anchor:** Wake up and go to sleep within a 30-minute window every day, including weekends.\n• **Digital Sunset:** Dim bright room lighting and eliminate smartphone/laptop blue light 60 minutes before bedtime.\n• **Temperature:** Maintain a cool bedroom environment (around 18–20°C / 65–68°F) to facilitate natural core body temperature drops.\n• **Caffeine Cutoff:** Avoid caffeinated beverages 8–10 hours before your scheduled bedtime to protect slow-wave deep sleep.`,
      isAIGenerated: false,
      mode: 'deterministic-fallback',
      statusMessage: 'Processed via FitLife Pro Science-Based Deterministic Engine (Gemini API key not configured in backend).'
    };
  }

  if (q.includes('habit') || q.includes('streak') || q.includes('discipline') || q.includes('motivation')) {
    return {
      reply: `### Atomic Habit Optimization\n\nBuilding lasting discipline requires frictionless systems rather than short-lived motivation:\n\n1. **Habit Stacking:** Anchor your new habit to an established routine (e.g. *"After I brush my teeth, I will immediately drink 400ml of water"*).\n2. **The 2-Minute Rule:** Scale any new habit down so it takes under 120 seconds to begin (e.g. putting on workout shoes, or completing 5 pushups).\n3. **Track Visually:** Check off your daily habit in FitLife Pro immediately after completing it to trigger a dopamine reinforcement loop.\n4. **Never Miss Twice:** If you miss one day due to unforeseen events, recommit to showing up the next day without guilt or extreme compensation.`,
      isAIGenerated: false,
      mode: 'deterministic-fallback',
      statusMessage: 'Processed via FitLife Pro Science-Based Deterministic Engine (Gemini API key not configured in backend).'
    };
  }

  // General lifestyle overview
  return {
    reply: `### FitLife Pro Daily Wellness Insights\n\nHello! Here is your custom lifestyle summary for your goal (**${goal || 'Optimal Health'}**):\n\n• **Energy Management:** Target around **${calories || 2000} kcal/day** with balanced protein and micronutrients.\n• **Hydration Baseline:** Drink **${water || 2500} ml** throughout the day.\n• **Rest Baseline:** Aim for **${sleepTarget || 8} hours** of uninterrupted sleep.\n• **Daily Movement:** Incorporate at least 30 minutes of intentional physical activity today.\n\nYou can ask me specific questions such as:\n- *"Suggest a high-protein vegetarian post-workout meal"*\n- *"Design a 3-day home workout split for beginners"*\n- *"How can I improve my sleep consistency this week?"*`,
    isAIGenerated: false,
    mode: 'deterministic-fallback',
    statusMessage: 'Processed via FitLife Pro Science-Based Deterministic Engine (Gemini API key not configured in backend).'
  };
}

/**
 * Execute AI lifestyle assistant request
 */
async function askAILifestyleAssistant(userQuery, userProfile) {
  const apiKey = process.env.GEMINI_API_KEY;

  const sanitizedContext = {
    goal: userProfile?.fitnessGoal || 'Overall Wellness',
    calories: userProfile?.dailyCalorieTarget || 2000,
    water: userProfile?.dailyWaterTarget || 2500,
    activity: userProfile?.activityLevel || 'Moderately active',
    diet: userProfile?.foodPreference || 'No Restrictions',
    sleepTarget: userProfile?.dailySleepTarget || 8,
    experience: userProfile?.workoutExperience || 'Beginner'
  };

  // If no Gemini key is provided, use the high-quality deterministic wellness engine
  if (!apiKey || apiKey.trim() === '' || apiKey === 'YOUR_GEMINI_API_KEY') {
    return generateDeterministicResponse(userQuery, sanitizedContext);
  }

  try {
    const systemInstruction = `You are FitLife Coach, an expert lifestyle, nutrition, and wellness assistant embedded inside FitLife Pro.
Your role: Provide practical, encouraging, science-backed lifestyle planning, meal suggestions, beginner exercise tips, habit formation strategies, and sleep hygiene advice.
IMPORTANT BOUNDARIES:
- DO NOT provide medical diagnoses, treatment advice, or drug prescriptions.
- If a user mentions chest pain, severe injuries, or chronic diseases, advise consulting a licensed physician.
- Base your advice on the user's provided profile:
  * Goal: ${sanitizedContext.goal}
  * Target Calories: ${sanitizedContext.calories} kcal/day
  * Hydration Target: ${sanitizedContext.water} ml/day
  * Dietary Preference: ${sanitizedContext.diet}
  * Activity Level: ${sanitizedContext.activity}
  * Workout Experience: ${sanitizedContext.experience}
- Present estimated calories or workout burns as approximations, not absolute medical facts.
- Use markdown formatting with clear bullet points. Keep answers actionable, engaging, and under 300 words.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemInstruction}\n\nUser Question: ${userQuery}` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600
          }
        })
      }
    );

    if (!response.ok) {
      console.warn(`Gemini API returned status ${response.status}. Falling back to deterministic engine.`);
      return generateDeterministicResponse(userQuery, sanitizedContext);
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!candidateText) {
      return generateDeterministicResponse(userQuery, sanitizedContext);
    }

    return {
      reply: candidateText,
      isAIGenerated: true,
      mode: 'gemini-2.5-flash',
      statusMessage: 'Live response generated via Google Gemini 2.5 Flash.'
    };
  } catch (error) {
    console.error('Gemini API call failed, falling back:', error.message);
    return generateDeterministicResponse(userQuery, sanitizedContext);
  }
}

module.exports = {
  askAILifestyleAssistant,
  generateDeterministicResponse
};
