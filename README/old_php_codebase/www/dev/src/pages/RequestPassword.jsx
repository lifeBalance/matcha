import React from 'react'

import { useNavigate } from 'react-router-dom'

// components
import Input from '../components/UI/Input'
import Modal from '../components/UI/Modal'

//icons
import {
  HandThumbUpIcon,
  HandRaisedIcon
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
function RequestPassword(props) {
  const {
    value: email,
    inputHasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    resetInput: resetEmailInput,
  } = useInput(validateEmail)

  // Modal
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  const navigate = useNavigate()
  let formIsValid = validateEmail(email)

  // Request Password Reset
  const {
    isConfirming: isRequesting,
    confirmError: requestError,
    confirm: requestPasswordReset
  } = useConfirm()

  function submitHandler(e) {
    e.preventDefault()

    if (!formIsValid) return

    // console.log(`Submitted: ${email}`)
    requestPasswordReset('/api/reset', 'post', { email }, () => setModalIsOpen(true))
    if (!requestError)
      resetEmailInput()
  }

  let emailErrorContent 
  if (emailHasError)
    emailErrorContent = (<>
      <HandRaisedIcon className='inline w-6' /> Must be a valid email address
    </>)

  let buttonContent
  if (formIsValid && !isRequesting)
      buttonContent = 'Submit'
  else if (!formIsValid)
    buttonContent = 'Enter a valid email'
  else if (formIsValid && isRequesting)
    buttonContent = 'Requesting...'

  let modalContent
  if (!isRequesting && requestError) {
    modalContent = (<>
      <HandRaisedIcon className='inline w-6 text-red-500 -mt-1 mr-2' />
      Sorry, {requestError.error}
    </>)
  } else if (!isRequesting && !requestError) {
    modalContent = (<>
      <HandThumbUpIcon className='inline w-5 text-green-500 -mt-1 mr-2' />
      Your Password Reset email is on the way.
    </>)
  }

  function closeModalHandler() {
    setModalIsOpen(false)
    if (!requestError)
      navigate('/', { replace: true })
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      {modalIsOpen &&
        <Modal closeModal={closeModalHandler}>
          <p>{modalContent}</p>
        </Modal>
      }

      <h1 className='text-white text-3xl text-center font-bold my-6 pb-4 capitalize'>Request Password Reset</h1>

      <form onSubmit={submitHandler} >
        <Input 
          label='email'
          type='text'
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          errorContent={emailErrorContent}
          placeholder='test@test.com'
        />

        <div className="flex justify-center mt-6 md:ml-4">
          <button
            disabled={!formIsValid}
            className='text-white bg-black hover:bg-gray-800 active:bg-white active:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed hover:disabled:bg-black focus:ring-transparent md:min-w-[260px]'
          >{formIsValid ? 'Submit' : 'Enter a valid email'}</button>
        </div>
      </form>
    </div>
  )
}

export default RequestPassword
