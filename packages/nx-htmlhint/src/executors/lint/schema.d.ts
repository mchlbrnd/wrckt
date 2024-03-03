export interface LintExecutorSchema {
  lintFilePattern: string;
  config?: string;
  rules?: string;
  rulesDir?: string;
  format?:
    | 'default'
    | 'compact'
    | 'checkstyle'
    | 'json'
    | 'html'
    | 'junit'
    | 'unix'
    | 'markdown';
  ignore?: string;
  noColor?: boolean;
  warn?: boolean;
}
