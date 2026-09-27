import logo from '../assets/primefix-solutions-logo-dark-bg.svg'


export default function Footer() {
  return (
    <footer className="site">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <img
  src={logo}
  alt=""
  className="primefix-footer-logo"
  width="42"
  height="42"
/>

            <div>
              <strong>PrimeFix Solutions</strong>
              <p>Carpentry, roofing, repairs, painting, and grounds work — every trade, one team.</p>
            </div>
          </div>
          <div className="footer-links">
            <div>
              <h5>Site</h5>
              <ul>
                <li><a href="#services">Services</a></li>
                <li><a href="#portfolio">Portfolio</a></li>
                <li><a href="#process">Process</a></li>
                <li><a href="#reviews">Reviews</a></li>
                <li><a href="#contact">Contact</a></li>
              </ul>
            </div>
            <div>
              <h5>Contact</h5>
              <ul>
                <li><a href="tel:5550102000">(555) 010-2000</a></li>
                <li><a href="mailto:hello@primefixsolutions.com">hello@primefixsolutions.com</a></li>
                <li><span>Mon–Sat, 7am–6pm</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PrimeFix Solutions. Licensed &amp; insured — license # on request.</span>
          <span>Every trade. One team.</span>
        </div>
      </div>
    </footer>
  )
}
