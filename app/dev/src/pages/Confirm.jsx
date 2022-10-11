import React from 'react'

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

// Validators
import { validateEmail } from '../utils/validators'

/*******************
 * REACT COMPONENT *
 *******************/
function Confirm(props) {
  // Extract parameters from the URL (React Router thing, not a Query string)
  const { useremail, usertoken } = useParams()
  
  // To control the MODE of the page:
  // 1. User is clicking on the linke to confirm her account
  // 2. Or filling the Email Form to request an Account confirmation email.
  const [confirmAccount, setConfirmAccount] = React.useState(false)
  
  // If there were an email and a token in the URL, set the mode to confirm.
  React.useEffect(() => {
    if (useremail && usertoken) {
      setConfirmAccount(true)
      console.log(useremail, usertoken)  // testing
      confirm('/api/confirm', 'put', {
        email: useremail,
        token: usertoken
      }, openModalHandler)
    }
  }, [])

  // Modal
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [modalContent, setModalContent] = React.useState(null)

  const navigate = useNavigate()
  function closeModalHandler() {
    setModalIsOpen(false)
    navigate('/', { replace: true })
  }

  function openModalHandler(data) {
    setModalContent(data)
    setModalIsOpen(true)
  }

  // Invoke Hook for confirming Account when clicking on the Email Link.
  const {
    isConfirming,
    confirmError,
    confirm
  } = useConfirm()

  // Invoke hook for requesting Confirmation Email.
  const {
    isConfirming: isRequestingEmail,
    confirmError: emailRequestError,
    confirm: requestEmail
  } = useConfirm()

  // Hook for controlling the input field.
  const {
    value: email,
    inputHasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler
  } = useInput(validateEmail)

  let formIsValid = validateEmail(email)

  function submitHandler(e) {
    e.preventDefault()

    if (!formIsValid) return

    requestEmail('/api/confirm', 'post', { email }, openModalHandler)
  }

  /* The standard way in JS of extracting the parameters from a properly
  formatted query string using the browser API, would be:

    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    const useremail = urlParams.get('email') // use the .has('email') first!
  */

  /**
   *  CONFIRMING ACCOUNT MODE
   */
  if (confirmAccount) {
    let modalContentWrapper

    if (!isConfirming && confirmError) {
      modalContentWrapper = (<>
        <HandRaisedIcon className='inline w-6 text-red-500 -mt-1' />
        Sorry, {modalContent}
      </>)
    } else if (!isConfirming && !confirmError) {
      modalContentWrapper = (<>
        <HandThumbUpIcon className='inline w-5 text-green-500 -mt-1' />
        Congratulations, {modalContent}.
      </>)
    }

    // we RETURN here. Whatever's below, we don't care.
    return (
      <div className="max-w-3xl mx-auto">
      {isConfirming &&
        <ArrowPathIcon className='my-20 w-40 animate-spin'/>}

      {!isConfirming && modalIsOpen &&
        (<Modal closeModal={closeModalHandler}>
          {modalContentWrapper}
        </Modal>)}
      </div>
    )
  } // end of IF

  /**
   *  REQUESTING EMAIL MODE (note we're outside the IF)
   */
  let emailErrorContent 
  if (emailHasError) {
    emailErrorContent = (<>
      <HandRaisedIcon className='w-5 inline text-orange-300 -mt-1 mr-2' />
      Must be a valid email address
    </>)
  }

  let modalContentWrapper
  if (!isRequestingEmail && emailRequestError) {
    modalContentWrapper = (<>
      <HandRaisedIcon className='inline w-6 text-red-500 -mt-1 mr-2' />
      Sorry, {modalContent}
    </>)
  } else if (!isRequestingEmail && !emailRequestError) {
    modalContentWrapper = (<>
      <HandThumbUpIcon className='inline w-5 text-green-500 -mt-1 mr-2' />
      {modalContent}.
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
      {!isRequestingEmail && modalIsOpen &&
        (<Modal closeModal={closeModalHandler}>
          {modalContentWrapper}
        </Modal>)}
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
