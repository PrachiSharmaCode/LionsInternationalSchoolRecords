
import './dataStatusMessage.css';
import { useNavigate } from "react-router-dom";

export default function DataStatusMessage(props){
    let navigate = useNavigate();

    let navigateToStudentOption = () => {
        if(props.dataAccessType === 'GET'){
            navigate('/student-options', { state: { type: 'GET', userAdmin: props.admin } })
        }
        if(props.dataAccessType === 'PUT'){
            navigate('/student-options', { state: { type: 'PUT', userAdmin: props.admin  } })
        } 
        if(props.dataAccessType === 'POST'){
            navigate('/action',  { state: { admin: props.admin} });
        } 
    }
    return(<>
    <div className="status-message-container">
        <p>{props.message}</p>
        <button onClick={() => navigateToStudentOption()} className='alert-button'>Okay</button>
    </div>
    </>)
}