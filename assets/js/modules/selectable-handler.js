import UIManager from "./ui-manager";

/**
 * This file manages the logic for the "selectable elements" in the dashboard.
 * "Selectable elements" refer to buttons (options) that update the dashboard when clicked.
 * There are three options: "Variation," "Versions," and "Languages." These allow users
 * to select the variation, version, or language of the campaign they want to review.
 * The class updates the visual state of each option to indicate whether it is "selected" or not.
 * Additionally, a callback function is provided to trigger UI updates based on the user's selection.
 * 
 * For more details about the UI updates, see ui-manager.js
 */

class SelectableHandler {
    constructor(el, config = {}) {
        this.selectable = el;
        this.options = this.selectable.querySelectorAll(".option button");
        this.init();

        this.onSelect = config.onSelect;
    }

    init() {
        this.options.forEach((option) => {
            option.addEventListener("click", () => {
                this.updateStyle(option);
                if (this.onSelect) this.onSelect(this.selectable, option);
            });
        });
    }

    updateStyle(clickedButton) {
        this.options.forEach((option) => {
            const wrapper = option.parentElement;
            const isSelected = wrapper.classList.contains("--selected");
            if (option === clickedButton && !isSelected) {
                wrapper.classList.add("--selected");
            } else {
                wrapper.classList.remove("--selected");
            }
        });
    }
}

function initSelectables() {
    const selectables = document.querySelectorAll(".selectable");
    let customSelectables = [];

    for (let i = 0; i < selectables.length; i++) {
        customSelectables[i] = new SelectableHandler(selectables[i], {
            onSelect: (selectable, option) => {
                new UIManager({
                    clickedDropdown: selectable,
                    clickedOption: option,
                });
            },
        });
    }
}

export { initSelectables, SelectableHandler };
