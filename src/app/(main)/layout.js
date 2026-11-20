import { cookies } from "next/headers";
import "react-quill-new/dist/quill.snow.css";
import { fetchAppliedData } from "@/actions/addPositionActions";
import { fetchTemplates } from "@/actions/templateListingActions";
import AppShell from "@/components/AppShell/AppShell";
import { getAuthToken } from "@/utils/CookieData";
import { decodeJWT } from "@/utils/jwt";

export const metadata = {
  title: "RecruitLoop",
  description: "Automate your recruiter outreach with smart templates",
};

export default async function MainLayout({ children }) {
  const cookieStore = await cookies();
  const role = cookieStore.get("role")?.value || null;
  const token = await getAuthToken();
  const decoded = token ? decodeJWT(token) : null;

  // Sidebar badge counts (candidate only)
  let counts = {};
  if (token && role !== "recruiter") {
    const [templates, applied] = await Promise.all([
      fetchTemplates("position/getUserPositions"),
      fetchAppliedData("apply/get-position-applied"),
    ]);
    counts = {
      templates: Array.isArray(templates?.data) ? templates.data.length : undefined,
      recent: Array.isArray(applied?.data) ? applied.data.length : undefined,
    };
  }

  return (
    <AppShell
      role={role}
      user={{ name: decoded?.name || "", email: decoded?.email || "" }}
      counts={counts}
    >
      {children}
    </AppShell>
  );
}
