import ReactDOM from 'react-dom'

//icons
import { XCircle } from '../Icons/icons'

function Modal(props) {
  const overlaysElement = document.getElementById('overlays')

  return ReactDOM.createPortal(
      <div className="bg-black fixed top-0 left-0 bg-opacity-75 h-screen w-screen flex items-center justify-center"
      onClick={props.closeModal}>
        <div className="bg-gray-100 text-gray-800 p-10 rounded-md w-3/4 md:w-1/2 relative">
          <XCircle styles='absolute top-4 right-4 w-7 text-gray-500 hover:cursor-pointer hover:text-red-600' onClick={props.closeModal} />
          {props.children}
        </div>
      </div>
  , overlaysElement)
}

export default Modal
