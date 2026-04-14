'use server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export async function signInWithGoogle(next: string = '/') {
  const supabase = await createClient()

  const redirectTo = `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo },
  })

  if (error) {
    console.error('Login error:', error.message)
    return redirect('/?error=login_failed')
  }

  if (data.url) {
    redirect(data.url)
  }
}

export async function signInWithEmail(email: string, next: string = '/'): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()

  const emailRedirectTo = `${SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo },
  })

  if (error) {
    console.error('Magic link error:', error.message)
    return { error: error.message }
  }

  return { success: true }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
}
