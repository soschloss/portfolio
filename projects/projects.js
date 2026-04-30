import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
// Fetch project data
let projects = await fetchJSON('../lib/projects.json');
// Select projects container
const projectsContainer = document.querySelector('.projects');
// Render projects
renderProjects(projects, projectsContainer, 'h2');
// Add number of projects to title
const projectsTitle = document.querySelector('.projects-title');
projectsTitle.textContent = `${projects.length} Projects`;

// Refactor all plotting into one function
function renderPieChart(projectsGiven) {
  // re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );
  // re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });
  // re-calculate slice generator, arc data, arc, etc.
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let newSliceGenerator = d3.pie().value((d) => d.value);
  let newArcData = newSliceGenerator(newData);
  let newArcs = newArcData.map((d) => arcGenerator(d));
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // clear up paths and legends
  let newSVG = d3.select('svg');
  newSVG.selectAll('path').remove();
  d3.select('.legend').selectAll('li').remove();
  // update paths and legends
  let legend = d3.select('.legend');
  newData.forEach((d, idx) => {
    legend
      .append('li')
      .attr('class', 'legend-item')
      .attr('style', `--color:${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
  newArcs.forEach((arc, idx) => {
    newSVG
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(idx));
    });
}

// Call this function on page load
renderPieChart(projects);

// Search functionality
let query = '';
const searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(filteredProjects);
});
