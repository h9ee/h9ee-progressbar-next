# h9ee-progressbar-next

[![npm version](https://img.shields.io/npm/v/h9ee-progressbar-next.svg)](https://www.npmjs.com/package/h9ee-progressbar-next) [![license](https://img.shields.io/npm/l/h9ee-progressbar-next.svg)](./LICENSE)

A minimal, customizable React progress bar component for Next.js App Router (v13+).

**Features**:

* Automatic top-loading indicator on client-side route transitions
* Configurable color and height
* Support for custom loader components
* No external dependencies (built-in simulation similar to NProgress)

---

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)

   * [Default Bar](#default-bar)
   * [Custom Bar](#custom-bar)
3. [API](#api)
4. [How It Works](#how-it-works)
5. [Compatibility](#compatibility)
6. [Development](#development)
7. [Contributing](#contributing)
8. [License](#license)

---

## Installation

Install the package via npm or yarn:

```bash
npm install h9ee-progressbar-next
# or
yarn add h9ee-progressbar-next
```

> **Peer Dependencies**:
>
> * React 18.x
> * Next.js >= 13.4.0 (App Router)

Ensure your project uses the Next.js App Router (i.e., has an `/app` directory).

---

## Usage

### Wrap your Root Layout

In your **`app/layout.tsx`** (or equivalent), import and wrap your application:

```tsx
'use client'

import ProgressBarProvider from 'h9ee-progressbar-next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProgressBarProvider>
          {children}
        </ProgressBarProvider>
      </body>
    </html>
  );
}
```

### Default Bar

By default, the provider renders a thin, fixed-top bar:

```tsx
<ProgressBarProvider>
  {children}
</ProgressBarProvider>
```

### Customizing Color and Height

Adjust the color or height via props:

```tsx
<ProgressBarProvider color="#0A2FFF" height="4px">
  {children}
</ProgressBarProvider>
```

### Custom Bar

Supply your own loader component (e.g., spinner, animated indicator):

```tsx
import ProgressBarProvider from 'h9ee-progressbar-next';
import MySpinner from './MySpinner';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ProgressBarProvider customBar={MySpinner}>
          {children}
        </ProgressBarProvider>
      </body>
    </html>
  );
}
```

> If you pass a JSX element (e.g., `<MySpinner />`), it will be rendered directly. Passing `customBar` disables `color` and `height` props.

---

## API

| Prop        | Type                                    | Default   | Description                                          |
| ----------- | --------------------------------------- | --------- | ---------------------------------------------------- |
| `children`  | `React.ReactNode`                       | —         | Application UI                                       |
| `color`     | `string`                                | `#2299DD` | Bar color (ignored if `customBar` is set)            |
| `height`    | `string`                                | `3px`     | Bar height (ignored if `customBar` is set)           |
| `customBar` | `React.ComponentType<any> \| ReactNode` | —         | Custom loader component or element during navigation |

---

## How It Works

1. **Client-Side Only**: The provider uses `'use client'` and runs in the browser.
2. **Link Click Detection**: Attaches a global click listener to capture internal `<a>` clicks and triggers loading.
3. **Route Change Detection**: Uses Next.js App Router hooks (`usePathname`, `useSearchParams`) to detect navigation completion.
4. **Progress Simulation**: Starts the bar at 10%, increments up to 90% with an interval, then jumps to 100% on completion before resetting.
5. **Custom Bar**: Mounts your `customBar` component instead of the default bar when provided.

This mimics NProgress-like behavior without external dependencies.

---

## Compatibility

* **Next.js**: 13.4.0, 14.x, 15.x (App Router only)
* **React**: 18.x
* **TypeScript**: v4.9+ (strict mode enabled)

---

## Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/h9ee/h9ee-progressbar-next.git
cd h9ee-progressbar-next
npm install
```

* **Build**: `npm run build` (compiles TS to `dist/` and types to `types/`)
* **Publish**: Update `package.json` version and run `npm publish`

---

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.
