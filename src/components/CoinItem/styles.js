import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
    title: {
      color: 'white',
      fontSize: 15,
      fontWeight: 'bold',
      marginBottom: 3,
    },
    text: {
      color: 'white',
      marginRight: 5,
    },
    coinContainer: {
      flexDirection: 'row',
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: 'grey',
      padding: 15,
      justifyContent: 'space-between',
    },
    rank: {
      fontWeight: 'bold',
      color: 'white',
    },
    rankContainer: {
      backgroundColor: '#585858',
      paddingHorizontal: 5,
      borderRadius: 5,
      marginRight: 5,
    }
});

export default styles