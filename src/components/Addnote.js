import React from 'react'
import { useContext } from 'react'
import noteContext from '../context/notes/NoteContext'
import { useState } from 'react'

const Addnote = (props) => {
    const context = useContext(noteContext);
    const {addnote} = context;

    const [note, setNote] = useState({title:"",description:"",tag:""});

    const handleClick = (e)=>{
        e.preventDefault();
        addnote(note.title,note.description,note.tag);
        setNote({title:"",description:"",tag:""});
        props.showAlert("Note Added Successfully","success");
    }

    const onChange = (e)=>{
        setNote({...note,[e.target.name]: e.target.value});
    }

    return (
        <div className='container mb-3 mt-5'>
            <div className="d-flex">
                <h2 className='p-2'>Add a Note</h2>
                <i className="fas fa-sticky-note fa-2x p-2"></i>
            </div>
            <form className='my-3'>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" onChange={onChange} value={note.title} minLength={1} required/>
                    <div id="titleHelp" className="form-text">Title should contain atleast one letter</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" onChange={onChange} value={note.description} minLength={1} required/>
                    <div id="titleHelp" className="form-text">Description should contain atleast one letter</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Tag</label>
                    <input type="text" className="form-control" id="tag" name="tag" onChange={onChange} value={note.tag} minLength={1}/>
                </div>
                <button disabled={note.title.length<1 || note.description.length<1}  type="submit" className="btn btn-primary my-2" onClick={handleClick}>Add Note</button>
            </form>
        </div>
    )
}

export default Addnote
