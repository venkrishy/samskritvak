// This script updates the admin panel styling to match the dark theme
// Run this to apply consistent dark theme styling to all form elements

const fs = require('fs');
const path = require('path');

const adminPanelPath = path.join(__dirname, '../src/components/admin/AdminPanel.jsx');

let content = fs.readFileSync(adminPanelPath, 'utf8');

// Update all Label components to have text-white class
content = content.replace(/<Label htmlFor="([^"]*)"(?!.*text-white)/g, '<Label htmlFor="$1" className="text-white"');

// Update all Input components to have dark theme classes
content = content.replace(/<Input\s+([^>]*?)(?!.*className)/g, '<Input $1 className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"');

// Update all Textarea components to have dark theme classes  
content = content.replace(/<Textarea\s+([^>]*?)(?!.*className)/g, '<Textarea $1 className="bg-white/10 border-white/20 text-white placeholder:text-gray-300"');

// Update Card components to have dark theme
content = content.replace(/<Card(?!.*bg-white\/10)/g, '<Card className="bg-white/10 backdrop-blur-sm border-white/20"');

// Update CardTitle to have white text
content = content.replace(/<CardTitle(?!.*text-white)/g, '<CardTitle className="text-white"');

fs.writeFileSync(adminPanelPath, content);

console.log('✅ Admin panel styling updated successfully!');

