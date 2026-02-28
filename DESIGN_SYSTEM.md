# OrçaFast — Design System

> Source of truth for all UI patterns. Any new component or page **must** follow these rules. Add new patterns here before implementing them.

---

## 1. Colors

All colors are defined in `src/theme/index.js`.

| Token | Hex | Usage |
|---|---|---|
| `emerald.500` | `#00d97e` | Brand primary, focus rings, CTAs |
| `emerald.600` | `#00b368` | Hover state for brand buttons |
| `gray.50` | `#f8fafc` | Page background |
| `gray.100` | `#f1f5f9` | Input background (standard) |
| `gray.200` | `#e2e8f0` | Borders, dividers |
| `gray.400` | `#94a3b8` | Placeholder text |
| `gray.500` | `#64748b` | Secondary text / icons |
| `gray.900` | `#0f172a` | Primary text, headings |

---

## 2. Inputs

### Standard Input (most forms)

The `app` variant is the **default** — no variant prop needed.

```jsx
// ✅ Correct — theme handles all styling
<Input
  placeholder="Nome completo"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  required
/>
```

**Tokens provided by `variant="app"` (theme/index.js):**
- `bg: white`
- `border: 1.5px solid gray.200` → `gray.300` on hover
- `borderRadius: xl` (12px)
- `height: 48px`
- `fontSize: sm`
- `color: gray.900`
- `_placeholder: { color: gray.400 }`
- **`_focus: { borderColor: emerald.500, boxShadow: '0 0 0 2px #00d97e' }`** ← the standard emerald ring
- `_disabled: { bg: gray.50, opacity: 0.5 }`

```jsx
// ❌ Never do this — these are all redundant:
<Input
  bg="gray.100"
  border="none"
  borderRadius="xl"
  color="gray.900"
  _placeholder={{ color: 'gray.500' }}
  _hover={{ bg: 'gray.100' }}
  _focus={{ bg: 'gray.100', boxShadow: '...', outline: 'none' }}
  fontSize="sm"
  h={12}
/>
```

The **only** extra props you should ever add:
- `required`, `type`, `id`, `name`, `value`, `onChange`, `placeholder` (functional)
- `pr={12}` when inside an `InputGroup` with a right element
- Width/spacing props (`w`, etc.)

---

### Adornment Input (with icon prefix, currency prefix, etc.)

Used in `SettingsProfile`, `SettingsGoals`. Keep the border for visual grouping with the adornment box, but use the standard emerald focus:

```jsx
<HStack spacing={0}>
  {/* Left adornment box */}
  <Center
    w="48px" h="48px" bg="white"
    roundedLeft="xl"
    sx={{ border: '1.5px solid #E2E8F0', borderRight: 'none' }}
  >
    <Icon as={FiPhone} boxSize={5} color="gray.500" />
  </Center>

  {/* Attached input */}
  <Input
    value={value}
    onChange={(e) => setValue(e.target.value)}
    placeholder="(11) 99999-9999"
    bg="white"
    roundedRight="xl"
    roundedLeft="none"
    h="48px"
    sx={{ border: '1.5px solid #E2E8F0' }}
    _focus={{ borderColor: 'emerald.500', boxShadow: '0 0 0 2px #00d97e' }}
    _hover={{ borderColor: 'gray.300' }}
  />
</HStack>
```

> **Why `sx`?** Chakra UI's `border="1.5px"` shorthand doesn't include the implicit `solid` style keyword. Use `sx={{ border: '1.5px solid #E2E8F0' }}` instead of `border="1.5px"` + `borderColor` to guarantee the border is always visible at rest.
>
> **Rule:** `boxShadow: '0 0 0 2px #00d97e'` — always 2px, always `#00d97e`.  
> Never use `green.400` or a 1px ring.

---

### Password Input (with show/hide toggle)

```jsx
<InputGroup>
  <Input
    type={show ? 'text' : 'password'}
    placeholder="Senha"
    pr={12}
    required
  />
  <InputRightElement h={12}>
    <Button variant="ghost" size="sm" onClick={() => setShow(!show)} _hover={{ bg: 'transparent' }}>
      <Icon as={show ? FiEyeOff : FiEye} w={4} h={4} color="gray.500" />
    </Button>
  </InputRightElement>
</InputGroup>
```

---

## 3. Textarea

The `app` variant is the default — matches Input in style.

```jsx
// ✅ Correct
<Textarea
  placeholder="Descreva o projeto..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
  minH="120px"
  resize="vertical"
/>
```

**Tokens:** same as Input `app` but with `py: 3`.

---

## 4. Select (native `<Select>`)

The `app` variant is the default.

```jsx
<Select value={value} onChange={(e) => setValue(e.target.value)}>
  <option value="a">Option A</option>
</Select>
```

---

## 5. ReactSelect (react-select library)

Used in `CreateProposalPage`. Uses `customSelectStyles` object defined in-component.  
The `option` style checks `state.data?.isCreate` to give the "+ Cadastrar" option a different look.

**Standard values to match the `app` input:**
- `backgroundColor: 'white'`
- `borderColor: state.isFocused ? '#00d97e' : '#E5E7EB'` (gray.200 at rest)
- `borderWidth: '1.5px'`
- `boxShadow: state.isFocused ? '0 0 0 2px #00d97e' : 'none'`
- `'&:hover': { borderColor: '#D1D5DB' }` (gray.300)

---

## 6. Buttons

| Variant | Usage | Example |
|---|---|---|
| `solid` (default) | Primary action | Save, Submit |
| `gradient` | High-emphasis CTA | "Novo orçamento" |
| `outline` | Secondary action | Cancel, Header upgrade |
| `ghost` | Tertiary / icon buttons | Back, Password toggle |

```jsx
// Primary
<Button type="submit" isLoading={loading} loadingText="Salvando...">
  Salvar
</Button>

// Secondary (outline)
<Button variant="outline" onClick={onCancel}>Cancelar</Button>
```

Height convention: `h={12}` (48px) for standard buttons. `size="sm"` for compact contexts (header).

---

## 7. Spacing & Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded="xl"` | 12px | Inputs, cards, buttons |
| `rounded="2xl"` | 16px | Modal, large cards |
| `rounded="lg"` | 8px | Small chips, badges |
| `rounded="full"` | 9999px | Avatars, pill badges |

---

## 8. Form Labels

```jsx
<FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
  Nome do cliente *
</FormLabel>
```

Or use `<FormControl isRequired>` — Chakra adds the red asterisk automatically (don't add `*` manually).

---

## 9. When to Add to This Doc

Add a new section when you introduce:
- A new interactive component pattern (e.g., date pickers, toggles, chips)
- A new color semantic (e.g., warning, danger, info)
- A new layout pattern used in 2+ places

> Last updated: 2026-02-28
