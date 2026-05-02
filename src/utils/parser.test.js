import { describe, it, expect } from 'vitest';
import { parseMessage } from './parser';

describe('Message Parser', () => {
  it('should extract title and assign to Me for "I will..." messages', () => {
    const result = parseMessage('I will fix the login bug by today');
    expect(result.owner).toBe('Me');
    expect(result.title).toBe('Fix the login bug');
    expect(result.status).toBe('todo');
  });

  it('should extract title and assign to Me for "I am..." messages', () => {
    const result = parseMessage('I am designing the database');
    expect(result.owner).toBe('Me');
    expect(result.title).toBe('Designing the database');
  });

  it('should extract third-party owner correctly', () => {
    const result = parseMessage('Alice is working on the API now');
    expect(result.owner).toBe('Alice');
    expect(result.title).toBe('The API');
  });

  it('should sanitize HTML from input', () => {
    const result = parseMessage('I will fix <script>alert("xss")</script> the bug');
    expect(result.title).toBe('Fix  the bug'); // Script is removed by DOMPurify
  });

  it('should handle empty or whitespace-only inputs', () => {
    const result = parseMessage('   ');
    expect(result).toBeNull();
  });
});
