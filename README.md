# IT@OSU Pattern Lab

## Requirements

1.  [PHP 7.1](http://www.php.net/)
2.  [Node + NPM](https://nodejs.org/en/)
3.  [Gulp](http://gulpjs.com/) (Install globally)
4.  [Composer](https://getcomposer.org/)

## Installation and Local Development Setup

1. Clone this repo
2. Navigate to project folder
3. Run `npm install`
4. Run `gulp`

## Gulp default task

The gulp default task includes initial PL site generation, regeneration as necessary, css and js compilation, and the watch task. Type `^c` to stop the task.

## Contributing to this project

TBD (Include Gitflow, Pull requests, BEM Methodology)

## Working on patterns

Navigate to `components/_patterns`. This is where all contributing work should take place. Each component is self-contained in a directory.

### How to add a new pattern

1. Navigate to `components/_patterns/[category]`
2. Create a directory with the name of your component (no spaces)
3. All code for a pattern should be stored within the pattern's directory. Use your folder name as the base file name like the examples below:
   a. `pattern-name.twig`
   b. `pattern-name.yml` (optional, but used for dummy content and setting variables)
   c. `_pattern-name.scss` (component-specific styles)
   d. `pattern-name.js` (optional, if component-specific js is needed)
   e. `pattern-name.md` (optional, but helpful to display additional information for your component in the styleguide)

Each directory is ordered alphabetically. To re-order the patterns, just add numbers to the beginning. You may optionally organize patterns into subtypes with subdirectories.

**NOTE:** Adding a new component folder may require you to restart your task runner.

### Nested Patterns

It is best practice to build up patterns from smaller patterns when appropriate. For example the "site-header" pattern is comprised of the "osu-navbar" and "masthead" patterns.

See: `03-organisms/site-header/site-header.twig` for usage example.

Also see Emulsify's documentation for more info:
[When to use include, extends, and embed](https://github.com/fourkitchens/emulsify/wiki/When-to-use-include,-extends,-and-embed)

### How to create sample content

TBD

### How to create pseudo-patterns

Pseudo-patterns are used to create variants of existing patterns. This is useful for showing multiple color variations, content variants, alternate states, etc...

The tilde (`~`) is used to designate a pseudo-pattern. All pseudo-patterns should be stored within the original pattern's directory.

For example `masthead~white.yml` is a a pseudo-pattern of `masthead.yml` and they share all of the same resources within the `masthead` directory. The pseudo-pattern .yml file should only contain data that overrides the original pattern. In this case only the `masthead_color` theme setting variable with a value of `white` should be included in `masthead~white.yml`.

In addition to being helpful for writing scss style variations, pseudo-patterns can also be helpful to test logic within twig templates.

### Use BEM Methodology

- Here's the details: [Methodology / BEM](https://en.bem.info/methodology/)
- Here's a helpful function that is available in this theme: [bem-twig-extension](https://github.com/drupal-pattern-lab/bem-twig-extension)
