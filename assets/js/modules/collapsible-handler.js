import UIManager from "./ui-manager";

class CollapsibleHandler {
    static instances = []; // Track all collapsible instances

    constructor(collapsible, config = {}) {
        this.collapsible = collapsible;
        this.collapsibleHeader = this.collapsible.firstElementChild;
        this.collapsibleBody = this.collapsible.lastElementChild;

        this.isExpanded = config.isExpanded || false;
        this.closeOnClickOutside = config.closeOnClickOutside ?? true; // Default: true
        this.allowMultipleOpen = config.allowMultipleOpen ?? false;
        this.onSelect = config.onSelect; // Callback function

        CollapsibleHandler.instances.push(this); // Store this instance

        this.init();
    }

    init() {
        // Sync initial state with DOM
        this.toggleCollapsible(this.isExpanded);

        this.collapsibleHeader.addEventListener("click", (event) => {
            event.stopPropagation(); // Prevent click event from bubbling to document
            if (!this.isExpanded) {
                if (!this.allowMultipleOpen) {
                    CollapsibleHandler.closeAll(); // Close others before opening if single-open mode
                }
            }
            this.isExpanded = !this.isExpanded;
            this.toggleCollapsible(this.isExpanded);
            // this.rotateArrow();
        });

        // Listen for clicks outside the collapsible only if enabled
        if (this.closeOnClickOutside) {
            document.addEventListener("click", this.handleOutsideClick);
        }

        this.triggerUIRebuild();
    }

    toggleCollapsible(expand) {
        this.collapsible.classList.toggle("--expanded", expand);
        this.collapsibleBody.style.display = expand ? "block" : "none";
    }

    // rotateArrow() {
    //     const angle = this.isExpanded ? "180" : "0";
    //     this.collapsibleCross.style.transform = `rotate(${angle}deg)`;
    // }

    static closeAll() {
        CollapsibleHandler.instances.forEach((instance) => {
            if (instance.isExpanded) {
                instance.isExpanded = false;
                instance.toggleCollapsible(false);
                // instance.rotateArrow();
            }
        });
    }

    handleOutsideClick = (event) => {
        if (!this.collapsible.contains(event.target)) {
            this.isExpanded = false;
            this.toggleCollapsible(false);
            // this.rotateArrow();
        }
    };

    triggerUIRebuild() {
        // Target only "variation", "version" and "language" collapsible.
        const collapsibleID = this.collapsibleBody.closest(".collapsible").id;
        if (
            collapsibleID === "variation" ||
            collapsibleID === "version" ||
            collapsibleID === "language"
        ) {
            this.collapsibleBody.addEventListener("click", (e) => {
                if(e.target.classList.contains("--selected")) return;
                if (this.onSelect) this.onSelect(e.currentTarget, e.target);
            });
        }
    }

    destroy() {
        document.removeEventListener("click", this.handleOutsideClick);
    }
}

export default function initCollapsibles(){
    const collapsibles = document.querySelectorAll(".collapsible");
    let customCollapsibles = [];
    if (collapsibles) {
        for (let i = 0; i < collapsibles.length; i++) {
            customCollapsibles[i] = new CollapsibleHandler(collapsibles[i], {
                isExpanded: true,
                allowMultipleOpen: true,
                closeOnClickOutside: false,
                onSelect: (clickedDropdown, clickedOption) => {
                    new UIManager({
                        clickedDropdown: clickedDropdown,
                        clickedOption: clickedOption,
                    });
                },
            });
        }
    }
}