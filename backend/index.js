
const express = require('express');
const config = require("./config.json");
const mongoose = require('mongoose');
const cors = require('cors');

const app = express(); // Create the Express application

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(config.connectionString);


const Notes = require('./models/noteModel');

// app.get("/", (req, res) => {
//     res.json({ data: "hello" });
// });

//get all notes
app.get("/get-all-notes", async (req, res) => {
    try {
    const notes = await Notes.find().sort({ isPinned: -1 });
        
    return res.json({
        error: false,
        notes,
        message: "All notes retrieved successfully",
    });
    } catch (error) {
    return res.status(500).json({
        error: true,
        message: "Internal Server Error",
    });
    }
});

//add note
app.post("/add-note", async (req, res) => {
    const { title, content, tagline, tags } = req.body;

    if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
    }
    if (!content) {
        return res.status(400).json({ error: true, message: "Content is required" });
    }
    if (!tagline) {
        return res.status(400).json({ error: true, message: "Tagline is required" });
    }
    
    try {
        const note = new Notes({
        title,
        content,
        tagline,
        tags: tags || [],
        });
    
        await note.save();
    
    return res.json({
        error: false,
        note,
        message: "Note added Successfully",
        });
    } catch (error) {
    return res.status(500).json({
        error: true,
        message: "Internal Server Error",
    });
    }
});

//edit note
app.put("/edit-note/:noteId", async (req, res) => {
    const noteId = req.params.noteId;
    const { title, content, tagline, tags, isPinned } = req.body;

    if (!title && !content && !tagline && !tags && !isPinned) {
        return res.status(400).json({ error: true, message: "No changes provided" });
    }
    
    try {
    const note = await Notes.findOne({ _id: noteId });
    
        if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
        }
    
        if (title) note.title = title;
        if (content) note.content = content;
        if (tagline) note.tagline = tagline;
        if (tags) note.tags = tags;
        if (isPinned) note.isPinned = isPinned;
    
    await note.save();
    
    return res.json({
        error: false,
        note,
        message: "Note updated successfully",
        });
    } catch (error) {
        return res.status(500).json({
        error: true,
        message: "Internal Server Error",
        });
    }
    });

//delete note
app.delete("/delete-note/:noteId", async (req, res) => {
    const noteId = req.params.noteId;
    
    try {
        const note = await Notes.findOne({ _id: noteId });
    
        if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
        }
    
        await Notes.deleteOne({ _id: noteId });
        
    return res.json({
        error: false,
        message: "Note deleted successfully",
        });
    } catch (error) {
    return res.status(500).json({
        error: true,
        message: "Internal Server Error",
    });
    }
});

//update isPinned
app.put("/update-note-pinned/:noteId", async (req, res) => {
    const noteId = req.params.noteId;
    const { isPinned } = req.body;
    
    if (isPinned === undefined) {
        return res.status(400).json({ error: true, message: "isPinned value required" });
    }
    
    try {
        const note = await Notes.findOne({ _id: noteId });
    
        if (!note) {
        return res.status(404).json({ error: true, message: "Note not found" });
        }
    
    note.isPinned = isPinned;
    
    await note.save();
    
    return res.json({
        error: false,
        note,
        message: "Note pinned status updated successfully",
    });
    } catch (error) {
    return res.status(500).json({
        error: true,
        message: "Internal Server Error",
        });
    }
});

//search notes
app.get("/search-note/", async (req, res) => {

    const {query} = req.query;

    if(!query){ 
        return res
            .status(400)
            .json({error : true, message: "Search query is required"});
    }

    try{
        const matchingNotes = await Notes.find({
            $or: [
                {title: {$regex : new RegExp(query,"i")}},
                {tagline : {$regex : new RegExp(query,"i")}},
                {content : {$regex : new RegExp(query,"i")}},
            ],
        });

        return res.json({
            error:false,
            notes:matchingNotes,
            message: "Notes matching the search query retrieved successfully",
        });
    } catch (error) {
        return res.status(500).json({
            error:true,
            message: "Internal Server Error",
        });
    }

});


app.listen(3000, () => { 
    console.log('server is running');
});

module.exports = app;