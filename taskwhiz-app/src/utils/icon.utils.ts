import type { LucideIconName } from '../types'; // Assuming LucideIconName is string

export const ICON_MAPPING: Record<'priority' | 'status' | 'category', Record<string, LucideIconName>> = {
  priority: {
    'urgent|critique|emergency': 'AlertTriangle',
    'high|haute|important': 'ArrowUp',
    'medium|moyenne|normal': 'Minus',
    'low|basse|minor': 'ArrowDown'
  },
  status: {
    'todo|à faire|new|open': 'Circle', // Added 'open'
    'progress|cours|doing|inprogress': 'Play', // Added 'inprogress'
    'review|révision|testing|qa': 'Eye', // Added 'qa'
    'done|terminé|completed|closed': 'CheckCircle', // Added 'closed'
    'cancelled|annulé|wontfix': 'XCircle' // Changed from 'X' to 'XCircle' for consistency
  },
  category: { // For future usage
    'bug|erreur|issue': 'Bug', // Added 'issue'
    'feature|fonctionnalité|enhancement': 'Sparkles', // Added 'enhancement'
    'design|ui|ux': 'Palette', // Added 'ui', 'ux'
    'documentation|docs|doc': 'FileText', // Added 'docs', 'doc'
    'meeting|réunion|event': 'Users', // Added 'event'
    'marketing|promo': 'Megaphone', // Added 'promo'
    'chore|task|other': 'ClipboardList', // Added default/generic category icons
    'research': 'Brain',
    'testing': 'TestTube2',
    'deployment': 'Rocket',
    'support': 'LifeBuoy',
  }
};

/**
 * Gets a corresponding Lucide icon name based on a text input and its type (priority, status, category).
 * The function performs a case-insensitive search using keywords defined in ICON_MAPPING.
 * 
 * @param text The input text (e.g., priority name "Haute", status name "En Cours").
 * @param type The type of entity ('priority', 'status', 'category').
 * @returns The name of the Lucide icon if a match is found, otherwise undefined.
 */
export const getIconName = (
  text: string,
  type: 'priority' | 'status' | 'category'
): LucideIconName | undefined => {
  if (!text || !type) {
    return undefined;
  }

  const lowerText = text.toLowerCase().trim();
  const mappingForType = ICON_MAPPING[type];

  if (!mappingForType) {
    return undefined;
  }

  for (const key in mappingForType) {
    const keywords = key.split('|');
    if (keywords.some(keyword => lowerText.includes(keyword.toLowerCase().trim()))) {
      return mappingForType[key];
    }
  }

  return undefined;
};
