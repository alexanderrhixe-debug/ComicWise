# Component Enhancements Documentation

This document describes the new enhanced components added to the ComicWise admin
panel.

## 🎯 Command Palette

**File:** `src/components/admin/CommandMenu.tsx`

A global search and navigation tool accessible via `Cmd+K` (Mac) or `Ctrl+K`
(Windows).

### Features:

- Quick navigation to all admin pages
- Fast access to create actions
- Keyboard-first interface
- Fuzzy search

### Usage:

```tsx
// Already integrated in admin layout
<CommandMenu />
```

Press `Cmd+K` or `Ctrl+K` anywhere in the admin panel to open.

---

## 📊 Enhanced DataTable

**File:** `src/components/admin/EnhancedDataTable.tsx`

An advanced data table with filtering, sorting, bulk operations, and CSV export.

### Features:

- Column visibility toggle
- Search/filter functionality
- Bulk row selection
- Bulk delete operations
- CSV export
- Sorting

### Usage:

```tsx
import {
  EnhancedDataTable,
  createSelectionColumn,
} from "@/components/admin/EnhancedDataTable";

const columns = [
  createSelectionColumn(),
  // ... your columns
];

<EnhancedDataTable
  columns={columns}
  data={data}
  searchPlaceholder="Search comics..."
  onBulkDelete={handleBulkDelete}
  enableRowSelection={true}
  exportFilename="comics"
/>;
```

### Props:

- `columns`: Column definitions (TanStack Table format)
- `data`: Array of data to display
- `searchPlaceholder`: Placeholder text for search input
- `onBulkDelete`: Async function for bulk delete operations
- `enableRowSelection`: Enable checkbox selection
- `exportFilename`: Base name for exported CSV files

---

## ⏳ Loading States

**File:** `src/components/admin/LoadingStates.tsx`

Skeleton loaders for better perceived performance.

### Components:

- `TableSkeleton`: For data tables
- `FormSkeleton`: For forms
- `StatCardSkeleton`: For dashboard stat cards
- `DashboardSkeleton`: Complete dashboard skeleton
- `CardGridSkeleton`: For grid layouts (comics, etc.)

### Usage:

```tsx
import { TableSkeleton } from "@/components/admin/LoadingStates";

// In loading.tsx or Suspense fallback
export default function Loading() {
  return <TableSkeleton columns={5} rows={10} />;
}
```

---

## ✍️ Rich Text Editor

**File:** `src/components/admin/RichTextEditor.tsx`

A WYSIWYG editor using TipTap for rich content editing.

### Features:

- Bold, Italic, Code formatting
- Headings (H2, H3)
- Bullet and numbered lists
- Blockquotes
- Undo/Redo
- Disabled state support

### Usage:

```tsx
import { RichTextEditor } from "@/components/admin/RichTextEditor";

const [description, setDescription] = useState("");

<RichTextEditor
  value={description}
  onChange={setDescription}
  placeholder="Enter comic description..."
  disabled={isPending}
/>;
```

### Props:

- `value`: HTML content string
- `onChange`: Callback when content changes
- `placeholder`: Placeholder text
- `className`: Additional CSS classes
- `disabled`: Disable editing

---

## 📈 Dashboard Charts

**File:** `src/components/admin/DashboardCharts.tsx`

Data visualization components using Recharts.

### Components:

#### UserGrowthChart

Line chart showing user growth over time.

```tsx
<UserGrowthChart
  data={[
    { month: "Jan", users: 150 },
    { month: "Feb", users: 200 },
    // ...
  ]}
/>
```

#### TopComicsChart

Bar chart showing most viewed comics.

```tsx
<TopComicsChart
  data={[
    { title: "Comic A", views: 15000 },
    { title: "Comic B", views: 12000 },
    // ...
  ]}
/>
```

#### GenreDistributionChart

Pie chart showing comic distribution by genre.

```tsx
<GenreDistributionChart
  data={[
    { name: "Action", value: 45 },
    { name: "Romance", value: 30 },
    // ...
  ]}
/>
```

#### ChapterPublishingChart

Bar chart showing chapter publishing activity.

```tsx
<ChapterPublishingChart
  data={[
    { date: "2024-01", chapters: 25 },
    { date: "2024-02", chapters: 30 },
    // ...
  ]}
/>
```

---

## ⚠️ Confirmation Dialog

**File:** `src/components/admin/ConfirmDialog.tsx`

Accessible confirmation dialogs to replace `window.confirm()`.

### Using the Hook:

```tsx
import { useConfirmDialog } from "@/components/admin/ConfirmDialog";

function MyComponent() {
  const { confirm, ConfirmDialog } = useConfirmDialog();

  async function handleDelete() {
    confirm({
      title: "Delete Comic?",
      description:
        "This action cannot be undone. All chapters will also be deleted.",
      confirmText: "Delete",
      variant: "destructive",
      onConfirm: async () => {
        await deleteComic(id);
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

### Direct Component:

```tsx
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

<ConfirmDialog
  open={isOpen}
  onOpenChange={setIsOpen}
  title="Are you sure?"
  description="This action cannot be undone."
  confirmText="Continue"
  cancelText="Cancel"
  variant="destructive"
  onConfirm={handleAction}
/>;
```

---

## 📭 Empty State

**File:** `src/components/admin/EmptyState.tsx`

Display friendly empty states for lists with no data.

### Usage:

```tsx
import { EmptyState } from "@/components/admin/EmptyState";
import { BookOpen } from "lucide-react";

{
  comics.length === 0 && (
    <EmptyState
      icon={BookOpen}
      title="No comics yet"
      description="Get started by creating your first comic. Comics can have multiple chapters and will be displayed on your homepage."
      actionLabel="Create Comic"
      actionHref="/admin/comics/new"
    />
  );
}
```

### Props:

- `icon`: Lucide icon component
- `title`: Main heading
- `description`: Explanation text
- `actionLabel`: Button text (optional)
- `actionHref`: Link for button (optional)
- `onAction`: Click handler for button (optional)

---

## 🧭 Breadcrumbs

**File:** `src/components/admin/Breadcrumbs.tsx`

Automatic breadcrumb navigation based on URL path.

### Usage:

```tsx
import { Breadcrumbs } from "@/components/admin/Breadcrumbs";

// Already integrated in admin layout
<Breadcrumbs />;
```

Automatically generates breadcrumbs from the current path:

- `/admin` → Home
- `/admin/comics` → Home / Comics
- `/admin/comics/123` → Home / Comics / 123

---

## 🌓 Theme Toggle

**File:** `src/components/admin/ThemeToggle.tsx`

Dark mode toggle with system preference support.

### Usage:

```tsx
import { ThemeToggle } from "@/components/admin/ThemeToggle";

// Already integrated in sidebar
<ThemeToggle />;
```

### Features:

- Light mode
- Dark mode
- System preference
- Smooth transitions
- Accessible dropdown

---

## 🎨 Integration Examples

### Example 1: Enhanced Comics List Page

```tsx
"use client";

import {
  EnhancedDataTable,
  createSelectionColumn,
} from "@/components/admin/EnhancedDataTable";
import { EmptyState } from "@/components/admin/EmptyState";
import { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import { BookOpen } from "lucide-react";

export default function ComicsPage() {
  const { comics, isLoading } = useComics();
  const { confirm, ConfirmDialog } = useConfirmDialog();

  const columns = [
    createSelectionColumn(),
    {
      accessorKey: "title",
      header: "Title",
    },
    // ... more columns
  ];

  async function handleBulkDelete(ids: number[]) {
    await deleteComics(ids);
  }

  if (isLoading) return <TableSkeleton />;
  if (comics.length === 0) {
    return (
      <EmptyState
        icon={BookOpen}
        title="No comics yet"
        description="Create your first comic to get started."
        actionLabel="Create Comic"
        actionHref="/admin/comics/new"
      />
    );
  }

  return (
    <>
      <EnhancedDataTable
        columns={columns}
        data={comics}
        searchPlaceholder="Search comics..."
        onBulkDelete={handleBulkDelete}
        enableRowSelection
        exportFilename="comics"
      />
      <ConfirmDialog />
    </>
  );
}
```

### Example 2: Enhanced Form with Rich Text

```tsx
"use client";

import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { FormSkeleton } from "@/components/admin/LoadingStates";

export default function ComicForm() {
  const [description, setDescription] = useState("");
  const [isPending, startTransition] = useTransition();

  if (isLoading) return <FormSkeleton fields={6} />;

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <Label>Description</Label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="Enter comic description..."
          disabled={isPending}
        />
      </div>
      {/* More fields */}
    </form>
  );
}
```

### Example 3: Dashboard with Charts

```tsx
import {
  UserGrowthChart,
  TopComicsChart,
  GenreDistributionChart,
} from "@/components/admin/DashboardCharts";
import { DashboardSkeleton } from "@/components/admin/LoadingStates";

export default async function DashboardPage() {
  const [userGrowth, topComics, genreDistribution] = await Promise.all([
    getUserGrowthData(),
    getTopComicsData(),
    getGenreDistributionData(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <UserGrowthChart data={userGrowth} />
        <TopComicsChart data={topComics} />
      </div>
      <GenreDistributionChart data={genreDistribution} />
    </div>
  );
}
```

---

## 🚀 Quick Start Checklist

To use these components in your pages:

1. ✅ **Command Palette** - Already integrated in layout
2. ✅ **Breadcrumbs** - Already integrated in layout
3. ✅ **Theme Toggle** - Already integrated in sidebar
4. ⏳ **DataTables** - Replace existing tables with EnhancedDataTable
5. ⏳ **Loading States** - Add loading.tsx files with skeletons
6. ⏳ **Rich Text** - Replace textareas with RichTextEditor for descriptions
7. ⏳ **Charts** - Add to dashboard for data visualization
8. ⏳ **Confirmations** - Replace window.confirm() with useConfirmDialog
9. ⏳ **Empty States** - Add to list pages when data.length === 0

---

## 📦 Dependencies

All required packages are already installed:

- `@tanstack/react-table` - DataTable
- `recharts` - Charts
- `@tiptap/react` + `@tiptap/starter-kit` - Rich text editor
- `papaparse` - CSV export
- `cmdk` - Command palette
- `next-themes` - Theme management

---

## 🎨 Customization

All components use Tailwind CSS and respect your theme configuration. Chart
colors use the CSS variables defined in `globals.css`:

- `--chart-1` through `--chart-5`

Modify these in `src/styles/globals.css` to match your brand colors.
