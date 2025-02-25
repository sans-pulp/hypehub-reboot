import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { GameInterface } from "@/components/GameInterface";
import { WelcomeScreen } from "@/components/WelcomeScreen";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    <WelcomeScreen />
  }

  return (
    <GameInterface />
  );
}
