import { FORMAT_TEXT_COMMAND } from 'lexical';
import { LinkNode, AutoLinkNode } from '@lexical/link';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import React, { useState, useCallback, useEffect } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HeadingNode, $createHeadingNode, $isHeadingNode } from '@lexical/rich-text';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { $isLinkNode, TOGGLE_LINK_COMMAND as TOGGLE_LINK } from '@lexical/link';
import { $getSelection, $isRangeSelection, $createParagraphNode, $createTextNode } from 'lexical';
import { $setBlocksType } from '@lexical/selection';

import { $isListNode, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND, REMOVE_LIST_COMMAND } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { ListNode, ListItemNode } from '@lexical/list';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import UpdateEditorStatePlugin from './UpdateEditorStatePlugin';
import { Bold, Italic, Underline, Type, Link, List, ListOrdered, Palette, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isHeading, setIsHeading] = useState(false);
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showHeadingDropdown, setShowHeadingDropdown] = useState(false);

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

      // Check for list types
      const anchorNode = selection.anchor.getNode();
      const element = anchorNode.getKey() === 'root'
        ? anchorNode
        : anchorNode.getTopLevelElementOrThrow();
      
      if ($isListNode(element)) {
        const listType = element.getListType();
        setIsBulletList(listType === 'bullet');
        setIsNumberedList(listType === 'number');
      } else {
        setIsBulletList(false);
        setIsNumberedList(false);
      }

      // Check if current element is a heading
      if ($isHeadingNode(element)) {
        setIsHeading(true);
      } else {
        setIsHeading(false);
      }
    }
  }, []);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        updateToolbar();
      });
    });
  }, [editor, updateToolbar]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showHeadingDropdown && !event.target.closest('.heading-dropdown')) {
        setShowHeadingDropdown(false);
      }
      if (showColorPicker && !event.target.closest('.color-picker')) {
        setShowColorPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showHeadingDropdown, showColorPicker]);

  const formatText = (formatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };

  const insertHeading = (headingLevel = 'h1') => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        // Check if we're already in a heading
        const anchorNode = selection.anchor.getNode();
        const element = anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
        
        if ($isHeadingNode(element)) {
          // If already a heading, convert back to paragraph
          $setBlocksType(selection, () => $createParagraphNode());
        } else {
          // Try to use $setBlocksType first
          try {
            $setBlocksType(selection, () => $createHeadingNode(headingLevel));
          } catch {
            // Fallback: manually replace the element
            const selectedText = selection.getTextContent();
            const headingNode = $createHeadingNode(headingLevel);
            
            if (selectedText) {
              // If there's selected text, create a text node and append it
              const textNode = $createTextNode(selectedText);
              headingNode.append(textNode);
            }
            
            // Replace the current element with the heading
            element.replace(headingNode);
            headingNode.select();
          }
        }
      }
    });
    setShowHeadingDropdown(false);
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

  const insertBulletList = () => {
    if (isBulletList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  };

  const insertNumberedList = () => {
    if (isNumberedList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  };

  const applyTextColor = (color) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.getType() === 'text') {
            node.setStyle(`color: ${color}`);
          }
        });
      }
    });
    setShowColorPicker(false);
  };

  const colorOptions = [
    '#000000', '#333333', '#666666', '#999999', '#CCCCCC',
    '#FF0000', '#FF6600', '#FFCC00', '#00FF00', '#0066FF',
    '#6600FF', '#FF0066', '#00FFFF', '#FF00FF', '#FFFF00'
  ];

  return (
    <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2 bg-gray-50">
      {/* Text Formatting */}
      <div className="flex gap-1 border-r border-gray-300 pr-2">
        <button
          type="button"
          onClick={() => formatText('bold')}
          className={`p-2 rounded border transition-colors ${isBold
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => formatText('italic')}
          className={`p-2 rounded border transition-colors ${isItalic
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>
        <button
          type="button"
          onClick={() => formatText('underline')}
          className={`p-2 rounded border transition-colors ${isUnderline
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          title="Underline"
        >
          <Underline size={16} />
        </button>
      </div>

      {/* Headings */}
      <div className="flex gap-1 border-r border-gray-300 pr-2 relative heading-dropdown">
        <button
          type="button"
          onClick={() => setShowHeadingDropdown(!showHeadingDropdown)}
          className={`p-2 rounded border transition-colors ${isHeading
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          title="Heading"
        >
          <Type size={16} />
        </button>
        
        {showHeadingDropdown && (
          <div className="absolute top-full left-0 mt-1 p-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 min-w-[120px]">
            <button
              type="button"
              onClick={() => insertHeading('h1')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              Heading 1
            </button>
            <button
              type="button"
              onClick={() => insertHeading('h2')}
              className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 rounded"
            >
              Heading 2
            </button>
            <button
              type="button"
              onClick={() => insertHeading('h3')}
              className="w-full text-left px-3 py-1 text-sm hover:bg-gray-100 rounded"
            >
              Heading 3
            </button>
          </div>
        )}
      </div>

      {/* Lists */}
      <div className="flex gap-1 border-r border-gray-300 pr-2">
        <button
          type="button"
          onClick={insertBulletList}
          className={`p-2 rounded border transition-colors ${isBulletList
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={insertNumberedList}
          className={`p-2 rounded border transition-colors ${isNumberedList
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>
      </div>

      {/* Links */}
      <div className="flex gap-1 border-r border-gray-300 pr-2">
        <button
          type="button"
          onClick={insertLink}
          className={`p-2 rounded border transition-colors ${isLink
            ? 'bg-primary text-white border-primary'
            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          title="Insert Link"
        >
          <Link size={16} />
        </button>
      </div>

      {/* Text Color */}
      <div className="flex gap-1 relative color-picker">
        <button
          type="button"
          onClick={() => setShowColorPicker(!showColorPicker)}
          className="p-2 rounded border bg-white text-gray-700 border-gray-300 hover:bg-gray-100 transition-colors"
          title="Text Color"
        >
          <Palette size={16} />
        </button>
        
        {showColorPicker && (
          <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
            <div className="grid grid-cols-5 gap-1">
              {colorOptions.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => applyTextColor(color)}
                  className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        )}
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
    h2: 'text-2xl font-bold mb-3 text-gray-900',
    h3: 'text-xl font-bold mb-2 text-gray-900',
  },
  link: 'text-blue-600 underline hover:text-blue-800',
  text: {
    bold: 'font-bold',
    italic: 'italic',
    underline: 'underline',
  },
  list: {
    nested: {
      listitem: 'list-none',
    },
    ol: 'list-decimal list-inside mb-2',
    ul: 'list-disc list-inside mb-2',
    listitem: 'mb-1',
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
      ListNode,
      ListItemNode,
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
        <ListPlugin />
        <OnChangePlugin onChange={handleChange} />
        <UpdateEditorStatePlugin editorStateStr={value} />
        <SetEditablePlugin isDisabled={disabled} />
      </LexicalComposer>
    </div>
  );
};

export default RichTextEditor;
