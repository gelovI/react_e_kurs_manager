import React, { createContext, useState } from "react";

export const ContainerContext = createContext();

export const ContainerProvider = ({ children }) => {
  const [containers, setContainers] = useState([]);

  return (
    <ContainerContext.Provider value={{ containers, setContainers }}>
      {children}
    </ContainerContext.Provider>
  );
};
