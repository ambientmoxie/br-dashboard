class Headliner {
    constructor(el) {
        this.header = el;
        this.init();
    }

    init(){
        this.generateGrid();
        window.addEventListener("resize", () => {
            this.generateGrid();
        })    
    }

    generateGrid() {
        // Decompose header wording into an array of letters,
        // then clear the header content.
        const wording = this.header.textContent.trim();
        const splittedText = [...wording];
        this.header.innerText = "";

        // Get header current width
        const computedStyle = window.getComputedStyle(this.header);
        const headerWidth = parseInt(computedStyle.width);
        
        // Set desired column width and creates an array of random css values.
        // This array will be used to add "movement" and randomness to the composition.
        const columunWidth = 25;
        const amount = headerWidth / columunWidth;
        const alignment = ["flex-end", "flex-start", "center"];

        // Create document fragment to precompose the header offscreen.
        let fragment = document.createDocumentFragment();

        // Looping through the pre-set number of columns
        // a create a span for each loop.
        for (let i = 0; i < amount; i++) {
            const col = document.createElement("span");
            col.classList.add("col");

            // If available in the splittedText arraty,
            // append a letter to the span to form the sentence.
            if (i < splittedText.length) {
                col.innerText = splittedText[i];
                // Adding random alignment css value to the letter.
                const alignmentIndex = this.randomIntFromInterval(0, alignment.length -1);
                col.style.alignItems = alignment[alignmentIndex];
            }
            fragment.append(col);
        }
        this.header.append(fragment);
    }

    randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export { Headliner };
