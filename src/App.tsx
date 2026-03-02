import { useEffect, useState } from 'react'
import './App.css'

type Note = { id: number; text: string };

function App() {
  const [text, setText] = useState<string>("");
  const [notes, setNotes] = useState<Note[]>([]);

  // Charge les notes depuis le stockage Chrome au démarrage
  useEffect(() => {
    chrome.storage.sync.get({ notes: [] }, (data: { notes: Note[] }) => {
      setNotes(data.notes);
    });
  }, []);

  // Sauvegarde automatiquement les notes dans le stockage Chrome à chaque modification
  useEffect(() => {
    chrome.storage.sync.set({ notes });
  }, [notes])

  const addNote = () => {
    if (!text.trim()) return;

    const newNote: Note = { 
      id: Date.now(), 
      text: text.trim() 
    };

    setNotes([newNote, ...notes]);
    setText("");
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((n) => n.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      addNote();
    }
  }

  return (
    <div className="w-80 p-5 bg-white rounded-xl shadow-lg font-sans border border-gray-100">
      {/* Titre de l'application */}
      <h2 className="text-2xl font-bold mb-1 text-gray-800">
        Notes rapides
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Capturez vos idées en quelques secondes
      </p>

      {/* Zone d'ajout de note */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-500
                     focus:border-blue-500 transition"
          type="text"
          placeholder="Ajouter une nouvelle note..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium
                     hover:bg-blue-600 active:scale-95 transition"
          onClick={addNote}
        >
          Ajouter
        </button>
      </div>

      {/* Liste des notes */}
      <div className="max-h-72 overflow-y-auto pr-1">
        {notes.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400 text-sm">
              Aucune note pour le moment
            </p>
            <p className="text-gray-300 text-xs mt-1">
              Commencez par ajouter votre première note ✨
            </p>
          </div>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            className="group flex justify-between items-start mb-3 p-3
                       bg-gray-50 rounded-lg border border-gray-100
                       hover:shadow-sm transition"
          >
            {/* Texte de la note */}
            <span className="text-sm text-gray-700 wrap-break-word pr-2">
              {note.text}
            </span>

            {/* Bouton de suppression */}
            <button
              className="text-gray-400 hover:text-red-500 text-xs font-medium
                         opacity-0 group-hover:opacity-100 transition"
              onClick={() => deleteNote(note.id)}
              title="Supprimer la note"
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>

      {/* Pied d'application */}
      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400 text-center">
        Stockage synchronisé avec votre navigateur
      </div>
    </div>
  )
}

export default App
