import React, { useEffect, useState } from 'react'
import './App.scss'
import { SelectCountry } from './components/SelectCountry'
import { VideoListings } from './components/VideoListings'
import { RegionList } from './config/config'
import { prepareRegionList } from './utils'

import logo from './img/ytrends-logo.png'

const regions = prepareRegionList(RegionList)

const App: React.FC = (): JSX.Element => {
  let [country, setCountry] = useState<string>('')
  let [nav, setNav] = useState(false)

  const allowedCountry = (locale: string) => {
    return regions.includes(locale)
  }

  const changeCountry = async (locale: string): Promise<void> => {
    let countryFound = allowedCountry(locale)
    if (countryFound) {
      setCountry(locale)
    }
  }

  const selectChanged = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (e.target !== null) {
      changeCountry(e.currentTarget.value)
    }
  }

  const forceScroll = () => {
    setTimeout(() => {
      window.scroll(0, window.scrollY + 1)
    }, 200)
  }

  useEffect(() => {
    forceScroll()
    if (window.navigator.language !== undefined) {
      changeCountry(window.navigator.language.toLocaleLowerCase())
    }
  }, [])

  const toggleMenu = () => {
    setNav(!nav)
  }

  return (
    <div className="App">
      <nav
        className="navbar is-fixed-top is-dark"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand">
          <a href="/" className="navbar-item">
            <img src={logo} alt="Ytrends" />
          </a>

          <a
            role="button"
            className={
              'is-secondary navbar-burger burger ' + (nav ? 'is-active' : '')
            }
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={toggleMenu}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarBasicExample"
          className={'navbar-menu' + (nav ? 'is-active' : '')}
        >
          <div className="navbar-start">
            <a className="navbar-item">Home</a>
            <a className="navbar-item">What's this?</a>
            <a className="navbar-item">Contact</a>
          </div>
        </div>
      </nav>
      <div className="section is-small has-text-centered">
        <h1 className="title is-size-2">
          Welcome to <span className="pink">Y</span>
          <span className="green">trends</span>
        </h1>
        <div className="subtitle is-size-4">
          An alternative list of trending videos <a>Learn more</a>
        </div>
      </div>
      <section className="section is-small has-text-centered">
        <SelectCountry
          onChange={selectChanged}
          regionList={RegionList}
          country={country}
        />
      </section>
      <VideoListings country={country} />
    </div>
  )
}

export default App
