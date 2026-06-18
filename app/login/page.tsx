import { redirect } from "next/navigation";

type LoginRedirectPageProps = {
  searchParams?: Promise<{ next?: string }>;
};

export default async function LoginRedirectPage({ searchParams }: LoginRedirectPageProps) {
  const params = await searchParams;
  const nextPath = params?.next;
  const welcomeHref = nextPath ? `/welcome?next=${encodeURIComponent(nextPath)}` : "/welcome";

  redirect(welcomeHref);
}
