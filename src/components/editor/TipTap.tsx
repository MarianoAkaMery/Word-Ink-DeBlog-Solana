"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "./Toolbar";
import Underline from "@tiptap/extension-underline";
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

import "./Tiptap.css"; // Import your CSS file for styling

const Tiptap = ({ onChange, content }: any) => {
  const handleChange = (newContent: string) => {
    onChange(newContent);
  };

  const fileToBase64 = (file: File): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  };

  const validateImageDimensions = (file: File): Promise<{ width: number, height: number }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const domImage = new (window as any).Image() as HTMLImageElement; // Casting to HTMLImageElement
        domImage.onload = () => {
          resolve({ width: domImage.width, height: domImage.height });
        };
        domImage.onerror = reject;
        domImage.src = event.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Placeholder.configure({
        placeholder: "Write something …",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: true,
      })
    ],  immediatelyRender: false,

    editorProps: {
      attributes: {
        class: "editor-custom", // Add a custom class for styling
      },
      handleDrop(view, event, slice, moved) {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          const filesize = file.size / (1024 * 1024); // get the filesize in MB

          if ((file.type === "image/jpeg" || file.type === "image/png") && filesize < 10) {
            validateImageDimensions(file).then(({ width, height }) => {
              if (width > 5000 || height > 5000) {
                window.alert("Your images need to be less than 5000 pixels in height and width.");
              } else {
                fileToBase64(file).then((base64Image) => {
                  const { schema } = view.state;
                  const coordinates = view.posAtCoords({ left: event.clientX, top: event.clientY });

                  if (coordinates) {
                    const imageNode = schema.nodes.image.create({ src: base64Image as string });
                    const transaction = view.state.tr.insert(coordinates.pos, imageNode);
                    view.dispatch(transaction);
                  }
                }).catch(() => {
                  window.alert("There was a problem converting your image, please try again.");
                });
              }
            }).catch(() => {
              window.alert("There was a problem validating your image, please try again.");
            });

            return true;
          } else {
            window.alert("Images need to be in jpg or png format and less than 10mb in size.");
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      handleChange(editor.getHTML());
    },
  });

  return (
    <div className="editor-container">
      <Toolbar editor={editor} content={content} />
      <EditorContent className="editor" editor={editor} />
    </div>
  );
};

export default Tiptap;
