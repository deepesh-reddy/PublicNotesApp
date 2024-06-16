import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utlis/axiosInstance";

const AddEditNotes = ( { noteData,type,getAllNotes, onClose,showToastMessage} ) =>{

    const [title,setTitle] = useState(noteData?.title || "");
    const [tagline,setTagline] = useState(noteData?.tagline || "");
    const [content,setContent] = useState(noteData?.content || "");
    const [tags,setTags] = useState(noteData?.tags || []);

    const [error,setError] = useState(null);

    //add note
    const addNewNote = async () => {
        try{
            const response = await axiosInstance.post("/add-note",{
                title,
                tagline,
                content,
                tags,
            });

            if(response.data && response.data.note){
                showToastMessage("Note Added Successfully");
                getAllNotes()
                onClose()
            }

        }catch (error){
            if(error.response && error.response.data && error.response.data){
                setError(error.response.data.message);
            }
        }
    };

    //edit note
    const editNote = async () => {
        const noteId = noteData._id;
        try{
            const response = await axiosInstance.put("/edit-note/" + noteId ,{
                title,
                tagline,
                content,
                tags,
            });

            if(response.data && response.data.note){
                showToastMessage("Note Updated Successfully");
                getAllNotes()
                onClose()
            }

        }catch (error){
            if(error.response && error.response.data && error.response.data.message){
                setError(error.response.data.message);
            }
        }
    };

    const handleAddNote = () =>{
        if(!title){
            setError("Please enter the title");
            return;
        }
        
        if(!tagline){
            setError("Please enter the Tagline ");
            return;
        }


        if(!content){
            setError("Please enter the content ");
            return;
        }

        // createBrowserRouter("");
        setError("");
        if(type === 'edit'){
            editNote()
        }else{
            addNewNote()
        }
    }


    return (
        <div className="relative" >

            <button className="w-10 h-10 rounded-full items-center justify-center absolute -top-3 -right-3 " onClick={onClose}>
                <MdClose className="text-xl text-slate-400" />
            </button>

            <div className="flex flex-col gap-2" >
                <label className="input-label">Title</label>
                <input type="text"
                className="text-2xl text-slate-950 outline-none bg-slate-50"
                placeholder="Click here to add title"
                value = {title}
                onChange={({target}) => setTitle(target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-2" >
                <label className="input-label">Tagline</label>
                <input type="text"
                className="text-xl text-slate-950 outline-none bg-slate-50" 
                placeholder="Add your tagline here"
                value = {tagline}
                onChange={({target}) => setTagline(target.value)}
                />
            </div>

            <div className="flex flex-col gap-2 mt-4" >
                <label className="input-label"> CONTENT </label>
                <textarea 
                    type="text"
                    className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded "
                    placeholder="Write your content here"
                    rows ={10}
                    value = {content}
                    onChange={({target}) => setContent(target.value)}
                />
            </div>


            {error && <p className="text-red-500 text-xs pt-4">{error}</p>} 

            <button className="btn-primary font-medium mt-5 p-3  hover:bg-green-600 " onClick={handleAddNote} >
                {type === 'edit' ? 'UPDATE' : 'ADD'}
            </button>

        </div>
    )
}

export default AddEditNotes;