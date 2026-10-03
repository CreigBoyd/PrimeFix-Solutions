const fs = require('fs');
const path = require('path');const rootDir = __dirname;

function generateTree(dirPath, prefix = '') {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  entries.sort((a, b) => {
    if (a.isDirectory() && !b.isDirectory()) return -1;
    if (!a.isDirectory() && b.isDirectory()) return 1;
    return a.name.localeCompare(b.name);
  });

  // Filter out excluded directories before processing to ensure correct tree branching
  const filteredEntries = entries.filter(entry => 
    entry.name !== 'node_modules' && 
    entry.name !== 'vendor' && 
    !entry.name.startsWith('.git')
  );

  const lastIndex = filteredEntries.length - 1;
  let treeString = '';

  filteredEntries.forEach((entry, index) => {
    const isLast = index === lastIndex;
    treeString += prefix + (isLast ? '└── ' : '├── ') + entry.name + (entry.isDirectory() ? '/' : '') + '\n';

    if (entry.isDirectory()) {
      treeString += generateTree(
        path.join(dirPath, entry.name),
        prefix + (isLast ? '    ' : '│   ')
      );
    }
  });

  return treeString;
}

const projectName = path.basename(rootDir);
const tree = `${projectName}/\n${generateTree(rootDir)}`;
const mdContent = `# Complete Project File Structure\n\n\`\`\`\n${tree}\`\`\`\n`;

fs.writeFileSync('File_Tree.md', mdContent);
console.log('File_Tree.md generated successfully (excluding vendor)!');