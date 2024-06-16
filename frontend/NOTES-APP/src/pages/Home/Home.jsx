import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import AddEditNotes from "./AddEditNotes";
import Modal from "react-modal";
import axiosInstance from "../../utlis/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/images/add-notes.png";
import NoDataImg from "../../assets/images/no-data.jpg";
import Pagination from "../../components/Pagination/Pagination";


const Home = () =>{

    const [openAddEditModal,setOpenAddEditModal] = useState({
        isShown:false,
        type:"add",
        data :null,
    });

    const [showToastMsg, setShowToastMsg] = useState({
        isShown :false,
        message : "",
        type : "add",
    });

    const [isSearch,setIsSearch] = useState(false);

    const handleEdit = (noteDetails) =>{
        setOpenAddEditModal({isShown: true, data: noteDetails, type:"edit"});
    }

    const showToastMessage = (message,type) =>{
        setShowToastMsg({
            isShown:true,
            message,
            type,
        })
    }

    const handleCloseToast = () =>{
        setShowToastMsg({
            isShown:false,
            message:"",
        })
    }

    




    const [allNotes,setAllNotes] = useState([]);

    // get all notes
    const getAllNotes = async (page = 1, limit = 6) => {
        try {
            const response = await axiosInstance.get("/get-all-notes", {
            params: { page, limit },
        });
            setAllNotes(response.data.notes);
        //   setTotalNotes(response.data.totalNotes);
        } catch (error) {
            console.log("An unexpected error occurred. Please try again");
        }
    };

    //delete note
    const deleteNote = async (data) => {
        const noteId = data._id;
        try{
            const response = await axiosInstance.delete("/delete-note/" + noteId);

            if(response.data && !response.data.error){
                showToastMessage("Note Deleted Successfully" , 'delete');
                getAllNotes()  
            }

        }catch (error){
            if(error.response && error.response.data && error.response.data.message){
                console.log("An unexpected error occurred.Please try again");
            }
        }
    }

    //search for a note
    const onSearchNote = async (query) => {
        try{
            const response = await axiosInstance.get("/search-note",{
                params: {query},
            });

            if(response.data && response.data.notes){
                setIsSearch(true);
                setAllNotes(response.data.notes);
            }
        }catch (error){
            console.log(error);
        }
    }

    //update isPinned
    const updateIsPinned = async (noteData) =>{
        const noteId = noteData._id;
    try {
        const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
            isPinned: !noteData.isPinned
        });

        
        if (response.data && response.data.note) {
            const message = noteData.isPinned ? "Note Unpinned Successfully" : "Note Pinned Successfully";
            const type = noteData.isPinned ? "delete" : "success";
            showToastMessage(message, type);
            getAllNotes();
        }

    } catch (error) {
        console.log(error);
        showToastMessage("An error occurred", "delete");
    }
    };

    //Pagination
    const [currentPage,setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(6);

    const lastPostIndex = currentPage * postsPerPage;
    const firstPostIndex = lastPostIndex - postsPerPage;
    const currentPosts = allNotes.slice(firstPostIndex,lastPostIndex);


    const handleClearSearch = () => {
        setIsSearch(false);
        getAllNotes();
    }
    

    useEffect(() =>{
        getAllNotes();
        return () => {};
    },[]);


    return (
        <>

            <Navbar onSearchNote = {onSearchNote} handleClearSearch= {handleClearSearch} />

            <div className="container mx-auto">
    {allNotes.length > 0 ? (
    <>
        <div className="mar grid grid-cols-3 gap-4 mt-8">
        {currentPosts.map((item, index) => (
            <NoteCard
            key={item._id}
            title={item.title}
            tagline={item.tagline}
            content={item.content}
            isPinned={item.isPinned}
            onEdit={() => handleEdit(item)}
            onDelete={() => deleteNote(item)}
            onPinNote={() => updateIsPinned(item)}
    />
        ))}
    </div>
    <Pagination
        totalPosts={allNotes.length}
        postsPerPage={postsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
    />
    </>
    ) : (
    // shows a card when there is no note
    <EmptyCard
        imgSrc={isSearch ? NoDataImg : AddNotesImg}
        message={
        isSearch
    ? `Oops! No notes found matching your search`
    : `Start creating first note! Click the 'Add' button to create first note`
    }
    />
    )}
</div>

            <button className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-green-600 absolute right-10 bottom-10" onClick={() =>{
                setOpenAddEditModal({isShown:true,type:"add",data:null});
            }} >
                <MdAdd className = "text-[32px] text-white " />
            </button>

            <Modal
            isOpen = {openAddEditModal.isShown}
            onRequestClose = {() => {}}
            style = {{
                overlay:{
                    backgroundColor : "rgb(0,0,0,0.2)",
                },
            }}
            contentLabel = ""
            className = "w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-scroll " 
            >
            <AddEditNotes
            type = {openAddEditModal.type}
            noteData={openAddEditModal.data}
            onClose={() => {
                setOpenAddEditModal ({isShown:false, type:"add" ,data: null});
            }}
            getAllNotes = {getAllNotes}
            showToastMessage = {showToastMessage}
            />
            </Modal>

            <Toast
            isShown = {showToastMsg.isShown}
            message = {showToastMsg.message}
            type = {showToastMsg.type}
            onClose = {handleCloseToast}
            />

        </>
    )
}

export default Home;