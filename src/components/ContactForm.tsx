import React, { useState } from 'react'
import { Link } from 'react-router-dom'

interface FormDataType {
  name: string
  email: string
  selectCategory: string
  message: string
  acceptTerms: boolean | string
}

type ContactFormProps = {
  firebase: any
}

export const ContactForm: React.FC<ContactFormProps> = props => {
  let [name, setName] = useState<string>('')
  let [email, setEmail] = useState<string>('')
  let [selectCategory, setSelectCategory] = useState<string>('')
  let [message, setMessage] = useState<string>('')
  let [acceptTerms, setAcceptTerms] = useState<boolean>(false)

  let [formError, setFormError] = useState<FormDataType>({
    name: '',
    email: '',
    selectCategory: '',
    message: '',
    acceptTerms: '',
  })

  let [formSubmitted, setFormSubmitted] = useState<boolean>(false)

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.currentTarget.value)
  }
  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.currentTarget.value)
  }
  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectCategory(e.currentTarget.value)
  }
  const handleMessage = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.currentTarget.value)
  }

  const handleTerms = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAcceptTerms(e.currentTarget.checked)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      validateForm({
        name,
        email,
        selectCategory,
        message,
        acceptTerms,
      })
    ) {
      sendToFirebase()
    }
  }

  const validateForm = (formData: FormDataType) => {
    let errors: FormDataType = {
      name: '',
      email: '',
      selectCategory: '',
      message: '',
      acceptTerms: '',
    }

    let valid = true

    if (formData.name.trim().length === 0) {
      valid = false
      errors.name = 'Name is empty'
    }

    if (formData.name.trim().length > 50) {
      valid = false
      errors.name = 'Name too long'
    }

    //eslint-disable-next-line
    const validMailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    if (formData.email.trim().length === 0) {
      valid = false
      errors.email = 'Email is empty'
    } else if (!validMailReg.test(formData.email.trim().toLowerCase())) {
      valid = false
      errors.email = 'Must be a real email'
    } else if (formData.email.trim().length > 140) {
      valid = false
      errors.email = 'Email too long'
    }

    if (formData.selectCategory.trim().length === 0) {
      valid = false
      errors.selectCategory = 'You must select a category'
    } else if (
      !['opinion', 'bug', 'advertising', 'other'].includes(
        formData.selectCategory
      )
    ) {
      valid = false
      errors.selectCategory = 'Invalid category'
    }

    if (formData.message.trim().length === 0) {
      valid = false
      errors.message = 'Inquiry is empty'
    } else if (formData.message.trim().length > 500) {
      valid = false
      errors.message = 'Inquiry too long'
    }

    if (!formData.acceptTerms) {
      valid = false
      errors.acceptTerms = 'You must accept the terms'
    }

    setFormError(errors)

    return valid
  }

  const sendToFirebase = async () => {
    const firebase = await import('firebase/app')
    await import('firebase/firestore')

    if (!firebase.apps.length) {
      const jsonFirebaseCFG: string | undefined =
        process.env.REACT_APP_FIREBASECFG

      if (jsonFirebaseCFG == undefined)
        throw Error('unable to read REACT_APP_FIREBASECFG env')

      const serviceAccount = JSON.parse(jsonFirebaseCFG)
      firebase.initializeApp(serviceAccount)
    }

    const fstore = firebase.firestore()

    let now = firebase.firestore.Timestamp.fromDate(new Date())

    fstore
      .collection('contacts')
      .add({
        name: name,
        email: email,
        category: selectCategory,
        message: message,
        timestamp: now.toDate(),
      })
      .then(function(docRef: any) {
        setFormSubmitted(true)
      })
      .catch(function(error: any) {
        // @todo firebase error! log somewhere else
        setFormSubmitted(true)
      })
  }

  const showErrors = () => {
    let errors = getErrors()

    if (errors.length > 0) {
      return (
        <section className="section is-small">
          <div className="content">
            <p>Errors:</p>
            <ol>{errors}</ol>
          </div>
        </section>
      )
    }

    return null
  }
  const getErrors = () => {
    let error = []
    if (formError.name.length > 0) error.push(formError.name)
    if (formError.email.length > 0) error.push(formError.email)
    if (formError.selectCategory.length > 0)
      error.push(formError.selectCategory)

    if (formError.message.length > 0) error.push(formError.message)
    if (
      typeof formError.acceptTerms === 'string' &&
      formError.acceptTerms.length > 0
    ) {
      error.push(formError.acceptTerms)
    }

    return error.map((e, i) => <li key={i}>{e}</li>)
  }

  return (
    <>
      <section className="section column is-8 is-offset-2">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label className="label">Name</label>
            <input
              type="text"
              className={
                'input ' + (formError.name.length > 0 ? 'is-danger' : '')
              }
              value={name}
              placeholder="Your name"
              maxLength={50}
              onChange={handleName}
            />
          </div>
          <div className="field">
            <label className="label">Email</label>
            <input
              type="email"
              className={
                'input ' + (formError.email.length > 0 ? 'is-danger' : '')
              }
              value={email}
              placeholder="Your email"
              maxLength={140}
              onChange={handleEmail}
            />
          </div>
          <div className="field">
            <label className="label">Category</label>
            <div
              className={
                'select is-medium ' +
                (formError.selectCategory.length > 0 ? 'is-danger' : '')
              }
            >
              <select value={selectCategory} onChange={handleSelect}>
                <option value="" disabled>
                  Select a category
                </option>
                <option value="opinion">Opinion about Ytrends</option>
                <option value="bug">Bugs and Issues</option>
                <option value="advertising">Advertising / Business</option>
                <option value="other">Other topics</option>
              </select>
            </div>
          </div>
          <div className="field">
            <label className="label">Inquire</label>
            <div className="control">
              <textarea
                value={message}
                className={
                  'textarea ' +
                  (formError.message.length > 0 ? 'is-danger' : '')
                }
                placeholder="Your message goes here"
                maxLength={500}
                onChange={handleMessage}
              />
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={handleTerms}
                  className={
                    '' +
                    (typeof formError.acceptTerms == 'string'
                      ? formError.acceptTerms.length > 0
                        ? 'is-danger'
                        : ''
                      : '')
                  }
                />
                I agree to the terms and conditions
              </label>
              <p>
                <Link to="/terms">Terms and conditions</Link>
              </p>
            </div>
          </div>
          <button
            type="submit"
            className="button"
            disabled={formSubmitted ? true : false}
          >
            Submit
          </button>
          {formSubmitted ? (
            <p> The message has been sent successfully :)</p>
          ) : null}
        </form>
        {showErrors()}
      </section>
    </>
  )
}
