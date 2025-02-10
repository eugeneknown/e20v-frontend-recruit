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
import Highlight from "@tiptap/extension-highlight";
// Custom
import * as Icons from "./icons";
// import { LinkModal } from "./LinkModal";
import './styles.css';
import { Autocomplete, Icon, MenuItem, Popover, Select, TextField } from "@mui/material";
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";
import { SketchPicker } from "react-color";
import MDBox from "components/MDBox";
import Indent from "./IndentExtension";

export function SimpleEditor({onChange, content, readOnly}) {

    const [font, setFont] = useState('Arial')
    const [fontSize, setFontSize] = useState('12px')
    const [modalIsOpen, setIsOpen] = useState(false);
    const [url, setUrl] = useState("");
    const [highlight, setHighlight] = useState('#FFFF00')
    const [highlightAnchorEl, setHighlightAnchorEl] = useState(null)

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
        Indent,
        Highlight.configure({ multicolor: true }),
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

    const fontFamilies = [
        "Arial",
        "Verdana",
        "Tahoma",
        "Trebuchet MS",
        "Georgia",
        "Times New Roman",
        "Courier New",
        "Lucida Console",
        "Comic Sans MS",
        "Impact",
        "Palatino Linotype",
        "Garamond",
        "Roboto",
        "Open Sans",
        "Lato",
        "Montserrat",
        "Oswald",
        "Raleway",
        "Nunito",
        "Poppins",
        "Merriweather",
        "Quicksand",
        "Bebas Neue",
        "Source Sans Pro",
        "PT Sans",
        "Ubuntu",
        "Fira Sans",
        "Muli",
        "Work Sans",
        "Overpass",
        "Barlow",
        "Josefin Sans",
        "Cabin",
        "Karla",
        "Manrope",
        "Inter",
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

    const handleColorChange = useCallback(
        (color) => {
          setHighlight(color.hex);
          if (editor) editor.chain().focus().setHighlight({ color: color.hex }).run()
    },[editor]);

    const handleOpenHighlight = useCallback((event) => {
        setHighlightAnchorEl(event.currentTarget);
    }, []);
    
    const handleCloseHighlight = useCallback(() => {
        setHighlightAnchorEl(null);
    }, []);

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

    const toggleHighlight = useCallback((color) => {
        const isHighlighted = editor.isActive("highlight", { color: highlight });
        if (isHighlighted) {
            editor.chain().focus().unsetHighlight().run();
        } else {
            editor.chain().focus().setHighlight({ color: highlight }).run();
        }
    }, [editor, highlight])

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
                <MDBox display='flex'>
                <button
                className={classNames("menu-button", {
                    "is-active": editor.isActive("highlight")
                })}
                style={{
                    color: "#242e39",
                    cursor: "pointer",
                    border: 0,
                    borderRadius: 0,
                }}
        
                onClick={toggleHighlight}
                >
                <FormatColorFillIcon />
                </button>
                <button
                onClick={handleOpenHighlight}
                className={classNames("menu-button", {
                    "is-active": editor.isActive("highlight")
                })}
                style={{
                    padding: "8px 12px",
                    border: 0,
                    borderRadius: 0,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    width: 45,
                }}
                >
                <svg width="20" height="20">
                    <circle cx="10" cy="10" r="8" fill={highlight} stroke="#000" strokeWidth="1" />
                </svg>
                </button>
                </MDBox>
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

            <Popover
                open={Boolean(highlightAnchorEl)}
                anchorEl={highlightAnchorEl}
                onClose={handleCloseHighlight}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <SketchPicker color={highlight} onChangeComplete={handleColorChange} />
            </Popover>

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