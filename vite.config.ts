import { defineConfig } from 'vite';
export default defineConfig({base:'./',server:{host:'0.0.0.0',port:18437},preview:{host:'0.0.0.0',port:18437},build:{target:['es2020','safari15.4'],chunkSizeWarningLimit:700}});
