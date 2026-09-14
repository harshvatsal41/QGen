import AuthForm from "@/components/AuthForm";
import { login } from "@/app/actions";
import { getSessionUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Log in",
  description: "Log in to your lumiqgen dashboard.",
  robots: { index: false },
};

export default async function LoginPage() {
  if (await getSessionUserId()) redirect("/dashboard");
  return <AuthForm mode="login" action={login} />;
}
