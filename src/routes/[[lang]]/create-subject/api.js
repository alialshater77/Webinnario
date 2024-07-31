import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL
const supabaseKey = PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Function to insert a class
export async function insertClass(name, code , specialization) {
  const { data, error } = await supabase
    .from('classes')
    .insert([
      { name: name, code: code , specialization : specialization }
    ])
  if (error) console.error('Error inserting class:', error)
  else console.log('Inserted class:', data)
}