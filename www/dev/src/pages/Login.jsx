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
import { login, resetLoggingInErrors } from '../store/authSlice'

// helper functions
function validateUsername(str) {
  // Between 2-10 characters: uppercase, lowercase and digits
  const regex = /^[A-Z\d\-_]{2,10}$/
  return str.toUpperCase().trim().match(regex)
}

function validatePwd(str) {
  // Between 5-10 characters: 1 upper, 1 lower, 1 digit, 1 special
  const regex = 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,10}$/
  return str.match(regex)
}
/**
 * REACT COMPONENT
 */
function Login() {
  // Redux
  const dispatch = useDispatch()
  const { isLoggedIn, isLoggingIn, errorLoggingIn } = useSelector(slices => slices.auth)

  const navigate = useNavigate()

  // Modal
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
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
    inputBlurHandler: usernameBlurHandler,
    resetInput: resetUsernameInput,
  } = useInput(validateUsername)

  const {
    value: password,
    inputHasError: passwordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    resetInput: resetPasswordInput,
  } = useInput(validatePwd)

  let formIsValid = !usernameHasError && !passwordHasError

  function submitHandler(e) {
    e.preventDefault()

    if (!formIsValid) return

    // console.log(`Submitted: ${username} ${password}`)
    dispatch(login({ username, password }))
  }

  React.useEffect(() => {
    if (errorLoggingIn)
      setModalIsOpen(true)
  }, [errorLoggingIn])

  let usernameErrorContent 
  if (usernameHasError)
    usernameErrorContent = (<>
      <HandRaisedIcon styles='w-5' />
      Between 2 and 10 characters. No spaces. Can use _ and -.
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

  let modalContent
  switch (errorLoggingIn) {
    case 'incorrect password':
      modalContent = (
        <>
          <HandRaisedIcon styles='w-5 text-red-500 -mt-1 mr-1' />
          Did you forgot your password?
        </>
      )
      break;
    case 'account not confirmed':
      modalContent = (<>
        <HandRaisedIcon styles='w-5 text-red-500 -mt-1 mr-1' />
        It seems you didn't <span className='font-bold'>confirm your account</span>. Check your email, or request a new <span className='font-bold'>Account Confirmation email</span>.
      </>)
      break;
    default:
      modalContent = (<>
        <QuestionMarkCircle styles='w-5 text-red-500 -mt-1 mr-1' />
        We don't know that dude here! 🤔
      </>)
  }

  return (
      <div className="mx-auto py-10">
        {modalIsOpen &&
          (<Modal closeModal={closeModalHandler}>
            <p>{modalContent}</p>
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
