"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import Placeholder from '@tiptap/extension-placeholder'
import Link from '@tiptap/extension-link'

import "./TipTap.css"; // Import your CSS file for styling

const Tiptap = ({ onChange, content }: any) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };
  
  const editor = useEditor({
    extensions: [StarterKit, Underline, Placeholder.configure({
      // Use a placeholder:
      placeholder: 'Write something …',}),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    editorProps: {
      attributes: {
        class: "editor-custom", // Add a custom class for styling
      },
    }, 
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  return (
    <div className="editor-container">
      <Toolbar editor={editor} content={content}/>
      <EditorContent className="editor"  editor={editor} />
    </div>
  );
};

export default Tiptap;