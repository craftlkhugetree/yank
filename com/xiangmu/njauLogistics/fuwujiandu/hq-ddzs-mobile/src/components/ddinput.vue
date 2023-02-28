<template>
  <div class="rich" @click.stop="void 0">
    <div
      placeholder="请详细描述督察发现的情况（必填）"
      class="font-s"
      id="dd_rich_text"
      :contenteditable="canEdit"
      @blur="onDivBlur"
      @mousedown="cancelEvent;"
      @click="cancelEvent;"
      @mouseup="saveSelection"
      @focus="restoreSelection"
      @keyup="saveSelection"
    ></div>
    <div class="div_flex label">
      <div
        v-for="item in topLabel"
        :key="item.id"
        class="no-wrap font-s item"
        :class="item.choose ? 'choose' : ''"
        @click.stop="chooseLabel(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <input-drop
      v-if="showContentEdit"
      :nodeText="nodeText"
      :selectDataList="label"
      @itemClick="itemClick"
    />
  </div>
</template>

<script>
import { workLabel_query } from "@/assets/js/api";
export default {
  name: "DDInput",
  components: {
    inputDrop: () => import("./ddInputDrop")
  },
  data() {
    return {
      space: "\u00a0",
      label: [],
      topLabel: [],
      canEdit: true,
      nodeText: "",
      parseContendMsg: ``,
      savedRange: null,
      isInFocus: false,
      iptTimer: null,
      num: 0,
      lastSelection: null,
      showContentEdit: false
    };
  },
  mounted() {
    this.getLabel();
    this.setLastEditRange();
  },
  computed: {},
  watch: {
    parseContendMsg(v) {
      let maxL = 1000;
      if (v.length > maxL) {
        let div = document.getElementById(this.global.richText);
        div.innerText = this.parseContendMsg.slice(0, maxL);
        let nodes = div.childNodes;
        this.$nextTick(() => {
          this.lastSelection.collapse(nodes[nodes.length - 1], 1);
        });
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.iptTimer);
  },
  methods: {
    chooseLabel(item) {
      this.$set(item, "choose", !item.choose);
      // console.log(
      //   this.savedRange,
      //   this.lastSelection,
      //   this.lastSelection.anchorNode.nodeName
      // );
      let tmp = `#${item.name}#`;
      let div = document.getElementById(this.global.richText);
      let nodes = div.childNodes;
      for (let index in nodes) {
        let obj = nodes[index];
        let t = obj.textContent;
        if (item.choose) {
          let span = document.createElement("span");
          span.className = "keyword";
          span.textContent = tmp;
          div.appendChild(span);
          let a1 = document.createTextNode(this.space);
          div.appendChild(a1);
          div.focus();
          this.lastSelection.collapse(nodes[nodes.length - 1], 1);
          break;
        } else {
          if (t === tmp) {
            let last = nodes[+index - 1];
            if (last && last.textContent === this.space) {
              // prevent duplicate brackets
              last.remove();
            }
            obj.remove();
          }
        }
      }
      this.changePText();
    },
    getLabel() {
      workLabel_query({
        limit: 10,
        page: 1
      }).then(res => {
        this.common.dealRes(res, () => {
          let label = res.data || [];
          label = label.map(b => ({
            count: "半年 " + this.util.bc(b.useCount),
            ...b
          }));
          this.label = label;
          this.topLabel = this.label.slice(0, 4);
        });
      });
    },
    itemClick(str) {
      let div = document.getElementById(this.global.richText);
      let nodes = div.childNodes;
      for (let index in nodes) {
        let item = nodes[index];
        let t = item.textContent;
        if (item.dd1) {
          this.showContentEdit = false;
          item.dd1 = false;
          item.textContent = `#${str}#`;
          div.focus();
          this.lastSelection.collapse(nodes[+index + 1], 1);
        }
      }
    },
    calSame(str, c) {
      let obj = {};
      for (let id in str) {
        let t = str[id];
        if (obj[t]) {
          obj[t] += 1;
        } else {
          obj[t] = 1;
        }
      }
      return obj[c] || 0;
    },
    // generate editable text
    getInput() {
      this.iptTimer = setInterval(() => {
        let div = document.getElementById(this.global.richText);
        this.changePText();
        this.parseContendMsg = div.innerText || "";
        let nodes = div.childNodes;
        let r2 = /^#.*?#$/;
        let recordTopLabel = {};
        for (let index in nodes) {
          let item = nodes[index];
          let t = item.textContent;
          let n = this.calSame(t, "#");
          // span
          if (item.nodeType === 1) {
            if (item.nodeName === "FONT") {
              div.insertBefore(document.createTextNode(t), item);
              item.remove();
              continue;
            }
            // choose topLabel
            this.topLabel.forEach((p, index) => {
              if (`#${p.name}#` === t) {
                this.$set(p, "choose", true);
                recordTopLabel[index] = recordTopLabel[index]
                  ? ++recordTopLabel[index]
                  : 1;
              }
            });
            if (n > 2 || (!r2.test(t) && n === 2)) {
              item.remove();
            } else if (item.dd1 && n === 2) {
              this.showContentEdit = false;
              item.dd1 = false;
              this.lastSelection.collapse(nodes[+index + 1], 1);
              //   this.savedRange.setStart(nodes[+index + 1], 0);
            } else if (n === 1 && item.dd1) {
              this.nodeText = item.textContent;
            } else if (n === 1 && !item.dd1) {
              item.remove();
            }
          } else if (item.nodeType === 3) {
            if (n > 0) {
              let t3 = t.split(/(#.*?#){1}/);
              let tmp;
              t3.forEach(x => {
                let xn = this.calSame(x, "#");
                if (xn === 0) {
                  div.insertBefore(document.createTextNode(x), item);
                } else if (xn === 1) {
                  ++this.num;
                  let arr = x.split("#");
                  let span = document.createElement("span");
                  span.className = "keyword";
                  span.textContent = "#";
                  span.dd1 = true;
                  let a0 = document.createTextNode(arr[0]);
                  let a1 = document.createTextNode(this.space + arr[1]);
                  div.insertBefore(a0, item);
                  div.insertBefore(span, item);
                  div.insertBefore(a1, item);
                  this.showContentEdit = true;
                  tmp = span;
                } else {
                  ++this.num;
                  let span = document.createElement("span");
                  span.className = "keyword";
                  span.textContent = x;
                  div.insertBefore(span, item);
                  tmp = span;
                }
              });
              item.remove();
              this.$nextTick(() => {
                this.lastSelection.collapse(tmp, 1);
              });
            }
          } else {
            // item.remove && item.remove()
          }
        }
        this.topLabel.forEach((p, index) => {
          if (!recordTopLabel[index]) {
            this.$set(p, "choose", false);
          }
        });
      }, 200);
    },
    saveSelection(e) {
      if (window.getSelection) {
        //non IE Browsers
        let sel = window.getSelection();
        this.savedRange = sel.rangeCount > 0 && sel.getRangeAt(0);
      } else if (document.selection) {
        //IE
        this.savedRange = document.selection.createRange();
      }
    },
    setLastEditRange() {
      let selection = window.getSelection
        ? window.getSelection()
        : document.selection;
      this.lastSelection = selection;
    },
    restoreSelection() {
      this.isInFocus = true;
      document.getElementById(this.global.richText).focus();
      if (this.savedRange != null) {
        if (window.getSelection) {
          //non IE and there is already a selection
          var s = window.getSelection();
          if (s.rangeCount > 0) s.removeAllRanges();
          s.addRange(this.savedRange);
        } else if (document.createRange) {
          //non IE and no selection
          window.getSelection().addRange(this.savedRange);
        } else if (document.selection) {
          //IE
          this.savedRange.select();
        }
      }
      this.$nextTick(() => {
        if (!this.iptTimer) {
          this.getInput();
        }
      });
    },
    //this part onwards is only needed if you want to restore selection onclick
    onDivBlur() {
      this.isInFocus = false;
      clearInterval(this.iptTimer);
      this.iptTimer = null;
      // if (this.savedRange) {
      //   this.lastSelection.removeAllRanges();
      //   this.lastSelection.addRange(this.savedRange);
      // }
      this.changePText();
    },
    changePText() {
      this.$parent.getRichText();
    },

    cancelEvent(e) {
      if (this.isInFocus == false && this.savedRange != null) {
        if (e && e.preventDefault) {
          //alert("FF");
          e.stopPropagation(); // DOM style (return false doesn't always work in FF)
          e.preventDefault();
        } else {
          window.event.cancelBubble = true; //IE stopPropagation
        }
        this.restoreSelection();
        return false; // false = IE style
      }
    }
  }
};
</script>
<style lang="scss">
.rich {
  position: relative;
  margin-bottom: 20px;
  #dd_rich_text {
    padding: $fixed_side $fixed_mb 0;
    height: 100px;
    white-space: normal;
    overflow-y: scroll;
    overflow-x: hidden;
    margin: 0;
    -webkit-user-select: auto;
    border-top: 1px solid #d9d9d9;
    color: #595959;
    &:empty::before {
      content: attr(placeholder);
      color: #969799;
    }
    &:focus::before {
      content: none;
    }
    .keyword {
      color: #ff9900;
    }
  }
  .label {
    border-bottom: 1px solid #d9d9d9;
    padding: $fixed_mb 0;
    .item {
      padding: 0 2px;
      max-width: 24%;
      margin-left: 1%;
      min-width: 72px;
      height: 26px;
      border: 1px solid #d9d9d9;
      border-radius: 2px;
      font-size: 12px;
      line-height: 26px;
      text-align: center;
      color: #8c8c8c;
    }
    .choose {
      border: 1px solid #ff9900;
      color: #ff9900;
    }
  }
}
</style>
