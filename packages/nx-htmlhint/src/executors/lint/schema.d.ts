export interface LintExecutorSchema {
  target: string;
  projectName: string;
  config?: string;
  rules?: string;
  rulesdir?: string;
  format?:
    | 'compact'
    | 'checkstyle'
    | 'json'
    | 'html'
    | 'junit'
    | 'unix'
    | 'markdown';
  ignore?: string;
  nocolor?: boolean;
  warn?: boolean;
}
