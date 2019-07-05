import React, { useState } from 'react'
import logo from '../img/ytrends-logo.png'
import { Link } from 'react-router-dom'

export const NavBar = () => {
  let [nav, setNav] = useState(false)

  const toggleMenu = () => {
    setNav(!nav)
  }

  const navigatedTo = () => {
    setNav(false)
  }

  return (
    <nav
      className="navbar is-fixed-top is-dark"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <Link className="navbar-item" to={'/'}>
          <img src={logo} alt="Ytrends" />
        </Link>

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
          <Link className="navbar-item" to={'/'} onClick={navigatedTo}>
            Home
          </Link>
          <Link className="navbar-item" to={'/about'} onClick={navigatedTo}>
            What's this?
          </Link>
          <Link className="navbar-item" to={'/contact'} onClick={navigatedTo}>
            Contact
          </Link>
        </div>
      </div>
    </nav>
  )
}
