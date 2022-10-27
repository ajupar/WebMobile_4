import * as React from 'react';
import { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Button, TouchableWithoutFeedback, Keyboard, ActivityIndicator, TextInput, ScrollView, StyleSheet, Alert } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// import { baseProps } from 'react-native-gesture-handler/lib/typescript/handlers/gestureHandlers';
import AsyncStorage from '@react-native-async-storage/async-storage'

// redux-kirjasto: staten hallinta globaaleina rakenteina. hyödyllinen esim. isommissa projekteissa.
//                  tällöin state ei ole aina jonkin komponentin omistuksessa

// Ohjelmaan otettu mallia täältä:
// React Native Tutorial #9 - Todo App
// https://www.youtube.com/watch?v=uLHFPt9B2Os

export default function App() {
  // kovakoodattu state ennen tehtävää 4.8
  // const [notes, setNewNotes] = useState([
  //   { name: 'Pese hampaat', id: 1 },
  //   { name: 'Kampaa hiukset', id: 2 },
  //   { name: 'Solmi kengännauhat', id: 3 },
  //   { name: 'Tilaa pizzaa', id: 4 },
  //   { name: 'Osta ruuvimeisseli', id: 5 },
  //   { name: 'Kastele kasvit', id: 6 }
  // ]);

  const [notes, setNewNotes] = useState([])

  const [currentNote, setCurrentNote] = useState('');

  const [currentId, setCurrentId] = useState(7);


  // TIEDON TALLENNUS- JA LUKUMETODIT (AsyncStorage)
  // https://react-native-async-storage.github.io/async-storage/docs/usage

  // const storeData = async (value) => {
  //   try {
  //     const jsonValue = JSON.stringify(value)
  //     await AsyncStorage.setItem('@storage_Key', jsonValue)
  //   } catch (e) {
  //     // saving error
  //     console.log('storeData error')
  //   }
  // }

  // const getData = async () => {
  //   try {
  //     const jsonValue = await AsyncStorage.getItem('@storage_Key')
  //     return jsonValue != null ? JSON.parse(jsonValue) : null;
  //   } catch (e) {
  //     // error reading value
  //     console.log('getData error')
  //   }
  // }

  // https://react-native-async-storage.github.io/async-storage/docs/api/
  // const getAllKeys = async () => {
  //   let keys = []
  //   try {
  //     keys = await AsyncStorage.getAllKeys()
  //   } catch (e) {
  //     // read key error
  //   }

  //   console.log(keys)
  //   return (keys)

  //   // example console.log result:
  //   // ['@MyApp_user', '@MyApp_key']
  // }

  // NAVIGOINTINÄKYMIEN (SCREEN) MÄÄRITTELY ALKAA
  // https://reactnavigation.org/docs/params/

  function NotesMainScreen({ navigation }) {
    return (
      <View style={styles.background}>

        <Text style={styles.notesHeader}>Muistiinpanot</Text>

        <FlatList
          style={styles.flatListStyle}
          keyExtractor={(item) => item.id}
          numColumns={2}
          data={notes}
          renderItem={({ item }) => (
            <TouchableOpacity>
              <NoteComponent item={item} />
            </TouchableOpacity>
          )} />

        <AddNoteButtonMainScreenComponent navigation={navigation} />

      </View>
    )
  }

  // https://reactnavigation.org/docs/params/
  function AddNoteScreen({ route, navigation }) {

    return (
      <View style={styles.background}>

        <AddNoteInputComponent />
        <AddNoteButtonComponent />
        <ReturnButtonComponent navigation={navigation} />

      </View>

    )
  }

  // NAVIGOINTINÄKYMIEN MÄÄRITTELY PÄÄTTYY

  // yksittäinen muistiinpano omana komponenttina
  const NoteComponent = ({ item }) => {
    return (
      <View>
        <Text style={styles.noteStyle}> {item.name}</Text>
      </View>
    )
  }

  // syötekenttä omana komponenttina
  const AddNoteInputComponent = () => {
    return (
      <View>
        <TextInput
          value={currentNote}
          style={styles.inputStyle}
          placeholder='Uusi muistiinpano...'
          autoFocus={true}
          onChangeText={(val) => { changeTextHandler(val) }}
        />
      </View>
    )
  }

  // määritellään nappi omassa komponentissa, koska Reactin Buttonin tyylittely
  // on niin rajoittunutta. Tyyli-prop annetaan tässä View-elementille, joka
  // ottaa Buttonin sisäänsä. navigation otettava propsina sisään
  // color pitää TÄSTÄKIN HUOLIMATTA(!!!) määrittää erikseen proppina
  // taustalla erot eri alustoissa (iOS ja Android), joille React Native käännetään
  const AddNoteButtonMainScreenComponent = ({ navigation }) => {
    return (
      <View style={styles.buttonStyle}>
        <Button title='Lisää muistiinpano' color='coral'
          onPress={() => {
            navigation.navigate('AddNoteScreen', {})
          }} />
      </View>
    )
  }

  // määritellään nappi omassa komponentissa, koska Reactin Buttonin tyylittely
  // on niin rajoittunutta. Tyyli-prop annetaan tässä View-elementille, joka
  // ottaa Buttonin sisäänsä. navigation otettava propsina sisään
  // color pitää määrittää erikseen proppina
  // taustalla erot eri alustoissa (iOS ja Android), joille React Native käännetään
  const ReturnButtonComponent = ({ navigation }) => {
    return (
      <View style={styles.buttonStyle}>
        <Button title='Takaisin' color='coral' onPress={() => { navigation.navigate('NotesMainScreen') }}
        />
      </View>
    )
  }

  // lisäys-alinäkymän lisäysnappi omana komponenttina
  // määritellään nappi omassa komponentissa, koska Reactin Buttonin tyylittely
  // on niin rajoittunutta. Tyyli-prop annetaan tässä View-elementille, joka
  // ottaa Buttonin sisäänsä.
  // color pitää määrittää erikseen proppina
  // taustalla erot eri alustoissa (iOS ja Android), joille React Native käännetään
  const AddNoteButtonComponent = () => {
    return (
      <TouchableOpacity style={styles.buttonStyle} >
        <Button title='Lisää' color='coral' onPress={() => { addNoteButtonHandler(currentNote) }}
        />
      </TouchableOpacity>
    )
  }

  // reagoi muutoksiin syötekentässä
  const changeTextHandler = (val) => {
    setCurrentNote(val);
    console.log(val)
  }

  // muistiinpanon lisäämisen tapahtumankäsittelijä
  const addNoteButtonHandler = (text) => {
    console.log('currentNote value ', currentNote)

    if (notes.some((temp_note) => temp_note.name === currentNote)) {

      console.log('alert-lohko')
      Alert.alert('HÄLYTYS!', 'Ei saa lisätä olemassaolevaa muistiinpanoa!')

    } else {

      let newNote = { name: currentNote, id: currentId }

      AsyncStorage.setItem(currentId.toString(), JSON.stringify(newNote))  // muista tehdä stringify/toString
        .then(() => setNewNotes(notes.concat(newNote)))

      // setNewNotes((notes) => {
      //   return [
      //     {
      //       name: currentNote,
      //       id: currentId
      //     },
      //     ...notes
      //   ]
      // })
      // storeData(currentNote)   // teht 4.8 - tallennus AsyncStorageen


      setCurrentNote('')  // nollataan nykyinen muistiinpano, kun se on lisätty listaan
      console.log('new note id ', currentId)
      setCurrentId(currentId + 1)
    }
  }


  // let current_id = 7

  // iteroidaan läpi muistiinpanojen sisältö: notes.map
  // toinen tapa on FlatList

  // lisäys View-näkymien ympärille?
  //   <TouchableWithoutFeedback onPress={() => {
  //     Keyboard.dismiss();
  //     console.log('poistutaan näppäimistöstä');
  //   }}>

  // </TouchableWithoutFeedback >

  // teht 4.8
  componentDidMount = () => {
    console.log('did mount')

    AsyncStorage.getAllKeys()
      .then((keyList) => AsyncStorage.multiGet(keyList))  // haetaan avaimia vastaavien avain-arvoparien lista. arvo indeksissä 1
      .then((valueList) => setNewNotes(valueList.map((value) => JSON.parse(value[1]))))  // asetetaan stateen. muista parsettaa

    // notes.map((temp_note) => {
    //   storeData(temp_note)
    // })

    // storeData(notes)
  }

  // teht 4.8
  // didUpdate ajaa aina kun, komponentin state muuttuu (eli komponentti vaatii päivitystä)
  // loputtoman luupin riski: jos statea muutetaan didUpdatessa, niin state muuttuu ja didUpdate kutsuu itseään loputtomasti
  // esim ohittava if-lause luupin välttämiseen
  // tällä ratkaisulla ei tarvita tähän sen kummempaa sisältöä mutta yleensä tässä kyllä ajetaan koodia
  componentDidUpdate = () => {
    console.log('did update')
    // storeData(notes)
    // getData(notes)
  }

  const Stack = createStackNavigator();

  return (
    <NavigationContainer style={styles.background}>
      <Stack.Navigator screenOptions={{
        headerShown: false  // piilotetaan navigaattorin otsikko, näyttää rumalta
      }}>
        <Stack.Screen name="NotesMainScreen" component={NotesMainScreen} />
        <Stack.Screen name="AddNoteScreen" component={AddNoteScreen} />
      </Stack.Navigator>
    </NavigationContainer>

  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    paddingTop: 40,
    paddingHorizontal: 20,
    backgroundColor: 'turquoise',
  },
  notesHeader: {
    fontWeight: 'bold',
    fontSize: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputStyle: {
    marginTop: 20,
    marginBottom: 20,
    padding: 10,
    borderWidth: 2,
    backgroundColor: 'orange',
  },
  noteStyle: {
    flex: 1,
    marginTop: 5,
    marginLeft: 5,
    padding: 10,
    backgroundColor: 'lightblue',
    fontSize: 14,
  },
  buttonStyle: {
    marginBottom: 15,
    color: 'coral',
  },
  flatListStyle: {
    flex: 1,
  }

})