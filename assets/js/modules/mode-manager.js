/**
 * This class manages two main elements of the dashboard: the board displaying all iframes and banners,
 * and the "served-sizes" component, which allows users to select which banner ratios to display on the board.
 * The logic relies solely on CSS to show or hide the selected ratios (no api calls). Users can choose between
 * reviewing banners one at a time ("single-view") or multiple banners simultaneously ("multi-view").
 */

class ModeManager {
    constructor(
        viewModeSwitch,
        bannerSizeList,
        bannerPreviewBoard,
        toggleButton,
        config = {}
    ) {
        // Header elements
        this.viewModeSwitch = viewModeSwitch;

        this.modeOptions = viewModeSwitch.querySelectorAll("li button");
        this.buttons = bannerSizeList.querySelectorAll("li button");
        this.banners = bannerPreviewBoard.querySelectorAll(".banner");

        this.handleClearSelection = this.toggleSelection.bind(this); // For reference
        this.toggleButton = toggleButton;

        // Defining default mode
        this.isMultiMode =
            config.isMultiMode === undefined ? true : config.isMultiMode;

        this.init();
    }

    init() {
        this.updateUI();

        this.modeOptions.forEach((modeButton) => {
            modeButton.addEventListener("click", (e) => {
                this.selectMode(e);
                this.updateUI();
            });
        });

        // Clear the board
        this.toggleButton.addEventListener("click", this.handleClearSelection);

        this.buttons.forEach((button) => {
            button.addEventListener("click", this.handleButtonClick.bind(this));
        });
    }

    handleButtonClick(e) {
        this.toggleButtonSelection(e);
        this.updateBoard();
    }

    updateUI() {
        this.syncButtonStates();
        this.updateBoard();
    }

    selectMode(e) {
        this.modeOptions.forEach((modeButton) => {
            modeButton.classList.remove("--selected");
        });

        this.isMultiMode = e.target.id === "multi";
        e.target.classList.add("--selected");
    }

    toggleSelection(e) {
        const clearButton = e.target;

        this.isCleared = !this.isCleared;
        clearButton.classList.toggle("--cleared", this.isCleared);

        const action = this.isCleared ? "remove" : "add";
        this.buttons.forEach((button) =>
            button.classList[action]("--selected")
        );

        // Remove event listener temporarily
        this.toggleButton.removeEventListener(
            "click",
            this.handleClearSelection
        );

        // Re-add event listener after a slight delay to allow UI updates
        setTimeout(() => {
            this.toggleButton.addEventListener(
                "click",
                this.handleClearSelection
            );
        }, 0);
        this.updateBoard();
    }

    syncButtonStates() {
        // Sync mode selector state
        this.modeOptions.forEach((modeOption) => {
            modeOption.classList.toggle(
                "--selected",
                (this.isMultiMode && modeOption.id === "multi") ||
                    (!this.isMultiMode && modeOption.id === "single")
            );
        });

        // Sync radio button states
        this.buttons.forEach((button, i) => {
            const isFirstButton = i === 0;
            this.isMultiMode
                ? button.classList.add("--selected")
                : button.classList.toggle("--selected", isFirstButton);
        });
    }

    toggleButtonSelection(e) {
        if (this.isMultiMode) {
            e.currentTarget.classList.toggle("--selected");
        } else {
            this.buttons.forEach((button) => {
                button.classList.remove("--selected");
            });
            e.currentTarget.classList.add("--selected");
        }
    }

    getSizes() {
        return Array.from(this.buttons)
            .filter((button) => button.classList.contains("--selected"))
            .map((button) => ({
                width: button.dataset.width,
                height: button.dataset.height,
            }));
    }

    updateBoard() {
        const servedSizes = this.getSizes(this.buttons);
        this.banners.forEach((banner) => {
            const iframe = banner.querySelector("iframe");
            const iframeWidth = iframe.width;
            const iframeHeight = iframe.height;
            const isMatch = servedSizes.some(
                (size) =>
                    size.width === iframeWidth && size.height === iframeHeight
            );
            banner.style.display = isMatch ? "block" : "none";
        });
    }
}

function initModeManager() {
    const viewModeSwitch = document.querySelector("#view-mode-switch");
    const bannerSizeList = document.querySelector("#banner-size-list");
    const bannerPreviewBoard = document.querySelector("#banner-preview-board");
    const toggleButton = document.querySelector("#toggle");

    if (
        viewModeSwitch &&
        bannerSizeList &&
        bannerPreviewBoard &&
        toggleButton
    ) {
        new ModeManager(
            viewModeSwitch,
            bannerSizeList,
            bannerPreviewBoard,
            toggleButton,
            {
                isMultiMode: false,
            }
        );
    }
}

export default initModeManager;
