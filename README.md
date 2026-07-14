# MacroZone

MacroZone is a React Native (Expo) macro tracker for logging meals, monitoring daily progress against custom goals, reviewing meal history, and visualizing weekly trends.

Built as a portfolio-ready Expo SDK 57 app with local persistence, Zustand state management, and a clean layered architecture.

## Features

- Daily macro dashboard (calories, protein, carbs, fat)
- Progress bars against configurable goals
- Create, edit, and delete meals
- Meal history grouped by day
- Weekly trend chart with macro selector
- Copy / share today's summary
- Local reminders at 12:00 and 18:00 (iOS/Android)
- Offline-first persistence with AsyncStorage + Zustand

## Stack

- Expo SDK 57 / React Native 0.86 / React 19
- Expo Router (file-based tabs)
- Zustand + AsyncStorage persistence
- `react-native-gifted-charts` + `react-native-svg`
- Expo Notifications / Haptics / Clipboard
- Jest + jest-expo for unit tests

## Architecture

```text
src/
  app/            Expo Router screens
  components/     Reusable UI
  lib/            Pure business logic (dates, macros, validation)
  store/          Zustand stores (meals + settings)
  styles/         Theme tokens and shared styles
  utils/          Side-effect helpers (notifications)
```

Screens talk to stores. Stores persist data. Screens and components use pure helpers from `lib/` for totals, filtering, and chart series. This keeps business logic easy to unit test.

## Getting started

```bash
npm install
npm start
```

Then open:
- Android emulator
- iOS simulator
- Expo Go
- Web (`npm run web`)

## Scripts

| Script | Description |
| --- | --- |
| `npm start` | Start Expo dev server |
| `npm run android` | Open Android |
| `npm run ios` | Open iOS |
| `npm run web` | Open web |
| `npm test` | Run unit tests |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | Expo lint |

## Product Notes

- Home metrics always reflect **today only**
- History keeps the full meal timeline grouped by local day
- Goals and reminder preferences persist between sessions
- Reminder notifications are re-synced on app launch when enabled
- Web supports the full UI except native notifications

## Testing

```bash
npm test
```

Coverage focuses on:
- date helpers
- macro totals / progress / weekly series
- meal form validation
- meal store CRUD actions

## Portfolio Highlights

- Correct daily business logic instead of summing lifelong history
- Explicit separation of pure logic vs UI vs persistence
- Configurable goals with visual progress feedback
- Weekly chart as the standout analytics feature
- CI workflow for typecheck + tests

## License

Private portfolio project.
