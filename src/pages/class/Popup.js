import Util_ from "./GlobalFtn";
import React from "react";
import "../../stylesheets/popup.css";

export default (function () {
  "use strict";
  //var
  //-----------------------
  //public ftn
  function Action_cancel_button() {
    Util_.make_element("div", "popup_render_place");
  }
  function Set_checkbox_len(max_len_, start_index_) {
    DataInfo.set_public_value({
      stack: [],
      max_len: max_len_,
      start_index: start_index_,
    });
  }
  //-----------------------
  //private ftn
  async function PopupContentCategory(
    array_,
    max_,
    init_state_ = null,
    start_index_ = 0
  ) {
    if (!start_index_) start_index_ = 0;
    var checkbox_text_ = Object.values(
      Util_.category_to_string("category_qa")
    ).slice(start_index_);
    var checkbox_state_ = new Array(checkbox_text_.length).fill(false);
    var start_state_ = [];
    if (init_state_)
      init_state_.map((i_) => {
        if (typeof i_ === "number") {
          checkbox_state_[i_ - start_index_] = true;
          start_state_.push(i_);
        }
      });
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          array: checkbox_state_,
        };
        this.result = start_state_;
        this.max_len = max_;
        this.add_num = start_index_;
      }
      action_checkbox_click(index_, e) {
        if (e.target.checked && this.max_len === 1) {
          var temp_ = this.state.array;
          temp_[this.result[0] - this.add_num] = false;
          temp_[index_] = true;
          this.setState({ array: temp_ });
          this.result[0] = index_ + this.add_num;
          this.props.set_state("popup_data", this.result);
        } else if (e.target.checked && this.result.length < this.max_len) {
          var temp_ = this.state.array;
          temp_[index_] = true;
          this.setState({ array: temp_ });
          this.result.push(index_ + this.add_num);
          this.props.set_state("popup_data", this.result);
        } else if (!e.target.checked) {
          var temp_ = this.state.array;
          temp_[index_] = false;
          this.setState({ array: temp_ });
          temp_ = 0;
          for (var i = 0; i < this.result.length; i++) {
            if (this.result[i] == index_ + this.add_num) {
              temp_ = i;
              break;
            }
          }
          this.result.splice(temp_, 1);
          this.props.set_state("popup_data", this.result);
        }
      }
      componentDidMount() {
        this.props.set_state("popup_data", this.result);
      }
      render() {
        const place_list = this.state.array.map((val_, index_) =>
          React.createElement(
            "div",
            { key: index_ },
            React.createElement(
              "label",
              { className: "none_display_checkbox_label" },
              React.createElement("input", {
                type: "checkbox",
                className: "popup_confirm_data",
                name: "place",
                checked: val_,
                onClick: this.action_checkbox_click.bind(this, index_),
              }),
              React.createElement(
                "span",
                { className: "normal_text" },
                checkbox_text_[index_] ? checkbox_text_[index_] : "없음"
              )
            )
          )
        );
        return React.createElement(
          "div",
          null,
          React.createElement(
            "div",
            { className: "popup_content_label normal_text" },
            "업무"
          ),
          React.createElement(
            "div",
            { className: "popup_checkbox_content" },
            place_list.slice(0, 16)
          ),
          React.createElement(
            "div",
            { className: "popup_content_label normal_text" },
            "업무 외"
          ),
          React.createElement(
            "div",
            { className: "popup_checkbox_content" },
            place_list.slice(16)
          )
        );
      }
    };
  }

  async function PopupContentArray(
    array_,
    max_,
    init_state_ = null,
    start_index_ = 0
  ) {
    if (!start_index_) start_index_ = 0;
    if (array_ === "place")
      var checkbox_text_ = Object.values(
        Util_.category_to_string("place")
      ).slice(start_index_);
    else if (array_ == "category1")
      var checkbox_text_ = Object.values(
        Util_.category_to_string("category")
      ).slice(start_index_);
    else if (array_ == "category2")
      var checkbox_text_ = Object.values(Util_.category_to_string("category2"));
    else if (array_ === "field")
      var checkbox_text_ = Object.values(
        Util_.category_to_string("field")
      ).slice(start_index_);
    else var checkbox_text_ = array_;

    var checkbox_state_ = new Array(checkbox_text_.length).fill(false);
    var start_state_ = [];
    if (init_state_)
      init_state_.map((i_) => {
        if (typeof i_ === "number") {
          checkbox_state_[i_ - start_index_] = true;
          start_state_.push(i_);
        }
      });
    return class extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          array: checkbox_state_,
        };
        this.result = start_state_;
        this.max_len = max_;
        this.add_num = start_index_;
      }
      action_checkbox_click(index_, e) {
        if (e.target.checked && this.max_len === 1) {
          var temp_ = this.state.array;
          temp_[this.result[0] - this.add_num] = false;
          temp_[index_] = true;
          this.setState({ array: temp_ });
          this.result[0] = index_ + this.add_num;
          this.props.set_state("popup_data", this.result);
        } else if (e.target.checked && this.result.length < this.max_len) {
          var temp_ = this.state.array;
          temp_[index_] = true;
          this.setState({ array: temp_ });
          this.result.push(index_ + this.add_num);
          this.props.set_state("popup_data", this.result);
        } else if (!e.target.checked) {
          var temp_ = this.state.array;
          temp_[index_] = false;
          this.setState({ array: temp_ });
          temp_ = 0;
          for (var i = 0; i < this.result.length; i++) {
            if (this.result[i] == index_ + this.add_num) {
              temp_ = i;
              break;
            }
          }
          this.result.splice(temp_, 1);
          this.props.set_state("popup_data", this.result);
        }
      }
      componentDidMount() {
        this.props.set_state("popup_data", this.result);
      }
      render() {
        const place_list = this.state.array.map((val_, index_) =>
          React.createElement(
            "div",
            { key: index_ },
            React.createElement(
              "label",
              { className: "none_display_checkbox_label" },
              React.createElement("input", {
                type: "checkbox",
                className: "popup_confirm_data",
                name: "place",
                checked: val_,
                onClick: this.action_checkbox_click.bind(this, index_),
              }),
              React.createElement(
                "span",
                { className: "normal_text" },
                checkbox_text_[index_] ? checkbox_text_[index_] : "없음"
              )
            )
          )
        );
        return React.createElement(
          "div",
          { className: "popup_checkbox_content" },
          place_list
        );
      }
    };
  }

  function PopupButtonContainer(
    button_cancel_text_,
    button_confirm_text_ = null,
    action_confirm_ = null
  ) {
    return class extends React.Component {
      constructor(props) {
        super(props);
      }
      render() {
        if (button_confirm_text_) {
          return React.createElement(
            "div",
            { className: "popup_button_container inline_container" },
            React.createElement(
              "div",
              {
                id: "popup_button_confirm",
                className: "popup_button",
                onClick: action_confirm_.bind(this, this.props.popup_data),
              },
              button_confirm_text_
            ),
            React.createElement(
              "div",
              {
                id: "popup_button_cancel",
                className: "popup_button",
                onClick: Action_cancel_button.bind(this),
              },
              button_cancel_text_
            )
          );
        } else {
          return React.createElement(
            "div",
            { className: "popup_button_container inline_container" },
            React.createElement(
              "div",
              {
                id: "popup_button_cancel",
                onClick: Action_cancel_button.bind(this),
              },
              button_cancel_text_
            )
          );
        }
      }
    };
  }

  function PopupTemplate(
    h3_title_,
    content_ele_,
    button_cancel_text_,
    button_confirm_text_,
    action_confirm_
  ) {
    return class extends React.Component {
      constructor() {
        super();
        this.state = {};
      }
      set_state(type_, val_) {
        this.state[type_] = val_;
        return;
      }
      render() {
        if (typeof content_ele_ === "function")
          content_ele_ = React.createElement(content_ele_, {
            set_state: this.set_state.bind(this),
          });
        let button_ele_ = PopupButtonContainer(
          button_cancel_text_,
          button_confirm_text_,
          action_confirm_
        );
        return React.createElement(
          "div",
          { className: "popup_box" },
          React.createElement(
            "div",
            { className: "popup_title normal_text" },
            h3_title_
          ),
          React.createElement(
            "div",
            { className: "popup_content normal_text" },
            content_ele_
          ),
          React.createElement(button_ele_, { popup_data: this.state })
        );
      }
    };
  }

  async function Create_popup(
    h3_title_,
    content_type_,
    button_cancel_text_,
    button_confirm_text_ = null,
    action_confirm_ = null,
    config_ = null
  ) {
    //,start_index_=0){
    if (content_type_ === "place" || content_type_ === "field")
      content_type_ = await PopupContentArray(
        content_type_,
        config_.max,
        config_.init_state,
        config_.start_index
      );
    else if (content_type_ === "category")
      content_type_ = await PopupContentCategory(
        content_type_,
        config_.max,
        config_.init_state,
        config_.start_index
      );
    var popup_ele_ = PopupTemplate(
      h3_title_,
      content_type_,
      button_cancel_text_,
      button_confirm_text_,
      action_confirm_
    );
    Util_.make_element(
      "div",
      "popup_render_place",
      { className: "glass_black" },
      React.createElement(popup_ele_)
    );
  }

  //=================================================================
  return {
    Create_popup,
    PopupContentArray,
    Action_cancel_button,
    Set_checkbox_len,
  };
})();
