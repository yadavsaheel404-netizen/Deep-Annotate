import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        about: resolve(__dirname, 'about.html'),
        blog: resolve(__dirname, 'blog.html'),
        careers: resolve(__dirname, 'careers.html'),
        caseStudies: resolve(__dirname, 'case-studies.html'),
        dataForage: resolve(__dirname, 'data-forage.html'),
        datasetLibrary: resolve(__dirname, 'dataset-library.html'),
        datasets: resolve(__dirname, 'datasets.html'),
        fullTime: resolve(__dirname, 'full-time.html'),
        howItWorks: resolve(__dirname, 'how-it-works.html'),
        programs: resolve(__dirname, 'programs.html'),
        services: resolve(__dirname, 'services.html'),
        blogsIndex: resolve(__dirname, 'blogs/index.html'),
        caseStudiesIndex: resolve(__dirname, 'case-studies/index.html'),
        datasetsIndex: resolve(__dirname, 'datasets/index.html'),
      }
    }
  }
});
