"use client";

import styles from './toolbar.module.css';
import React, { useCallback, useState, useRef } from "react";
import { type Editor } from "@tiptap/react";
import {
    Bold,
    Strikethrough,
    Italic,
    List,
    ListOrdered,
    Underline,
    Quote,
    Undo,
    Redo,
    Code,
    Heading,
    Link,
    Image
} from "lucide-react";

type Props = {
    editor: Editor | null;
    content: string;
};

const Toolbar = ({ editor, content }: Props) => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl || '');

        // cancelled or empty
        if (url === null || url === '') {
            editor?.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        // update link
        editor?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const toggleLink = () => {
        if (editor?.isActive('link')) {
            editor.chain().focus().unsetLink().run();
        } else {
            setLink();
        }
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result as string;
                editor?.chain().focus().setImage({ src: base64Image }).run();
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const addImage = useCallback(() => {
        triggerFileInput();
    }, []);

    if (!editor) {
        return null;
    }

    return (
        <div className={styles.customToolbar}>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleHeading({ level: 2 }).run();
                }}
                className={
                    editor.isActive("heading", { level: 2 })
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Heading className={styles.icon} />
            </button>

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleBold().run();
                }}
                className={
                    editor.isActive("bold")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Bold className={styles.icon} />
            </button>

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleItalic().run();
                }}
                className={
                    editor.isActive("italic")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Italic className={styles.icon} />
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleUnderline().run();
                }}
                className={
                    editor.isActive("underline")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Underline className={styles.icon} />
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleStrike().run();
                }}
                className={
                    editor.isActive("strike")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Strikethrough className={styles.icon} />
            </button>

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleBulletList().run();
                }}
                className={
                    editor.isActive("bulletList")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <List className={styles.icon} />
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleOrderedList().run();
                }}
                className={
                    editor.isActive("orderedList")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <ListOrdered className={styles.icon} />
            </button>
            <button
                type="button"
                onClick={addImage}
                className={
                    editor.isActive("redo")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Image className={styles.icon} />
            </button>

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().toggleBlockquote().run();
                }}
                className={
                    editor.isActive("blockquote")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Quote className={styles.icon} />
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().setCode().run();
                }}
                className={
                    editor.isActive("code")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Code className={styles.icon} />
            </button>
            {/* LINK */}
            <button
                type="button"
                onClick={toggleLink}
                className={
                    editor.isActive("link")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Link className={styles.icon} />
            </button>

            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().undo().run();
                }}
                className={
                    editor.isActive("undo")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Undo className={styles.icon} />
            </button>
            <button
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    editor.chain().focus().redo().run();
                }}
                className={
                    editor.isActive("redo")
                        ? styles.customToolbarBtnActive
                        : styles.customToolbarBtn
                }
            >
                <Redo className={styles.icon} />
            </button>
            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
        </div>
    );
};

export default Toolbar;
