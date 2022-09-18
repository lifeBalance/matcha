import React from 'react'

// components
import Input from '../components/UI/Input'

//icons
import { EnvelopeIcon, HandRaisedIcon } from '../assets/icons'

// hooks
import useInput from '../hooks/useInput'

// helper functions
function validateEmail(str) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return str.match(regex)
}

/**
 * REACT COMPONENT
 */
function ForgotPassword() {
  const {
    value: email,
    inputHasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    resetInput: resetEmailInput,
  } = useInput(validateEmail)

  let formIsValid = validateEmail(email)

  function submitHandler(e) {
    e.preventDefault()

    if (!formIsValid) return

    console.log(`Submitted: ${email}`)

    resetEmailInput()
  }

  let emailErrorContent 
  if (emailHasError)
    emailErrorContent = <><HandRaisedIcon styles='w-5' /> Must be a valid email address</>

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Password Recovery</h1>

      <form onSubmit={submitHandler} >
        <Input 
          type='text'
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          errorContent={emailErrorContent}
          placeholder='test@test.com'
        ><EnvelopeIcon styles='w-6 pb-1 ml-2' /> email</Input>

        <div className="flex flex-col md:flex-row md:justify-between space-y-4 md:space-y-0 items-center mt-6 md:ml-4">
          <button
            disabled={!formIsValid}
            className='text-white bg-black hover:bg-gray-800 active:bg-white active:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed hover:disabled:bg-black focus:ring-transparent'
          >{formIsValid ? 'Submit' : 'Enter a valid email'}</button>
        </div>
      </form>
    </div>
  )
}

export default ForgotPassword
