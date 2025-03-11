import { createClient } from "@/utils/supabase/server";
import { GameInterface } from "@/components/GameInterface";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { AlternativeGameInterface } from "@/components/alt/AlternativeGameInterface";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <WelcomeScreen />;
  }

  return (
    // <GameInterface />
    <AlternativeGameInterface />
  );
}
