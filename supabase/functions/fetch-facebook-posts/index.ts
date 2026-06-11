import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FbPost {
  id: string;
  message?: string;
  created_time: string;
  full_picture?: string;
  permalink_url?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
    .slice(0, 50) || 'post';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const pageId = Deno.env.get('FACEBOOK_PAGE_ID') || Deno.env.get('FACEBOOK_PAGE_USERNAME');
    const accessToken = Deno.env.get('FACEBOOK_ACCESS_TOKEN');

    if (!pageId || !accessToken) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Facebook not configured. Set FACEBOOK_PAGE_ID and FACEBOOK_ACCESS_TOKEN in Supabase secrets.',
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = `https://graph.facebook.com/v18.0/${pageId}/posts?fields=id,message,created_time,full_picture,permalink_url&limit=10&access_token=${accessToken}`;
    const res = await fetch(url);
    const json = await res.json();

    if (!res.ok) {
      console.error('Facebook API error:', json);
      return new Response(
        JSON.stringify({
          success: false,
          error: json.error?.message || 'Failed to fetch Facebook posts',
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const posts: FbPost[] = json.data || [];
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    let inserted = 0;
    for (const post of posts) {
      const message = post.message || '(No message)';
      const slug = `fb-${post.id}`;
      const excerpt = message.slice(0, 200) + (message.length > 200 ? '...' : '');

      const { error } = await supabase.from('articles').upsert(
        {
          slug,
          title: message.slice(0, 100),
          content: message,
          excerpt,
          source: 'facebook',
          source_url: post.permalink_url || null,
          image_url: post.full_picture || null,
          published_at: post.created_time,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      );

      if (!error) inserted++;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Synced ${inserted} post(s) from Facebook.`,
        total: posts.length,
        inserted,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('fetch-facebook-posts error:', err);
    return new Response(
      JSON.stringify({
        success: false,
        error: err instanceof Error ? err.message : 'Unknown error',
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
