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

// Select pie chart wedge
let selectedIndex = -1;
let query = '';

// Set colors for each year
let allRolledData = d3.rollups(projects, (v) => v.length, (d) => d.year);
let colors = d3.scaleOrdinal(d3.schemeTableau10)
  .domain(allRolledData.map(([year]) => String(year)));

// Filter projects based on year and pie chart selection
function getFilteredProjects() {
  return projects.filter((project) => {
    let matchesSearch = Object.values(project).join('\n').toLowerCase().includes(query.toLowerCase());
    let matchesYear = selectedIndex === -1 || String(project.year) === String(allRolledData[selectedIndex]?.[0]);
    return matchesSearch && matchesYear;
  });
}
function getSearchFilteredProjects() {
  return projects.filter((project) => {
    return Object.values(project).join('\n').toLowerCase().includes(query.toLowerCase());
  });
}

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
  // let colors = d3.scaleOrdinal(d3.schemeTableau10);

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
      .attr('style', `--color:${colors(String(d.label))}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
  newArcs.forEach((arc, i) => {
    newSVG
      .append('path')
      .attr('d', arc)
      .attr('fill', colors(String(newData[i].label)))
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        newSVG
          .selectAll('path')
          .attr('class', (_, idx) => (
            idx === selectedIndex ? 'selected' : ''
        ));
        legend
          .selectAll('li')
          .attr('class', (_, idx) => (
            idx === selectedIndex ? 'selected' : ''
         ));
        // if (selectedIndex === -1) {
        //   renderProjects(projects, projectsContainer, 'h2');
        // } else {
        //   // TODO: filter projects and project them onto webpage
        //   // Hint: `.label` might be useful
        //   let selectedYear = newData[selectedIndex].label;
        //   let filteredProjects = projects.filter((project) => String(project.year) === String(selectedYear));
        //   renderProjects(filteredProjects, projectsContainer, 'h2');
        // }
        renderProjects(getFilteredProjects(), projectsContainer, 'h2');
      });
    });
  newSVG
    .selectAll('path')
    .attr('class', (_, idx) => (
      idx === selectedIndex ? 'selected' : ''
    ));
  legend
    .selectAll('li')
    .attr('class', (_, idx) => (
      idx === selectedIndex ? 'selected' : ''
    ));
}

// Call this function on page load
renderPieChart(getSearchFilteredProjects());

// Search functionality
const searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
  query = event.target.value;
  let filteredProjects = getFilteredProjects();
  renderProjects(filteredProjects, projectsContainer, 'h2');
  renderPieChart(getSearchFilteredProjects());
});

