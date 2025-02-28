import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
// -----------------------------------------------------------------------------------
const params = new URLSearchParams(window.location.search);
const initial = localStorage.getItem("code")! || "0-50\n105\n805\n000";

const code = localStorage.getItem("saved")! != "true" && params.has("code") ? params.get("code")! : initial;
// -----------------------------------------------------------------------------------
const editorid = EditorView.editorAttributes.of({ id: "editor" });
// -----------------------------------------------------------------------------------
const codechange = EditorView.updateListener.of(update => {
    if(localStorage.getItem("saved")! != "false" && update.docChanged) localStorage.setItem("saved", "false");
});
// -----------------------------------------------------------------------------------
const startstate = EditorState.create({
    doc: code,
    extensions: [
        editorid,
        history(),
        lineNumbers(),
        keymap.of(defaultKeymap),
        keymap.of(historyKeymap),
        codechange,
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