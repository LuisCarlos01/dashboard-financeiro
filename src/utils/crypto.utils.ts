/**
 * Gera hash SHA-256 de uma string usando Web Crypto API
 * @param text - Texto a ser hasheado
 * @returns Promise com hash em formato hexadecimal
 */
export async function sha256Hash(text: string): Promise<string> {
  // Codificar texto em bytes
  const encoder = new TextEncoder();
  const data = encoder.encode(text);

  // Gerar hash usando Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);

  // Converter ArrayBuffer para hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  return hashHex;
}

/**
 * Compara uma string com um hash SHA-256
 * @param text - Texto a verificar
 * @param hash - Hash SHA-256 esperado
 * @returns Promise<boolean> indicando se correspondem
 */
export async function verifyHash(text: string, hash: string): Promise<boolean> {
  const textHash = await sha256Hash(text);
  return textHash === hash;
}

