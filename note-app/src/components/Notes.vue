<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useNotesStore } from "../stores/notes";

const store = useNotesStore();
const selectedNote = ref(null);
const isEditing = ref(false);
const showAddForm = ref(false);
const newNote = ref({ title: "", content: "" });

// Computed: Get filtered & sorted notes
const notes = computed(() => store.filteredNotes());

// Fetch notes on mount
onMounted(store.fetchNotes);

// Add a new note
const addNote = async () => {
  if (!newNote.value.title || !newNote.value.content) return;
  await store.addNote(newNote.value);
  newNote.value = { title: "", content: "" };
  showAddForm.value = false;
};

// Open a note for viewing/editing
const openNote = (note) => {
  selectedNote.value = { ...note };
  isEditing.value = false;
};

// Update a note
const updateNote = async () => {
  if (!selectedNote.value) return;
  await store.updateNote(selectedNote.value.id, selectedNote.value);
  selectedNote.value = null;
};

// Delete a note
const deleteNote = async (id) => {
  await store.deleteNote(id);
  selectedNote.value = null;
};
</script>

<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <div class="w-1/2 bg-gray-100 p-6 overflow-auto">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Notes</h1>

      <!-- Search & Sorting -->
      <div class="flex space-x-2 mb-4">
        <input
          v-model="store.searchQuery"
          placeholder="Search notes..."
          class="w-full p-2 border rounded-md"
        />
        <select v-model="store.sortBy" class="p-2 border rounded-md">
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="title">Title</option>
        </select>
      </div>

      <!-- Notes List -->
      <div v-if="notes.length" class="space-y-4">
        <div
          v-for="note in notes"
          :key="note.id"
          class="p-4 bg-white shadow-sm rounded-lg border cursor-pointer hover:bg-gray-200 transition"
          @click="openNote(note)"
        >
          <strong class="text-lg text-gray-900">{{ note.title }}</strong>
          <p class="text-gray-600 text-sm">{{ note.content.substring(0, 50) }}...</p>
        </div>
      </div>
      <p v-else class="text-center text-gray-500">No notes found.</p>

      <!-- Add Note Button -->
      <button
        @click="showAddForm = !showAddForm"
        class="w-full mt-6 p-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
      >
        {{ showAddForm ? "Cancel" : "Add Note" }}
      </button>

      <!-- Add Note Form (Collapsible) -->
      <div v-if="showAddForm" class="mt-4 space-y-4 transition-all duration-300">
        <input v-model="newNote.title" placeholder="Title" class="w-full p-3 border rounded-md" />
        <textarea v-model="newNote.content" placeholder="Content" class="w-full p-3 border rounded-md"></textarea>
        <button @click="addNote" class="w-full p-3 bg-green-500 text-white rounded-md hover:bg-green-600">
          Save Note
        </button>
      </div>
    </div>

    <!-- Note Viewer/Editor -->
    <div v-if="selectedNote" class="w-1/2 p-8">
      <h2 class="text-3xl font-semibold text-gray-900 mb-4">
        {{ isEditing ? "Edit Note" : "View Note" }}
      </h2>

      <input v-if="isEditing" v-model="selectedNote.title" class="w-full p-3 text-xl font-semibold border rounded-md" />
      <h3 v-else class="text-2xl font-bold text-gray-800">{{ selectedNote.title }}</h3>

      <textarea v-if="isEditing" v-model="selectedNote.content" class="w-full p-3 mt-2 h-64 border rounded-md"></textarea>
      <p v-else class="text-gray-700 mt-4 text-lg">{{ selectedNote.content }}</p>

      <div class="flex space-x-2 mt-6">
        <button @click="isEditing = !isEditing" class="px-4 py-2 bg-yellow-500 text-white rounded-md">
          {{ isEditing ? "Save" : "Edit" }}
        </button>
        <button @click="deleteNote(selectedNote.id)" class="px-4 py-2 bg-red-500 text-white rounded-md">Delete</button>
      </div>
    </div>
  </div>
</template>
