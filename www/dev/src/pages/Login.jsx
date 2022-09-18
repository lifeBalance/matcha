import React from 'react'
import { useNavigate } from 'react-router-dom'

// hooks
import useInput from '../hooks/useInput'

// components
import Input from '../components/UI/Input'

//icons
import { HandRaisedIcon } from '../assets/icons'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { login } from '../store/authSlice'

// helper functions
function validateName(str) {
  // 3 characters or more
  return str.length >= 3
}

function validatePwd(str) {
  // Between 5-10 characters: 1 upper, 1 lower, 1 digit, 1 special
  const regex = 
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,10}$/
  return str.match(regex)
}

function Login() {
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
    value: password,
    inputHasError: passwordHasError,
    inputChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    resetInput: resetPasswordInput,
  } = useInput(validatePwd)

  let formIsValid = validateName(username) && validatePwd(password)

  function submitHandler(e) {
    e.preventDefault()

    if (!formIsValid) return

    // console.log(`Submitted: ${username} ${password}`)
    dispatch(login({ username, password }))

    // if login was successful (otherwise show problem, and do none of what's below)
    if (!error) {
      resetUsernameInput()
      resetPasswordInput()
      navigate('/', {replace: true})
    }
  }

  let usernameErrorContent 
  if (usernameHasError)
    usernameErrorContent = <><HandRaisedIcon styles='w-5' /> Must be at least 3 characters</>

  let passwordErrorContent 
  if (passwordHasError)
    passwordErrorContent = <><HandRaisedIcon styles='w-5' /> At least 5 characters, including uppercase, lowercase, digit and symbol</>

  let submitButtonContent = 'Please, fill the form'
  if (formIsValid) 
    submitButtonContent = 'Submit'
  else if (isLoading)
    submitButtonContent = 'Logging in...'

  return (
      <div className="max-w-3xl mx-auto">
        <h1 className='text-white text-3xl text-center font-bold my-6 pb-4'>Log In</h1>

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
            value={password}
            onChange={passwordChangeHandler}
            onBlur={passwordBlurHandler}
            errorContent={passwordErrorContent}
          >password</Input>

          <div className="flex flex-col md:flex-row md:justify-between space-y-10 md:space-y-0 items-center mt-10">
            <button
              disabled={!formIsValid}
              className='text-white bg-black hover:bg-gray-800 active:bg-white active:text-black font-bold rounded-lg text-2xl w-full sm:w-auto px-3 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed hover:disabled:bg-black focus:ring-transparent md:ml-8'
            >{submitButtonContent}</button>
            <div className='space-y-6 text-center md:text-right'>
              <p onClick={() => navigate('/forgot', {replace: true})} className='text-white mx-5 text-lg md:text-right hover:underline hover:underline-offset-8'>Forgot Password?</p>
              <p onClick={() => navigate('/signup', {replace: true})} className='text-white mx-5 text-lg md:text-right hover:underline hover:underline-offset-8'>Create Account?</p>
            </div>
          </div>
        </form>
      </div>
  )
}

export default Login
