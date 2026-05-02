import { describe, it, expect } from 'vitest';
import { parseMessage } from './parser';

describe('Message Parser', () => {
  it('should extract title and assign to Me for "I will..." messages', () => {
    const result = parseMessage('I will fix the login bug by today');
    expect(result.owner).toBe('Me');
    expect(result.title).toBe('The login bug');
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
    expect(result.title).toBe('The bug'); // Script tag + 'fix' prefix removed
  });

  it('should handle empty or whitespace-only inputs', () => {
    const result = parseMessage('   ');
    expect(result).toBeNull();
  });

  // New test cases
  it('should handle "I\'m" contraction', () => {
    const result = parseMessage("I'm working on the dashboard");
    expect(result.owner).toBe('Me');
    expect(result.title).toBe('The dashboard');
  });

  it('should extract owner from "Name will..." pattern', () => {
    const result = parseMessage('Bob will implement the search feature');
    expect(result.owner).toBe('Bob');
    expect(result.title).toBe('Implement the search feature');
  });

  it('should remove "by tomorrow" timeframe', () => {
    const result = parseMessage('I will deploy the app by tomorrow');
    expect(result.title).toBe('Deploy the app');
  });

  it('should remove "ASAP" timeframe', () => {
    const result = parseMessage('I will review the PR ASAP');
    expect(result.title).toBe('Review the PR');
  });

  it('should capitalize the first letter of the title', () => {
    const result = parseMessage('I will update the readme');
    expect(result.title).toBe('Update the readme');
  });

  it('should handle single word task', () => {
    const result = parseMessage('I will refactor');
    expect(result.title).toBe('Refactor');
  });

  it('should default status to todo', () => {
    const result = parseMessage('Charlie will write tests');
    expect(result.status).toBe('todo');
    expect(result.owner).toBe('Charlie');
  });

  it('should handle message with no recognized pattern as self-assigned', () => {
    const result = parseMessage('review the pull request');
    expect(result.owner).toBe('Me');
    expect(result.title).toBe('Review the pull request');
  });

  it('should remove "now" timeframe from end', () => {
    const result = parseMessage('I will start the migration now');
    expect(result.title).toBe('Start the migration');
  });

  it('should handle "fixing" prefix removal', () => {
    const result = parseMessage('I am fixing the header alignment');
    expect(result.owner).toBe('Me');
    expect(result.title).toBe('The header alignment');
  });
});
