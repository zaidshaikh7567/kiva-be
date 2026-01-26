import { useEffect, useRef } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

const UpdateEditorStatePlugin = ({ editorStateStr }) => {
  const [editor] = useLexicalComposerContext();
  const lastAppliedStateRef = useRef(null);
  const mountedRef = useRef(false);

  useEffect(() => {
    // Skip if the state string is the same as last applied (prevents StrictMode double-invocation issues)
    if (editorStateStr === lastAppliedStateRef.current) {
      return;
    }

    if (editorStateStr && typeof editorStateStr === 'string' && editorStateStr.trim()) {
      try {
        // Validate it's proper JSON before parsing
        JSON.parse(editorStateStr);
        
        // Get current editor state
        const currentState = editor.getEditorState();
        const currentJson = JSON.stringify(currentState.toJSON());
        
        // Only update if the content is actually different
        if (currentJson !== editorStateStr) {
          const newEditorState = editor.parseEditorState(editorStateStr);
          editor.setEditorState(newEditorState);
          lastAppliedStateRef.current = editorStateStr;
          mountedRef.current = true;
        } else if (!mountedRef.current) {
          // First mount but content is already the same, just track it
          lastAppliedStateRef.current = editorStateStr;
          mountedRef.current = true;
        }
      } catch (e) {
        console.error('Error parsing editor state in plugin:', e);
      }
    } else if (editorStateStr === '' && lastAppliedStateRef.current !== '') {
      // Handle case where value is cleared - reset to empty state
      // This is handled by the initialConfig, so we just track it
      lastAppliedStateRef.current = editorStateStr;
    }
  }, [editor, editorStateStr]);

  return null;
};

export default UpdateEditorStatePlugin;
