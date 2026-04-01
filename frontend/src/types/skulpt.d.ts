/**
 * Type declarations for the Skulpt Python interpreter.
 *
 * Skulpt exposes a global `Sk` object. The npm package (`skulpt`) does not
 * include official TypeScript types, so we declare the subset of the API
 * used by our evaluation engine here.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

declare module "skulpt" {
  /** Configuration options for Sk.configure(). */
  interface SkConfigureOptions {
    /** Callback invoked every time `print()` produces output. */
    output: (text: string) => void;

    /**
     * Callback invoked when the Python code calls `input()`.
     * Must return a string (the user input).
     */
    inputfun: () => string;

    /**
     * Function used by Skulpt to read built-in library files.
     * Receives a filename (e.g. `"src/lib/math.js"`) and must return
     * the file content as a string, or throw if not found.
     */
    read: (filename: string) => string;

    /** Enable Python 3 syntax and semantics. */
    __future__: any;

    /** Execution limit in milliseconds (optional). */
    execLimit?: number;

    /** Kill limit in milliseconds — hard cap (optional). */
    killableWhile?: boolean;

    /** Kill limit in milliseconds (optional). */
    killableFor?: boolean;

    /** Set the yielding limit in milliseconds (optional). */
    yieldLimit?: number;
  }

  interface SkBuiltinFiles {
    files: Record<string, string>;
  }

  /** Skulpt misceval utilities. */
  interface SkMisceval {
    asyncToPromise: (
      fn: () => any,
      suspHandlers?: Record<string, any>,
    ) => Promise<any>;
  }

  /** Skulpt builtin namespace. */
  interface SkBuiltin {
    str: any;
    int_: any;
    float_: any;
    bool: any;
    none: any;
    list: any;
    dict: any;
    tuple: any;
    [key: string]: any;
  }

  /** The global Skulpt object. */
  interface Sk {
    configure: (options: Partial<SkConfigureOptions>) => void;
    importMainWithBody: (
      name: string,
      dumpJS: boolean,
      body: string,
      canSuspend: boolean,
    ) => any;
    misceval: SkMisceval;
    builtinFiles: SkBuiltinFiles;
    builtin: SkBuiltin;
    python3: any;

    /** Pre-built file reader for built-in modules. */
    TurtleGraphics?: any;

    /** Skulpt unfixable error types. */
    SyntaxError?: any;
    RuntimeError?: any;
  }

  const Sk: Sk;
  export default Sk;
}
