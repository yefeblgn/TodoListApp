export type ThemeScheme = 'dark' | 'light';

export const getDynamicStyles = (currentScheme: ThemeScheme) => ({
  container: {
    backgroundColor: currentScheme === 'dark' ? '#222' : '#fff',
  },
  header: {
    color: currentScheme === 'dark' ? '#fff' : '#333',
  },
  sectionTitle: {
    color: currentScheme === 'dark' ? '#fff' : '#333',
  },
  optionText: {
    color: currentScheme === 'dark' ? '#fff' : '#333',
  },
  otherSettingsText: {
    color: currentScheme === 'dark' ? '#fff' : '#007AFF',
  },
  footerText: {
    color: currentScheme === 'dark' ? '#aaa' : '#888',
  },
  option: {
    borderColor: currentScheme === 'dark' ? '#555' : '#ddd',
    backgroundColor: currentScheme === 'dark' ? '#444' : 'transparent',
  },
});
