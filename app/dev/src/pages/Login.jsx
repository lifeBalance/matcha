import React from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'

// hooks
import useInput from '../hooks/useInput'

// components
import Input from '../components/UI/Input'
import Modal from '../components/UI/Modal'

//icons
import { HandRaisedIcon, QuestionMarkCircle } from '../components/Icons/icons'

// redux
import { useSelector, useDispatch } from 'react-redux'
import {
  login,
  resetLoggingInErrors
} from '../store/authSlice'

// Validators
import { validateUsername, validatePassword } from '../utils/validators'

/**
 * REACT COMPONENT
 */
function Login() {
  // Redux
  const dispatch = useDispatch()
  const {
    isLoggedIn,
    isLoggingIn,
    isProfiled,
    errorLoggingIn
  } = useSelector(slices => slices.auth)

  const navigate = useNavigate()

  // Modal
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [modalContent, setModalContent] = React.useState(null)

  function closeModalHandler() {
    setModalIsOpen(false)
    dispatch(resetLoggingInErrors())
    navigate('/', { replace: true })
  }

  React.useEffect(() => {
    if (isLoggedIn)
      navigate('/', { replace: true })
  }, [])

  const {
    value: username,
    inputHasError: usernameHasError,
    inputChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler
  } = useInput(validateUsername)

  const {
    value: password,
    inputHasError: passwordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler
  } = useInput(validatePassword)

  let formIsValid = !usernameHasError && !passwordHasError

  // pass this function to the reducer to open the modal ;-)
  function openModal(data) {
    // console.log(data) // testing
    setModalContent(data.message)

    if (data.hasOwnProperty('profiled') && !data.profiled)
      navigate('/edit', { replace: true })
    else
      setModalIsOpen(true)
  }

  function submitHandler(e) {
    e.preventDefault()

    if (!formIsValid) return

    // console.log(`Submitted: ${username} ${password}`) // testing
    dispatch(login({ username, password, openModal }))
  }

  let usernameErrorContent 
  if (usernameHasError)
    usernameErrorContent = (<>
      <HandRaisedIcon styles='w-5' />
      Between 2 and 11 characters. No spaces (Can use _ and -).
    </>)

  let passwordErrorContent 
  if (passwordHasError)
    passwordErrorContent = (<>
      <HandRaisedIcon styles='w-5' />
      At least 5 characters, including uppercase, lowercase, digit and symbol
    </>)

  let submitButtonContent = 'Please, fill the form'
  if (formIsValid) 
    submitButtonContent = 'Submit'
  else if (isLoggingIn)
    submitButtonContent = 'Logging in...'

  let modalContentWrapper
  if (errorLoggingIn) {
    modalContentWrapper = (<>
      <HandRaisedIcon styles='w-5 text-red-500 -mt-1 mr-1' />
      {modalContent}
    </>)
  } else {
    modalContentWrapper = (<>
      <HandRaisedIcon styles='w-5 text-green-500 -mt-1 mr-1' />
      {modalContent}
    </>)
  }

  return (
      <div className="px-4 py-10">
        {modalIsOpen &&
          (<Modal closeModal={closeModalHandler}>
            {modalContentWrapper}
          </Modal>)
        }
        <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Log In</h1>

        <form onSubmit={submitHandler} className='flex flex-col items-center w-full'>
          <Input 
            type='text'
            label='username'
            value={username}
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
            errorContent={usernameErrorContent}
          >username</Input>

          <Input 
            type='password'
            label='password'
            value={password}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            errorContent={passwordErrorContent}
          >password</Input>

          <div className="flex flex-col md:flex-row md:justify-between space-y-10 md:space-y-0 items-center mt-10 mb-10">
            <div className='space-y-6 text-center md:text-right'>
              <button
                disabled={!formIsValid}
                className='text-white bg-black hover:bg-gray-800 active:bg-white active:text-black font-bold rounded-lg text-2xl w-full md:w-2/3 px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed hover:disabled:bg-black focus:ring-transparent md:ml-4 md:mr-32 md:min-w-[260px]'
              >{submitButtonContent}</button>
              <p onClick={() => navigate('/forgot', {replace: true})} className='text-white mx-5 text-lg md:text-left hover:underline hover:underline-offset-8 hover:cursor-pointer'>Forgot Password?</p>
            </div>

            <div className='space-y-10 text-center md:text-right'>
              <p onClick={() => navigate('/signup', {replace: true})} className='text-white mx-5 text-lg md:text-right hover:underline hover:underline-offset-8 hover:cursor-pointer'>Create Account?</p>
              <p onClick={() => navigate('/confirm', {replace: true})} className='text-white mx-5 text-lg md:text-right hover:underline hover:underline-offset-8 hover:cursor-pointer'>Confirm Account?</p>
            </div>
          </div>
        </form>
      </div>
  )
}

export default Login
