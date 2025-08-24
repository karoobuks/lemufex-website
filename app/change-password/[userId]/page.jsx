import ResetPassword from "@/components/ResetPassword";

export default async function PasswordResetPage({ params }) {
  const { userId } =  params;
  return <ResetPassword userId={params.userId} />;
}