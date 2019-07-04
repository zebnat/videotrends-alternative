import React, { useEffect, useState } from 'react'
import './App.scss'
import { NavBar } from './components/NavBar'
import { HomePage } from './components/pages/HomePage'

const App: React.FC = (): JSX.Element => {
  let [mainLang, setMainLang] = useState<string>('')

  useEffect(() => {
    if (window.navigator.language !== undefined) {
      const lang = window.navigator.language.toLocaleLowerCase()
      setMainLang(lang)
    }
  }, [])

  return (
    <>
      <NavBar />
      <HomePage defaultCountry={mainLang} />
    </>
  )
}

export default App
