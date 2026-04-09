import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') ?? '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? '';
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, user_location, user_preferences } = await req.json() as {
      messages: Array<{ role: string; content: string }>;
      user_location?: { lat: number; lng: number };
      user_preferences?: { currency: string; language: string };
    };

    // Extract keywords from last message
    const lastMessage = messages[messages.length - 1]?.content ?? '';
    const keywords = lastMessage.toLowerCase().split(/\s+/).filter((w: string) => w.length > 3);

    // Query places from Supabase
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    let placesContext = '';

    if (keywords.length > 0) {
      const searchTerms = keywords.slice(0, 3).join(' | ');
      const { data: places } = await supabase
        .from('places')
        .select('id, name, category, city, country, rating, price_level, description')
        .or(`name.ilike.%${keywords[0]}%,city.ilike.%${keywords[0]}%,description.ilike.%${keywords[0]}%`)
        .limit(5);

      if (places && places.length > 0) {
        placesContext = places.map((p: {
          name: string; category: string; city: string; country: string;
          rating: number; price_level: number; description: string;
        }) =>
          `- ${p.name} (${p.category}, ${p.city}, ${p.country}) — Note: ${p.rating}/5 — ${['€','€€','€€€','€€€€'][p.price_level-1]}`
        ).join('\n');
      }
    }

    const systemPrompt = `Tu es LeaderLife Guide, l'assistant voyage intégré à l'application LeaderLife. Tu es un guide passionné qui connaît les meilleurs spots du monde entier.

Règles strictes :
- Réponds TOUJOURS dans la langue de l'utilisateur (français par défaut)
- Sois chaleureux et enthousiaste mais CONCIS (200 mots max)
- Utilise 1-2 emojis max par message
- Quand tu recommandes un lieu, donne : Nom → pourquoi c'est top → fourchette de prix → un conseil pratique
- Donne des prix réalistes en monnaie locale du pays concerné
- Pour les questions sur une ville : parle sécurité + meilleure période + budget moyen
- Tu n'es pas une IA, tu es "le guide LeaderLife"
- Si des lieux de la base LeaderLife sont fournis dans le contexte, recommande-les en priorité

${user_preferences ? `Préférences utilisateur : devise ${user_preferences.currency}, langue ${user_preferences.language}` : ''}
${user_location ? `Position utilisateur : ${user_location.lat.toFixed(2)}, ${user_location.lng.toFixed(2)}` : ''}

LIEUX DISPONIBLES DANS L'APP LEADERLIFE :
${placesContext || 'Aucun lieu trouvé pour cette requête'}`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: systemPrompt,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json() as {
      content: Array<{ type: string; text: string }>;
    };
    const reply = data.content[0]?.text ?? "Je n'ai pas pu répondre. Réessayez !";

    return new Response(
      JSON.stringify({ reply, suggested_places: [] }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return new Response(
      JSON.stringify({ reply: `Oups, je n'ai pas pu répondre. Réessayez ! (${message})` }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
