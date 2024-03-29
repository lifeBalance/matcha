import React from 'react'

// hooks
import { useNavigate } from 'react-router-dom'
import useInput from '../hooks/useInput'
import useSignupForm from '../hooks/useSignupForm'
import useCheckAvailable from '../hooks/useCheckAvailable'

// components
import Input from '../components/UI/Input'
import Modal from '../components/UI/Modal'

//icons
import {
  CheckCircleIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline'

// redux
import { useSelector } from 'react-redux'

// Validators
import {
  validateUsername,
  validateName,
  validateEmail,
  validatePassword
} from '../utils/validators'

/**
 * REACT COMPONENT
 */
function SignUp() {
  // Redux
  const { isLoggedIn } = useSelector(slices => slices.auth)

  const { submitError, isSubmitting, submitForm } = useSignupForm()
  const navigate = useNavigate()

  if (isLoggedIn)
    navigate('/', {replace: true})

  // Modal
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [modalContent, setModalContent] = React.useState('')

  function openModalHandler(msg) {
    setModalIsOpen(true)
    setModalContent(msg)
  }

  function closeModalHandler() {
    setModalIsOpen(false)
    if (!submitError)
      navigate('/', { replace: true })
  }

  const {
    value: username,
    inputHasError: usernameHasError,
    inputChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
  } = useInput(validateUsername)

  const {
    value: firstname,
    inputHasError: firstNameHasError,
    inputChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(validateName)

  const {
    value: lastname,
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

  const {
    value: password,
    inputHasError: passwordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
  } = useInput(validatePassword)

  function stringsAreEqual(str) { return str === password }

  const {
    value: passwordConf,
    inputHasError: passwordConfHasError,
    inputChangeHandler: passwordConfChangeHandler,
    inputBlurHandler: passwordConfBlurHandler,
  } = useInput(stringsAreEqual.bind(password))

  const {
    available: usernameAvailable,
    checkIfAvailable: checkIfUsernameAvailable,
  } = useCheckAvailable()

  // Debounce username existence check in DB
  React.useEffect(() => {
    const timerId = setTimeout(() => {
      if (!usernameHasError && username.length >= 2) {
        checkIfUsernameAvailable('/api/accounts', { username })
      }
    }, 1000);

    return () => clearTimeout(timerId)
  }, [usernameHasError, username])

  // Derived state
  let formIsValid = (
    !usernameHasError     && username.length > 0 &&
    !firstNameHasError    && firstname.length > 0 &&
    !lastNameHasError     && lastname.length > 0 &&
    !emailHasError        && email.length > 0 &&
    !passwordHasError     && password.length > 0 &&
    !passwordConfHasError && passwordConf.length == password.length &&
    usernameAvailable
  )

  async function submitHandler(e) {
    e.preventDefault()

    if (!formIsValid) return

    // console.log(`Submitted: ${username} ${password}`)
    await submitForm('/api/accounts', {
      username,
      firstname,
      lastname,
      email,
      password
    }, openModalHandler)
  }

  let usernameErrorContent 
  if (username.length > 0 && usernameHasError) {
    usernameErrorContent = (<>
      <HandRaisedIcon className='inline w-5 text-yellow-300' /> Between 2 and 11 characters. No spaces. Can use _ and -.
    </>)
  } else if (username.length > 0 && !usernameHasError) {
    usernameErrorContent = usernameAvailable ?
    (<><CheckCircleIcon className='inline w-5 text-green-300' /> Username is available!</>)
    :
    (<><HandRaisedIcon className='inline w-5 text-yellow-300' /> Sorry, that username is already taken</>)
  }

  let firstNameErrorContent 
  if (firstname.length > 0 && firstNameHasError)
    firstNameErrorContent = (<>passpwwordConf
      <HandRaisedIcon className='inline w-5 text-yellow-300' /> Only letters (from 2 to 30)
    </>)

  let lastNameErrorContent 
  if (lastname.length > 0 && lastNameHasError)
    lastNameErrorContent = (<>
      <HandRaisedIcon className='inline w-5 text-yellow-300' /> Only letters (from 2 to 30)
    </>)

  let emailErrorContent 
  if (email.length > 0 && emailHasError) {
    emailErrorContent = (<>
      <HandRaisedIcon className='inline w-5 text-yellow-300' /> Must be a valid email address
    </>) 
  }

  let passwordErrorContent 
  if (password.length > 0 && passwordHasError)
    passwordErrorContent = (<>
      <HandRaisedIcon className='inline w-5 text-yellow-300' /> At least 5 characters, including uppercase, lowercase, digit and symbol
    </>)

let passwordConfErrorContent 
  if (passwordConf.length > 0 && passwordConfHasError)
    passwordConfErrorContent = (<>
      <HandRaisedIcon className='inline w-5 text-yellow-300' /> Passwords don't match!
    </>)

  let submitButtonContent = 'Please, fill the form'
  if (formIsValid) 
    submitButtonContent = 'Submit'
  else if (isSubmitting)
    submitButtonContent = 'Signing Up...'

  return (
    <div className="py-8">
      {modalIsOpen && submitError &&
        (<Modal closeModal={closeModalHandler}>
          <p>
            <HandRaisedIcon className='inline w-5 text-red-500 -mt-1 mr-2' />
            Sorry, {modalContent}
          </p>
        </Modal>)
      }
      {modalIsOpen && !submitError &&
        (<Modal closeModal={closeModalHandler}>
          <p>
            <CheckCircleIcon className='inline w-5 text-green-500 -mt-1 mr-1' />
            {modalContent}
          </p>
        </Modal>)
      }
      <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Sign Up</h1>

      <form onSubmit={submitHandler} className='flex flex-col items-center w-full'>
        <Input 
          type='text'
          label='username'
          value={username}
          onChange={usernameChangeHandler}
          onBlur={usernameBlurHandler}
          errorContent={usernameErrorContent}
        />

        <Input 
          type='text'
          label='first name'
          value={firstname}
          onChange={firstNameChangeHandler}
          onBlur={firstNameBlurHandler}
          errorContent={firstNameErrorContent}
        />

        <Input 
          type='text'
          label='last name'
          value={lastname}
          onChange={lastNameChangeHandler}
          onBlur={lastNameBlurHandler}
          errorContent={lastNameErrorContent}
        />

        <Input 
          type='text'
          label='email'
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          errorContent={emailErrorContent}
          placeholder='test@test.com'
        />

        <Input 
          type='password'
          label='password'
          value={password}
          onChange={passwordChangeHandler}
          onBlur={passwordBlurHandler}
          errorContent={passwordErrorContent}
        />

        <Input 
          type='password'
          label='password confirmation'
          value={passwordConf}
          onChange={passwordConfChangeHandler}
          onBlur={passwordConfBlurHandler}
          errorContent={passwordConfErrorContent}
        />

        <div className="flex flex-col md:flex-row md:justify-between space-y-10 md:space-y-0 items-center mt-10">
          <button
            disabled={!formIsValid}
            className='text-white bg-black hover:enabled:bg-gray-800 active:enabled:bg-white active:enabled:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed focus:ring-transparent md:ml-4 md:mr-12 md:mb-6 md:min-w-[260px]'
          >{submitButtonContent}</button>

          <div className='space-y-6 text-center md:text-right pb-8'>
            <p onClick={() => navigate('/forgot', {replace: true})} className='text-white mx-5 text-lg md:text-right hover:underline hover:underline-offset-8 hover:cursor-pointer'>Forgot Password?</p>
            <p onClick={() => navigate('/login', {replace: true})} className='text-white mx-5 text-lg md:text-right hover:underline hover:underline-offset-8 hover:cursor-pointer'>Already a member? <span className='font-bold'>Login</span></p>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignUp
