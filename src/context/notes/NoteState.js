import noteContext from "./NoteContext";
import { useState } from "react";

const NoteState = (props)=>{
    const host = "http://localhost:5000";
    const notesInitial = [];
    const [notes,setNotes] = useState(notesInitial);

    // Get notes
    const getnotes = async ()=>{

        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method:'GET',
            headers:{
                'auth-token':localStorage.getItem('token'),
                'Content-Type' : 'application/json'
            },
        });
        const Notes = await response.json();
        setNotes(Notes);
    }

    // Add a note
    const addnote = async (title,description,tag)=>{

        const response = await fetch(`${host}/api/notes/addnotes`, {
            method:'POST',
            headers:{
                'auth-token':localStorage.getItem('token'),
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({title,description,tag})
        });
        const note = await response.json();
        // console.log(json);
        
        setNotes(notes.concat(note));
    }

    // Delete a note
    const deletenote = async (id)=>{

        const response = await fetch(`${host}/api/notes/deletenotes/${id}`, {
            method:'DELETE',
            headers:{
                'auth-token':localStorage.getItem('token'),
                'Content-Type' : 'application/json'
            },
        });
        // const json = await response.json;

        const newnotes = notes.filter((note)=>{return note._id !== id});
        setNotes(newnotes);
    }

    // Edit a note
    const editnote = async (id,title,description,tag)=>{

        const response = await fetch(`${host}/api/notes/updatenotes/${id}`, {
            method:'PUT',
            headers:{
                'auth-token':localStorage.getItem('token'),
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({title,description,tag})
        });

        let newNotes = JSON.parse(JSON.stringify(notes));

        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if(element._id === id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            }
        }
        setNotes(newNotes);
    }

    return (
        <noteContext.Provider value={{notes,addnote,deletenote,editnote,getnotes}}>
            {props.children}
        </noteContext.Provider>
    )
}
export default NoteState;