import React, { useState, useRef, useContext, useEffect } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { useStore } from './store';

const TextInput = () => {

  const keyboardRef = useRef();
  const [layoutName, setLayoutName] = useState('default');
  const [currRow, setCurrRow] = useState('');

  useEffect(() => {
    (async () => {
      // await sleep(1000)
      // let kbElement = document.getElementsByClassName('react-simple-keyboard')[0]
      let keyboardRows = document.getElementsByClassName('hg-row');
      //@ts-ignore
      [...keyboardRows].forEach((row, index) => {
        row.classList.add('selectableItem')
        //@ts-ignore
        setCurrRow(`row_${index}`)
      }) 

  
    })()
  },[])

  const onKeyPress = (button: any) => {
    if (button === '{shift}')
      layoutName === 'shift'
        ? setLayoutName('default')
        : setLayoutName('shift');
    if (button === '{numbers}') setLayoutName('numbers');
    if (button === '{abc}') setLayoutName('default');
  };
  const onChange = (input: string) => useStore.setState({currentJournalMessage: input});

  const layout = {
    default: [
      'q w e r t y u i o p',
      'a s d f g h j k l',
      '{shift} z x c v b n m {bksp}',
      '{numbers} {space} {ent}',
    ],
    shift: [
      'Q W E R T Y U I O P',
      'A S D F G H J K L',
      '{shift} Z X C V B N M {bksp}',
      '{numbers} {space} {ent}',
    ],
    numbers: ['1 2 3', '4 5 6', '7 8 9', '{abc} 0 {bksp}'],
  };
  const display = {
    '{numbers}': '123',
    '{ent}': 'return',
    '{bksp}': '⌫',
    '{shift}': '⇧',
    '{space}': ' ',
    '{abc}': 'ABC',
  };


  
  useEffect(() => {
    // let items = getSelectableItems();
    // setSelectableElements(items);
    // setNumItems(items.length);
    window.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        console.log(currRow)
        // let keyboardRows = document.getElementsByClassName('hg-row');
        // console.log(keyboardRows)
        // [...keyboardRows].forEach(row => {
        //   row.classList.remove('selectableItem')
        // }) 
        // let keyboardCols = document.getElementsByClassName('hg-row');
        // console.log(keyboardRows)
        // [...keyboardRows].forEach(row => {
        //   row.classList.add('selectableItem')
        //   //@ts-ignore
        //   row.onClick = () => console.log('clicked')
        //   console.log(row)
        // }) 
    
        // revertAllItems();
        // currRefItem.current = true;
        // await sleep(1000);

        // let items = getSelectableItems();
        // setSelectableElements(items);
        // setNumItems(0);
        // setNumItems(items.length);
      }
      // if (e.key === 'Escape') {
      //   let items = getSelectableItems();
      //   currRefItem.current = false;
      //   setSelectableElements(items);
      //   setNumItems(0);
      //   setNumItems(items.length);
      // }
    });
  }, [currRow]);

  return (
    <div
      style={{
        alignSelf: 'flex-end',
      }}
    >
      <Keyboard
        keyboardRef={(r) => (keyboardRef.current = r)}
        layoutName={layoutName}
        layout={layout}
        display={display}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
    </div>
  );
};

export default TextInput;
