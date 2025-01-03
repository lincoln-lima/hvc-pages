import { EditorState } from "@codemirror/state";
import { defaultKeymap } from "@codemirror/commands";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
// -----------------------------------------------------------------------------------
const initialcode = (localStorage.getItem("code")) ? localStorage.getItem("code") : "0-50\n105\n805\n000";

const editorid = EditorView.editorAttributes.of({ id: "editor" });

const codechange = EditorView.updateListener.of(update => {
    if(update.docChanged) localStorage.setItem("code", getDoc());
});
// -----------------------------------------------------------------------------------
const startstate = EditorState.create({
    doc: initialcode!,
    extensions: [
        keymap.of(defaultKeymap),
        lineNumbers(),
        codechange,
        editorid,
    ]
});
// -----------------------------------------------------------------------------------
const view = new EditorView({
    state: startstate,
    parent: document.getElementById("porta-cartoes")!
});
// -----------------------------------------------------------------------------------
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
    });
}