const fs = require('fs');
const path = require('path');

const excludedFiles = [
  'LandingPage.tsx',
  'FlagshipArticle.tsx',
  'ConstraintMonitor.tsx',
  'OperatorReports.tsx',
  'ConstraintMap.tsx',
  'InteractiveConstraintMap.tsx',
  'BuildoutTrackerHub.tsx',
  'MarketTrackerHub.tsx',
  'CompanyDetail.tsx',
  'EvidenceSectorPage.tsx'
];

const excludedDirs = [
  'tracker',
  'monitor'
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (!excludedDirs.includes(f)) {
        walkDir(dirPath, callback);
      }
    } else {
      if (f.endsWith('.tsx') || f.endsWith('.ts')) {
        if (!excludedFiles.includes(f)) {
          callback(dirPath);
        }
      }
    }
  });
}

function replaceColors(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Backgrounds
  content = content.replace(/bg-\[\#F5F5F0\]/g, 'bg-[#1a2633]');
  content = content.replace(/bg-tpl-bg/g, 'bg-[#1a2633]');
  content = content.replace(/bg-white/g, 'bg-[#0f1a24]');
  content = content.replace(/bg-black/g, 'bg-white');
  
  // Text colors
  content = content.replace(/text-\[\#000000\]/g, 'text-slate-200');
  content = content.replace(/text-black/g, 'text-slate-900'); // Wait, if bg is dark, text-black -> text-white
  content = content.replace(/text-tpl-ink/g, 'text-white');
  content = content.replace(/text-tpl-slate/g, 'text-slate-300');
  content = content.replace(/text-tpl-steel/g, 'text-slate-400');
  content = content.replace(/text-\[\#2D3748\]/g, 'text-slate-300');
  
  // Borders
  content = content.replace(/border-black\/5/g, 'border-white/5');
  content = content.replace(/border-black\/10/g, 'border-white/10');
  content = content.replace(/border-tpl-ink\/10/g, 'border-white/10');
  content = content.replace(/border-tpl-ink\/30/g, 'border-white/30');
  content = content.replace(/border-tpl-ink/g, 'border-white/20');
  content = content.replace(/border-\[\#dcd9d5\]/g, 'border-white/5');

  // Specific card backgrounds
  content = content.replace(/bg-\[\#f9f8f5\]/g, 'bg-[#0f1a24]');
  content = content.replace(/bg-\[\#1c1b19\]/g, 'bg-[#0f1a24]');
  
  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated', filePath);
  }
}

walkDir('src/components', replaceColors);
walkDir('src/pages', replaceColors);
