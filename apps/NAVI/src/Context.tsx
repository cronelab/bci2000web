import React, { useState } from 'react';

const Context = React.createContext(undefined);

const Provider = ({ children }) => {
  const [bciOperator, setBciOperator] = useState();
  const [bciSource, setBciSource] = useState();
  const [numItems, setNumItems] = useState(0);
  const [selectableElements, setSelectableElements] = useState();
  const [menuState, setMenuState] = useState('main');
  const [selectableRefs, setSelectableRefs] = useState([]);
  const [keyboardState, setKeyboardState] = useState('none');
  const [currentJournalMessage, setCurrentJournalMessage] = useState('')
  return (
    <Context.Provider
      //@ts-ignore
      value={{
        numItems,
        setNumItems,
        bciOperator,
        setBciOperator,
        selectableElements,
        setSelectableElements,
        menuState,
        setMenuState,
        bciSource,
        setBciSource,
        selectableRefs,
        setSelectableRefs,
        keyboardState,
        setKeyboardState,
        currentJournalMessage, setCurrentJournalMessage
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Provider, Context };
