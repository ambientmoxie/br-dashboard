import UIManager from "./ui-manager";

class CustomSelect {

    static currentOpenDropdown = null; // To keep track of the currently open dropdown instance.

    constructor(defaultSelect, config = {}) {

        // Get elements from the default select tag
        this.defaultSelect = defaultSelect;
        this.defaultOptions = defaultSelect.querySelectorAll("option");         
        this.type = defaultSelect.getAttribute("data-type");

        this.customSelect = null; // Will be assign to the new custom select instance
        this.selectedOption = Array.from(this.defaultOptions).find(option => option.hasAttribute('selected'));

        this.onSelect = config.onSelect; // Callback function
        this.init(); // Init behavior

    }

    init(){
        this.customSelect = this.createCustomSelect();
        const header = this.customSelect.firstElementChild;
        const dropdown = this.customSelect.lastElementChild;

        header.addEventListener("click", (event) => {
            event.stopPropagation();
            this.toggleDropdown(dropdown);
        })

        dropdown.addEventListener("click", (e) => {
            if (e.target.classList.contains("custom-select__option")) {
                const option = e.target;
                this.editSelectedOption(e.target, header);       
                this.closeDropdown(CustomSelect.currentOpenDropdown);
                if (this.onSelect) this.onSelect(dropdown, option);                  
            }
        });
    }

    createCustomSelect() {

        // Creates wrapper to receive header and dropdown.
        const customSelect = document.createElement("div");
        customSelect.classList.add("custom-select");

        // Creates header and dropdown (already populated by options).
        const header = this.createHeader(); 
        const dropdown = this.createDropdown();

        customSelect.append(header, dropdown); // Append the header and dropdown to the selector wrapper.
        this.defaultSelect.parentElement.append(customSelect); // Append the complete custom selector to its wrapper. 
        this.defaultSelect.remove(); // Remove default select element from the DOM.

        return customSelect; // Return customSelect allowing DOM manipulation
    }

    createHeader() {
        const header = document.createElement("div");
        header.classList.add("custom-select__header", "custom-select__option");
        header.innerText = this.selectedOption.innerText;
        return header;
    }

    createDropdown() {
        const dropdown = document.createElement("div");
        dropdown.classList.add("custom-select__dropdown");
        dropdown.setAttribute("data-type", this.type);
        this.defaultOptions.forEach((defaultOption, index) => {
            const option = this.createOption(defaultOption, index);
            dropdown.append(option);
        });
        return dropdown;
    }

    createOption(defaultOption, index) {
        const option = document.createElement("div");
        option.classList.add("custom-select__option");
        option.innerText = defaultOption.innerText;
        option.dataset.index = index; // Remove ?
        option.setAttribute("data-key", defaultOption.getAttribute("data-key"));

        if (index === this.defaultSelect.selectedIndex) {
            option.classList.add("prevent-selection");
            this.currentSelectedOption = option;
        }

        return option;
    }

    toggleDropdown(dropdown) {
        if (CustomSelect.currentOpenDropdown && CustomSelect.currentOpenDropdown !== dropdown) {
            this.closeDropdown(CustomSelect.currentOpenDropdown);
        }
    
        const isVisible = dropdown.style.display === "block";    
        isVisible ? this.closeDropdown(dropdown) : this.openDropdown(dropdown);
    }

    // Close the dropdown if user clicks outside the currently open instance.
    handleOutsideClick(event) {
        if (CustomSelect.currentOpenDropdown && !CustomSelect.currentOpenDropdown.parentElement.contains(event.target)){
            this.closeDropdown(CustomSelect.currentOpenDropdown);
        }
    }

    // Close targeted dropdown, reset class and reasign currentOpenDropdown.
    closeDropdown(dropdown) {
        dropdown.style.display = "none";
        dropdown.parentElement.classList.remove("is-open");
        CustomSelect.currentOpenDropdown = null;

        // Remove the event listener to the body
        document.removeEventListener("click", this.boundOutsideClickHandler);
    }

    // Open targeted dropdown, reset class and reasign currentOpenDropdown.
    openDropdown(dropdown){
        dropdown.style.display = "block";
        dropdown.closest(".custom-select").classList.add("is-open");
        CustomSelect.currentOpenDropdown = dropdown;

        // Add event listener to the body and bind the click to the current object.
        this.boundOutsideClickHandler = this.handleOutsideClick.bind(this);
        document.addEventListener("click", this.boundOutsideClickHandler);
    }

    editSelectedOption(newSelectedOption, header) {
        if (this.currentSelectedOption)
            this.currentSelectedOption.classList.remove("prevent-selection");
        newSelectedOption.classList.add("prevent-selection"); 
        header.innerText = newSelectedOption.innerText;       
        this.currentSelectedOption = newSelectedOption;
    }
}

// Initialize all the custom select elements
const initCustomSelect = () => {

    const defaultSelects = document.querySelectorAll(".custom-select");
    let customSelects = [];

    for (let index = 0; index < defaultSelects.length; index++) {
        customSelects[index] = new CustomSelect(defaultSelects[index], {
            onSelect: (clickedDropdown, clickedOption) => {
                // updateIframeSrc(dropdown, clickedIndex);
                new UIManager({
                    clickedDropdown: clickedDropdown,
                    clickedOption: clickedOption,
                })
            },
        })
    }

}

export default initCustomSelect;