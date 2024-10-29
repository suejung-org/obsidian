import { nodeProfilingIntegration } from "@sentry/profiling-node";

// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://1d325bc440add19cb0cab04847316f48@o1413557.ingest.us.sentry.io/4507356101476352",

  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions

  // Set sampling rate for profiling - this is relative to tracesSampleRate
  profilesSampleRate: 1.0,
  integrations: [
    // Add our Profiling integration
    nodeProfilingIntegration(),
  ],
});
