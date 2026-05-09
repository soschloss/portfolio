import { fetchJSON, renderProjects, fetchGithubData } from './global.js';
const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');
// Render latest projects
renderProjects(latestProjects, projectsContainer, 'h2');
// Parse github data
const githubData = await fetchGithubData('soschloss');
const profileStats = document.querySelector('#profile-stats');
if (profileStats) {
  profileStats.innerHTML = `
        <dl>
          <div><dt>Public Repos</dt><dd>${githubData.public_repos}</dd></div>
          <div><dt>Followers</dt><dd>${githubData.followers}</dd></div>
          <div><dt>Following</dt><dd>${githubData.following}</dd></div>
          <div><dt>Public Gists</dt><dd>${githubData.public_gists}</dd></div>
        </dl>
    `;
}