import React from 'react'

const Body = () => {
  return (
<div className="nav-bar-wrapper">
        <nav className="main-nav">
          <ul>
            <li>
              <Link to="/" className={isActive("/") ? "active" : ""}>
                Home
              </Link>
              <button>d</button>
            </li>
            <li>
              <Link
                to="/association"
                className={isActive("/association") ? "active" : ""}
              >
                Association
              </Link>
            </li>
            <li>
              <Link
                to="/calendar"
                className={isActive("/calendar") ? "active" : ""}
              >
                Calendar
              </Link>
            </li>
            <li>
              <Link
                to="/certificate-request"
                className={isActive("/certificate-request") ? "active" : ""}
              >
                Certificate Request
              </Link>
            </li>
            <li>
              <Link
                to="/massForm"
                className={isActive("/massForm") ? "active" : ""}
              >
                Book Mass
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={isActive("/contact") ? "active" : ""}
              >
                Contact us
              </Link>
            </li>
            <li>
              <Link
                to="/certificate-status"
                className={isActive("/certificate-status") ? "active" : ""}
              >
                Certificate Status
              </Link>
            </li>
            <li>
              <Link
                to="/status"
                className={isActive("/status") ? "active" : ""}
              >
                Mass Status
              </Link>
            </li>
          </ul>
        </nav>
      </div>
  )
}

export default Body
