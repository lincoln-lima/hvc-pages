import {EditorState} from "@codemirror/state"
import {EditorView, keymap} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"
import {dracula} from 'thememirror';

let startState = EditorState.create({
    doc: "Hello World",
    extensions: [
        keymap.of(defaultKeymap),
        dracula
    ]
})

const editor_area = document.querySelector("#editor-area");

/* function editorFromTextArea(textarea, extensions) {
    let view = new EditorView({doc: textarea.value, extensions})
    textarea.parentNode.insertBefore(view.dom, textarea)
    textarea.style.display = "none"
    if (textarea.form) textarea.form.addEventListener("submit", () => {
      textarea.value = view.state.doc.toString()
    })
    return view
} */

// let view = editorFromTextArea(editor_area, startState.extensions)

let view = new EditorView({
    state: startState,
    parent: editor_area
})