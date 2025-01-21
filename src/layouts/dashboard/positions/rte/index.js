import React, { useCallback, useEffect, useState } from "react";
import classNames from "classnames";
// => Tiptap packages
import { useEditor, EditorContent, Editor, BubbleMenu } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Link from "@tiptap/extension-link";
import Bold from "@tiptap/extension-bold";
import Underline from "@tiptap/extension-underline";
import Italic from "@tiptap/extension-italic";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import History from "@tiptap/extension-history";
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import TextStyle from '@tiptap/extension-text-style'
import FontFamily from '@tiptap/extension-font-family'
import FontSize from 'tiptap-extension-font-size'
// Custom
import * as Icons from "./icons";
// import { LinkModal } from "./LinkModal";
import './styles.css';
import { Autocomplete, Icon, MenuItem, Select, TextField } from "@mui/material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

export function SimpleEditor({onChange, content, readOnly}) {

    const [font, setFont] = useState('Arial')
    const [fontSize, setFontSize] = useState('12px')
    const [modalIsOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");

    const editor = useEditor({
        extensions: [
        Document,
        History,
        Paragraph,
        Text,
        Link.configure({
            openOnClick: false
        }),
        Bold,
        Underline,
        Italic,
        Strike,
        Code,
        ListItem,
        BulletList,
        OrderedList,
        TextStyle,
        FontFamily,
        FontSize,
        ],
        editable: !readOnly,
        content,
        onUpdate: ({editor}) => {
            onChange(editor.getHTML())
            if (editor) {
                const attrs = editor.getAttributes('textStyle')
                setFont(attrs.fontFamily || 'Arial')
                setFontSize(attrs.fontSize || '12px')
            }
        },
    });

    // const fontFamily = [
    //     {
    //         title: 'Comic Sans',
    //         font: '"Comic Sans MS", "Comic Sans"'
    //     },
    //     {
    //         title: 'Serif',
    //         font: 'serif'
    //     },
    //     {
    //         title: 'Monospace',
    //         font: 'monospace'
    //     },
    //     {
    //         title: 'Cursive',
    //         font: 'cursive'
    //     },
    // ]

    const fontFamilies = [
        "Arial",
        "Georgia",
        "Tahoma",
        "Courier New",
        "Times New Roman",
        "Verdana",
        "Comic Sans MS",
    ];
    const fontSizes = ["12px", "14px", "16px", "18px", "20px"];

    const openModal = useCallback(() => {
        console.log(editor.chain().focus());
        setUrl(editor.getAttributes("link").href);
        setIsOpen(true);
    }, [editor]);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        setUrl("");
    }, []);

    const saveLink = useCallback(() => {
        if (url) {
        editor
            .chain()
            .focus()
            .extendMarkRange("link")
            .setLink({ href: url, target: "_blank" })
            .run();
        } else {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        }
        closeModal();
    }, [editor, url, closeModal]);

    const removeLink = useCallback(() => {
        editor.chain().focus().extendMarkRange("link").unsetLink().run();
        closeModal();
    }, [editor, closeModal]);

    const handleFontChange = (event) => {
        const selectedFont = event.target.value;
        setFont(selectedFont);
    
        if (editor) {
          editor.chain().focus().setFontFamily(selectedFont).run();
        }
    };

    const handleFontSizeChange = (event, newValue) => {
        const selectedSize = newValue || event.target.value;
        setFontSize(selectedSize);
    
        editor.chain().focus().setFontSize(selectedSize).run();
    };

    useEffect(() => {
        if (!editor) return;
    
        const handleSelectionChange = () => {
            const attrs = editor.getAttributes("textStyle");
            setFont(attrs.fontFamily || "Arial");
            setFontSize(attrs.fontSize || '12px')
        };
    
        editor.on("selectionUpdate", handleSelectionChange);
        return () => {
            editor.off("selectionUpdate", handleSelectionChange);
        };
    }, [editor]);

    const toggleBold = useCallback(() => {
        editor.chain().focus().toggleBold().run();
    }, [editor]);

    const toggleUnderline = useCallback(() => {
        editor.chain().focus().toggleUnderline().run();
    }, [editor]);

    const toggleItalic = useCallback(() => {
        editor.chain().focus().toggleItalic().run();
    }, [editor]);

    const toggleBulletList = useCallback(() => {
        editor.chain().focus().toggleBulletList().run();
    }, [editor]);

    const toggleOrderedList = useCallback(() => {
        editor.chain().focus().toggleOrderedList().run();
    }, [editor]);

    const toggleStrike = useCallback(() => {
        editor.chain().focus().toggleStrike().run();
    }, [editor]);

    const toggleCode = useCallback(() => {
        editor.chain().focus().toggleCode().run();
    }, [editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="editor">
            <div className="menu" style={{ display: 'flex' }}>
                {/* <button
                className="menu-button"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                >
                <Icons.RotateLeft />
                </button>
                <button
                className="menu-button"
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                >
                <Icons.RotateRight />
                </button> */}
                <Select
                    value={font}
                    onChange={handleFontChange}
                    displayEmpty
                    variant="outlined"
                    size="small"
                    sx={{ minWidth: 150, py: .9 }}
                >
                    {fontFamilies.map((font) => (
                        <MenuItem key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                        </MenuItem>
                    ))}
                </Select>
                <Autocomplete
                    value={fontSize}
                    onInputChange={handleFontSizeChange}
                    freeSolo
                    options={fontSizes}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            variant="outlined"
                        />
                    )}
                    sx={{ minWidth: 75 }}
                />
                <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("bold")
                })}
                onClick={toggleBold}
                >
                <Icons.Bold />
                </button>
                <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("underline")
                })}
                onClick={toggleUnderline}
                >
                <Icons.Underline />
                </button>
                <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("intalic")
                })}
                onClick={toggleItalic}
                >
                <Icons.Italic />
                </button>
                <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("bulletList")
                })}
                onClick={toggleBulletList}
                >
                <FormatListBulletedIcon />
                </button>
                <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("orderedList")
                })}
                onClick={toggleOrderedList}
                >
                <FormatListNumberedIcon />
                </button>
                <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("link")
                })}
                onClick={openModal}
                >
                <Icons.Link />
                </button>
                <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("strike")
                })}
                onClick={toggleStrike}
                >
                <Icons.Strikethrough />
                </button>
                <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("code")
                })}
                onClick={toggleCode}
                >
                <Icons.Code />
                </button>
            </div>

            <BubbleMenu
                className="bubble-menu-light"
                tippyOptions={{ duration: 150 }}
                editor={editor}
                shouldShow={({ editor, view, state, oldState, from, to }) => {
                // only show the bubble menu for links.
                return from === to && editor.isActive("link");
                }}
            >
                <button className="button" onClick={openModal}>
                Edit
                </button>
                <button className="button-remove" onClick={removeLink}>
                Remove
                </button>
            </BubbleMenu>

            <EditorContent editor={editor} />

            {/* <LinkModal
                url={url}
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                contentLabel="Edit Link Modal"
                closeModal={closeModal}
                onChangeUrl={(e) => setUrl(e.target.value)}
                onSaveLink={saveLink}
                onRemoveLink={removeLink}
            /> */}
        </div>
    );
}