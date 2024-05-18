// import {EditorState} from "@codemirror/state"
import {EditorView, keymap} from "@codemirror/view"
import {defaultKeymap} from "@codemirror/commands"
import {espresso} from 'thememirror';

/* let startState = EditorState.create({
    doc: "Hello World",
    extensions: [
        keymap.of(defaultKeymap),
        dracula
    ]
}) */

const editor_area = document.getElementById("area-texto");

function editorFromTextArea(textarea) {
    let view = new EditorView({
        doc: textarea.value,
        extensions: [
            keymap.of(defaultKeymap),
            espresso
        ]
    })

    textarea.parentNode.insertBefore(view.dom, textarea)
    textarea.style.display = "none"
    if (textarea.form) textarea.form.addEventListener("submit", () => {
      textarea.value = view.state.doc.toString()
    })
    return view
}

let view = editorFromTextArea(editor_area)

/* let view = new EditorView({
    state: startState,
    parent: editor_area
}) */