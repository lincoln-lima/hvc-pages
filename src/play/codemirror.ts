import { globals } from "../default";
// -----------------------------------------------------------------------------------
import { EditorState } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
// -----------------------------------------------------------------------------------
let code;
const params = new URLSearchParams(window.location.search);
// -----------------------------------------------------------------------------------
const container = document.querySelector(".container-editor")!;
// -----------------------------------------------------------------------------------
const unSaved = () => {
    container.classList.add("unsaved");
    globals.changeStorage("saved", "false");
}
// -----------------------------------------------------------------------------------
if(params.has("code")) {
    const url = new URL(window.location.href);

    unSaved();
    code = params.get("code")!;

    url.searchParams.delete("code");
    window.history.pushState({}, "", url.toString());
}
else {
    globals.changeStorage("saved", "true");
    code = localStorage.getItem("code")! || "0-50\n105\n805\n000";
}
// -----------------------------------------------------------------------------------
const editorid = EditorView.editorAttributes.of({ id: "editor" });
// -----------------------------------------------------------------------------------
const codechange = EditorView.updateListener.of(update => {
    if(localStorage.getItem("saved")! != "false" && update.docChanged) unSaved();
});
// -----------------------------------------------------------------------------------
const startstate = EditorState.create({
    doc: code,
    extensions: [
        editorid,
        history(),
        codechange,
        lineNumbers(),
        keymap.of(defaultKeymap),
        keymap.of(historyKeymap),
    ]
});
// -----------------------------------------------------------------------------------
const view = new EditorView({
    state: startstate,
    parent: container
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