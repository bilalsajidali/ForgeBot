/**
 * Frontend environment configuration (Vite: prefix with VITE_).
 * See .env.example for variable names and defaults.
 */

const trimTrailingSlash = (value) => String(value).replace(/\/+$/, '')

function readString(key, fallback) {
  const raw = import.meta.env[key]
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return fallback
  }
  return String(raw).trim()
}

export const env = {
  /** Backend API origin, e.g. http://localhost:8000 */
  apiBaseUrl: trimTrailingSlash(readString('VITE_API_BASE_URL', 'http://localhost:8000')),

  /** Full URL to the chat widget script (embed snippet) */
  widgetScriptUrl: readString('VITE_WIDGET_SCRIPT_URL', 'https://cdn.botforge.app/widget.js'),

  /** Global name used on window for widget config (must match widget implementation) */
  widgetConfigGlobal: readString('VITE_WIDGET_CONFIG_GLOBAL', 'BotForgeConfig'),

  /** Marketing / contact (mailto) */
  salesEmail: readString('VITE_SALES_EMAIL', 'sales@botforge.app'),

  /** Public app name (nav, landing) */
  appName: readString('VITE_APP_NAME', 'BotForge'),

  /** Response header names from the API (axios lowercases keys in the browser) */
  headers: {
    knowledgeWarnings: readString(
      'VITE_HEADER_KNOWLEDGE_WARNINGS',
      'x-botforge-knowledge-warnings'
    ),
    pdfWarningsLegacy: readString('VITE_HEADER_PDF_WARNINGS', 'x-botforge-pdf-warnings'),
  },
}
