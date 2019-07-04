import React, { useState } from 'react'
import logo from '../img/ytrends-logo.png'

export const NavBar = () => {
  let [nav, setNav] = useState(false)

  const toggleMenu = () => {
    setNav(!nav)
  }

  return (
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
  )
}
