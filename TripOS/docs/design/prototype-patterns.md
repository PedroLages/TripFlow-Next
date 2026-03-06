# Prototype Patterns to Adopt

Patterns extracted from Google AI Studio prototype (Feb 13, 2026) that should be implemented in production TripOS.

## 1. Quorum Facepile (Voting)

**Pattern:** Show who has voted with visual feedback

```tsx
// Location: apps/web/src/features/voting/components/QuorumFacepile.tsx

interface QuorumFacepileProps {
  poll: Poll;
  members: User[];
}

export function QuorumFacepile({ poll, members }: QuorumFacepileProps) {
  return (
    <div className="flex flex-col items-end">
      <div className="flex -space-x-1.5 mb-1.5">
        {members.map(member => {
          const hasVoted = poll.votedUserIds.includes(member.id);
          return (
            <div
              key={member.id}
              className={cn(
                "relative transition-all duration-300",
                hasVoted ? "z-10" : "z-0 opacity-40 grayscale scale-90"
              )}
              title={hasVoted ? `${member.name} voted` : `${member.name} pending`}
            >
              <Avatar
                src={member.avatarUrl}
                alt={member.name}
                className="w-6 h-6 ring-2 ring-background"
              />
              {hasVoted && (
                <div className="absolute -bottom-1 -right-1 bg-success rounded-full p-0.5 border border-background">
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <p className="text-[10px] text-muted-foreground font-medium">
        {poll.votedUserIds.length}/{poll.requiredQuorum} to decide
      </p>
    </div>
  );
}
```

**Usage:** Epic 5 (Democratic Decision Making)

---

## 2. Urgency Calculator (Deadlines)

**Pattern:** Smart deadline formatting with urgency detection

```tsx
// Location: apps/web/src/lib/utils/deadline.ts

export function getTimeRemaining(deadline: string) {
  const total = Date.parse(deadline) - Date.now();
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  const mins = Math.floor((total / 1000 / 60) % 60);

  if (total <= 0) return { text: 'Closed', urgent: false };
  if (days > 0) return { text: `${days}d left`, urgent: false };
  if (hours > 2) return { text: `${hours}h left`, urgent: false };
  return { text: `${hours}h ${mins}m left`, urgent: true };
}
```

**Usage:** Polls (Epic 5), Tasks (Epic 9), Payment deadlines (Epic 7)

---

## 3. Role Badge System

**Pattern:** Visual role indicators with icons

```tsx
// Location: apps/web/src/features/trips/components/RoleBadge.tsx

import { Crown, Wallet, Navigation, Sparkles, Users } from 'lucide-react';

type MemberRole = 'OWNER' | 'ORGANIZER' | 'MEMBER' | 'GUEST';

const ROLE_CONFIG = {
  OWNER: {
    icon: Crown,
    variant: 'vote' as const, // Purple
    label: 'Owner'
  },
  ORGANIZER: {
    icon: Users,
    variant: 'default' as const,
    label: 'Organizer'
  },
  MEMBER: {
    icon: Users,
    variant: 'outline' as const,
    label: 'Member'
  },
  GUEST: {
    icon: Users,
    variant: 'outline' as const,
    label: 'Guest'
  },
} as const;

export function RoleBadge({ role }: { role: MemberRole }) {
  const config = ROLE_CONFIG[role];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="text-xs">
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}
```

**Usage:** Epic 3 (Team Building), Member lists

---

## 4. Category Color System

**Pattern:** Consistent category-based coloring

```tsx
// Location: apps/web/src/lib/utils/categories.ts

export type ExpenseCategory = 'FOOD' | 'TRANSPORT' | 'LODGING' | 'ACTIVITY' | 'OTHER';

export function getCategoryColor(category: ExpenseCategory) {
  const colors = {
    FOOD: 'bg-orange-500',
    TRANSPORT: 'bg-blue-500',
    LODGING: 'bg-purple-500',
    ACTIVITY: 'bg-green-500',
    OTHER: 'bg-gray-500',
  } as const;

  return colors[category];
}

export function getCategoryIcon(category: ExpenseCategory) {
  const icons = {
    FOOD: Utensils,
    TRANSPORT: Car,
    LODGING: Bed,
    ACTIVITY: Tag,
    OTHER: MoreHorizontal,
  } as const;

  return icons[category];
}
```

**Usage:** Epic 7 (Expenses), Epic 4 (Itinerary activities)

---

## 5. Floating Island Navigation

**Pattern:** Glassmorphism sticky header for mobile

```tsx
// Location: apps/web/src/components/navigation/FloatingNav.tsx

export function FloatingNav() {
  return (
    <div className="sticky top-6 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto bg-background/80 backdrop-blur-xl border border-border/50 rounded-full shadow-lg px-2 py-2 flex items-center gap-1">
        <div className="flex items-center gap-2 pl-4 pr-6 border-r border-border/50">
          <div className="bg-primary h-6 w-6 rounded-md flex items-center justify-center text-primary-foreground font-bold text-xs">
            T
          </div>
          <span className="font-bold text-sm tracking-tight">TripOS</span>
        </div>
        {/* Tab buttons */}
      </div>
    </div>
  );
}
```

**Usage:** Mobile navigation, Dashboard

---

## 6. Progress Bar with Color Variants

**Pattern:** Budget/expense tracking bars

```tsx
// Location: apps/web/src/components/ui/ProgressBar.tsx (extend existing)

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  className?: string;
  indicatorColor?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  indicatorColor = 'bg-primary',
  showLabel = false,
  className
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={cn("space-y-1", className)}>
      {showLabel && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-bold">${value} / ${max}</span>
        </div>
      )}
      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-1000 ease-out",
            indicatorColor
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
```

**Usage:** Budget tracking, Expense summaries, Trip progress

---

## 7. Blind Voting State

**Pattern:** Hide results until user votes

```tsx
// Location: apps/web/src/features/voting/components/BlindVoteCard.tsx

{poll.isBlind && poll.status === 'ACTIVE' && !poll.userVoted ? (
  <div className="bg-muted/30 border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-3">
    <div className="bg-muted rounded-full p-3">
      <EyeOff className="w-6 h-6 text-muted-foreground" />
    </div>
    <div>
      <p className="font-bold text-foreground">Blind Vote Active</p>
      <p className="text-xs text-muted-foreground max-w-[200px]">
        Results are hidden to prevent groupthink. Cast your vote to see participation.
      </p>
    </div>
    <Button size="sm" onClick={() => onVote(poll.id)}>
      Reveal & Vote
    </Button>
  </div>
) : (
  <VoteResults poll={poll} />
)}
```

**Usage:** Epic 5 (Voting)

---

## 8. Multi-Currency Display

**Pattern:** Show original currency with USD conversion

```tsx
// Location: apps/web/src/features/expenses/components/ExpenseAmount.tsx

interface ExpenseAmountProps {
  amount: number;
  currency: Currency;
  convertedAmount?: number;
  className?: string;
}

export function ExpenseAmount({
  amount,
  currency,
  convertedAmount,
  className
}: ExpenseAmountProps) {
  const symbol = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
  }[currency];

  return (
    <div className={cn("text-right", className)}>
      <p className="font-bold">
        {symbol}{amount.toLocaleString()}
      </p>
      {currency !== 'USD' && convertedAmount && (
        <p className="text-xs text-muted-foreground">
          ~${convertedAmount}
        </p>
      )}
    </div>
  );
}
```

**Usage:** Epic 7 (Expenses)

---

## NOT to Adopt

### ❌ Monolithic Component Files
- Prototype has 2000+ line files
- **Instead:** Split into feature modules from day 1

### ❌ No Loading States
- Prototype renders everything instantly
- **Instead:** Use React Query loading states, skeleton components

### ❌ Inline Mock Data
- Prototype uses `MOCK_*` constants everywhere
- **Instead:** Use MSW (Mock Service Worker) for API mocking

### ❌ useState for Server State
- Prototype uses `useState` for polls, expenses
- **Instead:** Use React Query for all server data

---

## Implementation Priority

1. **Quorum Facepile** - Epic 5 (next voting story)
2. **Urgency Calculator** - Epic 5 (poll deadlines)
3. **Role Badge System** - Epic 3 (members)
4. **Category System** - Epic 4 (itinerary) and Epic 7 (expenses)
5. **Progress Bars** - Epic 6 (budget) and Epic 7 (expenses)
6. **Multi-Currency** - Epic 7 (expenses)
7. **Blind Vote State** - Epic 5 (advanced voting)
8. **Floating Nav** - Epic 13 (responsive UI)
