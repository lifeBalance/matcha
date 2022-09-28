import React from 'react'

import { useNavigate } from 'react-router-dom'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../store/authSlice'

// hooks
import useInput from '../hooks/useInput'
import useSelect from '../hooks/useSelect'
import useTextArea from '../hooks/useTextArea'
import useSubmitProfile from '../hooks/useSubmitProfile'

// components
import Input from '../components/UI/Input'
import Select from '../components/UI/Select'
import TextArea from '../components/UI/TextArea'
import Modal from '../components/UI/Modal'
// import FilePicker from '../components/UI/FilePicker'

//icons
import { HandRaisedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

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
  const [modalContent, setModalContent] = React.useState('')
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  const [formIsValid, setFormIsValid] = React.useState(false)
  const [formWasChanged, setFormWasChanged] = React.useState(false)
  const navigate = useNavigate()
  
  // redux
  const { accessToken, isLoggedIn } = useSelector(slices => slices.auth)
  const dispatch = useDispatch()

  const {
    isSubmitting: gettingProfile,
    submitError: errorGettingProfile,
    submitProfile: getProfile
  } = useSubmitProfile()

  const {
    value: firstName,
    setValue: setFirstName,
    inputWasChanged: firstNameWasChanged,
    inputHasError: firstNameHasError,
    inputChangeHandler: firstNameChangeHandler,
    inputBlurHandler: firstNameBlurHandler,
  } = useInput(validateName)

  const {
    value: lastName,
    setValue: setLastName,
    inputWasChanged: lastNameWasChanged,
    inputHasError: lastNameHasError,
    inputChangeHandler: lastNameChangeHandler,
    inputBlurHandler: lastNameBlurHandler,
  } = useInput(validateName)

  const {
    value: email,
    setValue: setEmail,
    inputWasChanged: emailWasChanged,
    inputHasError: emailHasError,
    inputChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
  } = useInput(validateEmail)

  const {
    selectValue: genderValue,
    setSelectValue: setGenderValue,
    selectChangeHandler: genderChangeHandler,
    selectWasChanged: genderWasChanged
  } = useSelect()

  const {
    selectValue: preferencesValue,
    setSelectValue: setPreferencesValue,
    selectChangeHandler: preferencesChangeHandler,
    selectWasChanged: preferencesWasChanged
  } = useSelect()

  const {
    areaValue: bioValue,
    setAreaValue: setBioValue,
    areaChangeHandler: bioChangeHandler,
    areaWasChanged: bioWasChanged,
    charactersLeft: bioCharactersLeft
  } = useTextArea(255)

  function setProfile(data) {
    setFirstName(data.firstName)
    setLastName(data.lastName)
    setEmail(data.email)
    setGenderValue(data.genderValue)
    setPreferencesValue(data.preferencesValue)
    setBioValue(data.bioValue)
  }

  React.useEffect(() => {
    if (!isLoggedIn)
      navigate('/', { replace: true })
    else
      getProfile('get', accessToken, null, (data) => setProfile(data))
  }, [])

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
    if (!firstNameHasError &&
        !lastNameHasError &&
        !emailHasError &&
        firstName.length > 0 &&
        lastName.length > 0)
    {
      setFormIsValid(true)
    } else {
      setFormIsValid(false)
    }
  }, [firstName,
      lastName,
      firstNameHasError,
      lastNameHasError,
      emailHasError])

  React.useEffect(() => {
    if (firstNameWasChanged ||
        lastNameWasChanged ||
        emailWasChanged ||
        genderWasChanged ||
        preferencesWasChanged ||
        bioWasChanged)
    {
      setFormWasChanged(true)
    } else {
      setFormWasChanged(false)
    }
  }, [firstNameWasChanged,
      lastNameWasChanged,
      emailWasChanged,
      genderWasChanged,
      preferencesWasChanged,
      bioWasChanged])

  function onCancelButtonHandler(e) {
    e.preventDefault()
  }

  let submitButtonStyles
  if (formWasChanged && formIsValid) 
    submitButtonStyles = 'bg-green-600 hover:bg-green-500 text-white'
  else if (formWasChanged && !formIsValid)
    submitButtonStyles = 'bg-red-600 hover:bg-red-500 text-white'
  else 
    submitButtonStyles = 'bg-gray-600 text-gray-500'

  /**
   * Submit the Profile form
   */
  const {
    isSubmitting,
    submitError,
    submitProfile
  } = useSubmitProfile()

  function getModalFeedback(data) {
    if (data.message === 'success') {
      setModalContent(<>
        <CheckCircleIcon className='inline w-5 text-green-500' />
        Profile Successfully updated.
      </>)
      setModalIsOpen(true)
    } else if (data.message === 'confirm') {
      setModalContent(<>
        <CheckCircleIcon className='inline w-5 text-green-500' />
        Profile Successfully updated. Confirm your new email before logging in!
      </>)
      setModalIsOpen(true)
      dispatch(logout())
    } else if (data.message === 'email exists') {
      setModalContent(<>
        <HandRaisedIcon className='inline w-5 text-orange-500' />
        Sorry, it seems there's already a user using that email address!
      </>)
      setModalIsOpen(true)
    }
  }

  function submitHandler(e) {
    e.preventDefault()

    submitProfile('put', accessToken, JSON.stringify({
      firstName,
      lastName,
      email,
      genderValue,
      preferencesValue,
      bioValue
    }), getModalFeedback)
  }

  if (gettingProfile && !errorGettingProfile)
    return (
      <div className='py-10 px-4'>
        <p>Loading...</p>
      </div>
    )
  else if(!gettingProfile && errorGettingProfile)
    return (
      <div className='py-10 px-4'>
        <p>{errorGettingProfile}</p>
      </div>
    )

  function closeModalHandler() {
    setModalIsOpen(false)
    navigate('/', { replace: true })
  }

  return (
    <div className='py-10 px-4'>
      {modalIsOpen &&
        (<Modal closeModal={closeModalHandler}>
          <p>{modalContent}</p>
        </Modal>)
      }
      <h1 className='text-4xl font-bold text-center mb-8 text-white'>Profile</h1>
      <form className='flex flex-col items-center w-full' onSubmit={submitHandler}>
        <Input
          label='firstName'
          value={firstName}
          onChange={firstNameChangeHandler}
          onBlur={firstNameBlurHandler}
          errorContent={firstNameErrorContent}
        />

        <Input
          label='lastName'
          value={lastName}
          onChange={lastNameChangeHandler}
          onBlur={lastNameBlurHandler}
          errorContent={lastNameErrorContent}
        />

        <Input
          label='email'
          value={email}
          onChange={emailChangeHandler}
          onBlur={emailBlurHandler}
          errorContent={emailErrorContent}
        />

        <Select
          value={genderValue}
          onChangeHandler={genderChangeHandler}
          label='gender'
          id='gender'
          options={[
            { value: 2, label: 'non-binary 🙅'},
            { value: 1, label: 'man 🍆'},
            { value: 0, label: 'woman 🍑'},
          ]}
          for='gender'
        />

        <Select
          value={preferencesValue}
          onChangeHandler={preferencesChangeHandler}
          label='preferences'
          id='preferences'
          options={[
            { value: 2, label: 'men & women 😏'},
            { value: 1, label: 'only men 🕺'},
            { value: 0, label: 'only women 💃'},
          ]}
          for='preferences'
          charactersLeft={bioCharactersLeft}
        />

        <TextArea
          label='about you'
          for='bio'
          id='bio'
          value={bioValue}
          rows='3'
          onChangeHandler={bioChangeHandler}
          charactersLeft={bioCharactersLeft}
          maxLength={255}
        />

        {/* <FilePicker label='upload some pics' /> */}

        <div className="flex flex-col md:flex-row space-y-10 md:space-y-0 mt-10 md:items-start">
          <button
            disabled={!formIsValid}
            className={`${submitButtonStyles} font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed focus:ring-transparent md:ml-4 md:mr-12 md:mb-6 min-w-[240px]`}
          >Save Changes</button>

          <button
            className='bg-black text-white hover:bg-gray-800 font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed focus:ring-transparent md:ml-4 md:mr-12 md:mb-6 min-w-[240px]'
            onClick={onCancelButtonHandler}
          >Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default Profile