"use client";

import { FileSignature, Trash2, Edit2, Loader2 } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteBoard, renameBoard, openBoard } from "./actions";

export function BoardCard({ room }: { room: any }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(room.metadata.title || "Untitled Board");
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpen = async () => {
    setIsLoading(true);
    await openBoard(room.id);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to completely delete this board?")) {
      setIsDeleting(true); // Show loading state on the card
      await deleteBoard(room.id);
      
      // Force Next.js to immediately refresh the dashboard UI
      router.refresh(); 
    }
  };

  const handleRename = async (e: React.FormEvent | React.FocusEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsEditing(false);
    
    if (title.trim() !== "" && title !== room.metadata.title) {
      setIsLoading(true);
      await renameBoard(room.id, title);
      setIsLoading(false);
      
      // Force Next.js to immediately refresh the dashboard UI
      router.refresh();
    } else {
      setTitle(room.metadata.title);
    }
  };

  // If it's currently being deleted, we can completely hide it to make it feel instant
  if (isDeleting) return null; 

  return (
    <div 
      onClick={handleOpen}
      className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-blue-200 transition group cursor-pointer h-36 flex flex-col justify-between relative overflow-hidden"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      <div className="flex items-start justify-between relative z-0">
        <div className="flex items-center gap-3 text-gray-700 group-hover:text-blue-600 transition w-full">
          <FileSignature className="w-5 h-5 text-blue-500 shrink-0" />
          
          {isEditing ? (
            <form onSubmit={handleRename} className="w-full mr-12">
              <input 
                type="text" 
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleRename}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-2 py-1 text-sm border border-blue-400 rounded outline-none"
              />
            </form>
          ) : (
            <h3 className="font-semibold truncate pr-16">{title}</h3>
          )}
        </div>
        
        {!isEditing && (
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition absolute -top-1 -right-1">
            <button 
              onClick={(e) => { e.stopPropagation(); setIsEditing(true); }} 
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={handleDelete} 
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 font-medium relative z-0">
        {room.metadata.createdAt 
          ? new Date(room.metadata.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) 
          : "Recently created"}
      </div>
    </div>
  );
}
