import { env } from './env'

/**
 * Embed snippet shown in docs / test UI.
 */
export function buildEmbedSnippet(apiKeyPlaceholder) {
  const key =
    typeof apiKeyPlaceholder === 'string' && apiKeyPlaceholder.length > 0
      ? apiKeyPlaceholder
      : 'bf_live_your_key_here'
  const g = env.widgetConfigGlobal
  const src = env.widgetScriptUrl
  return `<script>
  window.${g} = { apiKey: "${key}" };
</script>
<script src="${src}"></script>`
}
