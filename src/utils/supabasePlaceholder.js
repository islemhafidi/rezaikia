import { supabase } from './supabaseClient'

/**
 * Submits a vote to the Supabase database
 * @param {Object} voteData - The data containing name, national ID, and selected candidate info
 * @returns {Promise<{success: boolean, message: string, data?: any, error?: string}>}
 */
export async function submitVote(voteData) {
  console.log('Sending vote payload to database:', voteData);
  console.log('Supabase client initialized:', !!supabase);

  try {
    console.log('About to insert into votes table');
    const { data, error } = await supabase
      .from('votes')
      .insert([
        {
          voter_name: voteData.name,
          national_id: voteData.idNumber,
          list_number: voteData.listSelected || 102,
          candidate_number: voteData.candidateNumber || 2,
          candidate_name: 'Imad Rezayguia',
          voted_at: new Date().toISOString()
        }
      ])
      .select(); // Add select to get the inserted data back
      
    console.log('Supabase response - data:', data);
    console.log('Supabase response - error:', error);
      
    if (error) throw error;
    return { 
      success: true, 
      data,
      message: 'Vote recorded successfully.' 
    };
  } catch (error) {
    console.error('Error submitting vote to Supabase:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return { 
      success: false, 
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Fetches the total number of votes from Supabase
 * @returns {Promise<{success: boolean, count?: number, error?: string}>}
 */
export async function getTotalVotes() {
  try {
    const { count, error } = await supabase
      .from('votes')
      .select('*', { count: 'exact', head: true });
      
    if (error) throw error;
    return { success: true, count: count || 0 };
  } catch (error) {
    console.error('Error fetching total votes:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Simulates subscribing an email to campaign newsletter updates
 * @param {string} email - Subscriber email
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function subscribeNewsletter(email) {
  console.log('Registering email subscriber:', email);

  await new Promise((resolve) => setTimeout(resolve, 800));

  /* Real Supabase implementation:
  try {
    const { data, error } = await supabase
      .from('subscribers')
      .insert([{ email, subscribed_at: new Date().toISOString() }]);
      
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: error.message };
  }
  */

  return {
    success: true,
    message: 'Subscription logged in placeholder database.',
  };
}
