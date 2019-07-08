import React from 'react'

type GlobalContextProps = {
  fstore: any
}
const GlobalContext: React.Context<GlobalContextProps> = React.createContext({
  fstore: undefined,
})

export const GlobalProvider = GlobalContext.Provider
export const GlobalConsumer = GlobalContext.Consumer

export default GlobalContext
