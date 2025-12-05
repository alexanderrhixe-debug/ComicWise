import { sql } from "drizzle-orm";
import { BookMarked, BookOpen, Eye, Users } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db/client";
import { bookmark, chapter, comic, user } from "@/db/schema";

export default async function AdminDashboard() {
  const [usersCount, comicsCount, chaptersCount, , totalViews] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(user)
      .then((r) => r[0]?.count || 0),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(comic)
      .then((r) => r[0]?.count || 0),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(chapter)
      .then((r) => r[0]?.count || 0),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(bookmark)
      .then((r) => r[0]?.count || 0),
    db
      .select({ total: sql<number>`sum(views)::int` })
      .from(comic)
      .then((r) => r[0]?.total || 0),
  ]);

  const stats = [
    {
      title: "Total Users",
      value: usersCount,
      description: "Registered users",
      icon: Users,
    },
    {
      title: "Total Comics",
      value: comicsCount,
      description: "Comics in database",
      icon: BookOpen,
    },
    {
      title: "Total Chapters",
      value: chaptersCount,
      description: "Chapters available",
      icon: BookMarked,
    },
    {
      title: "Total Views",
      value: totalViews.toLocaleString(),
      description: "Comic views",
      icon: Eye,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your ComicWise platform</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
