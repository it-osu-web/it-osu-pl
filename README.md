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

Never commit directly to the `develop` or `master` branches. All contributions should be added via pull requests. We will be using the [git-flow](https://danielkummer.github.io/git-flow-cheatsheet/) branching model.

Start the feature locally...

Do not finish a feature yourself via git flow. When you are finished with a feature, create a pull request from your feature branch. The feature will be finished by the repository admin when the pull request is accepted. You may then delete your local version of the feature branch.

Be granular with features. Avoid scope creep.

### Creating, tagging, and assigning issues

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
[When to use include, extends, and embed](https://github.com/fourkitchens/emulsify/wiki/When-to-use-include,-extends,-and-embed).

### How to create sample content

Sample content is created via the patterns's `.yml` file. Any variables included in the corresponding `.twig` file should be assigned in the `.yml` file.

**NOTE:** Sample content does not nest along with the pattern's `.twig` file. For example, this content must also be included in the `site-footer.yml` file since "address-block" is nested within "site-footer".

Below is an example of `address-block.yml` contents.

```
footer_color:
  white
site_name:
  Name of Website
address_1:
  100 Mount Hall
address_2:
 1050 Carmack Road
city:
  Columbus
state:
  OH
zip:
  43210
phone:
  614-292-8800
fax:
  614-292-8860
contact_email:
  odee@osu.edu
```

In addition to pattern-specific data, sample data can be assigned at the root-level of the styleguide in the `/components/_data/data.yml` file. Pattern-level data will override data from this file.

### How to create pseudo-patterns

Pseudo-patterns are used to create variants of existing patterns. This is useful for showing multiple color variations, content variants, site-specific vatiations, alternate states, etc...

The tilde (`~`) is used to designate a pseudo-pattern. All pseudo-patterns should be stored within the original pattern's directory.

For example `masthead~white.yml` is a a pseudo-pattern of `masthead.yml` and they share all of the same resources within the `masthead` directory. The pseudo-pattern .yml file should only contain data that overrides the original pattern. In this case only the `masthead_color` theme setting variable with a value of `white` should be included in `masthead~white.yml`.

In addition to being helpful for writing scss style variations, pseudo-patterns can also be helpful to test logic within twig templates.

### Pattern organization

Patterns are divided into categories that progressively become more complex. This is based off of [Atomic Design Methodology](http://atomicdesign.bradfrost.com/chapter-2/).

| Category  | Description                                                                                                                 |
| --------- | --------------------------------------------------------------------------------------------------------------------------- |
| Base      | Base settings, color variables, font-families, etc...                                                                       |
| Atoms     | Foundational building blocks, including basic html elements.                                                                |
| Molecules | Two or more atoms grouped together for a specific function such as a status message box or group of links.                  |
| Organisms | Complex UI elements composed of groups of molecules and/or atoms such as a navbar or site header.                           |
| Templates | Page-level objects that organize patterns into a layout and provide context and content structure.                          |
| Pages     | Specific instances of templates (page prototypes) that show what a UI looks like with real representative content in place. |

### Use BEM methodology

- Here's the details: [Methodology / BEM](https://en.bem.info/methodology/)
- Here's a helpful function that is available in this theme: [bem-twig-extension](https://github.com/drupal-pattern-lab/bem-twig-extension)
