import React, { createContext, useState } from 'react';

export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {
  const [inputValue, setInputValue] = useState('');
  const [isInputValid, setIsInputValid] = useState(true);
  const [searchValue, setSearchValue] = useState('');

  return (
    <LocationContext.Provider
      value={{ inputValue, setInputValue, isInputValid, setIsInputValid,searchValue,setSearchValue }}
    >
      {children}
    </LocationContext.Provider>
  );
};
