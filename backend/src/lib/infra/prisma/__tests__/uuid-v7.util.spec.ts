import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UUIDv7 } from '../uuid-v7.util';

describe('UUIDv7', () => {
  describe('generate', () => {
    it('should generate a valid UUID v7', () => {
      const uuid = UUIDv7.generate();
      
      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe('string');
      expect(UUIDv7.isValid(uuid)).toBe(true);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = UUIDv7.generate();
      const uuid2 = UUIDv7.generate();
      
      expect(uuid1).not.toBe(uuid2);
    });

    it('should generate time-ordered UUIDs', async () => {
      const uuid1 = UUIDv7.generate();
      
      // Small delay to ensure different timestamps
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const uuid2 = UUIDv7.generate();
      
      // UUID v7 should be lexicographically sortable by time
      expect(uuid1 < uuid2).toBe(true);
    });
  });

  describe('isValid', () => {
    it('should validate correct UUID v7 format', () => {
      const validUuid = UUIDv7.generate();
      expect(UUIDv7.isValid(validUuid)).toBe(true);
    });

    it('should reject invalid UUID formats', () => {
      expect(UUIDv7.isValid('invalid-uuid')).toBe(false);
      expect(UUIDv7.isValid('123e4567-e89b-12d3-a456-426614174000')).toBe(false); // UUID v1
      expect(UUIDv7.isValid('550e8400-e29b-41d4-a716-446655440000')).toBe(false); // UUID v4
      expect(UUIDv7.isValid('')).toBe(false);
      expect(UUIDv7.isValid('not-a-uuid')).toBe(false);
    });

    it('should validate UUID v7 version bit', () => {
      const uuid = UUIDv7.generate();
      const versionChar = uuid.charAt(14); // Version is at position 14
      expect(versionChar).toBe('7');
    });
  });

  describe('extractTimestamp', () => {
    it('should extract timestamp from UUID v7', () => {
      const beforeGeneration = new Date();
      const uuid = UUIDv7.generate();
      const afterGeneration = new Date();
      
      const extractedTimestamp = UUIDv7.extractTimestamp(uuid);
      
      expect(extractedTimestamp).toBeInstanceOf(Date);
      expect(extractedTimestamp.getTime()).toBeGreaterThanOrEqual(beforeGeneration.getTime());
      expect(extractedTimestamp.getTime()).toBeLessThanOrEqual(afterGeneration.getTime());
    });

    it('should throw error for invalid UUID', () => {
      expect(() => {
        UUIDv7.extractTimestamp('invalid-uuid');
      }).toThrow('Invalid UUID v7 format');
    });
  });

  describe('compare', () => {
    it('should compare UUIDs chronologically', async () => {
      const uuid1 = UUIDv7.generate();
      
      // Ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 1));
      
      const uuid2 = UUIDv7.generate();
      
      expect(UUIDv7.compare(uuid1, uuid2)).toBeLessThan(0);
      expect(UUIDv7.compare(uuid2, uuid1)).toBeGreaterThan(0);
      expect(UUIDv7.compare(uuid1, uuid1)).toBe(0);
    });

    it('should throw error for invalid UUIDs', () => {
      const validUuid = UUIDv7.generate();
      
      expect(() => {
        UUIDv7.compare('invalid', validUuid);
      }).toThrow('Both UUIDs must be valid UUID v7 format');
      
      expect(() => {
        UUIDv7.compare(validUuid, 'invalid');
      }).toThrow('Both UUIDs must be valid UUID v7 format');
    });
  });

  describe('sort', () => {
    it('should sort UUIDs chronologically', async () => {
      const uuids: string[] = [];
      
      // Generate UUIDs with small delays
      for (let i = 0; i < 3; i++) {
        uuids.push(UUIDv7.generate());
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      // Shuffle the array
      const shuffled = [...uuids].sort(() => Math.random() - 0.5);
      
      // Sort using UUIDv7.sort
      const sorted = UUIDv7.sort(shuffled);
      
      expect(sorted).toEqual(uuids); // Should match original chronological order
    });

    it('should not mutate original array', () => {
      const original = [UUIDv7.generate(), UUIDv7.generate()];
      const originalCopy = [...original];
      
      UUIDv7.sort(original);
      
      expect(original).toEqual(originalCopy);
    });
  });

  describe('database performance benefits', () => {
    it('should demonstrate time-ordering for event sourcing', () => {
      // Simulate domain events being generated over time
      const eventIds: string[] = [];
      
      for (let i = 0; i < 5; i++) {
        eventIds.push(UUIDv7.generate());
      }
      
      // Verify they are naturally ordered
      const sorted = [...eventIds].sort();
      expect(eventIds).toEqual(sorted);
      
      // Verify timestamps are extractable for temporal queries
      eventIds.forEach(id => {
        const timestamp = UUIDv7.extractTimestamp(id);
        expect(timestamp).toBeInstanceOf(Date);
      });
    });

    it('should be suitable for primary keys and indexes', () => {
      const uuid = UUIDv7.generate();
      
      // Should be 36 characters (standard UUID format)
      expect(uuid.length).toBe(36);
      
      // Should contain proper separators
      expect(uuid.charAt(8)).toBe('-');
      expect(uuid.charAt(13)).toBe('-');
      expect(uuid.charAt(18)).toBe('-');
      expect(uuid.charAt(23)).toBe('-');
      
      // Version should be 7
      expect(uuid.charAt(14)).toBe('7');
      
      // Variant should be 8, 9, A, or B (RFC 4122)
      const variant = uuid.charAt(19);
      expect(['8', '9', 'a', 'b', 'A', 'B']).toContain(variant);
    });
  });
});