const fs = require('fs');

const content = fs.readFileSync('src/pages/Articolo.tsx', 'utf-8');
const lines = content.split('\n');

const stack = [];
let insideComment = false;

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // skip single line comments and simple inline JSX comments 
    if (line.trim().startsWith('//')) continue;
    let cleanLine = line.replace(/\{?\/\*.*?\*\/\}?/g, ''); // inline comments
    
    // match tags
    const tagRegex = /"([^"]*)"|'([^']*)'|<([a-zA-Z0-9_\.]+)([^>]*?)(\/?)>|<\/([a-zA-Z0-9_\.]+)[^>]*>/g;
    let match;
    
    while ((match = tagRegex.exec(cleanLine)) !== null) {
        if (match[1] || match[2]) continue; // inside string
        
        const isSelfClosing = match[5] === '/';
        const openTag = match[3];
        const closeTag = match[6];
        
        if (openTag && !isSelfClosing) {
            // ignore self-closing components without the slash e.g. <br>, <img>, <link>, <meta>, <input>, <hr>
            if (['br', 'img', 'link', 'meta', 'input', 'hr', 'script'].includes(openTag)) continue;
            stack.push({ tag: openTag, line: i + 1 });
        } else if (closeTag) {
            if (['br', 'img', 'link', 'meta', 'input', 'hr', 'script'].includes(closeTag)) continue;
            
            if (stack.length > 0) {
                const last = stack[stack.length - 1];
                if (last.tag === closeTag) {
                    stack.pop();
                } else {
                    console.error(`Mismatch at line ${i + 1}: found </${closeTag}>, expected </${last.tag}> (opened at ${last.line})`);
                    process.exit(1);
                }
            } else {
                console.error(`Extra closing tag </${closeTag}> at line ${i + 1}`);
                process.exit(1);
            }
        }
    }
}

if (stack.length > 0) {
    console.error(`Unclosed tags remaining: ${stack.map(s => `<${s.tag}> (line ${s.line})`).join(', ')}`);
} else {
    console.log("All tags matched perfectly!");
}
