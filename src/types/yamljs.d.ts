declare module 'yamljs' {
  interface YAMLOptions {
    schema?: any;
    indent?: number;
  }

  interface YAML {
    parse(text: string, options?: YAMLOptions): any;
    stringify(obj: any, inline?: number, spaces?: number): string;
    load(path: string, callback?: (result: any) => void): any;
    dump(obj: any, path: string, callback?: (err: Error) => void): void;
  }

  const YAML: YAML;
  export = YAML;
}

