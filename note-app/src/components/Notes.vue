<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useNotesStore } from "../stores/notes";
import { Plus, Trash2, Edit2, Search, X } from "lucide-vue-next";

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
  <div class="flex h-screen bg-gray-50">
    <!-- Sidebar -->
    <div class="w-1/3 bg-white p-6 shadow-lg border-r">
      <h1 class="text-3xl font-semibold text-gray-900 mb-6 flex items-center">
        📒 My Notes
      </h1>

      <!-- Search & Sorting -->
      <div class="flex items-center bg-gray-100 rounded-lg p-2 mb-4">
        <Search class="text-gray-500 w-5 h-5 mr-2" />
        <input
          v-model="store.searchQuery"
          placeholder="Search notes..."
          class="w-full bg-transparent outline-none"
        />
      </div>

      <div class="flex justify-between items-center mb-4">
        <span class="text-sm text-gray-500">Sort by:</span>
        <select v-model="store.sortBy" class="p-2 border rounded-lg bg-gray-100">
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
          class="p-4 bg-white shadow-md rounded-lg border cursor-pointer hover:bg-gray-100 transition-all"
          @click="openNote(note)"
        >
          <h3 class="text-lg font-semibold text-gray-800">{{ note.title }}</h3>
          <p class="text-gray-500 text-sm truncate">{{ note.content }}</p>
        </div>
      </div>
      <p v-else class="text-center text-gray-400">No notes found.</p>

      <!-- Add Note Button -->
      <button
        @click="showAddForm = !showAddForm"
        class="w-full mt-6 flex items-center justify-center p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        <Plus class="w-5 h-5 mr-2" />
        {{ showAddForm ? "Cancel" : "Add Note" }}
      </button>

      <!-- Add Note Form (Collapsible) -->
      <div v-if="showAddForm" class="mt-4 space-y-4 transition-all duration-300">
        <input
          v-model="newNote.title"
          placeholder="Title"
          class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <textarea
          v-model="newNote.content"
          placeholder="Content"
          class="w-full p-3 border rounded-lg h-32 focus:outline-none focus:ring-2 focus:ring-blue-400"
        ></textarea>
        <button @click="addNote" class="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">
          Save Note
        </button>
      </div>
    </div>

    <!-- Note Viewer/Editor -->
    <div v-if="selectedNote" class="w-2/3 p-8">
      <div class="flex justify-between items-center">
        <h2 class="text-3xl font-semibold text-gray-900">
          {{ isEditing ? "Edit Note" : "View Note" }}
        </h2>
        <button @click="selectedNote = null" class="text-gray-500 hover:text-red-500">
          <X class="w-6 h-6" />
        </button>
      </div>

      <div class="mt-4 bg-white shadow-lg rounded-lg p-6">
        <input
          v-if="isEditing"
          v-model="selectedNote.title"
          class="w-full p-3 text-xl font-semibold border rounded-lg"
        />
        <h3 v-else class="text-2xl font-bold text-gray-800">{{ selectedNote.title }}</h3>

        <textarea
          v-if="isEditing"
          v-model="selectedNote.content"
          class="w-full p-3 mt-2 h-64 border rounded-lg"
        ></textarea>
        <p v-else class="text-gray-700 mt-4 text-lg">{{ selectedNote.content }}</p>

        <div class="flex space-x-4 mt-6">
          <button
            @click="isEditing = !isEditing"
            class="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
          >
            <Edit2 class="w-5 h-5 mr-2" />
            {{ isEditing ? "Save" : "Edit" }}
          </button>
          <button
            @click="deleteNote(selectedNote.id)"
            class="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            <Trash2 class="w-5 h-5 mr-2" />
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
