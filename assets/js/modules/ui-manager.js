import initModeManager from "./mode-manager";

/**
 * After each user click, the code below loops through all dropdown elements and retrieves the selected options.
 * These options act as "keys" used to form a path through the production object, leading to the corresponding index.html file.
 *
 * Each key is validated before use. For instance, if the user switches from version 5 to version 2 while "Italian"
 * is selected as the language, it is essential to check whether "Italian" is available for version 2. Any invalid keys
 * (e.g., "Italian") are assigned a fallback value (currently the last available option in the array). The validated keys
 * are then returned to compose a valid path, which is subsequently used to rebuild the user interface.
 *
 * The rebuilt UI reflects the new selection by updating dropdowns, buttons, and iframes dynamically to ensure the user sees
 * only valid and available options based on their choices.
 */

class UIManager {
    constructor(el = {}) {
        this.clickedDropdown = el.clickedDropdown;
        this.clickedOption = el.clickedOption;

        // Retrieve the "production data" object, pass from the server to the DOM.
        // This object is a snapshot of the whole current production.
        this.jsonProductionData = document.getElementById("production-data");
        this.productionData = JSON.parse(this.jsonProductionData.textContent);

        this.rebuildUI();
    }

    rebuildUI() {
        // The keys are generated, validated, and returned as an array of valid keys.
        // The array follows this specific order: "variation," "version," "language."
        // This order is crucial as it reflects the structure of the production object.
        const keys = this.generatePathKeys();
        console.log(keys);
        // The keys are passed through each function to form a valid path,
        // enabling them to access the necessary data to rebuild the component.
        // this.updateBasicInfo(keys);
        this.rebuildSelectables(keys);
        this.rebuildRadioButtons(keys);
        this.rebuildBoard(keys);
        
        // After the rebuild, the event listeners attached to each UI element are removed.
        // It is necessary to reinitialize the modes.
        initModeManager();
    }

    generatePathKeys() {
        const dropdowns = document.querySelectorAll(".selectable");
        let potentialVariation, potentialVersion, potentialLanguage;

        dropdowns.forEach((dropdown) => {
            const dropdownType = dropdown.getAttribute("data-type");
            const optionKey =
                this.clickedDropdown === dropdown
                    ? this.clickedOption.getAttribute("data-key")
                    : dropdown
                          .querySelector(".--selected")
                          .getAttribute("data-key");

            // Assign potential values based on dropdown type
            if (dropdownType === "variation") potentialVariation = optionKey;
            if (dropdownType === "version") potentialVersion = optionKey;
            if (dropdownType === "language") potentialLanguage = optionKey;
        });

        const keysToTest = [
            potentialVariation,
            potentialVersion,
            potentialLanguage,
        ];

        return this.resolveKeys(this.productionData, keysToTest);
    }

    resolveKeys(obj, keys) {
        let current = obj;
        let validKeys = [];
        for (const key of keys) {
            if (current?.hasOwnProperty(key)) {
                current = current[key];
                validKeys.push(key);
            } else {
                // Notes:
                // Select the first key: Object.keys(current)[0];
                // Select the last key: Object.keys(current)[Object.keys(current).length - 1];
                const fallback =
                    Object.keys(current)[Object.keys(current).length - 1];
                validKeys.push(fallback);
                current = current[fallback];
            }
        }
        return validKeys;
    }

    rebuildSelectables(keys) {
        // Sorting dropdowns to rebuild in this particular order: variation, version, language.
        const variationDropdown = document.querySelector(
            'div[data-type="variation"]'
        );
        const versionDropdown = document.querySelector(
            'div[data-type="version"]'
        );
        const languageDropdown = document.querySelector(
            'div[data-type="language"]'
        );
        const sortedDropdown = [
            variationDropdown,
            versionDropdown,
            languageDropdown,
        ];

        // Sorting data "folders" in this particular order: variation, version, language.
        const variationFolder = this.productionData;
        const versionFolder = this.productionData[keys[0]];
        const languageFolder = this.productionData[keys[0]][keys[1]];
        const sortedFolders = [variationFolder, versionFolder, languageFolder];

        // Looping through each dropdown, one type at a time,
        // and rebuilding it using data from the corresponding data folder.
        // Additionally, keys are passed through the createOption function
        // to detect which key is currently selected.
        sortedDropdown.forEach((dropdown, i) => {
            dropdown.innerHTML = "";
            this.createOption(dropdown, sortedFolders[i], keys[i]);
        });
    }

    createOption(dropdown, folder, selectedKey) {
        const fragment = document.createDocumentFragment();
        Object.keys(folder).forEach((item, index) => {

            const formatedItemText = item.replace("-", " ");
            const option = document.createElement("button");
            option.classList.add("button-default", "btn-common");
            option.setAttribute("data-index", index);
            option.setAttribute("data-key", item);
            option.innerHTML = formatedItemText;


            if (item === selectedKey) option.classList.add("--selected");

            fragment.append(option);
        });

        dropdown.append(fragment);
    }

    rebuildRadioButtons(keys) {
        const servedSizes =
            this.productionData[keys[0]][keys[1]][keys[2]]["served-sizes"];
        if (!servedSizes) {
            console.error(
                "Invalid path to HTML file. Check the production data or selected keys."
            );
            return;
        }

        const bannerSizeList = document.querySelector("#banner-size-list");
        bannerSizeList.innerHTML = "";
        const fragment = document.createDocumentFragment();

        servedSizes.forEach((servedSize) => {
            const bannerWidth = servedSize[0];
            const bannerHeight = servedSize[1];
            const listItem = document.createElement("li");
            listItem.classList.add("banner-size-item");

            listItem.innerHTML = `
            <button data-width="${bannerWidth}" data-height="${bannerHeight}" class="banner-size-button --selected">
                ${bannerWidth}x${bannerHeight}
            </button>`;

            fragment.appendChild(listItem);
        });

        bannerSizeList.append(fragment);
    }

    rebuildBoard(keys) {
        const servedSizes =
            this.productionData[keys[0]][keys[1]][keys[2]]["served-sizes"];
        const pathToHTMLFile =
            this.productionData[keys[0]][keys[1]][keys[2]]["path-to-file"];

        const bannerPreviewBoard = document.querySelector(
            "#banner-preview-board"
        );
        bannerPreviewBoard.innerHTML = "";

        servedSizes.forEach((servedSize) => {
            const bannerWidth = servedSize[0];
            const bannerHeight = servedSize[1];

            const banner = document.createElement("div");
            banner.classList.add("banner");

            const bannerWrapper = document.createElement("div");
            bannerWrapper.classList.add("banner__wrapper");
            bannerWrapper.innerHTML = `<iframe src="${pathToHTMLFile}" width="${bannerWidth}" height="${bannerHeight}" frameborder="0"></iframe>`;

            const bannerFooter = document.createElement("div");
            bannerFooter.classList.add("banner__footer");
            bannerFooter.innerHTML = `<p>${bannerWidth}x${bannerHeight}</p>`;

            banner.append(bannerWrapper);
            banner.append(bannerFooter);

            bannerPreviewBoard.append(banner);
        });
    }

    updateBasicInfo(keys) {
        const infoVersion = document.getElementById("counter-version");
        const infoLanguage = document.getElementById("counter-language");
        const infoRatio = document.getElementById("counter-ratio");

        const versionNumber = Object.keys(this.productionData[keys[0]]).length;
        const languageNumber = Object.keys(
            this.productionData[keys[0]][keys[1]]
        ).length;
        const ratioNumber = Object.keys(
            this.productionData[keys[0]][keys[1]][keys[2]]["served-sizes"]
        ).length;

        infoVersion.innerText = this.formatWordWithCount(
            versionNumber,
            "version"
        );
        infoLanguage.innerText = this.formatWordWithCount(
            languageNumber,
            "language"
        );
        infoRatio.innerText = this.formatWordWithCount(ratioNumber, "ratio");
    }

    formatWordWithCount(count, word) {
        const shouldBePlural = count > 1;
        const formattedWord = shouldBePlural ? word + "s" : word;
        return count + " " + formattedWord;
    }

    fixeCollapsiblesMaxHeight() {
        const collapsibles = document.querySelectorAll(".collapsible");
        collapsibles.forEach((collapsible) => {
            const collapsibleBody =
                collapsible.querySelector(".collapsible__body");
            const collapsibleWrapper = collapsibleBody.firstElementChild;
            const collapsibleNewHeight =
                CollapsibleHandler.getContentHeight(collapsibleWrapper);
            const isExpanded = collapsibleBody.classList.contains("--expanded");
            collapsibleBody.style.maxHeight = isExpanded
                ? collapsibleNewHeight + "px"
                : 0;
        });
    }
}

export default UIManager;
