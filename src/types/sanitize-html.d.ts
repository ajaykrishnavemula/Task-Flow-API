declare module 'sanitize-html' {
  interface IOptions {
    allowedTags?: string[];
    allowedAttributes?: {
      [key: string]: string[];
    };
    allowedSchemes?: string[];
    allowedSchemesByTag?: {
      [key: string]: string[];
    };
    allowedSchemesAppliedToAttributes?: string[];
    allowProtocolRelative?: boolean;
    allowedClasses?: {
      [key: string]: string[];
    };
    allowedStyles?: {
      [key: string]: {
        [key: string]: RegExp[];
      };
    };
    selfClosing?: string[];
    allowedIframeHostnames?: string[];
    parser?: {
      lowerCaseTags?: boolean;
      lowerCaseAttributeNames?: boolean;
    };
    transformTags?: {
      [key: string]: string | ((tagName: string, attribs: any) => any);
    };
    exclusiveFilter?: (frame: IFrame) => boolean;
    textFilter?: (text: string) => string;
    allowVulnerableTags?: boolean;
  }

  interface IFrame {
    tag: string;
    attribs: { [key: string]: string };
    text: string;
    tagPosition: number;
  }

  interface IDefaults {
    allowedTags: string[];
    allowedAttributes: {
      [key: string]: string[];
    };
  }

  function sanitize(dirty: string, options?: IOptions): string;
  
  namespace sanitize {
    var defaults: IDefaults;
  }

  export = sanitize;
}

// Made with Bob
