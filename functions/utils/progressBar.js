/**
 * Create a progressBar
 * @param { Object } = options - a object that contain options, it is optional
 * @param { String } = options.empty - a string for the empty bar
 * @param { String } = options.full - a string for the full bar
 * @param { String } = options.dock - a string for the bar, you can add the bar with "{progression}" and the percent with "{percent}"
 * @param { Number } = options.value - the start value of the bar
 * @param { Number } = options.maxValue - the max value of the bar
 * @param { Number } = options.length - the character length of the bar
 *
 * @returns { Object }
 */

class progressBar {
  constructor(options = {}) {
    if (options.empty && typeof options.empty == "string")
      this.empty = options.empty;
    else this.empty = " ";
    if (options.full && typeof options.full == "string")
      this.full = options.full;
    else this.full = "#";
    if (options.dock && typeof options.dock == "string")
      this.dock = options.dock;
    else this.dock = "[ {progression} ] {percent}%";
    if (options.value && typeof options.value == "number")
      this.value = options.value;
    else this.value = 0;
    if (options.maxValue && typeof options.maxValue)
      this.maxValue = options.maxValue;
    else this.maxValue = 100;
    if (options.length && typeof options.length == "number")
      this.length = options.length;
    else this.length = 10;
  }

  /**
   * This function return the bar in ASCII characters
   *
   * @returns { String }
   */
  draw() {
    const progress = (this.value / this.maxValue).toFixed(1);
    if (progress > 1)
      return this.dock.replace(/{(progression|percent)}/g, (a, b) => {
        switch (a) {
          case "{progression}":
            return this.getBar(this.full, this.length);
          case "{percent}":
            return 100;
          default:
            return a;
        }
      });

    return this.dock.replace(/{(progression|percent)}/g, (a, b) => {
      switch (a) {
        case "{progression}":
          return (
            this.getBar(this.full, (progress * this.length).toFixed(0)) +
            "" +
            this.getBar(
              this.empty,
              this.length - (progress * this.length).toFixed(0)
            )
          );
        case "{percent}":
          return ((this.value / this.maxValue) * 100).toFixed(0);
        default:
          return a;
      }
    });
  }

  /**
   * This function update the value of the bar
   *
   * @param { Number } nb - the value to add
   * @returns { Boolean }
   */
  update(nb) {
    if (typeof nb !== "number") return false;
    this.value += nb;
    return true;
  }

  /**
   * This function update the model of the bar
   *
   * @param { String } str - the new model for the bar
   * @returns { Boolean }
   */
  updateDock(str) {
    if (typeof str !== "string") return false;
    this.dock = str;
    return true;
  }

  /**
   * This function update the maxValue of the bar
   *
   * @param { Number } nb - the new maxValue
   * @returns { Boolean }
   */
  updateMaxValue(nb) {
    if (typeof nb !== "number") return false;
    this.maxValue = nb;
    return true;
  }

  /**
   * This function update the length of the bar
   *
   * @param { Number } nb - the new length of the bar
   * @returns { Boolean }
   */
  updateLength(nb) {
    if (typeof nb !== "number") return false;
    this.length = nb;
    return true;
  }

  /**
   * This function update the full character of the bar
   *
   * @param { Number } nb - the new full character
   * @returns { Boolean }
   */
  updateFullCht(str) {
    if (typeof str !== "string") return false;
    this.full = str;
    return true;
  }

  /**
   * This function update the empty character of the bar
   *
   * @param { Number } nb - the new empty character
   * @returns { Boolean }
   */
  updateEmptyCht(str) {
    if (typeof str !== "string") return false;
    this.empty = str;
    return true;
  }

  /**
   * This function give a line of ASCII characters with a length and string
   *
   * @param { String } cht - the ASCII character
   * @param { Number } lgt - the line length
   * @returns { String }
   */
  getBar(cht, lgt) {
    if (typeof cht !== "string") throw new Error("character must be a string");
    let str = "";
    for (let i = 0; i < lgt; i++) {
      str += cht;
    }
    return str;
  }
}

module.exports = progressBar;
