import React from 'react'
import { Link } from 'react-router-dom'
import owner from '../../img/owner.png'
import Helmet from 'react-helmet'

export const TermsPage = () => {
  return (
    <>
      <Helmet>
        <title>Ytrends Terms and Conditions</title>
        <meta
          name="description"
          content="Legal Terms and conditions you whould read in order to comply with our rules and regulations."
        />
      </Helmet>
      <section className="section is-small">
        <h1 className="title">Ytrends.net Terms and Conditions</h1>
        <h2 className="subtitle">Rules and regulations</h2>
      </section>
      <section className="section is-small">
        <div className="content">
          <p>This website is operated by an individual, not a company.</p>
          <div className="has-text-centered">
            <img src={owner} alt="site owner" />
          </div>
          <p>
            By accessing this website we assume you accept these terms and
            conditions. Do not continue to use Ytrends if you do not agree to
            take all of the terms and conditions stated on this page.
          </p>
          <p>
            The following terminology applies to these Terms and Conditions,
            Privacy Statement and Disclaimer Notice and all Agreements:
            "Client", "You" and "Your" refers to you, the person log on this
            website and compliant to the Company’s terms and conditions. "The
            Company", "Ourselves", "We", "Our" and "Us", refers to our Company.
            "Party", "Parties", or "Us", refers to both the Client and
            ourselves. All terms refer to the offer, acceptance and
            consideration of payment necessary to undertake the process of our
            assistance to the Client in the most appropriate manner for the
            express purpose of meeting the Client’s needs in respect of
            provision of the Company’s stated services, in accordance with and
            subject to, prevailing law of Spain. Any use of the above
            terminology or other words in the singular, plural, capitalization
            and/or he/she or they, are taken as interchangeable and therefore as
            referring to same.
          </p>
          <h3>Disclaimer</h3>
          <p>
            To the maximum extent permitted by applicable law, we exclude all
            representations, warranties and conditions relating to our website
            and the use of this website. Nothing in this disclaimer will:
          </p>
          <ul>
            <li>
              limit or exclude our or your liability for death or personal
              injury
            </li>
            <li>
              limit or exclude our or your liability for fraud or fraudulent
              misrepresentation
            </li>
            <li>
              limit any of our or your liabilities in any way that is not
              permitted under applicable law
            </li>
            <li>
              exclude any of our or your liabilities that may not be excluded
              under applicable law
            </li>
          </ul>
          <p>
            The limitations and prohibitions of liability set in this Section
            and elsewhere in this disclaimer: (a) are subject to the preceding
            paragraph; and (b) govern all liabilities arising under the
            disclaimer, including liabilities arising in contract, in tort and
            for breach of statutory duty.
          </p>
          <p>
            This website has been created for recreational and learning reasons,
            therefore it is completely free. Despite being free, the site could
            use advertising and sponsors at any time.
          </p>
          <p>
            As long as the website and the information and services on the
            website are provided free of charge, we will not be liable for any
            loss, malfunction, errors, bugs or damage of any nature.
          </p>
          <h3>Cookies</h3>
          <p>
            We employ the use of cookies. By accessing Ytrends, you agreed to
            use cookies in agreement with the{' '}
            <Link to="/privacy">Privacy Policy</Link>.
          </p>
          <p>
            Most interactive websites use cookies to let us retrieve the user’s
            details for each visit. Cookies are used by our website to enable
            the functionality of certain areas to make it easier for people
            visiting our website. Some of our affiliate/advertising partners may
            also use cookies.
          </p>
          <h3>License</h3>
          <p>
            Unless otherwise stated, We own the intellectual property rights for
            all material on Ytrends. All intellectual property rights are
            reserved. You may access this from Ytrends for your own personal use
            subjected to restrictions set in these terms and conditions.
          </p>
          <p>You must not:</p>
          <ul>
            <li>Republish material from Ytrends</li>
            <li>Sell, rent or sub-license material from Ytrends</li>
            <li>Reproduce, duplicate or copy material from Ytrends</li>
            <li>Redistribute content from Ytrends</li>
          </ul>
          <p>
            Parts of this website offer an opportunity for users to post and
            exchange opinions and information in certain areas of the website.
            We do not filter, edit, publish or review Comments prior to their
            presence on the website. Comments do not reflect the views and our
            opinions, our agents and/or affiliates. Comments reflect the views
            and opinions of the person who post their views and opinions. To the
            extent permitted by applicable laws, We shall not be liable for the
            Comments or for any liability, damages or expenses caused and/or
            suffered as a result of any use of and/or posting of and/or
            appearance of the Comments on this website.
          </p>
          <p>
            We reserve the right to monitor all Comments and to remove any
            Comments which can be considered inappropriate, offensive or causes
            breach of these Terms and Conditions.
          </p>
          <h3>iFrames</h3>
          <p>
            Without prior approval and written permission, you may not create
            frames around our Webpages that alter in any way the visual
            presentation or appearance of our Website.
          </p>
          <h3>Your Privacy</h3>
          <p>
            Please read <Link to="/privacy">Privacy Policy</Link>.
          </p>

          <p>
            If you have any questions or suggestions about our Terms of service,
            do not hesitate to <Link to="/contact">contact</Link> with the owner
            of the website.
          </p>
        </div>
      </section>
    </>
  )
}
