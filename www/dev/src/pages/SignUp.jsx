import React from 'react'
import { useNavigate } from 'react-router-dom'

// components
import Layout from '../components/UI/Layout'

//icons
import { HandRaisedIcon } from '../assets/icons'

// hooks
import useInput from '../hooks/useInput'
import Input from '../components/UI/Input'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

// helper functions
function validateName(str) {
  // 3 characters or more
  return str.length >= 2
}

function validateEmail(str) {
  const regex = 
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return str.match(regex)
}

function validatePwd(str) {
  // Between 5-10 characters: 1 upper, 1 lower, 1 digit, 1 special
  const regex = 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,10}$/
  return str.match(regex)
}

function SignUp() {
  // Redux
  const dispatch = useDispatch()
  const { isLoggedIn, isLoading, error } = useSelector(slices => slices.auth)
  const navigate = useNavigate()

  if (isLoggedIn)
    navigate('/', {replace: true})

  const {
    value: username,
    inputHasError: usernameHasError,
    inputChangeHandler: usernameChangeHandler,
    inputBlurHandler: usernameBlurHandler,
    resetInput: resetUsernameInput,
  } = useInput(validateName)

  const {
    value: firstName,
    inputHasError: firstNameHasError,
    inputChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
    resetInput: resetFirstNameInput,
  } = useInput(validateName)

  const {
    value: lastName,
    inputHasError: lastNameHasError,
    inputChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
    resetInput: resetLastNameInput,
  } = useInput(validateName)

  const {
    value: email,
    inputHasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    resetInput: resetEmailInput,
  } = useInput(validateEmail)

  const {
    value: password,
    inputHasError: passwordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    resetInput: resetPasswordInput,
  } = useInput(validatePwd)

  let formIsValid = validateName(username) && 
                    validateName(firstName) &&
                    validateName(lastName) &&
                    validateEmail(email) &&
                    validatePwd(password)

  function submitHandler(e) {
    e.preventDefault()

    if (!formIsValid) return

    // console.log(`Submitted: ${username} ${password}`)
    dispatch(login({ username, password }))

    // if login was successful (otherwise show problem, and do none of what's below)
    if (!error) {
      resetUsernameInput()
      resetFirstNameInput()
      resetLastNameInput()
      resetEmailInput()
      resetPasswordInput()
      navigate('/', {replace: true})
    }
  }

  let usernameErrorContent 
  if (usernameHasError)
    usernameErrorContent = (<>
      <HandRaisedIcon styles='w-5' /> Must be at least 2 characters
    </>)

  let firstNameErrorContent 
  if (firstNameHasError)
    firstNameErrorContent = (<>
      <HandRaisedIcon styles='w-5' /> Must be at least 2 characters
    </>)

let lastNameErrorContent 
  if (lastNameHasError)
    lastNameErrorContent = (<>
      <HandRaisedIcon styles='w-5' /> Must be at least 2 characters
    </>)

let emailErrorContent 
  if (emailHasError)
    emailErrorContent = (<>
      <HandRaisedIcon styles='w-5' /> Must be a valid email address
    </>)

  let passwordErrorContent 
  if (passwordHasError)
    passwordErrorContent = (<>
      <HandRaisedIcon styles='w-5' /> At least 5 characters, including uppercase, lowercase, digit and symbol
    </>)

  let submitButtonContent = 'Please, fill the form'
  if (formIsValid) 
    submitButtonContent = 'Submit'
  else if (isLoading)
    submitButtonContent = 'Logging in...'

  return (
    <Layout>
      <div className="bg-gradient-to-br from-pink-400 via-red-400 to-yellow-400 p-8 max-w-3xl mx-auto">
        <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Sign Up</h1>

        <form onSubmit={submitHandler} className=''>
          <Input 
            type='text'
            value={username}
            onChange={usernameChangeHandler}
            onBlur={usernameBlurHandler}
            errorContent={usernameErrorContent}
          >username</Input>

          <Input 
            type='text'
            value={firstName}
            onChange={firstNameChangeHandler}
            onBlur={firstNameBlurHandler}
            errorContent={firstNameErrorContent}
          >first name</Input>

          <Input 
            type='text'
            value={lastName}
            onChange={lastNameChangeHandler}
            onBlur={lastNameBlurHandler}
            errorContent={lastNameErrorContent}
          >last name</Input>

          <Input 
            type='text'
            value={email}
            onChange={emailChangeHandler}
            onBlur={emailBlurHandler}
            errorContent={emailErrorContent}
          >email</Input>

          <Input 
            type='text'
            value={password}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            errorContent={passwordErrorContent}
          >password</Input>

          <div className="flex flex-col md:flex-row md:justify-between space-y-10 md:space-y-0 items-center mt-10">
            <button
              disabled={!formIsValid}
              className='text-white bg-black hover:bg-gray-800 active:bg-white active:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed hover:disabled:bg-black focus:ring-transparent md:ml-8'
            >{submitButtonContent}</button>

            <div className='space-y-6 text-center md:text-right'>
              <p onClick={() => navigate('/forgot', {replace: true})} className='text-white mx-5 text-lg md:text-right hover:underline hover:underline-offset-8'>Forgot Password?</p>
              <p onClick={() => navigate('/login', {replace: true})} className='text-white mx-5 text-lg md:text-right hover:underline hover:underline-offset-8'>Already a member? <span className='font-bold'>Login</span></p>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default SignUp
