// GDPR delete-account endpoint. Verifies the caller's JWT, then uses the
// service role to delete the auth user. All owned rows (profile,
// inventory, favorites, chat, entitlements) cascade via ON DELETE CASCADE.
//
// Deployed with: supabase functions deploy delete-account
import { createClient } from 'jsr:@supabase/supabase-js@2';

import { corsHeaders, jsonResponse } from '../_shared/cors.ts';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed' }, 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return jsonResponse({ error: 'Missing authorization header' }, 401);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY');
  if (!supabaseUrl || !serviceKey || !anonKey) {
    return jsonResponse({ error: 'Server not configured' }, 500);
  }

  // Identify the caller from their JWT (anon client scoped to the token).
  const caller = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: userError,
  } = await caller.auth.getUser();
  if (userError || !user) {
    return jsonResponse({ error: 'Invalid session' }, 401);
  }

  // Delete as service role. FK cascades remove all owned data.
  const admin = createClient(supabaseUrl, serviceKey);
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return jsonResponse({ error: deleteError.message }, 500);
  }

  return jsonResponse({ success: true });
});
