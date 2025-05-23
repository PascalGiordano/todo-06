/**
 * Generates a simple unique ID based on the current timestamp.
 * Note: This is not a robust UUID solution. For production, consider using a library like `uuid`.
 */
export const generateId = (): string => Date.now().toString() + Math.random().toString(36).substring(2, 9);

/**
 * Generates initials from a full name.
 * E.g., "John Doe" -> "JD", "SingleName" -> "S"
 * @param fullName The full name of the user.
 * @returns The initials.
 */
export const getInitials = (fullName: string): string => {
  if (!fullName || typeof fullName !== 'string') {
    return '?';
  }
  const names = fullName.trim().split(/\s+/);
  if (names.length === 1 && names[0].length > 0) {
    return names[0][0].toUpperCase();
  }
  return names
    .map((name) => (name.length > 0 ? name[0].toUpperCase() : ''))
    .slice(0, 2) // Max 2 initials
    .join('');
};

/**
 * Returns a random Tailwind CSS color class for user avatars or tags.
 * Focuses on vibrant, distinct colors.
 * @returns A string representing a Tailwind CSS background color class.
 */
export const getRandomColor = (): string => {
  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500', 
    'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500', 
    'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500', 
    'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 
    'bg-rose-500'
  ];
  // Tailwind text color classes corresponding to the background colors for good contrast
  const textColors = [
    'text-white', 'text-white', 'text-black', 'text-black',
    'text-black', 'text-white', 'text-white', 'text-white',
    'text-white', 'text-white', 'text-white', 'text-white',
    'text-white', 'text-white', 'text-white', 'text-white',
    'text-white'
  ];

  const randomIndex = Math.floor(Math.random() * colors.length);
  
  // For this helper, we just need the background color for the user's avatar circle.
  // The `UserSetup.tsx` component applies `text-white` directly.
  // However, if we wanted this function to return both bg and text, we could do:
  // return { backgroundColor: colors[randomIndex], textColor: textColors[randomIndex] };
  
  return colors[randomIndex];
};

/**
 * Delays execution for a specified number of milliseconds.
 * @param ms The number of milliseconds to wait.
 * @returns A promise that resolves after the delay.
 */
export const wait = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Simple debounce function.
 * @param func The function to debounce.
 * @param delay The delay in milliseconds.
 * @returns A debounced version of the function.
 */
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}

/**
 * Capitalizes the first letter of a string.
 * @param str The string to capitalize.
 * @returns The capitalized string.
 */
export const capitalizeFirstLetter = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
