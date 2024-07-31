import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public';

const supabaseUrl = PUBLIC_SUPABASE_URL
const supabaseKey = PUBLIC_SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)



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

// Function to fetch all classes
export async function fetchQuestions(classId) {
  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('class_id', classId)

    if (error) {
      console.error('Error fetching questions:', error);
      return { data: [], error }; // Ensure a consistent return type
    }

    return { data, error: null };
  } catch (error) {
    console.error('Error in fetchQuestions function:', error);
    return { data: [], error }; // Ensure a consistent return type
  }
}