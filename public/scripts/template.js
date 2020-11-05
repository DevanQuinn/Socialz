class Template {
    constructor(arr, textArr = [], className = null, parentNode) {
        this.arr = arr;
        this.className = className;
        this.parentNode = parentNode;
        this.textArr = textArr;
    }

    generateTemplate()
    {
        let nodeArr = [];
        this.arr.forEach((element, index) => {
            const node = document.createElement(element)
            document.className = this.className;
            this.parentNode.appendChild(node);
            node.innerHTML = this.textArr[index];
            nodeArr.push(node);
        });
        return nodeArr;
    }
};

module.exports = Template;