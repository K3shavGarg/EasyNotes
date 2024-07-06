import React from 'react'
import { useContext } from 'react'
import noteContext from '../context/notes/NoteContext'

const NoteItem = (props) => {
  const context = useContext(noteContext);
  const {deletenote} = context;
  const {note, updatenote} = props;
  return (
    <div className='col-md-3'>
        <div className="card my-3">
            <div className="card-body">
                <h4 className="card-title">{note.title}</h4>
                <p className="card-subtitle mb-2 text-body-secondary" style={{"fontSize":13}}>{note.date}</p>
                <p className="card-text">{note.description}</p>
                <div className='d-flex'>
                  <span className="badge rounded-pill text-bg-info me-auto p-2">{note.tag}</span>
                  <i className="fa-solid fa-pen-to-square mx-2 p-2" onClick={()=>{updatenote(note)}}></i>
                  <i className="fa-solid fa-trash-can mx-2 p-2" onClick={()=>{deletenote(note._id); props.showAlert("Note Deleted Successfully","success")}}></i>
                </div>
            </div>
        </div>
    </div>
  )
}

export default NoteItem

