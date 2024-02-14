export const HTMLHINT_CONFIG = '.htmlhintrc';

export const HTMLHINT_TARGET_PATTERN = '**/*.{htm,html}';

export const HTMLHINT_CONFIG_RULES = {
  'alt-require': false, // The alt attribute of an <img> element must be present and alt attribute of area[href] and input[type=image] must have a value.
  'attr-lowercase': false, // All attribute names must be in lowercase.
  'attr-sorted': false, // Attribute tags must be in proper order.
  'attr-no-duplication': false, // Elements cannot have duplicate attributes.
  'attr-unsafe-chars': false, // Attribute values cannot contain unsafe chars.
  'attr-value-double-quotes': false, // Attribute values must be in double quotes.
  'attr-value-not-empty': false, // All attributes must have values.
  'attr-value-single-quotes': false, // Attribute values must be in single quotes.
  'attr-whitespace': false, // All attributes should be separated by only one space and not have leading/trailing whitespace.
  'doctype-first': false, // Doctype must be declared first.
  'doctype-html5': false, // Invalid doctype. Use': false, // "<!DOCTYPE html>"
  'head-script-disabled': false, // The <script> tag cannot be used in a <head> tag.
  'href-abs-or-rel': false, // An href attribute must be either absolute or relative.
  'html-lang-require': false, // The lang attribute of an <html> element must be present and should be valid.
  'id-class-ad-disabled': false, // The id and class attributes cannot use the ad keyword, it will be blocked by adblock software.
  'id-class-value': false, // The id and class attribute values must meet the specified rules.
  'id-unique': false, // The value of id attributes must be unique.
  'inline-script-disabled': false, // Inline script cannot be used.
  'inline-style-disabled': false, // Inline style cannot be used.
  'input-requires-label': false, // All [ input ] tags must have a corresponding [ label ] tag.
  'script-disabled': false, // The <script> tag cannot be used.
  'space-tab-mixed-disabled': false, // Do not mix tabs and spaces for indentation.
  'spec-char-escape': false, // Special characters must be escaped.
  'src-not-empty': true, // The src attribute of an img(script,link) must have a value.
  'style-disabled': false, // <style> tags cannot be used.
  'tag-pair': false, // Tag must be paired.
  'tag-self-close': false, // Empty tags must be self closed.
  'empty-tag-not-self-closed': false, // Empty tags must not use self closed syntax.
  'tagname-lowercase': false, // All html element names must be in lowercase.
  'tagname-specialchars': false, // All special characters must be escaped.
  'title-require': false, // <title> must be present in <head> tag.
  'tags-check': false, // Checks html tags.
  'attr-no-unnecessary-whitespace': false, // No spaces between attribute names and values.
};

export const HTMLHINT_SEMVER = '^1.1.4';
