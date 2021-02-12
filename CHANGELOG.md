# Changelog

## [Unreleased]
- Add optional site slogan to masthead.
- Adjust status message css and rename twig template. 


## [1.1.6] - 2020-09-01
- Update ADA message in footer.

## [1.1.5] - 2020-07-25

- Fix extlink button link styles.
- Make sure footer_text div only renders if field has value.
- Update book-menu and book-links for easier import into Drupal theme.

## [1.1.4] - 2020-07-23

- Added pre-footer region to page-template.
- Moved skip-link to page-template.
- Re-enabled footer_text in footer component.
- Re-added foundation flex classes in order to use 'flex-grow'.
- Added book-links, book-nav, and book-menu components.

## [1.1.3] - 2020-07-20

- Fixed masthead and footer hover styles.
- Fixed logo alignment in masthead.
- Updated site name image size for standard masthead.
- Updated tile styles, including adding a tile\_\_label option.
- Reworked Drupal Page Template to use twig blocks.
- Added second sidebar to Drupal Page Template.

## [1.1.2] - 2020-07-15

- Selectively add Foundation components instead of everything.
- Redo buttons using Foundation as a base.
- Create sane defaults for nav links.
- Rework breadcrumb styles and markup.
- Create menu tabs component.
- Update infobox to not rely on header level.
- Add bottom padding to content.
- Update various hover and focus styles.

## [1.1.1] - 2020-07-13

- Various typography improvements.
- Fix list spacing.
- Fix faux button links.
- Update basic text and header links for improved accessibility.
- Update footer and masthead components for improved link behaviors and colors.
- Provide examples of headers and links in long text.

## [1.1.0] - 2020-07-06

Re-syncing releases with `it-osu-web/it-osu-pl-drupal`

- Various small and medium changes ported back from Drupal themes including:
  - Restructure 00-base directory items.
  - Simplify spacing variables.
  - Clean up cards, info boxes, and tiles.
  - Adjust tile title styles to not rely on header element.
  - Standardize callouts.
  - Slightly adjust details styles.
  - Adjust list styles; remove reliance on `list-item` class.
- Adjusted button and button-like styles — including `more-link` and pagers.
- Adjusted Main Menu to accomodate longer items.
- Added Filter Block pattern.
