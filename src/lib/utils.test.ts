import { describe, it, expect } from 'vitest';
import { encodeConfig, decodeConfig, cn } from './utils';
import { EventConfig } from './types';

describe('Utility Functions', () => {
  describe('cn()', () => {
    it('merges tailwind classes correctly', () => {
      expect(cn('p-4', 'p-2')).toBe('p-2');
      expect(cn('text-black', undefined, 'text-white')).toBe('text-white');
    });
  });

  describe('encodeConfig and decodeConfig', () => {
    it('should correctly encode and decode the event configuration object', () => {
      const mockConfig: EventConfig = {
        eventName: 'Royal Gala',
        eventDate: '2027-01-01T20:00',
        timezone: 'UTC',
        userInfo: {
          name: 'King Arthur',
          email: 'arthur@camelot.com',
          phoneCode: '+44',
          phone: '123456789'
        },
        additionalInfo: [
          { header: 'Venue', description: 'The Grand Hall' }
        ],
        style: {
          textColor: '#ffd700',
          bgColor: '#0a0b10',
          fontFamily: 'var(--font-playfair)',
          fontSize: 'text-xl'
        }
      };

      const encoded = encodeConfig(mockConfig);
      expect(typeof encoded).toBe('string');
      expect(encoded.length).toBeGreaterThan(0);

      const decoded = decodeConfig(encoded) as EventConfig;
      expect(decoded.eventName).toBe(mockConfig.eventName);
      expect(decoded.userInfo.email).toBe(mockConfig.userInfo.email);
      expect(decoded.additionalInfo[0].description).toBe(mockConfig.additionalInfo[0].description);
      expect(decoded.style.bgColor).toBe(mockConfig.style.bgColor);
    });

    it('should return empty string on erroneous encode inputs gracefully depending on JSON structure', () => {
      // Circular reference to trigger error
      const circularObj: any = {};
      circularObj.circularRef = circularObj;
      const result = encodeConfig(circularObj);
      expect(result).toBe('');
    });

    it('should return null when decoding an invalid string', () => {
      // Not base64
      const result = decodeConfig('!!not-base64!!');
      expect(result).toBeNull();
    });
  });
});
