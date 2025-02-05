import { defineStore } from "pinia";
import { ref } from "vue";
import notesService from "../api/notesService";
import type { Note } from "../api/notesService";

export const useNotesStore = defineStore("notes", () => {
  const notes = ref<Note[]>([]);
  const searchQuery = ref("");
  const sortBy = ref("newest");

  // Fetch all notes
  const fetchNotes = async () => {
    try {
      const response = await notesService.getAllNotes();
      notes.value = response.data;
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add a new note
  const addNote = async (note: Note) => {
    try {
      await notesService.createNote(note);
      fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Update a note
  const updateNote = async (id: number, updatedNote: Note) => {
    try {
      await notesService.updateNote(id, { ...updatedNote, updated: new Date().toISOString() });
      fetchNotes();
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Delete a note
  const deleteNote = async (id: number) => {
    if (confirm("Are you sure?")) {
      try {
        await notesService.deleteNote(id);
        fetchNotes();
      } catch (error) {
        console.error("Error deleting note:", error);
      }
    }
  };

  // Computed: Filtered & sorted notes
  const filteredNotes = () => {
    let results = [...notes.value];

    // Search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      results = results.filter(
        (note) => note.title.toLowerCase().includes(query) || note.content.toLowerCase().includes(query)
      );
    }

    // Sorting
    if (sortBy.value === "newest") {
      results.sort((a, b) => new Date(b.created!).getTime() - new Date(a.created!).getTime());
    } else if (sortBy.value === "oldest") {
      results.sort((a, b) => new Date(a.created!).getTime() - new Date(b.created!).getTime());
    } else if (sortBy.value === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    }

    return results;
  };

  return { notes, fetchNotes, addNote, updateNote, deleteNote, searchQuery, sortBy, filteredNotes };
});
