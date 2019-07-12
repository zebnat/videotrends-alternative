import React from 'react'
import { Link } from 'react-router-dom'
import owner from '../../img/owner.png'
import Helmet from 'react-helmet'

export const PrivacyPage = () => {
  return (
    <>
      <Helmet>
        <title>Ytrends Privacy Information</title>
        <meta
          name="description"
          content="Please read our privacy policy and understand what data we use and what we do with it. You should care about your privacy!"
        />
      </Helmet>
      <section className="section is-small">
        <h1 className="title">Privacy Policy</h1>
        <h2 className="subtitle">What we do with your data</h2>
      </section>
      <section className="section is-small">
        <div className="content">
          <p>This website is operated by an individual, not a company.</p>
          <div className="has-text-centered">
            <img src={owner} alt="site owner" />
          </div>
          <p>
            This page is used to inform website visitors regarding our policies
            with the collection, use, and disclosure of Personal Information if
            anyone decided to use our Service, the Ytrends website.
          </p>
          <p>
            If you choose to use our Service, then you agree to the collection
            and use of information in relation with this policy. The Personal
            Information that we collect are used for providing and improving the
            Service. We will not use or share your information with anyone
            except as described in this Privacy Policy.
          </p>
          <h3>Information Collection and Use</h3>
          <p>
            We don't ask you about any personal information. We use Cookies just
            to remember your cookie settings and for analytics usage.
          </p>
          <h4>Cookies</h4>
          <p>
            <strong>Necessary</strong> Cookies are required just to remember
            your choices about cookies and other future settings.
          </p>
          <p>
            <strong>Analytics</strong> Cookies are cookies that services like
            Google Analytics sets to collect information about that pages you
            visit (inside Ytrends).
          </p>
          <p>
            Our website uses these "cookies" to collection information and to
            improve our Service. You have the option to accept these cookies,
            and know when a cookie is being sent to your computer. If you choose
            to refuse our cookies, you may not be able to use some portions of
            our Service.
          </p>
          <h3>Browser Settings</h3>
          <p>
            We use some information that your Browser might share like browser
            language settings to make it the default language while visiting the
            site
          </p>
          <h3>Links to other sites</h3>
          <p>
            Our Service may contain links to other sites. If you click on a
            third-party link, you will be directed to that site. Note that these
            external sites are not operated by us. Therefore, we strongly advise
            you to review the Privacy Policy of these websites. We have no
            control over, and assume no responsibility for the content, privacy
            policies, or practices of any third-party sites or services.
          </p>
          <h3>Children’s Privacy</h3>
          <p>
            We don't collect any personal information from anyone but also Our
            Services do not address anyone under the age of 13. We do not
            knowingly collect personal identifiable information from children
            under 13. In the case we discover that a child under 13 has provided
            us with personal information, we immediately delete this from our
            servers. If you are a parent or guardian and you are aware that your
            child has provided us with personal information, please contact us
            so that we will be able to do necessary actions.
          </p>
          <h3>Changes to This Privacy Policy</h3>
          <p>
            We may update our Privacy Policy from time to time. Thus, we advise
            you to review this page periodically for any changes. We will notify
            you of any changes by posting the new Privacy Policy on this page.
            These changes are effective immediately, after they are posted on
            this page.
          </p>
          <h3>Contact</h3>
          <p>
            If you have any questions or suggestions about our Privacy Policy,
            do not hesitate to <Link to="/contact"> contact us</Link>.
          </p>
          <p>
            If you want you can also check our{' '}
            <Link to="/terms">terms of service</Link>
          </p>
        </div>
      </section>
    </>
  )
}
