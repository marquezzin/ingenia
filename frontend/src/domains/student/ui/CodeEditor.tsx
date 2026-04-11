/**
 * CodeEditor — Monaco Editor wrapper for Python code editing.
 *
 * Provides syntax highlighting, line numbers, and a dark theme
 * optimized for the student exercise page.
 */
import Editor from "@monaco-editor/react";
import classes from "./CodeEditor.module.css";

interface CodeEditorProps {
  /** Current source code value. */
  value: string;
  /** Called when user edits the code. */
  onChange: (value: string) => void;
  /** Set to true to prevent editing (e.g. while running). */
  readOnly?: boolean;
  /** Editor height — defaults to 400px. */
  height?: string;
}

export function CodeEditor({
  value,
  onChange,
  readOnly = false,
  height = "400px",
}: CodeEditorProps) {
  return (
    <div className={classes.root}>
      <Editor
        height={height}
        language="python"
        theme="vs-dark"
        value={value}
        onChange={(val) => onChange(val ?? "")}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: "on",
          padding: { top: 12, bottom: 12 },
          renderLineHighlight: "gutter",
          scrollbar: {
            verticalScrollbarSize: 8,
            horizontalScrollbarSize: 8,
          },
        }}
      />
    </div>
  );
}
