import React, { useEffect, useState } from 'react'
import './App.scss'
import { NavBar } from './components/NavBar'
import { HomePage } from './components/pages/HomePage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AboutPage } from './components/pages/AboutPage'
import { ContactPage } from './components/pages/ContactPage'

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
      <Router>
        <NavBar />
        <Switch>
          <Route
            exact
            path="/"
            render={props => <HomePage {...props} defaultCountry={mainLang} />}
          />
          <Route exact path="/about" component={AboutPage} />
          <Route exact path="/contact" component={ContactPage} />
        </Switch>
      </Router>
    </>
  )
}

export default App
