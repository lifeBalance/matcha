import React from 'react'

// hooks
import useInput from '../hooks/useInput'

// components
import Input from '../components/UI/Input'
import Select from '../components/UI/Select'
import Textarea from '../components/UI/Textarea'
import FilePicker from '../components/UI/FilePicker'

//icons
import { HandRaisedIcon } from '@heroicons/react/24/outline'

// helper functions
function validateName(str) {
  // Between 2-10 characters: uppercase, lowercase and digits
  const regex = /^[A-Z\-\s]{2,20}$/
  return str.toUpperCase().trim().match(regex)
}

function validateEmail(str) {
  const regex = 
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return str.match(regex)
}

function Profile() {
  const {
    value: firstName,
    inputHasError: firstNameHasError,
    inputChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(validateName)

  const {
    value: lastName,
    inputHasError: lastNameHasError,
    inputChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput(validateName)

  const {
    value: email,
    inputHasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(validateEmail)

  let firstNameErrorContent
  if (firstNameHasError)
  firstNameErrorContent = (<>
    <HandRaisedIcon className='inline w-5 -mt-1 text-orange-200' />
    Between 2 and 20 letters (Can use - and space).
  </>)
  let lastNameErrorContent
  if (lastNameHasError)
  lastNameErrorContent = (<>
    <HandRaisedIcon className='inline w-5 -mt-1 text-orange-200' />
    Between 2 and 20 letters (Can use - and space).
  </>)

  let emailErrorContent 
  if (email.length > 0 && emailHasError) {
    emailErrorContent = (<>
      <HandRaisedIcon className='inline w-5 -mt-1 text-orange-200' /> Must be a valid email address
    </>)
  }

  // let submitButtonContent = 'Save changes'
  // if (formIsValid) 
  //   submitButtonContent = 'Submit'
  // else if (isSubmitting)
  //   submitButtonContent = 'Submitting...'

  return (
    <div className='py-10 px-4'>
      <h1 className='text-4xl font-bold text-center mb-8 text-white'>Profile</h1>
      <form className='flex flex-col items-center w-full'>
        <Input 
          type='text'
          label='first name'
          value={firstName}
          onChange={firstNameChangeHandler}
          onBlur={firstNameBlurHandler}
          errorContent={firstNameErrorContent}
        />

        <Input 
          type='text'
          label='last name'
          value={lastName}
          onChange={lastNameChangeHandler}
          onBlur={lastNameBlurHandler}
          errorContent={lastNameErrorContent}
        />

        <Input 
          type='email'
          label='email'
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          errorContent={emailErrorContent}
          />

        <Select
          label='Gender'
          id='gender'
          options={[
            { value: '1', label: 'man 🍆'},
            { value: '0', label: 'woman 🍑'},
          ]}
          for='gender'
        />

        <Select
          label='Preferences'
          id='preferences'
          options={[
            { value: '2', label: 'man & woman 😏'},
            { value: '1', label: 'only man 🕺'},
            { value: '0', label: 'only woman 💃'},
          ]}
          for='preferences'
        />

        <Textarea
          label='about you'
          placeholder='Tell us something about you...'
          rows='4'
          maxLength='255'
        />

        <FilePicker
          label='upload some pics'
        />

        <div className="flex flex-col md:flex-row md:justify-between space-y-10 md:space-y-0 mt-10 md:items-start">
          <button
            // disabled={!formIsValid}
            className='text-white bg-black hover:enabled:bg-gray-800 active:enabled:bg-white active:enabled:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed focus:ring-transparent md:ml-4 md:mr-12 md:mb-6 min-w-[240px]'
          >Save changes</button>

          <button
            className='bg-white text-black hover:enabled:bg-gray-800 active:enabled:bg-white active:enabled:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed focus:ring-transparent md:ml-4 md:mr-12 md:mb-6 min-w-[240px]'
          >Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default Profile