# TripFlow shadcn/ui Components

> Component documentation for TripFlow's shadcn/ui integration

## Table of Contents

- [Custom Components](#custom-components)
  - [CityCard](#citycard)
  - [BudgetProgressCard](#budgetprogresscard)
  - [CityTabs](#citytabs)
- [shadcn Components](#shadcn-components)
  - [Button Variants](#button-variants)
  - [Form Components](#form-components)
  - [Navigation Components](#navigation-components)

---

## Custom Components

### CityCard

City-themed card with automatic color styling based on TripFlow's city system.

**Usage:**
```tsx
import { CityCard } from '@/components/tripflow'

<CityCard
  city="shanghai"
  title="Shanghai Budget"
  description="3 nights, Aug 27-30"
>
  <BudgetContent />
</CityCard>
```

**Props:**
- `city`: CitySlug - Required. One of: shanghai, hongkong, osaka, kyoto, tokyo, beijing
- `title`: string - Optional card title
- `description`: string - Optional card description
- `showIcon`: boolean - Show city icon (default: true)
- `footer`: ReactNode - Optional footer content
- `className`: string - Additional CSS classes

**Features:**
- Automatic color theming based on city
- Responsive grid layout (12-column adaptive)
- Dark mode support
- City icon with color accent
- shadcn Card component foundation

---

### BudgetProgressCard

Displays budget progress with visual health indicators.

**Usage:**
```tsx
import { BudgetProgressCard } from '@/components/tripflow'

<BudgetProgressCard
  city="tokyo"
  totalBudget={5000}
  spent={3200}
  currencyCode="USD"
/>
```

**Props:**
- `city`: CitySlug - Required
- `totalBudget`: number - Total budget in cents
- `spent`: number - Amount spent in cents
- `currencyCode`: string - Currency code (default: "USD")

**Features:**
- Automatic percentage calculation
- Color-coded progress bar:
  - Green (< 80%): Healthy
  - Yellow (80-100%): Warning
  - Red (> 100%): Over budget
- Alert warnings at 80% and 100%
- Remaining/over budget display
- Responsive design

---

### CityTabs

Navigation tabs with city color indicators.

**Usage:**
```tsx
import { CityTabs } from '@/components/Itinerary/CityTabs'

<CityTabs
  cities={['shanghai', 'hongkong', 'tokyo']}
  defaultCity="shanghai"
  onCityChange={(city) => console.log('Selected:', city)}
>
  {(city) => <CityContent city={city} />}
</CityTabs>
```

**Props:**
- `cities`: CitySlug[] - Array of cities to display
- `defaultCity`: CitySlug - Optional. Default selected city
- `onCityChange`: (city: CitySlug) => void - Optional. Called when selection changes
- `children`: (city: CitySlug) => ReactNode - Render function for tab content
- `className`: string - Optional additional classes

**Features:**
- Color-coded city indicators
- Animated color dot on active tab
- City icons
- Responsive: Shows abbreviated names on mobile
- Keyboard navigation
- Render prop pattern for flexible content

---

## shadcn Components

### Button Variants

TripFlow extends shadcn Button with city-themed variants.

**Standard Variants:**
```tsx
<Button variant="default">Default</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

**City Variants:**
```tsx
<Button variant="shanghai">Shanghai</Button>
<Button variant="hongkong">Hong Kong</Button>
<Button variant="osaka">Osaka</Button>
<Button variant="kyoto">Kyoto</Button>
<Button variant="tokyo">Tokyo</Button>
<Button variant="beijing">Beijing</Button>
```

**Sizes:**
```tsx
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

**Combined:**
```tsx
<Button variant="shanghai" size="lg">
  Book Shanghai Hotel
</Button>
```

---

### Form Components

TripFlow uses shadcn Form with react-hook-form and Zod validation.

**Example: AddActivityModal**

```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { activitySchema } from '@/lib/schemas/activity-schema'

const form = useForm({
  resolver: zodResolver(activitySchema),
  defaultValues: {
    title: '',
    category: 'sightseeing',
  },
})

<Form {...form}>
  <form onSubmit={form.handleSubmit(onSubmit)}>
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Activity Title</FormLabel>
          <FormControl>
            <Input placeholder="e.g., Visit The Bund" {...field} />
          </FormControl>
          <FormDescription>
            Enter the name of your activity
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
    <Button type="submit">Add Activity</Button>
  </form>
</Form>
```

**Benefits:**
- Type-safe forms with Zod
- Automatic validation and error messages
- Accessible form controls
- FormDescription auto-generates aria-describedby
- Consistent styling across the app

---

### Navigation Components

**Sheet (Slide-over Panel):**

Used in SettingsModal:

```tsx
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

<Sheet open={isOpen} onOpenChange={setIsOpen}>
  <SheetContent side="right" className="w-full sm:max-w-[540px]">
    <SheetHeader>
      <SheetTitle>Global Settings</SheetTitle>
      <SheetDescription>
        Manage your preferences
      </SheetDescription>
    </SheetHeader>
    <div className="mt-6">
      {/* Settings content */}
    </div>
  </SheetContent>
</Sheet>
```

**Tabs:**

Used in CityTabs wrapper:

```tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

<Tabs defaultValue="shanghai">
  <TabsList>
    <TabsTrigger value="shanghai">Shanghai</TabsTrigger>
    <TabsTrigger value="tokyo">Tokyo</TabsTrigger>
  </TabsList>
  <TabsContent value="shanghai">
    Shanghai content
  </TabsContent>
  <TabsContent value="tokyo">
    Tokyo content
  </TabsContent>
</Tabs>
```

---

## Best Practices

### 1. Always Use shadcn First

Before creating a custom component, check if shadcn has an equivalent:

✅ **Do:**
```tsx
import { Button } from '@/components/ui/button'
<Button>Click me</Button>
```

❌ **Don't:**
```tsx
<button className="custom-button">Click me</button>
```

### 2. Compose, Don't Recreate

Use shadcn primitives as building blocks:

✅ **Do:**
```tsx
<Dialog>
  <DialogContent>
    <Form>...</Form>
  </DialogContent>
</Dialog>
```

❌ **Don't:**
```tsx
<div className="modal-overlay">
  <div className="modal-content">...</div>
</div>
```

### 3. Use Variants Over className

✅ **Do:**
```tsx
<Button variant="destructive" size="sm">Delete</Button>
```

⚠️ **Acceptable for one-offs:**
```tsx
<Button className="bg-[hsl(var(--chart-shanghai))]">Custom</Button>
```

❌ **Don't:**
```tsx
<Button className="!bg-red-500 !p-10">Override Everything</Button>
```

### 4. Leverage TypeScript

All components are fully typed:

```tsx
import type { CitySlug } from '@/lib/city-colors'
import type { ActivityFormData } from '@/lib/schemas/activity-schema'

// TypeScript will enforce valid city values
const city: CitySlug = 'shanghai' // ✅
const invalid: CitySlug = 'paris' // ❌ Type error
```

---

## Migration Guide

### Migrating from ButtonLegacy

**Before:**
```tsx
import { ButtonLegacy } from '@/components/ui/ButtonLegacy'
<ButtonLegacy variant="primary" fullWidth>Submit</ButtonLegacy>
```

**After:**
```tsx
import { Button } from '@/components/ui/button'
<Button variant="default" className="w-full">Submit</Button>
```

**Changes:**
- `variant="primary"` → `variant="default"`
- `fullWidth` → `className="w-full"`
- Import path: `@/components/ui/button` (lowercase)

---

## Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TripFlow Style Guide](../TRIPFLOW-STYLE-GUIDE.md)
- [Accessibility Guide](../accessibility/README.md)
- [Migration Summary](../migrations/shadcn-ui-migration-summary.md)
