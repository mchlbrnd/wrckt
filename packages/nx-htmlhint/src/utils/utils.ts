export const HTMLHINT_CONFIG = '.htmlhintrc';

export const HTMLHINT_TARGET_PATTERN = '**/*.{htm,html}';

export const HTMLHINT_CONFIG_RULES = {
  'tagname-lowercase': true,
  'attr-lowercase': false,
  'attr-value-double-quotes': true,
  'attr-value-not-empty': false,
  'attr-no-duplication': true,
  'doctype-first': false,
  'tag-pair': true,
  'tag-self-close': true,
  'id-unique': true,
  'src-not-empty': true,
  'title-require': false,
  'head-script-disabled': true,
  'alt-require': true,
  'doctype-html5': true,
  'id-class-value': false,
  'style-disabled': true,
  'inline-style-disabled': true,
  'inline-script-disabled': true,
  'space-tab-mixed-disabled': false,
  'id-class-ad-disabled': true,
  'href-abs-or-rel': false,
  'attr-unsafe-chars': true,
};

export const HTMLHINT_SEMVER = '^1.1.4';
