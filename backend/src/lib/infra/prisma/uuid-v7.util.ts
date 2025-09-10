import { uuidv7 } from 'uuidv7';

/**
 * UUID v7 Utility
 * 
 * UUID v7 features:
 * - Time-ordered: Contains timestamp in the first 48 bits
 * - Database friendly: Better for primary keys and indexes
 * - Sortable: Lexicographically sortable by creation time
 * - Globally unique: Like other UUIDs
 * 
 * Benefits for this DDD/CQRS system:
 * - Better database performance for event sourcing
 * - Natural ordering for domain events
 * - Reduced index fragmentation in PostgreSQL
 * - Compatible with existing UUID fields
 */
export class UUIDv7 {
  /**
   * Generate a new UUID v7
   * @returns Time-ordered UUID v7 string
   */
  static generate(): string {
    return uuidv7();
  }

  /**
   * Validate if a string is a valid UUID v7
   * @param uuid - String to validate
   * @returns true if valid UUID v7
   */
  static isValid(uuid: string): boolean {
    // UUID v7 regex pattern
    const uuidv7Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidv7Regex.test(uuid);
  }

  /**
   * Extract timestamp from UUID v7
   * @param uuid - UUID v7 string
   * @returns Date object representing the creation time
   */
  static extractTimestamp(uuid: string): Date {
    if (!UUIDv7.isValid(uuid)) {
      throw new Error('Invalid UUID v7 format');
    }

    // Extract timestamp from first 48 bits (12 hex characters)
    const timestampHex = uuid.replace(/-/g, '').substring(0, 12);
    const timestamp = parseInt(timestampHex, 16);
    
    return new Date(timestamp);
  }

  /**
   * Compare two UUID v7s chronologically
   * @param uuid1 - First UUID v7
   * @param uuid2 - Second UUID v7
   * @returns -1 if uuid1 < uuid2, 0 if equal, 1 if uuid1 > uuid2
   */
  static compare(uuid1: string, uuid2: string): number {
    if (!UUIDv7.isValid(uuid1) || !UUIDv7.isValid(uuid2)) {
      throw new Error('Both UUIDs must be valid UUID v7 format');
    }

    return uuid1.localeCompare(uuid2);
  }

  /**
   * Sort an array of UUID v7s chronologically
   * @param uuids - Array of UUID v7 strings
   * @returns Sorted array (earliest first)
   */
  static sort(uuids: string[]): string[] {
    return uuids.slice().sort(UUIDv7.compare);
  }
}