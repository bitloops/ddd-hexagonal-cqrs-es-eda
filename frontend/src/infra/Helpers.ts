class Helpers {
  static async sha256Hash(message: string) {
    // Convert the message to a Uint8Array
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    // Generate the hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    // Convert the hash to a hexadecimal string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }
}

export default Helpers;
