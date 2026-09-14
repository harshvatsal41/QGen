import AuthForm from "@/components/AuthForm";
import { signup } from "@/app/actions";
import { getSessionUserId } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Create your account",
  description: "Sign up for lumiqgen — 3 free dynamic QR codes with editable destinations and scan analytics.",
  robots: { index: false },
};

export default async function SignupPage() {
  if (await getSessionUserId()) redirect("/dashboard");
  return <AuthForm mode="signup" action={signup} />;
}
