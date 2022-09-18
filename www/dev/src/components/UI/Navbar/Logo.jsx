import Peach from '../../../assets/peach.png'
import { Link } from 'react-router-dom'

function Logo(props) {
  return (
    <Link to='/'>
      <h1 className={`${props.styles}`}>m<img src={Peach} alt="" className='inline w-9' />tch<img src={Peach} alt="" className='inline w-9' /></h1>
    </Link>
  )
}

export default Logo