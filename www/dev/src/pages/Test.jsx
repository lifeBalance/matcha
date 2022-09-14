import React from 'react'
import Layout from '../components/UI/Layout'

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
    <Layout>
      <h1 className='text-2xl font-bold text-center'>Test</h1>
      {contentElem}
    </Layout>
  )
}

export default Test