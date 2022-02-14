// cssController.ts
/**
 * Specify this is a module comment without renaming it:
 * @module
 */

/**
 * @category CSS Utilities
 * @returns returns all the selectable elements on the page
 */
const getSelectableItems = (): Element[] => {
  let _items = document.getElementsByClassName('selectableItem');
  return [..._items];
};

/**
 * Will change the border color on a selectable element between red and white
 * @category CSS Utilities
 * @param item
 * @param state
 */
const switchItem = (item: Element, state: boolean): void => {
  if (state == true) {
    item.setAttribute('style', 'border-color: red !important');
  } else {
    item.setAttribute('style', 'border-color: white !important');
  }
};

/**
 * @category CSS Utilities
 */
const revertAllItems = (): void => {
  getSelectableItems().forEach((item) => {
    item.setAttribute('style', 'border-color: white !important');
  });
};

export { getSelectableItems, switchItem, revertAllItems };
