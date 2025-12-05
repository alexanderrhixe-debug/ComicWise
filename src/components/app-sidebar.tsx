"use client";

import {
  LayoutDashboard,
  BookOpen,
  Users,
  FileText,
  Palette,
  UserCircle,
  FolderOpen,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
  },
  {
    title: "Comics",
    icon: BookOpen,
    href: "/admin/comics",
  },
  {
    title: "Chapters",
    icon: FileText,
    href: "/admin/chapters",
  },
  {
    title: "Users",
    icon: Users,
    href: "/admin/users",
  },
  {
    title: "Authors",
    icon: UserCircle,
    href: "/admin/authors",
  },
  {
    title: "Artists",
    icon: Palette,
    href: "/admin/artists",
  },
  {
    title: "Genres",
    icon: FolderOpen,
    href: "/admin/genres",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <BookOpen className="h-6 w-6" />
          <span className="text-lg font-bold">ComicWise Admin</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={pathname === item.href}>
                    <Link href={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-muted-foreground px-4 py-2 text-xs">ComicWise v1.0.0</div>
      </SidebarFooter>
    </Sidebar>
  );
}
