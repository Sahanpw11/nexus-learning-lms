const fs = require('fs');
const path = require('path');

const pages = [
  'Users.js',
  'Students.js', 
  'Analytics.js',
  'Notifications.js',
  'Settings.js'
];

const replacements = [
  { from: /bg-black/g, to: 'style={{backgroundColor:"#fcfcf7"}}' },
  { from: /bg-gradient-dark/g, to: 'style={{backgroundColor:"#fcfcf7"}}' },
  { from: /text-white(?![^<]*>)/g, to: 'text-gray-800' },
  { from: /text-text-white-muted/g, to: 'text-gray-600' },
  { from: /text-text-white-subtle/g, to: 'text-gray-500' },
  { from: /hover:text-white/g, to: 'hover:text-gray-800' },
  { from: /bg-white\/5/g, to: 'bg-gray-100' },
  { from: /bg-white\/10/g, to: 'bg-gray-100' },
  { from: /hover:bg-white\/5/g, to: 'hover:bg-gray-100' },
  { from: /hover:bg-white\/10/g, to: 'hover:bg-gray-100' },
  { from: /border-white\/10/g, to: 'border-gray-300' },
  { from: /border-white\/20/g, to: 'border-gray-300' },
  { from: /placeholder-text-white-muted/g, to: 'placeholder-gray-500' },
  { from: /placeholder:text-text-white-subtle/g, to: 'placeholder:text-gray-500' }
];

pages.forEach(page => {
  const filePath = path.join('frontend', 'src', 'pages', page);
  
  if (fs.existsSync(filePath)) {
    console.log(`Updating ${page}...`);
    
    let content = fs.readFileSync(filePath, 'utf8');
    
    replacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });
    
    fs.writeFileSync(filePath, content);
    console.log(`${page} updated successfully`);
  }
});

console.log('All pages updated!');
