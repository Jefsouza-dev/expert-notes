import { NoteCard } from "./components/note-card";
import { NewNoteCard } from "./components/new-note-card";
import { ChangeEvent, useState } from "react";

interface note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [search, setSearch] = useState("");
  const [notes, setNotes] = useState<note[]>(() => {
    const notesOnStorage = localStorage.getItem("notes");

    if (notesOnStorage) {
      return JSON.parse(notesOnStorage);
    }

    return [];
  });

  function onNoteCreated(content: string) {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const currentNotes = [newNote, ...notes];

    setNotes(currentNotes);

    localStorage.setItem("notes", JSON.stringify(currentNotes));
  }

  function onNoteDeleted(id: string) {
    const currentNotes = notes.filter((note) => note.id !== id);

    setNotes(currentNotes);

    localStorage.setItem("notes", JSON.stringify(currentNotes));
  }

  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    const { value: query } = event.target;

    setSearch(query);
  }

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLowerCase().includes(search.toLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <form className="w-full">
        <input
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
          type="text"
          placeholder="Busque em suas notas"
          onChange={handleSearch}
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDeleted={onNoteDeleted} />
        ))}
      </div>
    </div>
  );
}
