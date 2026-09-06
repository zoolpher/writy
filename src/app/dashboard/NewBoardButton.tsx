"use client";

import { useState } from "react";
import { createNewBoard } from "./actions";
import { Loader2 } from "lucide-react";

export function NewBoardButton({ nextNumber }: { nextNumber: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setIsLoading(true);
    // If the user leaves it completely blank, assign the default "Untitled n"
    const finalTitle = title.trim() || `Untitled ${nextNumber}`;
    
    const formData = new FormData();
    formData.append("title", finalTitle);
    
    await createNewBoard(formData);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition shadow-sm"
      >
        + New Board
      </button>
      
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-gray-900 mb-2">Name your Room</h2>
            <p className="text-sm text-gray-500 mb-4">What would you like to call this whiteboard?</p>
            
            <input 
              autoFocus
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Untitled ${nextNumber}`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6 text-gray-900 bg-white placeholder:text-gray-400"
              onKeyDown={(e) => { 
                if (e.key === "Enter") handleCreate(); 
                if (e.key === "Escape") setIsOpen(false);
              }}
            />
            
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsOpen(false)} 
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreate} 
                disabled={isLoading} 
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
