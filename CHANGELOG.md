# Changelog

## [Unreleased]

## [1.7.0] - 2021-12-02

- Update Masthead styles.
- Update h3 and h4 styles.
- Remove default border from <img> tag.
- Convert main menu to lowercase.
- Remove default 100% width on tiles.
- Adjust gutter value in \_settings.scss.
- Incorporate recent footer changes from wcm_theme.
- Remove lt-gray masthead option.
- Update region-template.twig and page-template.twig to make `content_after` region full width.

## [1.6.3] - 2021-07-30

- Further updates to Masthead typography.

## [1.6.2] - 2021-06-30

- Update a11yNavbar script to add support for target attribute.
- Update page template bottom padding.

## [1.6.1] - 2021-06-25

- Updates to masthead site name sizes.
- Only display main-menu after the script is fully loaded.
- Move mobile menu icon to left side in preparation for search block on Drupal sites.

## [1.6.0] - 2021-06-05

- Added ID to Breadcrumb heading.
- Moved label of Pager to aria-label of parent <nav> element.
- Moved <main> element to only wrap content region.

## [1.5.1] - 2021-05-24

- Remove tile image zoom on hover.
- Removed unused/unfinished menu script on main menu that was negatively affecting Drupal admin menubar.

## [1.5.0] - 2021-05-05

- Update address block to accommodate for letters in phone numbers. NOTICE: Markup change.
- Add aspect ratio mixin and classes.
- Apply 3:2 aspect ratio to tile images.

## [1.4.2] - 2021-05-03

- Increased side padding and gutters to make sites look less cramped.
- Various Tile updates including allowing for images.
- Fixed mobile styles for main menu.
- Styled current breadcrumb for when it is not a link.
- Minor typography adjustment in footer.
- Adjusted masthead padding per breakpoint.
- Updated stacked OSU logo svgs.

## [1.4.1] - 2021-04-30

- Allows for use of <span> as well as <a> elements as menuitems in HTML source.
- Added menubarInstructionsText option.

## [1.4.0] - 2021-04-09

- Rework card to better utilize css grid for button alignment.
- Improve value check with footer_text.
- Moved wrappers to region templates. NOTICE: Significant markup change.
- Make all layout wrappers white by default.
- Slight adjustments to Card and Tile styles.

## [1.3.0] - 2021-03-30

- Improve and unify focus styles for form elements.
- Remove extra page-title from template.
- Reworked card so that button aligns to bottom of each card.
- Renamed card grid twig file.
- Improved how tiles and cards are divided per row within grid.
- Removed info-box grid pattern.

## [1.2.3] - 2021-03-11

- Fixed main menu dropdowns.

## [1.2.2] - 2021-03-08

- Provide white option for tile.
- Add Hero Banner Pattern.
- Remove layout inner from hero region.

## [1.2.1] - 2021-03-04

- Provide alternative to clearfix on layout\_\_wrappers.
- Update tile hover styles.
- Remove tile alt.

## [1.2.0] - 2021-03-03

- Update markup for card, info-box, and tile.
- Update tile styles — remove italics.
- Added color variations to tiles.
- Updated `_tile.twig` file name to `tile.twig`.

## [1.1.9] - 2021-03-02

- Adjust padding on <a> elements.
- Indicate that external links are external in visually-hidden text.
- Update card, info-box, and tile patterns to improve compatibility with Drupal themes.

## [1.1.8] - 2021-02-19

- Add general variant of status message.
- Make sure sure footer_text only renders if it has value.
- Remove all references to TTD.
- Remove explicit refs to ada_email.
- Adjust font weight in address block.
- Masthead css updates.

## [1.1.7] - 2021-02-12

- Add optional site slogan to masthead.
- Adjust status message css and rename twig template.
- Update base table styles.
- Add field\_\_label style.
- Add clearfix to several regions in page template.
- Update aria-labelledby in book menu.
- Update pager color.
- Update extlink button style.
- Add disabled button styles.

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
