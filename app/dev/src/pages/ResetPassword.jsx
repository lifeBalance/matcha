import React from 'react'

import { useNavigate, useParams } from 'react-router-dom'

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

// Validators
import { validatePassword } from '../utils/validators'

/**
 * REACT COMPONENT
 */
function ResetPassword() {
  const { email, token } = useParams()

  function stringsAreEqual(str) {
    return str === password
  }
  const {
    value: password,
    inputHasError: passwordHasError,
    setInputHasError: setPasswordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(validatePassword)

  const {
    value: pwdConf,
    inputHasError: pwdConfHasError,
    setInputHasError: setPwdConfHasError,
    inputChangeHandler: pwdConfChangeHandler,
    inputBlurHandler: pwdConfBlurHandler,
  } = useInput(stringsAreEqual.bind(password))

  // Modal
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  const navigate = useNavigate()

  // To sync both states (passwordHasError, pwdConfHasError) and derived from state (formIsValid)
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      if (!passwordHasError && !pwdConfHasError)
        formIsValid = true
      if (password.length > 0 && !validatePassword(password))
        setPasswordHasError(true)
      else
        setPasswordHasError(false)
      if (!stringsAreEqual(pwdConf))
        setPwdConfHasError(true)
      else
        setPwdConfHasError(false)
    }, 500);

    return () => {
      clearTimeout(timerId);
    }
  }, [password, pwdConf])

  let formIsValid = !passwordHasError && !pwdConfHasError

  // Request Password Reset
  const {
    isConfirming: isRequesting,
    confirmError: requestError,
    confirm: requestPasswordReset
  } = useConfirm()

  function submitHandler(e) {
    e.preventDefault()
    // console.log(password, pwdConf, email, token);

    if (!formIsValid) return

    // console.log(`Submitted: ${email}`)
    requestPasswordReset(
      '/api/reset',
      'put',
      {
        password,
        pwdConf,
        email,
        token
      },
      () => setModalIsOpen(true))
  }

  let passwordErrorContent 
  if (passwordHasError)
    passwordErrorContent = (<>
      <HandRaisedIcon className='inline w-5 text-yellow-300' />
      At least 5 characters, including uppercase, lowercase, digit and symbol
    </>)

  let pwdConfErrorContent 
  if (pwdConf.length > 0 && pwdConfHasError)
    pwdConfErrorContent = (<>
      <HandRaisedIcon className='inline w-5 text-yellow-300' /> Passwords don't match!
    </>)

  let buttonContent
  if (formIsValid && !isRequesting)
    buttonContent = 'Submit'
  else if (!formIsValid)
    buttonContent = 'Enter a valid password'
  else if (formIsValid && isRequesting)
    buttonContent = 'Resetting...'

  let modalContent
  if (!isRequesting && requestError) {
    modalContent = (<>
      <HandRaisedIcon className='inline w-6 text-red-500 -mt-1 mr-2' />
      Sorry, {requestError.error}
    </>)
  } else if (!isRequesting && !requestError) {
    modalContent = (<>
      <HandThumbUpIcon className='inline w-5 text-green-500 -mt-1 mr-2' />
      Your Password has been reset. You can Log in.
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

      <h1 className='text-white text-3xl text-center font-bold my-6 pb-4 capitalize'>Reset Password</h1>

      <form onSubmit={submitHandler} >
        <Input 
          label='password'
          type='password'
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          errorContent={passwordErrorContent}
        />

        <Input 
          label='confirm password'
          type='password'
          value={pwdConf}
          onChange={pwdConfChangeHandler}
          onBlur={pwdConfBlurHandler}
          errorContent={pwdConfErrorContent}
        />

        <div className="flex justify-center mt-6 md:ml-4">
          <button
            disabled={!formIsValid}
            className='text-white bg-black hover:bg-gray-800 active:bg-white active:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed hover:disabled:bg-black focus:ring-transparent md:min-w-[260px]'
          >{formIsValid ? 'Submit' : 'Enter a valid pasword'}</button>
        </div>
      </form>
    </div>
  )
}

export default ResetPassword
