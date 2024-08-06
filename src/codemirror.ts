import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { noctisLilac } from "thememirror";
// import { tags } from "@lezer/highlight";
// import { HighlightStyle } from "@codemirror/language";

/* definindo área de código com codemirror */
const fixedHeightEditor = EditorView.theme({
    "&": {height: "100%", fontSize: "2em"}
});

const myFont = EditorView.contentAttributes.of({class: "pontilhada"});

/* const myHighlightStyle = HighlightStyle.define([
    {tag: }
]) */

let startstate = EditorState.create({
    doc: "750\n751\n050\n251\n160\n860\n000\n20\n35",
    extensions: [
        keymap.of(defaultKeymap),
        noctisLilac,
        fixedHeightEditor,
        myFont
    ]
});

let view = new EditorView({
    state: startstate,
    parent: document.getElementById("porta-cartoes")!
});

export function getDoc() {
    return view.state.doc.toString();
}

export function setDoc(text: string) {
    view.dispatch({changes: {
        from: 0,
        to: view.state.doc.length,
        insert: text
    }})
}