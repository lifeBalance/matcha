import Peach from '../../../assets/peach.png'

function Logo(props) {
  return (
    <div>
      <h1 className={props.styles}>m<img src={Peach} alt="" className='inline w-9' />tch<img src={Peach} alt="" className='inline w-9' /></h1>
    </div>
  )
}

export default Logo