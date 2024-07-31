import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL
const supabaseKey = PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Function to insert a question
export async function insertQuestion(classId, question , specialization) {
  const { data, error } = await supabase
    .from('questions')
    .insert([
      { class_id: classId, specialization: specialization , question: question }
    ])
  if (error) console.error('Error inserting question:', error)
  else console.log('Inserted question:', data)
}

// Function to fetch all classes
export async function fetchClasses() {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select('*');

    if (error) {
      console.error('Error fetching classes:', error);
      return { data: [], error }; // Ensure a consistent return type
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in fetchClasses function:', error);
    return { data: [], error }; // Ensure a consistent return type
  }
}