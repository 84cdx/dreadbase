"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToVault(
  mediaId: string,
  mediaType: string,
  rating: number,
  title: string,
  posterPath: string
) {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return { error: "Zugriff verweigert: Sie müssen eingeloggt sein." };
  }

  const { error } = await supabase.from("vault").upsert({
    user_id: userData.user.id,
    media_id: mediaId,
    media_type: mediaType,
    rating: rating > 0 ? rating : null,
    title,
    poster_path: posterPath,
  }, { 
    onConflict: 'user_id,media_id,media_type' 
  });

  if (error) {
    console.error("Error adding to vault:", error);
    return { error: "Fehler beim Hinzufügen zum Vault. Bitte versuchen Sie es später erneut." };
  }

  revalidatePath(`/${mediaType}/${mediaId}`);
  return { success: true };
}

export async function removeFromVault(mediaId: string, mediaType?: string) {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return { error: "Zugriff verweigert: Sie müssen eingeloggt sein." };
  }

  const { error } = await supabase
    .from("vault")
    .delete()
    .match({ user_id: userData.user.id, media_id: mediaId });

  if (error) {
    console.error("Error removing from vault:", error);
    return { error: "Fehler beim Entfernen aus dem Vault." };
  }

  if (mediaType) {
    revalidatePath(`/${mediaType}/${mediaId}`);
  }
  return { success: true };
}
