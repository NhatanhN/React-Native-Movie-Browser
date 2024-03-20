import { StyleSheet } from 'react-native';

const COLORS = {
  green: '#33cc33',
  red: '#e63900',
  gray: '#33404d',
  themeLight: {
    c1: '#2B2D42', //darkgray
    c2: '#8D99AE', //gray
    c3: '#EDF2F4', //white
    c4: '#EF233C', //red
    c5: '#D90429', //deeper red
  },
};

let theme = COLORS.themeLight;

const base = StyleSheet.create({
  container: {
    backgroundColor: theme.c3,
    borderBottomWidth: 1,
    borderBottomColor: theme.c2,
    borderTopWidth: 1,
    borderTopColor: theme.c2,
    padding: 13,
    flex: 1,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 20,
  },
  displayRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 2,
  },
  searchInput: {
    flex: 1,
  },
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 8,
  },
  pageButtons: {
    width: '40%',
    maxWidth: 220,
  },
  heading: {
    fontSize: 24,
    paddingLeft: 16,
  },
  listButtons: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 20,
    padding: 4,
    alignItems: 'center',
  },
  expand: {
    flex: 1,
  },
  deleteAccText: {
    fontSize: 18,
    textAlign: 'center',
    textDecorationLine: 'underline',
    color: 'firebrick',
    fontStyle: 'italic',
    margin: 7,
  },
  modalContainer: {
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .6)',
  },
  popup: {
    borderWidth: 5,
    backgroundColor: 'white',
    width: '80%',
    padding: 12,
    margin: 8,
  },
  popupHeader: {
    fontSize: 20,
    fontFamily: 'serif',
    margin: 20,
    textAlign: 'center',
  },
  centeredText: {
    fontSize: 22,
    alignSelf: 'center',
    margin: 12,
    marginBottom: 24,
  },
  toggle: {
    flex: 1,
  },
  toggleLabel: {
    flex: 8,
    fontSize: 20,
  },
  title: {
    fontFamily: 'serif',
    fontSize: 30,
    padding: 10,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  form: {
    borderWidth: 5,
    marginBottom: 40,
    maxWidth: 500,
    padding: 12,
    borderRadius: 15,
    backgroundColor: '#d9dcd6',
    elevation: 14,
    shadowRadius: 10,
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 10,
      height: 10,
    },
  },
  secondaryText: {
    color: '#555555',
    fontSize: 18,
    marginBottom: 16,
  },
  link: {
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  statusMsg: {
    fontSize: 18,
    fontStyle: 'italic',
    color: COLORS.red,
    padding: 3,
    paddingRight: 12,
  },
  spacer: {
    flex: 1,
  },
  userInputs: {
    marginTop: 7,
    marginBottom: 7,
  },
  p: {
    paddingBottom: 12,
    fontSize: 18,
  },
  h: {
    margin: 8,
    fontFamily: 'serif',
    fontWeight: 'bold',
    fontSize: 24,
  },
  imgContainer: {
    alignItems: 'center',
    padding: 30,
  },
  addBorderToImg: {
    borderRadius: 7,
    borderWidth: 5,
    borderColor: COLORS.themeLight.c1,
  },
  padding: {
    padding: 30
  }
});

export default base;
export { COLORS };
