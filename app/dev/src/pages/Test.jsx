import React from 'react'

// Components
import Modal from '../components/UI/Modal'
// import Map from '../components/Map'
import Map2 from '../components/Map2'

// Hooks
import useTests from '../hooks/useTests'

// Redux
import { useDispatch, useSelector } from 'react-redux'
import { refresh } from '../store/authSlice'

function Test() {
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [modalContent, setModalContent] = React.useState(null)

  // redux
  const accessToken = useSelector(slices => slices.auth.accessToken)
  const dispatch = useDispatch()

  // function feedback(msg) {
  //   setModalContent(msg)
  //   // setModalIsOpen(true)
  // }

  // const {
  //   content,
  //   isLoading,
  //   error,
  //   getTests
  // } = useTests({ feedback })

  // React.useEffect(() => {
  //   getTests()
  // }, [])

  function closeModalHandler() {
    setModalIsOpen(false)
    // navigate('/', { replace: true })
  }

  // let contentElem = isLoading ? 
  //   (<p>Loading...</p>)
  //   :
  //   (<p>hoes</p>)

  return (
    <div className=''>
      {/* {modalIsOpen && (
        <Modal closeModal={closeModalHandler}>
          <p>{modalContent}</p>
        </Modal>
      )} */}
      {/* <h1 className='text-2xl font-bold text-center'>{contentElem}</h1> */}
      {/* <p>Coordinates: {content.coordinates}</p> */}
      <h1>Map 2</h1>
      <Map2 />

      <button
        onClick={() => dispatch(refresh({ accessToken }))}
        className='bg-blue-500 w-full text-white font-bold p-4 rounded-lg active:bg-blue-400 hover:bg-blue-600'
      >
        Refresh token
      </button>
    </div>
  )
}

export default Test
