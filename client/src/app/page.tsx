import { createClient } from "@/utils/supabase/server";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { AlternativeGameInterface } from "@/components/AlternativeGameInterface";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <WelcomeScreen />;
  }

  return (
    <AlternativeGameInterface />
  );
}
