import React from "react";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <h3>Our Lady, Mother of the Poor Church</h3>
          <p>Tilamola · Sanguem · Goa</p>
        </div>
        <div className="footer-links">
          <div>
            <h4>Worship</h4>
            <ul>
              <li>Mass intentions</li>
              <li>Certificates</li>
              <li>Associations</li>
            </ul>
          </div>
          <div>
            <h4>Connect</h4>
            <ul>
              <li>Parish office</li>
              <li>Coordinator</li>
              <li>Contact us</li>
            </ul>
          </div>
        </div>
        <div className="footer-copy">
          <small>© {new Date().getFullYear()} Our Lady, Mother of the Poor Church. All rights reserved.</small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

