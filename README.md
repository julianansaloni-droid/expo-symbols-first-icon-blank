# expo-symbols on web: the first SymbolView stays blank when the icon font takes longer than 12 s

A blank Expo app (`npx create-expo-app@latest --template blank`, SDK 57) with four `SymbolView`s.
`metro.config.js` makes the dev server hold the Material Symbols font file for 18 s, so every
page load sees what a slow network or a cold cache sees. Nothing else is changed.

## Steps

1. `npm install`
2. `npx expo start --web`
3. Open the page in Chrome (or Firefox) with the cache disabled (DevTools, Network, "Disable
   cache") or in a new private window, and wait about 20 seconds.

**Expected:** all four icons draw once the font file arrives (about 18 s).

**Actual:** the first icon to mount ("today") stays an empty box for the rest of the page's life.
The other three draw. Delete `metro.config.js` (font in time) and all four draw.

iPhone and Safari are not affected: expo-font skips its font check there.

## Why

- `expo-symbols/build/SymbolView.js` (the web and Android view) sets `loaded` only in the `.then`
  of its own `loadAsync`. The `.catch(() => { /* noop */ })` swallows a rejection, and the effect
  (`[]` dependencies) never retries, so the icon renders its empty `View` for good.
- `expo-font/build/ExpoFontLoader.web.js`: the first `loadAsync` of a family writes the
  `@font-face` rule and returns `new FontObserver(family).load(testString, 12000)`, which rejects
  after 12 s. Every later call resolves at once, because on web `isLoaded` only checks that the
  rule exists, so only the first caller is affected.
- `expo-font/build/FontLoader.web.js`: the `try { return ExpoFontLoader.loadAsync(name, input); }
  catch {}` meant to swallow that timeout catches only synchronous throws; the returned promise
  still rejects.

## Workaround

Call `loadAsync({ [regular.name]: regular.font })`, with `regular` from
`expo-symbols/androidWeights/regular`, at module scope before any `SymbolView` mounts, so that
call is the one waiting on the font check.
