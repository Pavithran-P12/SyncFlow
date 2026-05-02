import DOMPurify from 'dompurify';

/**
 * Parses a natural language message and extracts task details.
 * Also sanitizes the input to prevent XSS.
 * 
 * @param {string} rawMessage - The raw user input
 * @returns {Object} - The parsed task data { title, owner, status }
 */
export const parseMessage = (rawMessage) => {
  // 1. Sanitize Input
  const message = DOMPurify.sanitize(rawMessage.trim());
  
  if (!message) {
    return null;
  }

  let title = message;
  let owner = 'Me';
  
  const lowerMsg = message.toLowerCase();
  
  // 2. Extract Owner
  if (lowerMsg.startsWith('i will ') || lowerMsg.startsWith('i am ') || lowerMsg.startsWith("i'm ")) {
    owner = 'Me';
    title = message.replace(/^(i will|i am|i'm)\s+/i, '');
  } else {
    const parts = message.split(' ');
    if (parts.length > 2 && (parts[1] === 'will' || parts[1] === 'is')) {
      owner = parts[0];
      // Capitalize first letter of owner if not 'Me'
      owner = owner.charAt(0).toUpperCase() + owner.slice(1);
      title = parts.slice(2).join(' ');
    }
  }

  // 3. Remove common timeframes from title
  const timeframes = [' by today', ' by tomorrow', ' today', ' tomorrow', ' now', ' ASAP'];
  for (const tf of timeframes) {
    if (title.toLowerCase().endsWith(tf.toLowerCase())) {
      title = title.slice(0, -tf.length);
    }
  }
  
  // 4. Remove action prefixes
  title = title.replace(/^(working on|fix|fixing|do|doing)\s+/i, '');

  // 5. Final cleanup
  title = title.trim();
  if (title) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  return {
    title,
    owner,
    status: 'todo'
  };
};
