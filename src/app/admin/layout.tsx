import { auth } from "auth";
import { Breadcrumbs } from "components/admin/Breadcrumbs";
import { CommandMenu } from "components/admin/CommandMenu";
import { AppSidebar } from "components/AppSidebar";
import { SidebarInset, SidebarProvider } from "components/ui/sidebar";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/sign-in?callbackUrl=/admin");
  }

  if (session.user.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Breadcrumbs />
          {children}
        </div>
      </SidebarInset>
      <CommandMenu />
    </SidebarProvider>
  );
}
