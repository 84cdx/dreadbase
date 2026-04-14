"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function addToWatchlist(
  mediaId: string,
  mediaType: string,
  title: string,
  posterPath: string
) {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return { error: "Zugriff verweigert: Sie müssen eingeloggt sein." };
  }

  const { error } = await supabase.from("watchlist").upsert({
    user_id: userData.user.id,
    media_id: mediaId,
    media_type: mediaType,
    title,
    poster_path: posterPath,
  }, { 
    onConflict: 'user_id,media_id,media_type' 
  });

  if (error) {
    console.error("Error adding to watchlist:", error);
    return { error: "Fehler beim Hinzufügen zur Liste." };
  }

  revalidatePath(`/${mediaType}/${mediaId}`);
  revalidatePath("/mylist");
  return { success: true };
}

export async function removeFromWatchlist(mediaId: string, mediaType?: string) {
  const supabase = await createClient();
  const { data: userData, error: authError } = await supabase.auth.getUser();

  if (authError || !userData?.user) {
    return { error: "Zugriff verweigert: Sie müssen eingeloggt sein." };
  }

  const { error } = await supabase
    .from("watchlist")
    .delete()
    .match({ user_id: userData.user.id, media_id: mediaId });

  if (error) {
    console.error("Error removing from watchlist:", error);
    return { error: "Fehler beim Entfernen aus der Liste." };
  }

  if (mediaType) {
    revalidatePath(`/${mediaType}/${mediaId}`);
  }
  revalidatePath("/mylist");
  return { success: true };
}
