console.log('IT’S ALIVE!');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

// Auto navigation menu
let pages = [
  { url: '', title: 'Home' },
  { url: 'projects/', title: 'Projects' },
  { url: 'resume/', title: 'Resume' },
  { url: 'contact/', title: 'Contact' },
  { url: 'https://github.com/soschloss', title: 'GitHub' },
];
let nav = document.createElement('nav');
document.body.prepend(nav);
const BASE_PATH = (location.hostname === "localhost" || location.hostname === "127.0.0.1")
  ? "/"                  // Local server
  : "/portfolio/";       // GitHub Pages repo name
for (let p of pages) {
  let url = p.url;
  url = !url.startsWith('http') ? BASE_PATH + url : url;
  let title = p.title;
  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );
  if (a.host !== location.host) {
    a.setAttribute('target', '_blank');
  }
  nav.append(a);
}
// Light/dark mode toggle
// Drop down list
document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select>
			<option value="light dark">Automatic</option>
            <option value="light">Light</option>
            <option value="dark">Dark</option>
		</select>
	</label>`,
);
function setColorScheme(scheme) {
  document.documentElement.style.setProperty('color-scheme', scheme);
  select.value = scheme;
}

let select = document.querySelector('.color-scheme select');

if ('colorScheme' in localStorage) {
  setColorScheme(localStorage.colorScheme);
}

select.addEventListener('input', function (event) {
  localStorage.colorScheme = event.target.value;
  setColorScheme(event.target.value);
});

// import projects data
export async function fetchJSON(url) {
  try {
    // Fetch the JSON file from the given URL
    const response = await fetch(url);
    // console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching or parsing JSON data:', error);
  }
}
// Render projects
export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  // Validate heading level
  const validHeadings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
  if (!validHeadings.includes(headingLevel)) {
    headingLevel = 'h2';
  }
  // Clear existing content
  containerElement.innerHTML = '';
  // Create and append project elements 
  for (const project of projects) {
    const article = document.createElement('article');
    const title = project.title ?? 'Untitled Project';
    const image = project.image 
      ? `${BASE_PATH}images/${project.image}` 
      : 'https://vis-society.github.io/labs/2/images/empty.svg';
    const alt = project.title ?? 'No image available';
    const description = project.description ?? 'No description available';

    article.innerHTML = `
      <${headingLevel}>${title}</${headingLevel}>
      <img src="${image}" alt="${alt}">
      <p>${description}</p>
    `;
    containerElement.appendChild(article);
  }
}

// Load GitHub data
export async function fetchGithubData(username) {
  return fetchJSON(`https://api.github.com/users/${username}`);
}

