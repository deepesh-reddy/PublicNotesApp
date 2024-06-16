import React from "react";
import {MdOutlinePushPin} from "react-icons/md";
import {MdCreate,MdDelete} from "react-icons/md";

const NoteCard = ({
    title,
    date,
    tagline,
    content,
    isPinned,
    onEdit,
    onDelete,
    onPinNote
}) =>{
    return (
        <div className="border rounded p-6 bg-white hover:shadow-xl transition-all ease-in-out" >
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-2xl font-medium" > {title} </h4>
                    {tagline && <p className="text-s text-slate-500 mt-1">{tagline}</p>}
                </div>
                <MdOutlinePushPin className={`icon-bt text-xl ${isPinned ? 'text-green-500' : 'text-slate-300  hover:text-green-500'} `} onClick = {onPinNote} />
            </div>

            <p className="text-l text-slate-600 mt-2" > {content?.slice(0,280)}....... </p>

            <div className="flex items-center justify-between mt-2">
                <div></div>
                <div className="flex items-center gap-2">
                    <MdCreate
                    className="icon-btn hover:text-green-600"
                    onClick={onEdit}
                    />
                    
                    <MdDelete
                    className="icon-btn hover:text-red-500"
                    onClick={onDelete}
                    />

                </div>
            </div>

        </div>

    )
}

export default NoteCard;