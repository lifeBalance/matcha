import React from 'react'
import { unescape } from 'lodash'
import { useNavigate } from 'react-router-dom'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { logout, setIsProfiled } from '../store/authSlice'

// hooks
import useInput from '../hooks/useInput'
import useSelect from '../hooks/useSelect'
import useTextArea from '../hooks/useTextArea'
import useSubmitProfile from '../hooks/useSubmitProfile'
import useGetProfile from '../hooks/useGetProfile'
import useFilePicker from '../hooks/useFilePicker'

// components
import Input from '../components/UI/Input'
import Select from '../components/UI/Select'
import TextArea from '../components/UI/TextArea'
import Modal from '../components/UI/Modal'
import FilePicker from '../components/UI/FilePicker'

//icons
import { HandRaisedIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

// Validators
import {
  validateName,
  validateEmail,
  validateAge
} from '../utils/validators'

function SettingsForm(props) {
  const [modalContent, setModalContent] = React.useState('')
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [userName, setUserName] = React.useState('')

  const [formIsValid, setFormIsValid] = React.useState(false)
  const [formWasChanged, setFormWasChanged] = React.useState(false)
  const navigate = useNavigate()

  // redux
  const { accessToken, isLoggedIn, uid } = useSelector((slices) => slices.auth)
  const dispatch = useDispatch()

  const {
    isGetting: gettingProfile,
    getError: errorGettingProfile,
    getProfile,
  } = useGetProfile()

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
    value: age,
    setValue: setAge,
    inputWasChanged: ageWasChanged,
    inputHasError: ageHasError,
    inputChangeHandler: ageChangeHandler,
    inputBlurHandler: ageBlurHandler,
  } = useInput(validateAge)

  const {
    selectValue: genderValue,
    setSelectValue: setGenderValue,
    selectChangeHandler: genderChangeHandler,
    selectWasChanged: genderWasChanged,
  } = useSelect()

  const {
    selectValue: preferencesValue,
    setSelectValue: setPreferencesValue,
    selectChangeHandler: preferencesChangeHandler,
    selectWasChanged: preferencesWasChanged,
  } = useSelect()

  const {
    areaValue: bioValue,
    setAreaValue: setBioValue,
    areaChangeHandler: bioChangeHandler,
    areaWasChanged: bioWasChanged,
    // charactersLeft: bioCharactersLeft,
  } = useTextArea(255)

  const {
    files,
    setFiles,
    filesLeft,
    setFilesLeft,
    filePickerError,
    setFilePickerError,
    deletePic,
    filePickerWasChanged,
    filePickerChangeHandler
  } = useFilePicker(5)

  function setUserState(data) {
    setUserName(data.username)
    setFirstName(data.firstname)
    setLastName(data.lastname)
    setEmail(data.email)
    data.age ? setAge(data.age) : setAge('')
    setGenderValue(data.gender)
    setPreferencesValue(data.prefers)
    setBioValue(unescape(data.bio))
    // data.bio ? setBioValue(unescape(data.bio)) : setBioValue()
    setFilesLeft(5 - data.pics.length)
  }

  React.useEffect(() => {
    if (!isLoggedIn) navigate('/', { replace: true })
    else getProfile({
      url: '/settings', 
      id: uid,
      accessToken,
      setUserState
    })
  }, [isLoggedIn])

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
      <HandRaisedIcon className='inline w-5 -mt-1 text-orange-200' /> Must be
      a valid email address
    </>)
  }

  let ageErrorContent
  if (ageHasError) {
    ageErrorContent = (<>
      <HandRaisedIcon className='inline w-5 -mt-1 text-orange-200' />
      Must be at least 18 and no more than 100
    </>)
  } else if (!ageHasError && !age) ageErrorContent = '*required'

  React.useEffect(() => {
    if (
      !firstNameHasError &&
      !lastNameHasError &&
      !emailHasError &&
      !ageHasError && age &&
      firstName.length > 0 &&
      lastName.length > 0
    ) {
      setFormIsValid(true)
    } else {
      setFormIsValid(false)
    }
  }, [firstName, lastName, age, ageHasError, firstNameHasError, lastNameHasError, emailHasError])

  React.useEffect(() => {
    if (
      firstNameWasChanged ||
      lastNameWasChanged ||
      emailWasChanged ||
      ageWasChanged ||
      genderWasChanged ||
      preferencesWasChanged ||
      bioWasChanged ||
      filePickerWasChanged
    ) {
      setFormWasChanged(true)
    } else {
      setFormWasChanged(false)
    }
  }, [
    firstNameWasChanged,
    lastNameWasChanged,
    emailWasChanged,
    ageWasChanged,
    genderWasChanged,
    preferencesWasChanged,
    bioWasChanged,
    filePickerWasChanged
  ])

  function onCancelButtonHandler(e) {
    e.preventDefault()
    navigate(-1, { replace: true })
  }

  let submitButtonStyles
  if (formWasChanged && formIsValid)
    submitButtonStyles = 'bg-green-600 hover:bg-green-500 text-white'
  else if (formWasChanged && !formIsValid)
    submitButtonStyles = 'bg-red-600 hover:bg-red-500 text-white'
  else submitButtonStyles = 'bg-gray-600 text-gray-500'

  /**
   * Submit the Profile form
   */
  const { isSubmitting, submitError, submitProfile } = useSubmitProfile()

  function getModalFeedback(data) {
    if (!submitError) {
      setModalContent(<>
        <CheckCircleIcon className='inline w-5 text-green-500' />
        {data.message}
      </>)
       // Set the proper state to be able to leave form
      dispatch(setIsProfiled())
      // Invoke the Profile Pic state using Setter (passed down in the props object)
      props.setProfilePic(data.profile_pic)
    } else {
      setModalContent(<>
        <CheckCircleIcon className='inline w-5 text-green-500' />
        {data.message}
      </>)
    }
    // SET THE PROFILE PICTURE (If the user added one)
    if (data.profilePic) props.setProfilePic(data.profilePic)

    setModalIsOpen(true)

    // Log out the user if she's not confirmed
    if (!data.confirmed) dispatch(logout())
  }

  function closeFilePickerModalHandler() {
    setModalIsOpen(false)
    setFilePickerError(false)
  }

  // Submit profile
  function submitHandler(e) {
    e.preventDefault()

    submitProfile({
      accessToken,
      firstName,
      lastName,
      email,
      age,
      genderValue,
      preferencesValue,
      bioValue,
      files,
      callback: getModalFeedback
    })
  }

  if (gettingProfile && !errorGettingProfile)
    return (
      <div className='py-10 px-4'>
        <p>Loading...</p>
      </div>
    )
  else if (!gettingProfile && errorGettingProfile)
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
      {modalIsOpen && (
        <Modal closeModal={closeModalHandler}>
          <p>{modalContent}</p>
        </Modal>
      )}
      {filePickerError && (
        <Modal closeModal={closeFilePickerModalHandler}>
          <p>{filePickerError}</p>
        </Modal>
      )}
      <h1 className='text-4xl font-bold text-center mb-8 text-white'>
        {userName}
      </h1>
      <form
        className='flex flex-col items-center w-full'
        onSubmit={submitHandler}
      >
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

        <Input
          label='age'
          value={age}
          type='number'
          onChange={ageChangeHandler}
          onBlur={ageBlurHandler}
          errorContent={ageErrorContent}
        />

        <Select
          value={genderValue}
          onChangeHandler={genderChangeHandler}
          label='gender'
          id='gender'
          options={[
            { value: 2, label: 'non-binary 🙅' },
            { value: 1, label: 'man 🍆' },
            { value: 0, label: 'woman 🍑' },
          ]}
          for='gender'
        />

        <Select
          value={preferencesValue}
          onChangeHandler={preferencesChangeHandler}
          label='preferences'
          id='preferences'
          options={[
            { value: 2, label: 'men & women 😏' },
            { value: 1, label: 'only men 🕺' },
            { value: 0, label: 'only women 💃' },
          ]}
          for='preferences'
        />

        <TextArea
          label='about you'
          for='bio'
          id='bio'
          value={bioValue}
          rows='3'
          onChangeHandler={bioChangeHandler}
          charactersLeft={255 - bioValue.length}
          maxLength={255}
        />

        <FilePicker
          label='upload some pics'
          name='picker'
          onChangeFilePicker={filePickerChangeHandler}
          files={files}
          filesLeft={filesLeft}
          onClickHandler={deletePic}
        />

        <div className='flex flex-col md:flex-row space-y-10 md:space-y-0 mt-10 md:items-start'>
          <button
            disabled={!formIsValid}
            className={`${submitButtonStyles} font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed focus:ring-transparent md:ml-4 md:mr-12 md:mb-6 min-w-[240px]`}
          >
            Save Changes
          </button>

          <button
            className='bg-black text-white hover:bg-gray-800 font-bold rounded-lg text-2xl w-full sm:w-auto px-5 py-2.5 text-center cursor-pointer disabled:cursor-not-allowed focus:ring-transparent md:ml-4 md:mr-12 md:mb-6 min-w-[240px]'
            onClick={onCancelButtonHandler}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsForm
