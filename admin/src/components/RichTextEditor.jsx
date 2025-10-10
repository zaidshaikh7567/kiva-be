import { FORMAT_TEXT_COMMAND } from 'lexical';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import React, { useState, useCallback, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HeadingNode, $createHeadingNode } from '@lexical/rich-text';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $isLinkNode, TOGGLE_LINK_COMMAND as TOGGLE_LINK } from '@lexical/link';
import { $getSelection, $isRangeSelection, $createParagraphNode } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import UpdateEditorStatePlugin from './UpdateEditorStatePlugin';

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isHeading, setIsHeading] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));

      const node = selection.getNodes()[0];
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if (elementDOM.tagName === 'H1') setIsHeading(true);
        else setIsHeading(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  const formatText = (formatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };

  const insertHeading = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
        const elementDOM = editor.getElementByKey(element.getKey());
        if (elementDOM && elementDOM.tagName === 'H1') {
          const paragraphNode = $createParagraphNode();
          selection.insertNodes([paragraphNode]);
        } else {
          const headingNode = $createHeadingNode('h1');
          selection.insertNodes([headingNode]);
        }
      }
    });
  };

  const insertLink = () => {
    if (!isLink) {
      const url = prompt('Enter URL:');
      if (url) {
        editor.dispatchCommand(TOGGLE_LINK, { url });
      }
    } else {
      editor.dispatchCommand(TOGGLE_LINK, null);
    }
  };

  return (
    <div className="border-b border-gray-200 p-1 flex flex-wrap gap-2">
      <div className="flex gap-1">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className={`px-3 py-1 text-sm font-medium rounded border ${isBold
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className={`px-3 py-1 text-sm font-medium rounded border ${isItalic
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className={`px-3 py-1 text-sm font-medium rounded border ${isUnderline
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
        >
          U
        </button>
      </div>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={insertHeading}
          className={`px-3 py-1 text-sm rounded border ${isHeading
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
        >
          Heading
        </button>
      </div>

      <div className="flex gap-1">
        <button
          type="button"
          onClick={insertLink}
          className={`px-3 py-1 text-sm rounded border ${isLink
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
        >
          Link
        </button>
      </div>
    </div>
  );
};

const SetEditablePlugin = ({ isDisabled }) => {
  const [editor] = useLexicalComposerContext();
  useEffect(() => {
    editor.setEditable(!isDisabled);
  }, [editor, isDisabled]);
  return null;
};

const theme = {
  paragraph: 'mb-2',
  heading: {
    h1: 'text-3xl font-bold mb-4 text-gray-900',
  },
  link: 'text-blue-600 underline hover:text-blue-800',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
};

const RichTextEditor = ({ value, onChange, placeholder = 'Start writing...', disabled }) => {
  // Parse the initial value if provided
  const getInitialEditorState = () => {
    if (value && typeof value === 'string' && value.trim()) {
      try {
        // Validate it's proper JSON
        JSON.parse(value);
        return value;
      } catch (e) {
        console.error('Invalid initial editor state:', e);
        return undefined;
      }
    }
    return undefined;
  };

  const initialConfig = {
    namespace: 'RichTextEditor',
    theme,
    onError: (error) => {
      console.error('Lexical error:', error);
    },
    nodes: [
      HeadingNode,
      LinkNode,
      AutoLinkNode,
    ],
    editorState: getInitialEditorState(),
    editable: !disabled,
  };

  const handleChange = useCallback((editorState) => {
    const content = JSON.stringify(editorState.toJSON());
    onChange(content);
  }, [onChange]);

  return (
    <div className="border border-gray-300 rounded-b-lg overflow-hidden">
      <LexicalComposer initialConfig={initialConfig}>
        <div className="bg-white">
          <Toolbar />
          <div className="relative">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="min-h-[200px] p-4 focus:outline-none"
                  style={{ minHeight: '200px' }}
                />
              }
              placeholder={
                <div className="absolute top-4 left-4 text-gray-400 pointer-events-none">
                  {placeholder}
                </div>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
        </div>
        <HistoryPlugin />
        <AutoFocusPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={handleChange} />
        <UpdateEditorStatePlugin editorStateStr={value} />
        <SetEditablePlugin isDisabled={disabled} />
      </LexicalComposer>
    </div>
  );
};

export default RichTextEditor;
