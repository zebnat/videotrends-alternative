import React, { useEffect, useState } from 'react'
import './App.scss'
import { NavBar } from './components/NavBar'
import { HomePage } from './components/pages/HomePage'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { AboutPage } from './components/pages/AboutPage'
import { ContactPage } from './components/pages/ContactPage'
import { CookieBanner } from '@palmabit/react-cookie-law'
import { PrivacyPage } from './components/pages/PrivacyPage'
import { TermsPage } from './components/pages/TermsPage'
import { Footer } from './components/Footer'

const App: React.FC = (): JSX.Element => {
  let [mainLang, setMainLang] = useState<string>('')
  let [allowCookies, setAllowCookies] = useState<boolean>(false)
  let [allowAnalytics, setAllowAnalytics] = useState<boolean>(false)
  let [analyticsInitialized, setAnalyticsInitialized] = useState<boolean>(false)

  const setAnalits = (v: boolean) => {
    setAnalyticsInitialized(v)
  }

  useEffect(() => {
    if (window.navigator.language !== undefined) {
      const lang = window.navigator.language.toLocaleLowerCase()
      setMainLang(lang)
    }
  }, [])

  const handleAnalytics = () => {
    if (!allowAnalytics) {
      setAllowAnalytics(true)
      import('autotrack/lib/plugins/url-change-tracker')
        .then(() => {
          if (!analyticsInitialized) {
            window.ga('create', 'UA-143424625-1', 'auto')
            window.ga('require', 'urlChangeTracker')
            window.ga('send', 'pageview')
            setAnalyticsInitialized(true)
          }
        })
        .catch(e => {
          setAnalyticsInitialized(false)
        })
    }
  }

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
          <Route exact path="/privacy" component={PrivacyPage} />
          <Route exact path="/terms" component={TermsPage} />
        </Switch>
        <Footer />
      </Router>
      <CookieBanner
        message="We use cookies to ensure you with the best experience. By accepting you agree to our policy."
        privacyPolicyLinkText="Read Cookie Policy"
        statisticsOptionText="Analytics"
        showPreferencesOption={false}
        showMarketingOption={false}
        policyLink="/privacy"
        styles={{
          dialog: {
            position: 'fixed',
            left: 0,
            bottom: 0,
            zIndex: 10000,
            backgroundColor: '#fcfcfc',
            padding: 10,
            width: '100%',
          },
        }}
        onAccept={() => setAllowCookies(true)}
        onAcceptStatistics={handleAnalytics}
      />
    </>
  )
}

export default App
