import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    paddingTop: 60,
  },
  header: { 
    fontSize: 24, 
    fontWeight: '600', 
    marginVertical: 16, 
  },
  section: { 
    marginVertical: 12, 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: '500', 
    marginBottom: 8, 
  },
  options: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
  },
  option: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedOption: { 
    backgroundColor: '#007AFF', 
    borderColor: '#007AFF' 
  },
  optionText: { 
    fontSize: 16, 
  },
  optionRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
  },
  otherSettings: { 
    marginTop: 16, 
    padding: 12, 
    borderWidth: 1, 
    borderRadius: 8, 
    alignItems: 'center', 
  },
  otherSettingsText: { 
    fontSize: 16, 
  },
  footer: { 
    position: 'absolute', 
    bottom: 20, 
    width: '100%', 
    alignItems: 'center', 
  },
  footerText: { 
    fontSize: 14, 
  },
});

export default styles;
