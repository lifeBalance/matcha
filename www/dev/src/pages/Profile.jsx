import React from 'react'

// redux
import { useSelector, useDispatch } from 'react-redux'
import {
  setAboutYou,
  setFirstName,
  setLastName,
  setEmail,
  setFirstNameHasError,
  setLastNameHasError,
  setEmailHasError,
  setFormIsValid,
  setModified
} from '../store/profileSlice'

// hooks
import useTextArea from '../hooks/useTextArea'
import useInputRedux from '../hooks/useInputRedux'

// components
import Select from '../components/UI/Select'
import FilePicker from '../components/UI/FilePicker'

//icons
import { HandRaisedIcon } from '@heroicons/react/24/outline'

// helper functions
function validateName(str) {
  // Between 2-10 characters: uppercase, lowercase and digits
  const regex = /^[A-Z\-\s]{2,32}$/
  return str.toUpperCase().trim().match(regex)
}

function validateEmail(str) {
  const regex = 
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return str.match(regex)
}

function Profile() {
  const dispatch = useDispatch()
  // Let's pull in from the slice, the pieces of state we're gonna need
  const {
    firstName,
    lastName,
    email,
    firstNameHasError,
    lastNameHasError,
    emailHasError,
    formIsValid,
    modified
  } = useSelector(slices => slices.profile)

  const { InputRedux: InputFirstName } = useInputRedux(
                    firstName,
                    val => dispatch(setFirstName(val)),
                    validateName,
                    validationFn => dispatch(setFirstNameHasError(validationFn)))

  const { InputRedux: InputLastName } = useInputRedux(
                    lastName,
                    val => dispatch(setLastName(val)),
                    validateName,
                    validationFn => dispatch(setLastNameHasError(validationFn)))

  const { InputRedux: InputEmail } = useInputRedux(
                    email,
                    val => dispatch(setEmail(val)),
                    validateEmail,
                    validationFn => dispatch(setEmailHasError(validationFn)))

  const { TextArea } = useTextArea(255, (value) => dispatch(setAboutYou(value)))

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

  React.useEffect(() => {
    dispatch(setModified(true))
  }, [firstName, lastName, email])

  React.useEffect(() => {
    dispatch(setModified(true))
    if (!firstNameHasError && !lastNameHasError && !emailHasError)
      dispatch(setFormIsValid(true))
    else
      dispatch(setFormIsValid(false))
  }, [firstNameHasError, lastNameHasError, emailHasError])

  let submitButtonContent = 'Save changes'
  if (formIsValid) 
    submitButtonContent = 'Submit'
  // else if (isSubmitting)
  //   submitButtonContent = 'Submitting...'

  return (
    <div className='py-10 px-4'>
      <h1 className='text-4xl font-bold text-center mb-8 text-white'>Profile</h1>
      <form className='flex flex-col items-center w-full'>
        {InputFirstName({
          type: 'text',
          label: 'first name',
          placeholder: 'write your first name...',
          errorContent: firstNameErrorContent
        })}

        {InputLastName({
          type: 'text',
          label: 'last name',
          placeholder: 'write your last name...',
          errorContent: lastNameErrorContent
        })}

        {InputEmail({
          type: 'email',
          label: 'email',
          placeholder: 'write your email...',
          errorContent: emailErrorContent
        })}

        <Select
          label='Gender'
          id='gender'
          options={[
            { value: '2', label: 'non-binary 🙅'},
            { value: '1', label: 'man 🍆'},
            { value: '0', label: 'woman 🍑'},
          ]}
          for='gender'
        />

        <Select
          label='Preferences'
          id='preferences'
          options={[
            { value: '2', label: 'men & women 😏'},
            { value: '1', label: 'only men 🕺'},
            { value: '0', label: 'only women 💃'},
          ]}
          for='preferences'
        />

        <TextArea
          id='about'
          label='about you'
          rows='4'
          placeholder='Tell us something about you...'
        />

        <FilePicker
          label='upload some pics'
        />

        <div className="flex flex-col md:flex-row md:justify-between space-y-10 md:space-y-0 mt-10 md:items-start">
          <button
            disabled={!formIsValid}
            className='text-gray-500 bg-gray-600 hover:enabled:bg-gray-800 active:enabled:bg-white active:enabled:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed focus:ring-transparent md:ml-4 md:mr-12 md:mb-6 min-w-[240px]'
          >{submitButtonContent}</button>

          <button
            className='bg-white text-black hover:enabled:bg-gray-800 active:enabled:bg-white active:enabled:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed focus:ring-transparent md:ml-4 md:mr-12 md:mb-6 min-w-[240px]'
          >Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default Profile