import { createRouter, createWebHistory } from "vue-router";
import NotesList from "../components/Notes.vue";

const routes = [
  { path: "/", redirect: "/notes" },
  { path: "/notes", component: NotesList },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
