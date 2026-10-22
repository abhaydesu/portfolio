import { Home } from "@/components/v2/home";
import { bangaloreWeather } from "@/components/v2/weather";
import { unitedNow } from "@/components/v2/football";

export default async function Page() {
  const [weather, football] = await Promise.all([
    bangaloreWeather(),
    unitedNow(),
  ]);
  return <Home football={football} weather={weather} />;
}
