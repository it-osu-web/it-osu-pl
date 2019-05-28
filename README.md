# IT@OSU Pattern Lab

## Requirements

1.  [PHP 7.1](http://www.php.net/)
2.  [Node + NPM](https://nodejs.org/en/)
3.  [Gulp](http://gulpjs.com/) (Install globally)
4.  [Composer](https://getcomposer.org/)

## Installation and Local Development Setup

1. Clone this repo
2. Navigate to project folder
3. Run `composer install`
4. Run `npm install`
5. Run `gulp`

## Gulp default task

The gulp default task includes initial PL site generation, regeneration as necessary, css and js compilation, and the watch task. Type `^c` to stop the task.

## Contributing to this project

TBD (Include Gitflow, Pull requests, BEM Methodology)

## Working on patterns

Navigate to `components/_patterns`. This is where all work should take place. Each pattern is self-contained in a directory.

### How to add a new pattern

1. Navigate to `components/_patterns/[category]`
2. Create a directory with the name of your pattern (no spaces)
3. All code for a pattern should be stored within the pattern's directory. Use your folder name as the base file name like the examples below:

- `pattern-name.twig`
- `pattern-name.yml` (optional, but used for dummy content)
- `_pattern-name.scss` (pattern-specific styles)
- `pattern-name.js` (optional, if component-specific js is needed)
- `pattern-name.md` (optional, but helpful to display additional information about your component in the styleguide)

Each directory is ordered alphabetically. To re-order the patterns, just add numbers to the beginning. You may optionally organize patterns into subtypes with subdirectories.

**NOTE:** Adding a new folder may require you to restart your task runner (gulp).

### Nested Patterns

It is best practice to build up patterns from smaller patterns when appropriate. For example the "site-footer" pattern is comprised of the "address-block" and "social-media-links" patterns.

See: `components/_patterns/03-organisms/site-footer/_site-footer.twig` for usage example.

Also see Emulsify's documentation for more info:
[When to use include, extends, and embed](https://github.com/fourkitchens/emulsify/wiki/When-to-use-include,-extends,-and-embed)

### How to create sample content

TBD

### How to create pseudo-patterns

Pseudo-patterns are used to create variants of existing patterns. This is useful for showing multiple color variations, content variants, site-specific vatiations, alternate states, etc...

The tilde (`~`) is used to designate a pseudo-pattern. All pseudo-patterns should be stored within the original pattern's directory.

For example `masthead~white.yml` is a a pseudo-pattern of `masthead.yml` and they share all of the same resources within the `masthead` directory. The pseudo-pattern .yml file should only contain data that overrides the original pattern. In this case only the `masthead_color` theme setting variable with a value of `white` should be included in `masthead~white.yml`.

In addition to being helpful for writing scss style variations, pseudo-patterns can also be helpful to test logic within twig templates.

### Pattern organization

Patterns are divided into categories that progressively become more complex. Atoms, Molecules, and Organisms follow [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/)

| Category     | Description                                                                                                |
| ------------ | ---------------------------------------------------------------------------------------------------------- |
| 00-base      | Base settings, color variables, font-families, etc...                                                      |
| 01-atoms     | Foundational building blocks, including basic html elements.                                               |
| 02-molecules | Two or more atoms grouped together for a specific function such as a status message box or group of links. |
| 03-organisms | Complex UI elements composed of groups of molecules and/or atoms such as a navbar or site header.          |

### Use BEM methodology

- Here's the details: [Methodology / BEM](https://en.bem.info/methodology/)
- Here's a helpful function that is available in this theme: [bem-twig-extension](https://github.com/drupal-pattern-lab/bem-twig-extension)
