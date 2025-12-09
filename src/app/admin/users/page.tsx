import { DataTable } from "components/admin/DataTable";
import { database, user } from "src/database";

export default async function AdminUsersPage() {
  const users = await database.select().from(user);

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
        <p className="text-muted-foreground">Manage all users in the platform</p>
      </div>

      <DataTable columns={columns} data={users} />
    </div>
  );
}
