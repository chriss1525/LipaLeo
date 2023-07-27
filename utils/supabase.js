const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_PUBLIC_ANON_KEY,
  process.env.SUPABASE_URL
);

module.exports = supabase;
