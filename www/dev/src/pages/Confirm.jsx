import React from 'react'
import axios from 'axios'

import { useNavigate, useParams } from 'react-router-dom'

// components
import Input from '../components/UI/Input'
import Modal from '../components/UI/Modal'

//icons
import {
  EnvelopeIcon,
  HandThumbUpIcon,
  HandRaisedIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

// hooks
import useInput from '../hooks/useInput'
import useConfirm from '../hooks/useConfirm'

// helper functions
function validateEmail(str) {
  const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return str.match(regex)
}

/**
 * REACT COMPONENT
 */
function Confirm(props) {
  // To control if the user is confirming her account
  const [confirmAccount, setConfirmAccount] = React.useState(false)

  // Confirm Account (Email Link)
  const {
    isConfirming,
    confirmError,
    confirm } = useConfirm()

  // Request Confirmation Email
  const {
    isConfirming: isRequestingEmail,
    confirmError: emailRequestError,
    confirm: requestEmail } = useConfirm()
  const { useremail, usertoken } = useParams()
  const navigate = useNavigate()

  // Modal
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  function closeModalHandler() {
    setModalIsOpen(false)
    navigate('/', { replace: true })
  }

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

    requestEmail('/api/confirm', 'post', { email })
    console.log(`Submitted: ${email}`)

    resetEmailInput()
  }

  // Extract the params from a properly formatted query string
  // const queryString = window.location.search
  // const urlParams = new URLSearchParams(queryString)
  // const useremail = urlParams.get('email') // use the .has('email') first!

  React.useEffect(() => {
    if (useremail && usertoken) {
      setConfirmAccount(true)
      // console.log(useremail, usertoken);
      confirm('/api/confirm', 'put', {
        email: useremail,
        token: usertoken
      })
    }
  }, [])

  React.useEffect(() => {
    if (confirmAccount && !isConfirming)
      setModalIsOpen(true)
  }, [confirmAccount, isConfirming])

  // CONFIRMING ACCOUNT MODE
  if (confirmAccount) {
    let modalContent

    if (!isConfirming && confirmError) {
      modalContent = (<>
        <HandRaisedIcon className='inline w-6 text-red-500' />
        Sorry, {confirmError.error}
      </>)
    } else if (!isConfirming && !confirmError) {
      modalContent = (<>
        <HandThumbUpIcon className='inline w-5 text-green-500' />
        Your account has been confirmed. You can now login.
      </>)
    }

    return (
      <div className="max-w-3xl mx-auto">
      {isConfirming &&
        <ArrowPathIcon className='my-20 w-40 animate-spin'/>}

      {!isConfirming && modalIsOpen &&
        <Modal closeModal={closeModalHandler}>
          <p>{modalContent}</p>
        </Modal>}
      </div>
    )
  }

  // REQUESTING EMAIL MODE
  let emailErrorContent 
  if (emailHasError) {
    emailErrorContent = (<>
      <HandRaisedIcon className='w-5 inline text-orange-300 -mt-1 mr-2' />
      Must be a valid email address
    </>)
  }

  let modalContent
  if (!isRequestingEmail && emailRequestError) {
    modalContent = (<>
      <HandRaisedIcon className='inline w-6 text-red-500 -mt-1 mr-2' />
      Sorry, {emailRequestError.error}
    </>)
  } else if (!isRequestingEmail && !emailRequestError) {
    modalContent = (<>
      <HandThumbUpIcon className='inline w-5 text-green-500 -mt-1 mr-2' />
      Your confirmation email is on the way.
    </>)
  }

  let buttonContent
  if (formIsValid && !isRequestingEmail)
      buttonContent = 'Submit'
  else if (!formIsValid)
    buttonContent = 'Enter a valid email'
  else if (formIsValid && isRequestingEmail)
    buttonContent = 'Requesting...'

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className='text-white text-3xl text-center font-bold my-6 pb-4 capitalize'>confirmation email</h1>

      <form onSubmit={submitHandler} >
        <Input 
          label='email'
          type='text'
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          errorContent={emailErrorContent}
          placeholder='test@test.com'
        ><EnvelopeIcon className='w-6 pb-1 ml-2 inline' /> email</Input>

        <div className="flex justify-center mt-6 md:ml-4">
          <button
            disabled={!formIsValid}
            className='text-white bg-black hover:bg-gray-800 active:bg-white active:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed hover:disabled:bg-black focus:ring-transparent md:min-w-[260px]'
          >{buttonContent}</button>
        </div>
      </form>
    </div>
  )
}

export default Confirm
