/**
 * URL state utilities.
 * Serialize/deserialize calculator state to/from URL search params
 * so that links can be shared.
 */

/**
 * Serialize a flat object of string/number values to URL search params.
 */
export function serializeToParams(state: Record<string, string | number | boolean | undefined>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(state)) {
    if (value !== undefined && value !== '') {
      params.set(key, String(value));
    }
  }
  return params.toString();
}

/**
 * Deserialize URL search params to a flat object.
 */
export function deserializeFromParams(searchParams: URLSearchParams): Record<string, string> {
  const result: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

/**
 * Get a number from search params, with optional default.
 */
export function getNumParam(
  params: URLSearchParams,
  key: string,
  defaultValue?: number
): number | undefined {
  const val = params.get(key);
  if (val === null || val === '') return defaultValue;
  const num = parseFloat(val);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Get a string from search params, with optional default.
 */
export function getStrParam(
  params: URLSearchParams,
  key: string,
  defaultValue?: string
): string | undefined {
  const val = params.get(key);
  if (val === null || val === '') return defaultValue;
  return val;
}

/**
 * Build a shareable URL for a calculator with given state.
 */
export function buildShareUrl(
  basePath: string,
  state: Record<string, string | number | boolean | undefined>,
): string {
  const params = serializeToParams(state);
  if (typeof window !== 'undefined') {
    return `${window.location.origin}${basePath}?${params}`;
  }
  return `${basePath}?${params}`;
}

/**
 * Copy text to clipboard. Returns true if successful.
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}
