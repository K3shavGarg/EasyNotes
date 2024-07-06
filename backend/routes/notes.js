const express = require('express');
const router = express.Router();
const Notes = require('../models/Notes')
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// ROUTE 1 : Get all the notes using : Get "/api/notes/fetchallnotes".      Login required
router.get('/fetchallnotes', fetchuser, async (req,res)=>{
    try{
        const notes = await Notes.find({user: req.user.id});
        res.json(notes);
    }
    catch(error){
        // console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// ROUTE 2 : Add a new note using : POST "/api/notes/addnotes".      Login required
router.post('/addnotes', fetchuser, [
    body('title','Enter a valid title').isLength({min:1}),
    body('description','Description should contain atleast 1 characters').isLength({min:1}),
], async (req,res)=>{
    try{
        const {title,description,tag} = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()});
        }

        const notes = new Notes({
            title: title,
            description: description,
            tag: tag,
            user: req.user.id
        });
        const savednotes = await notes.save();
        res.json(savednotes);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// ROUTE 3 : Update the notes using : PUT "/api/notes/updatenotes".      Login required
router.put('/updatenotes/:id', fetchuser, async (req,res)=>{  // The id used in the url is the note id
    try{
        const {title,description,tag} = req.body;
        // Create new Note object
        const newNote = {};
        if(title){newNote.title = title};
        if(description){newNote.description = description};
        if(tag){newNote.tag = tag};

        // Find the note to be updated and update it.
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }

        // Check whether the note user want to update is of the user himself or the other user.
        let userID = note.user.toString();
        if(userID !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndUpdate(req.params.id, {$set: newNote}, {new:true});
        res.json(note);
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})

// ROUTE 4 : Delete the notes using : DELTE "/api/notes/deletenotes".      Login required
router.delete('/deletenotes/:id', fetchuser, async (req,res)=>{  // The id used in the url is the note id
    try{
        // Find the note to be deleted and delete it.
        let note = await Notes.findById(req.params.id);
        if(!note){
            return res.status(404).send("Not Found");
        }

        // Check whether the note user want to delete is of the user himself or the other user.
        let userID = note.user.toString();
        if(userID !== req.user.id){
            return res.status(401).send("Not Allowed");
        }

        note = await Notes.findByIdAndDelete(req.params.id);
        res.json({"Success" : "Note has been deleted"});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
})
module.exports = router
