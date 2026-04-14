'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation'; // Ajoute cet import

export async function createActivity(formData: FormData) {
  const sport = formData.get('sport') as string;
  const location = formData.get('location') as string;
  const distance = parseFloat(formData.get('distance') as string);
  const elevation = parseInt(formData.get('elevation') as string);
  const description = formData.get('description') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;

  const start_date = new Date(`${date}T${time}`).toISOString();

  const { error } = await supabase.from('activities').insert([
    {
      sport,
      location,
      distance,
      elevation,
      description,
      start_date,
      organizer_id: 'user_temp_123',
    },
  ]);

  if (error) {
    console.error('Erreur insertion:', error);
    return { message: 'Erreur lors de la création' };
  }

  // Plutôt que juste revalider, on redirige vers l'accueil.
  // Cela force Next.js à recharger les données proprement.
  revalidatePath('/');
  redirect('/');
}

import { signIn, signOut } from '@/auth';

export async function handleSignIn() {
  await signIn('strava');
}

export async function handleSignOut() {
  await signOut();
}
