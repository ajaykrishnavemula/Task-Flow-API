declare module 'marked' {
  interface MarkedOptions {
    baseUrl?: string;
    breaks?: boolean;
    gfm?: boolean;
    headerIds?: boolean;
    headerPrefix?: string;
    langPrefix?: string;
    mangle?: boolean;
    pedantic?: boolean;
    sanitize?: boolean;
    sanitizer?: (html: string) => string;
    silent?: boolean;
    smartLists?: boolean;
    smartypants?: boolean;
    xhtml?: boolean;
  }

  function marked(src: string, options?: MarkedOptions): string;

  namespace marked {
    function parse(src: string, options?: MarkedOptions): string;
    function setOptions(options: MarkedOptions): void;
  }

  export { marked };
}

