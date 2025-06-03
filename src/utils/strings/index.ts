export const capitalize = <T>(str: string): T => {
  return (str || '')
    .split(' ')
    .map(word =>
      word ? word[0].toUpperCase() + word.slice(1).toLowerCase() : ''
    )
    .join(' ') as T;
};
