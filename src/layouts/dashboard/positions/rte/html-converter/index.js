import { generateHTML } from "@tiptap/html";
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


export function ToHTML({data}) {

    console.log('to html', data);

    return generateHTML(data, [
        Document,
        History,
        Paragraph,
        Text,
        Link,
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
        Highlight,
    ])

}