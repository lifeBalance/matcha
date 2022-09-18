import React from 'react'

// redux
import { useSelector, useDispatch } from 'react-redux'
import { getContent } from '../store/testSlice'

function Test() {
  const { content, error, isLoading } = useSelector(slices => slices.test)
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(getContent())
  }, [])

  let contentElem 

  if (isLoading)
    contentElem = (<p>Loading...</p>)
  else if (content && !error)
    contentElem = (<p>{content}</p>)
  else if (!content && error)
    contentElem = <p>{error}</p>

  return (
    <h1 className='text-2xl font-bold text-center'>{contentElem}</h1>
  )
}

export default Test