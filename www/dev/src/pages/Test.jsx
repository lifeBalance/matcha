import React from 'react'

import Modal from '../components/UI/Modal'
import { useNavigate } from 'react-router-dom'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { getContent } from '../store/testSlice'

function Test() {
  const [modalIsOpen, setModalIsOpen] = React.useState(false)

  const { content, error, isLoading } = useSelector((slices) => slices.test)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  React.useEffect(() => {
    dispatch(getContent())
    if (error) setModalIsOpen(true)
  }, [error])

  function closeModalHandler() {
    setModalIsOpen(false)
    navigate('/', { replace: true })
  }

  let contentElem = isLoading ? 
    (<p>Loading...</p>)
    :
    (<p>{content}</p>)

  return (
    <>
      {modalIsOpen && (
        <Modal closeModal={closeModalHandler}>
          <p>{error}</p>
        </Modal>
      )}
      <h1 className='text-2xl font-bold text-center'>{contentElem}</h1>
    </>
  )
}

export default Test
