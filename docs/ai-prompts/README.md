# TripFlow AI Prompt Templates

This directory contains prompt templates that **force** AI assistants (Claude Code, Gemini, ChatGPT, etc.) to follow the TripFlow Style Guide.

## Why These Templates?

Without explicit instructions, AI assistants may:
- ❌ Not read the style guide
- ❌ Use outdated patterns
- ❌ Hardcode values instead of using design tokens
- ❌ Skip accessibility requirements
- ❌ Miss testing standards

These templates **enforce** style guide compliance by:
- ✅ Requiring AI to read relevant sections first
- ✅ Providing explicit checklists
- ✅ Referencing specific style guide sections
- ✅ Including quality gates

## Available Templates

### 1. Component Creation
**File:** `COMPONENT-CREATION-PROMPT.md`

**Use when:** Creating new UI components (buttons, cards, forms, etc.)

**Ensures:**
- shadcn/ui composable pattern
- Design token usage
- Accessibility compliance
- TypeScript strict types
- Full test coverage

### 2. Code Review
**File:** `CODE-REVIEW-PROMPT.md`

**Use when:** Asking AI to review code before committing or opening PR

**Ensures:**
- Style guide compliance check
- Accessibility verification
- Performance review
- Test quality assessment
- Actionable feedback

### 3. Feature Development
**File:** `FEATURE-DEVELOPMENT-PROMPT.md`

**Use when:** Implementing complete features (multi-component)

**Ensures:**
- Architecture planning
- Component reuse
- Consistent patterns
- End-to-end testing
- Quality gates

## How to Use

### Method 1: Copy-Paste (Simple)

1. Open the relevant template file
2. Copy the prompt template
3. Fill in your specific requirements
4. Paste into Claude Code, Gemini, or ChatGPT
5. AI will read the style guide and follow standards

### Method 2: Reference in CLAUDE.md (Automatic for Claude Code)

Claude Code automatically reads `CLAUDE.md`, which already includes:
- Mandatory style guide requirements
- Component checklist
- Code review standards
- Quick reference

So when using Claude Code, you can simply say:
```
"Create a CityBadge component following the TripFlow style guide"
```

And Claude Code will automatically:
1. Read the style guide
2. Follow the component checklist
3. Use design tokens
4. Implement accessibility
5. Write tests

### Method 3: Create Custom GPTs (Advanced)

For ChatGPT/Gemini:
1. Create a custom GPT with the style guide as context
2. Include the prompt templates as instructions
3. Save for repeated use

## Examples

### Example 1: Creating a Button Variant

```bash
# In Claude Code:
> Create a new "gradient" variant for the Button component following
> the TripFlow style guide. Should use city colors as gradient background.
```

Claude Code will:
1. Read CLAUDE.md (which references the style guide)
2. Read Section 13 (Button Components)
3. Use class-variance-authority pattern (Section 12.1)
4. Use city color tokens (Section 5.2)
5. Add accessibility attributes (Section 27)
6. Write tests (Section 25)

### Example 2: Reviewing Code

```bash
# In Claude Code:
> Review my changes to ActivityCard.tsx against the style guide
```

Claude Code will:
1. Read Code Review Standards (CLAUDE.md)
2. Check accessibility (keyboard, ARIA, contrast)
3. Verify design token usage
4. Check TypeScript types
5. Assess test coverage
6. Provide specific fixes

### Example 3: Building a Feature

```bash
# Using the template:
Copy FEATURE-DEVELOPMENT-PROMPT.md, fill in:

Feature Requirements:
- Trip expense tracker with category breakdowns
- Real-time budget vs. actual comparison
- Export to CSV functionality
- Mobile-optimized with charts

Then paste into AI assistant.
```

## Quick Reference for Common Tasks

| Task | Template | Key Sections |
|------|----------|--------------|
| New component | Component Creation | 11, 12, 37 |
| Styling change | Feature Development | 5, 7, 23 |
| Form implementation | Component Creation | 14, 19, 27 |
| Accessibility fix | Code Review | 27-30 |
| Performance optimization | Code Review | 26 |
| Testing | Code Review | 25 |

## Tips for Best Results

**✅ DO:**
- Reference specific style guide sections in prompts
- Use templates as starting points
- Customize for your specific needs
- Ask AI to explain trade-offs when multiple approaches exist

**❌ DON'T:**
- Skip reading the style guide yourself (understand the standards)
- Assume AI has read the guide (always reference it explicitly)
- Ignore accessibility requirements (they're mandatory)
- Accept code without running the checklist

## Enforcement Hierarchy

1. **CLAUDE.md** (automatic for Claude Code)
   - Project-level instructions
   - Always loaded by Claude Code
   - References style guide

2. **Git Hooks** (.husky/pre-commit)
   - Reminds developers before commit
   - Shows checklist
   - Optional: Can block commits

3. **AI Prompt Templates** (this directory)
   - Explicit instructions for AI
   - Use with any AI assistant
   - Ensures compliance

4. **Code Review** (human or AI)
   - Final quality gate
   - Use CODE-REVIEW-PROMPT.md
   - Catches what automation missed

## Updating These Templates

When the style guide changes:
1. Update CLAUDE.md references
2. Update prompt templates
3. Update this README
4. Notify team in #design-system channel

## Questions?

- Style guide questions: See `TRIPFLOW-STYLE-GUIDE.md`
- Template usage: This README
- Claude Code setup: `CLAUDE.md`
- Team discussion: #design-system Slack channel
