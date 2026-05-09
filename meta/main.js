import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// Read loc.csv
async function loadData() {
  const data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line), // or just +row.line
    depth: Number(row.depth),
    length: Number(row.length),
    date: new Date(row.date + 'T00:00' + row.timezone),
    datetime: new Date(row.datetime),
  }));

  return data;
}

function processCommits(data) {
  return d3
    .groups(data, (d) => d.commit)
    .map(([commit, lines]) => {
      let first = lines[0];
      let { author, date, time, timezone, datetime } = first;
      let ret = {
        id: commit,
        url: 'https://github.com/soschloss/portfolio/commit/' + commit,
        author,
        date,
        time,
        timezone,
        datetime,
        hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
        totalLines: lines.length,
      };

      Object.defineProperty(ret, 'lines', {
        value: lines,
        enumerable: false,
        configurable: false,
        writable: false
      });

      return ret;
    });
}

function addStat(dl, label, value) {
  const div = dl.append('div');
  div.append('dt').text(label);
  div.append('dd').text(value);
}

function renderCommitInfo(data, commits) {
  const dl = d3.select('#stats').append('dl').attr('class', 'stats');

  // Total LOC
  addStat(dl, 'Total LOC', data.length);

  // Total commits
  addStat(dl, 'Commits', commits.length);

  // Number of files
  const numFiles = d3.group(data, d => d.file).size;
  addStat(dl, 'Files', numFiles);

  // Longest line length
  const maxLength = d3.max(data, d => d.length);
  addStat(dl, 'Longest line', maxLength + ' chars');

  // Longest file (by line count)
  //   const fileLengths = d3.rollup(data, v => v.length, d => d.file);
  //   const longestFile = d3.greatest(fileLengths, ([, count]) => count);
  //   addStat(dl, 'Longest file', `${longestFile[0].split('/').pop()} (${longestFile[1]} lines)`);

  // Time of day most work is done
  const workByPeriod = d3.rollups(
    data,
    (v) => v.length,
    (d) => new Date(d.datetime).toLocaleString('en', { dayPeriod: 'short' }),
  );
  const maxPeriod = d3.greatest(workByPeriod, (d) => d[1])?.[0];
  addStat(dl, 'Peak coding time', maxPeriod);
}

let data = await loadData();

// Compute commit data
let commits = processCommits(data);

// Render commit information
renderCommitInfo(data, commits);


// console.log(commits);