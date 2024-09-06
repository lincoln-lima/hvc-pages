import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";

// import { tags } from "@lezer/highlight";
// import { HighlightStyle } from "@codemirror/language";

/* const myHighlightStyle = HighlightStyle.define([
    {tag: }
]) */

const initialcode = (localStorage.getItem("code")) ? localStorage.getItem("code") : "0-50\n150\n850\n000";

const editorclass = EditorView.editorAttributes.of({ class: "editor" });
const contentclass = EditorView.contentAttributes.of({ class: "content" });

const codechange = EditorView.updateListener.of(update => {
    if(update.docChanged) localStorage.setItem("code", getDoc());
})

let startstate = EditorState.create({
    doc: initialcode!,
    extensions: [
        keymap.of(defaultKeymap),
        lineNumbers(),
        codechange,
        editorclass,
        contentclass
    ]
});

let view = new EditorView({
    state: startstate,
    parent: document.getElementById("porta-cartoes")!
});

export const getDoc = () => {
    return view.state.doc.toString();
}

export const setDoc = (text: string) => {
    view.dispatch({
        changes: {
            from: 0,
            to: view.state.doc.length,
            insert: text
        }
    })
}