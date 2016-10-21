/**
 * Created by mbroersen on 7/7/16.
 */
class AnimateScroll {

    /**
     *
     * @param options
     */
    constructor (options)
    {
        options = options || {};
        this.increment = 20;
        this.to = options.to || 0;
        this.duration = options.duration || 500;
        this.startDelayTimeout = null;
    }

    
    animate(to, duration, complete)
    {
        if (this.isRunning()) {
            return;
        }

        this.increment = 20;
        this.to = to || 0;
        this.duration = duration || 500;
        this.onComplete = complete || function () {};
        this.start();
    }
    
    /**
     *
     */
    start()
    {
        this.running = true;
        this.startPosition = window.scrollY;
        this.change =  this.to - this.startPosition;
        this.currentTime = 0;
        this._animateStep();
    }

    /**
     *
     * @private
     */
    _animateStep()
    {
        this.currentTime += this.increment;
        var val = AnimateScroll.easeInOutQuad(this.currentTime, this.startPosition, this.change, this.duration);

        window.scrollTo(0, Math.round(val));

        if (this.currentTime < this.duration) {
            var me = this;

            window.requestAnimationFrame(function () {
                me._animateStep();
            });
            return;
        }
        
        this._complete();
    }

    /**
     *
     * @private
     */
    _complete()
    {
        window.scrollTo(0, this.to);
        this.onComplete();
        this.running = false;
    }

    /**
     * 
     */
    isRunning()
    {
        return this.running;
    }
    

    /**
     *
     * @param t
     * @param b
     * @param c
     * @param d
     * @returns {*}
     */
    static easeInOutQuad (t, b, c, d)
    {
        t /= d/2;
        if (t < 1) return c/2*t*t + b;
        t--;
        return -c/2 * (t*(t-2) - 1) + b;
    }
}

module.exports = AnimateScroll;