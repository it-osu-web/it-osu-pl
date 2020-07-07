# IT@OSU Pattern Lab

A pattern library for IT@OSU (OCIO/ODEE at The Ohio State University) websites and applications. It uses the [Pattern Lab Standard Edition for Twig](https://github.com/pattern-lab/edition-php-twig-standard) and incorporates many elements from [Foundation v6](https://get.foundation/), including the [XY Grid](https://get.foundation/sites/docs/xy-grid.html).

## Requirements

1.  [PHP 7.1](http://www.php.net/)
2.  [Node + NPM](https://nodejs.org/en/)
3.  [Composer](https://getcomposer.org/)

## Installation and Local Development Setup

1. Clone this repo
2. Navigate to repo directory
3. Run `composer install`
4. Run `npm install`
5. Run `npm run gulp`

## Gulp default task

The gulp default task includes initial PL site generation, regeneration as necessary, css and js compilation, and the watch task. Type `^c` to stop the task.

## Contributing to this project

Never commit directly to the `master` branch. All contributions should be added via pull requests. We will be following the [GitHub Flow](https://guides.github.com/introduction/flow/) branching model.

Be sure to work from the repo's [issue queue](https://github.com/it-osu-web/it-osu-pl/issues). If you plan to work on something that doesn't already have an issue, create one and assign it to yourself.

Be granular with features and avoid scope creep. For example, if you are working on a new pattern, try not to make changes that are not related to that pattern.

### Starting a new feature

Create a new branch from `master`. Your branch name should be descriptive (e.g., refactor-buttons, book-nav-pattern, image-documentation, etc...), so that others can quickly see what is being worked on. If the branch was created locally, be sure to publish it, so that others can see your work in progress. Do all of your work on this branch, making as many commits as necessary. If any new changes have happened on the `master` branch since you originally created your branch, be sure to merge them in and test before finishing your feature.

### Finishing a feature

When you are finished with a feature, create a pull request from your feature branch via the github web interface. Be sure to reference corresponding issues in the pull request description by using a [supported keyword](https://docs.github.com/en/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword). For example: `closes #99` would close out issue #99 when the pull request is merged.

If the pull request is not accepted immediately and requires additional work, you may continue to work from the branch. The pull request will remain open. You can request another review once the updates have been made.

You may delete your local version of the feature branch when the pull request has been merged.

### Creating, tagging, and assigning issues

As you identify bugs, tasks, feature requests, or other issues, please add them to the [issue queue](https://github.com/it-osu-web/it-osu-pl/issues) and tag them appropriately. If a task needs to be worked on by a specific person, assign it to them, otherwise leave it unassigned.

### Other ways to contribute

- If you are not comfortable building out patterns yourself, or if you have an idea but do not know how to build it, create an issue and provide mockups or other info to help a developer build out the pattern.
- Identify missing patterns, missing documentation, style improvements, accessibility concerns, bugs, or other issues and add an appropriate item to the issue queue.

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

Sample content is created via the patterns' `.yml` file. Any variables included in the corresponding `.twig` file should be assigned in the `.yml` file.

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

Pseudo-patterns are used to create variants of existing patterns. This is useful for showing multiple color variations, content variants, site-specific variations, alternate states, etc...

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

### Mixins and Reusable Classes

Coming soon.

### Use BEM methodology when possible

- A great intro to BEM: [BEM will make you happy](https://medium.com/@basterrika/bem-will-make-you-happy-ab0d0a821226)
- Here's the full details: [Methodology / BEM](https://en.bem.info/methodology/)
- We don't have to be super strict about it right now, but let's do what we can.
- Provide options to accept modifiers as variables on lower-level (Atoms, Molecules) patterns. See `components/_patterns/01-atoms/00-text/04-paragraph/paragraph.twig` for a good example of how to do that.

### Twig Resources

- [Official Documentation](https://twig.symfony.com/doc/2.x/templates.html)

### Foundation Use and Resources

Foundation was initially added to this project because of its XY Grid, but we are finding it to be useful in other areas and will gradually be integrating more facets of it into this project.

Before creating a new pattern, check [Foundation's documentation](https://get.foundation/sites/docs/index.html) to determine if it has a built-in component that could be used as a starting point.

Along those same lines, when styling a pattern, be sure to look at `_settings.scss` first to determine if defaults can be changed in that file, before adding additional css rules within your pattern.

There are certain items that you should always rely on Foundation for. They are as as follows:

- XY Grid
- Breakpoints
- `rem-calc()` function

We are also explicitly not using certain aspects of Foundation for various reasons such as already having legacy code, custom-designed implementations, or other reasons. These patterns are as follows:

- Primary Menu
- Buttons
- Breadcrumbs
- Pagers (looking at possible conversion)
- Tables (looking at possible conversion)
- Headers (partially uses Foundation settings)
- Form elements (looking at possible conversion)
- Images (looking at possible conversion)
- Callouts (looking at possible conversion)
- Cards (looking at possible conversion)
- Spacing Standards (will likely convert)

#### Foundation Documentation

- [Foundation for Sites](https://get.foundation/sites/docs/index.html)
- [XY Grid](https://get.foundation/sites/docs/xy-grid.html)
- [rem-calc](https://get.foundation/sites/docs/sass-functions.html#rem-calc)
