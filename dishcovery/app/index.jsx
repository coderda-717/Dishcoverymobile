// dishcovery/app/index.jsx
// Root entry point ("/"). Without this file, expo-router would resolve
// "/" to (tabs)/index.jsx (since route groups don't add a path segment),
// skipping the splash screen entirely. Redirecting here guarantees the
// splash screen is always the first thing the user sees on launch.
import { Redirect } from "expo-router";

export default function Index() {
  return <Redirect href="/splash" />;
}