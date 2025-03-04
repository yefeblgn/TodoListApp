import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    paddingHorizontal: 16, 
    fontWeight: '600',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 120,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabIcon: { 
    width: 30, 
    height: 30, 
    tintColor: '#fff' 
  },
  refreshIndicator: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  refreshText: {
    fontSize: 16,
    color: 'black',
  },
});

export default styles;
