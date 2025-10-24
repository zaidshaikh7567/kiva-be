// Utility function to convert Lexical JSON to HTML
export const convertLexicalToHTML = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return '';
  
  return nodes.map(node => {
    switch (node.type) {
      case 'paragraph': {
        const paragraphContent = node.children ? convertLexicalToHTML(node.children) : '';
        // Add margin bottom for spacing between paragraphs
        return `<p style="margin-bottom: 1rem;">${paragraphContent}</p>`;
      }
        
      case 'heading': {
        const headingContent = node.children ? convertLexicalToHTML(node.children) : '';
        const tag = node.tag || 'h1';
        // Add styling for proper display
        const fontSize = tag === 'h1' ? 'font-size: 2rem; font-weight: bold;' : tag === 'h2' ? 'font-size: 1.5rem; font-weight: bold;' : 'font-size: 1.25rem; font-weight: bold;';
        const margin = tag === 'h1' ? 'margin-bottom: 1rem;' : 'margin-bottom: 0.5rem;';
        return `<${tag} style="${fontSize} ${margin} display: block;">${headingContent}</${tag}>`;
      }
        
      case 'list': {
        const listContent = node.children ? convertLexicalToHTML(node.children) : '';
        const listTag = node.listType === 'bullet' ? 'ul' : 'ol';
        const listStyle = node.listType === 'bullet' 
          ? 'style="list-style-type: disc; margin-left: 20px; padding-left: 0;"'
          : 'style="list-style-type: decimal; margin-left: 20px; padding-left: 0;"';
        return `<${listTag} ${listStyle}>${listContent}</${listTag}>`;
      }
        
      case 'listitem': {
        const listItemContent = node.children ? convertLexicalToHTML(node.children) : '';
        return `<li>${listItemContent}</li>`;
      }
        
      case 'text': {
        let textContent = node.text || '';
        
        // Preserve whitespace and convert line breaks
        textContent = textContent.replace(/\n/g, '<br>');
        
        // Apply text formatting
        if (node.format) {
          if (node.format & 1) textContent = `<strong style="font-weight: bold;">${textContent}</strong>`; // bold
          if (node.format & 2) textContent = `<em style="font-style: italic;">${textContent}</em>`; // italic
          if (node.format & 8) textContent = `<u style="text-decoration: underline;">${textContent}</u>`; // underline
        }
        
        // Apply text color if present
        if (node.style && node.style.includes('color:')) {
          textContent = `<span style="${node.style}">${textContent}</span>`;
        }
        
        return textContent;
      }
        
      case 'link': {
        const linkContent = node.children ? convertLexicalToHTML(node.children) : '';
        const url = node.url || '#';
        return `<a href="${url}" class="text-blue-600 underline hover:text-blue-800">${linkContent}</a>`;
      }
        
      default:
        // For unknown node types, try to extract text content
        if (node.children) {
          return convertLexicalToHTML(node.children);
        }
        return node.text || '';
    }
  }).join('');
};

// Function to parse Lexical JSON and convert to HTML
export const parseLexicalDescription = (description) => {
  if (!description) return 'No description available';
  
  try {
    // If it's already HTML, return as is
    if (typeof description === 'string' && description.includes('<')) {
      return description;
    }
    
    // Handle Lexical object directly
    if (typeof description === 'object' && description !== null) {
      if (description.root && description.root.children) {
        return convertLexicalToHTML(description.root.children);
      }
      // If it's an object but not Lexical format, try to convert to string
      return JSON.stringify(description);
    }
    
    // If it's a Lexical JSON string, parse it
    if (typeof description === 'string') {
      const parsed = JSON.parse(description);
      
      if (parsed.root && parsed.root.children) {
        return convertLexicalToHTML(parsed.root.children);
      }
      
      return parsed;
    }
    
    return description;
  } catch (error) {
    console.error('Error parsing description:', error);
    return 'No description available';
  }
};

// Function to extract plain text from Lexical JSON (for previews, etc.)
export const extractPlainText = (description) => {
  if (!description) return 'No description available';
  
  try {
    // If it's already a plain string, return it
    if (typeof description === 'string' && !description.includes('{')) {
      return description;
    }
    
    // Handle Lexical object directly
    if (typeof description === 'object' && description !== null) {
      if (description.root && description.root.children) {
        return extractTextFromNodes(description.root.children);
      }
      // If it's an object but not Lexical format, return generic text
      return 'Product description';
    }
    
    // Parse if it's a JSON string
    let parsed = description;
    if (typeof description === 'string') {
      parsed = JSON.parse(description);
    }
    
    // If it has a root with children, extract text
    if (parsed && parsed.root && parsed.root.children) {
      return extractTextFromNodes(parsed.root.children);
    }
    
    // If it's an object but not Lexical format, try to return string representation
    if (typeof parsed === 'object') {
      return 'Product description';
    }
    
    return description;
  } catch (error) {
    console.error('Error extracting text:', error);
    return 'No description available';
  }
};

// Helper function to extract plain text from nodes
const extractTextFromNodes = (nodes) => {
  if (!nodes || !Array.isArray(nodes)) return '';
  
  return nodes.map(node => {
    if (node.children) {
      return extractTextFromNodes(node.children);
    }
    return node.text || '';
  }).join(' ').trim();
};
