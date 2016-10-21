import AnimateScroll from "../animate/Scroll";

class ScrollToTop 
{
    /**
     * 
     * @param options
     */
    constructor(options)
    {
        this.animator = new AnimateScroll();
        this.element = options.element;
        this.startDelayTimeout = null;
    }

    /**
     *
     * @param ele
     * @returns {number}
     */
    getTotalTop()
    {
        var ele = this.element;

        var totalTop = 0;
        while (ele) {
            totalTop += ele.offsetTop;
            ele = ele.offsetParent;
        }

        return totalTop;
    }

    /**
     *
     */
    onMouseLeave()
    {
        document.activeElement.blur();
        clearTimeout(this.startDelayTimeout);
    }
    

    /**
     *
     */
    onFocus(e)
    {
        if (this.animator.isRunning()) {
            return;
        }

        if (this.startDelayTimeout !== null) {
            return;
        }


        var me = this;


        this.startDelayTimeout = setTimeout(function () {
            me.animator.animate(me.getTotalTop(), 500,  function () {
                e.detail.datagrid.yScrollContainer.focus();
            });
            me.startDelayTimeout = null;

        }, 500);

    }
}
module.exports = ScrollToTop;