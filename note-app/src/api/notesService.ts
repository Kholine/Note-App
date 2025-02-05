import axios from "axios";

const API_URL = "http://localhost:5076/api/notes"; // Adjust based on your backend URL

// Define the Note interface
export interface Note {
  id?: number;
  title: string;
  content: string;
  created?: string;
  updated?: string;
}

export default {
  getAllNotes() {
    return axios.get<Note[]>(API_URL);
  },

  getNoteById(id: number) {
    return axios.get<Note>(`${API_URL}/${id}`);
  },

  createNote(note: Note) {
    return axios.post<Note>(API_URL, note);
  },

  updateNote(id: number, note: Note) {
    return axios.put(`${API_URL}/${id}`, note);
  },

  deleteNote(id: number) {
    return axios.delete(`${API_URL}/${id}`);
  }
};
