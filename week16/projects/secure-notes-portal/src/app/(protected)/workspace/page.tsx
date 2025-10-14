import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import WorkspaceClient from "@/components/WorkspaceClient";

export default async function WorkspacePage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  return <WorkspaceClient user={session.user} />;
}
