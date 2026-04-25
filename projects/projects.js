import { fetchJSON, renderProjects } from '../global.js';
// Fetch project data
const projects = await fetchJSON('../lib/projects.json');
// Select projects container
const projectsContainer = document.querySelector('.projects');
// Render projects
renderProjects(projects, projectsContainer, 'h2');
// Add number of projects to title
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;
