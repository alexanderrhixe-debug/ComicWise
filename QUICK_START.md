# Quick Start: Using New Components

## 🚀 Keyboard Shortcuts

- **`Cmd+K` / `Ctrl+K`** - Open command palette (quick navigation)
- Use the theme toggle in sidebar header for dark/light mode

---

## 📋 Common Integration Patterns

### 1. Replace a Simple Table

**Before:**

```tsx
<table>{/* simple table */}</table>
```

**After:**

```tsx
import {
  EnhancedDataTable,
  createSelectionColumn,
} from "@/components/admin/EnhancedDataTable";

const columns = [
  createSelectionColumn(), // Add row selection
  { accessorKey: "title", header: "Title" },
  { accessorKey: "author", header: "Author" },
  // ... more columns
];

<EnhancedDataTable
  columns={columns}
  data={items}
  searchPlaceholder="Search..."
  onBulkDelete={handleBulkDelete}
  enableRowSelection
  exportFilename="items"
/>;
```

---

### 2. Add Loading State

**Create:** `src/app/admin/[entity]/loading.tsx`

```tsx
import { TableSkeleton } from "@/components/admin/LoadingStates";

export default function Loading() {
  return <TableSkeleton columns={6} rows={10} />;
}
```

---

### 3. Replace Textarea with Rich Text

**Before:**

```tsx
<Textarea
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
```

**After:**

```tsx
import { RichTextEditor } from "@/components/admin/RichTextEditor";

<RichTextEditor
  value={description}
  onChange={setDescription}
  disabled={isPending}
/>;
```

---

### 4. Add Empty State to List

**Add to list page:**

```tsx
import { EmptyState } from "@/components/admin/EmptyState";
import { BookOpen } from "lucide-react";

// After data loading
{
  items.length === 0 && (
    <EmptyState
      icon={BookOpen}
      title="No items yet"
      description="Get started by creating your first item."
      actionLabel="Create Item"
      actionHref="/admin/items/new"
    />
  );
}
```

---

### 5. Replace window.confirm()

**Before:**

```tsx
async function handleDelete() {
  if (confirm("Are you sure?")) {
    await deleteItem(id);
  }
}
```

**After:**

```tsx
import { useConfirmDialog } from "@/components/admin/ConfirmDialog";

function MyComponent() {
  const { confirm, ConfirmDialog } = useConfirmDialog();

  async function handleDelete() {
    confirm({
      title: "Delete Item?",
      description: "This action cannot be undone.",
      variant: "destructive",
      onConfirm: async () => {
        await deleteItem(id);
      },
    });
  }

  return (
    <>
      <Button onClick={handleDelete}>Delete</Button>
      <ConfirmDialog />
    </>
  );
}
```

---

### 6. Add Charts to Dashboard

**In dashboard page:**

```tsx
import {
  UserGrowthChart,
  TopComicsChart,
  GenreDistributionChart,
} from "@/components/admin/DashboardCharts";

// Fetch your data
const userGrowth = [
  { month: "Jan", users: 150 },
  { month: "Feb", users: 200 },
  // ...
];

const topComics = [
  { title: "Comic A", views: 15000 },
  { title: "Comic B", views: 12000 },
  // ...
];

// Render
<div className="grid gap-4 md:grid-cols-2">
  <UserGrowthChart data={userGrowth} />
  <TopComicsChart data={topComics} />
</div>;
```

---

## 🎯 Priority Integration Order

1. **Command Palette** ✅ Already integrated
2. **Breadcrumbs** ✅ Already integrated
3. **Theme Toggle** ✅ Already integrated
4. **Loading States** - Add loading.tsx files
5. **Empty States** - Add to list pages
6. **Enhanced DataTable** - Replace existing tables
7. **Confirmation Dialogs** - Replace window.confirm()
8. **Rich Text Editor** - For descriptions
9. **Charts** - Add to dashboard

---

## 📦 Import Cheat Sheet

```tsx
// Command Palette (already in layout)
import { CommandMenu } from "@/components/admin/CommandMenu";

// Data Tables
import {
  EnhancedDataTable,
  createSelectionColumn,
} from "@/components/admin/EnhancedDataTable";

// Loading States
import {
  TableSkeleton,
  FormSkeleton,
  DashboardSkeleton,
  StatCardSkeleton,
  CardGridSkeleton,
} from "@/components/admin/LoadingStates";

// Rich Text
import { RichTextEditor } from "@/components/admin/RichTextEditor";

// Charts
import {
  UserGrowthChart,
  TopComicsChart,
  GenreDistributionChart,
  ChapterPublishingChart,
} from "@/components/admin/DashboardCharts";

// Dialogs
import {
  useConfirmDialog,
  ConfirmDialog,
} from "@/components/admin/ConfirmDialog";

// Empty States
import { EmptyState } from "@/components/admin/EmptyState";

// Navigation (already in layout)
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

// Theme (already in sidebar)
import { ThemeToggle } from "@/components/admin/ThemeToggle";
```

---

## 🔥 Pro Tips

1. **Command Palette** - Add custom actions to the CommandMenu by editing the
   `items` array
2. **DataTable** - Customize columns with TanStack Table's column definition
   format
3. **Loading States** - Match skeleton columns/rows to your actual table
   structure
4. **Rich Text** - The editor returns HTML, store it directly in your database
5. **Charts** - Use your actual data structure, components are flexible
6. **Empty States** - Always provide an action button to guide users
7. **Theme** - All components automatically adapt to dark/light mode

---

## ⚡ Quick Wins

These take 5 minutes each and provide immediate value:

1. Add `loading.tsx` to list pages → Better perceived performance
2. Add `EmptyState` to empty lists → Better UX
3. Replace `window.confirm()` with `useConfirmDialog` → Better accessibility
4. Add theme toggle → User preference support

---

## 📚 Full Documentation

See `COMPONENTS_GUIDE.md` for:

- Detailed component documentation
- All props and options
- Advanced usage examples
- Integration patterns

---

## ✅ Checklist

After integrating components, verify:

- [ ] Command palette opens with Cmd+K
- [ ] Theme toggle works (light/dark/system)
- [ ] Breadcrumbs show correct path
- [ ] Loading states appear during data fetch
- [ ] Empty states show when lists are empty
- [ ] DataTable filters, sorts, and exports work
- [ ] Confirmation dialogs replace browser confirm
- [ ] Rich text editor saves HTML properly
- [ ] Charts display data correctly
- [ ] All components respect dark mode

---

**Need help?** Check `COMPONENTS_GUIDE.md` for detailed examples!
