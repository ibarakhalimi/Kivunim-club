import { redirect } from "next/navigation";

export default function AdminIdeasPage() {
  redirect("/admin/inquiries?tab=ideas");
}
