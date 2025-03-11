import { EditorState, Extension } from "@codemirror/state";
import { EditorView, keymap, lineNumbers } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
// -----------------------------------------------------------------------------------
export class CodeEditor {
    private static instance: CodeEditor | null = null;

    private code: string = "0-50\n105\n805\n000";

    private state: EditorState | undefined = undefined;
    private parentElement: Element | undefined = undefined;

    private id: Extension | undefined = undefined;
    private view: EditorView | undefined = undefined;
    private changeEvent: Extension | undefined = undefined;

    public static getInstance(): CodeEditor {
        if(!this.instance) this.instance = new CodeEditor();

        return this.instance;
    }

    public init(parentElement: Element) {
        this.parentElement = parentElement;

        this.id = EditorView.editorAttributes.of({ id: "editor" });

        this.changeEvent = EditorView.updateListener.of(update => {
            if(localStorage.getItem("saved")! != "false" && update.docChanged) this.unSaved();
        });

        this.defineCode();

        this.state = EditorState.create({
            doc: this.code,
            extensions: [
                this.id,
                history(),
                lineNumbers(),
                this.changeEvent,
                keymap.of(defaultKeymap),
                keymap.of(historyKeymap),
            ]
        });

        this.view = new EditorView({
            state: this.state,
            parent: this.parentElement!
        });
    }

    private defineCode() {
        const params = new URLSearchParams(window.location.search);

        if(params.has("code")) {
            const url = new URL(window.location.href);

            this.unSaved();
            this.code = params.get("code")!;

            url.searchParams.delete("code");
            window.history.pushState({}, "", url);
        }
        else if(localStorage.getItem("code")) {
            localStorage.setItem("saved", "true");
            this.code = localStorage.getItem("code")!;
        }
        else this.unSaved();
    }

    private unSaved = () => {
        localStorage.setItem("saved", "false");
        this.parentElement!.classList.add("unsaved");
    }

    public getCode = () => {
        return this.view!.state.doc.toString();
    }

    public setCode = (text: string) => {
        this.view!.dispatch({
            changes: {
                from: 0,
                to: this.view!.state.doc.length,
                insert: text
            }
        });
    }
}