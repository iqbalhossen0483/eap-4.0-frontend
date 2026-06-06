import { redirect } from "next/navigation";

// Root index — send everyone to the dashboard. The (dashboard) layout
// guards auth and redirects unauthenticated users to /login.
export default function Home() {
  redirect("/dashboard");
}
