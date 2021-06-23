import React from "react";
import '../../stylesheets/ContentList.css'

export function MakeContentList(props, component_, page_move_ = null) {
    return class extends React.Component {
      constructor() {
        super(props)
        this.MAXCONTENTCOUNT = 10
        this.data_source_ = null
        this.state = {
          ShowingPage: 0,
          EndPage: 0,
          preshow_class: [
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
          ],
          preshow_ele_: null,
          move_left_ele: null,
          move_right_ele: null,
          get_more_button: null,
        };
      }
      click_preshow_container(index_) {
        this.state.preshow_class.fill("list_preshow_default")
        this.state.preshow_class[index_] = "list_preshow_click"
        this.make_content_list()
      }
      async action_get_more() {
        var new_data_len_=await props.get_more_data()
        if (new_data_len_) {
          this.data_source_ = DataInfo.get_page_memmory("ResArr")
          var temp_ = this.data_source_.length / this.MAXCONTENTCOUNT
          this.state.EndPage = Math.ceil(temp_)
          this.state.move_right_ele = React.createElement(
            "div",
            {
              className: "scrollbar_arrow",
              onClick: this.action_move_page.bind(this, 1),
            },
            ">>"
          )
          this.state.get_more_button = null
          //button--------------------------------------------------
          if (
            new_data_len_>=50
          )
            this.state.get_more_button = React.createElement(
              "div",
              {
                className: "content_list_button",
                onClick: this.action_get_more.bind(this),
              },
              "더 보기"
            )
          else {
            this.state.get_more_button = React.createElement(
              "div",
              {
                className: "content_list_button",
                onClick: this.action_move_page.bind(this, "end"),
              },
              " 끝 으로"
            );
          }
          //---------------------------------------------------------
          this.setState(this.state)
        } else {
          console.log("err failed to load more...")
        }
      }
      map_preshow_container(preshow_data_) {
        const preshow_list_ = preshow_data_.map((val_, index_) => {
          return React.createElement(
            "div",
            {
              className: this.state.preshow_class[index_],
              onClick: this.click_preshow_container.bind(this, index_),
            },
            React.createElement(
              component_(
                index_,
                val_,
                props.isClick,
                page_move_ ? page_move_ : null
              )
            )
          )
        })
        return preshow_list_
      }
      action_move_page(direction_) {
        if (typeof direction_ === "string") {
          if (direction_ === "start" && this.state.ShowingPage >= 1)
            this.state.ShowingPage = 1
          else if (direction_ === "start" && this.state.ShowingPage === 1)
            return
          else if (
            direction_ === "end" &&
            this.state.ShowingPage !== this.state.EndPage
          )
            this.state.ShowingPage = this.state.EndPage;
          else if (
            direction_ === "end" &&
            this.state.ShowingPage <= this.state.EndPage
          )
            return;
        } else if (this.state.EndPage <= 1) return
        else if (direction_ === 0) {
          if (this.state.ShowingPage <= 1) return
          this.state.ShowingPage -= 1;
        } else if (direction_ === 1) {
          if (this.state.ShowingPage >= this.state.EndPage) return;
          this.state.ShowingPage += 1;
        } else return;
        this.state.preshow_class.fill("list_preshow_default");
        this.make_content_list();
      }
      make_move_arrow() {
        if (this.state.EndPage == 1) return;
        else if (this.state.ShowingPage == 1) {
          this.state.move_left_ele = null;
          this.state.move_right_ele = React.createElement(
            "div",
            {
              className: "scrollbar_arrow",
              onClick: this.action_move_page.bind(this, 1),
            },
            ">>"
          );
        } else if (this.state.ShowingPage == this.state.EndPage) {
          this.state.move_left_ele = React.createElement(
            "div",
            {
              className: "scrollbar_arrow",
              onClick: this.action_move_page.bind(this, 0),
            },
            "<<"
          );
          this.state.move_right_ele = null;
        } else {
          this.state.move_left_ele = React.createElement(
            "div",
            {
              className: "scrollbar_arrow",
              onClick: this.action_move_page.bind(this, 0),
            },
            "<<"
          );
          this.state.move_right_ele = React.createElement(
            "div",
            {
              className: "scrollbar_arrow",
              onClick: this.action_move_page.bind(this, 1),
            },
            ">>"
          );
        }
      }
      make_content_list() {
        var start_index_ = this.state.ShowingPage - 1;
        var preshow_data_ = this.data_source_.slice(
          start_index_ * this.MAXCONTENTCOUNT,
          start_index_ * this.MAXCONTENTCOUNT + this.MAXCONTENTCOUNT
        );
        this.state.preshow_ele_ = this.map_preshow_container(preshow_data_);
        this.make_move_arrow();
        this.setState(this.state);
      }

      componentDidMount() {
        this.state.ShowingPage = 1;
        this.data_source_ = DataInfo.get_page_memmory("ResArr");
        if (
          Number.isInteger(
            this.data_source_.length > 0 && this.data_source_.length / 50
          )
        )
          this.state.get_more_button = React.createElement(
            "div",
            {
              className: "content_list_button",
              onClick: this.action_get_more.bind(this),
            },
            "더 보기"
          );
        else {
          this.state.get_more_button = React.createElement(
            "div",
            {
              className: "content_list_button",
              onClick: this.action_move_page.bind(this, "end"),
            },
            " 끝 으로"
          );
        }
        var temp_ = this.data_source_.length / this.MAXCONTENTCOUNT;
        //this.state.EndPage = temp_ > 1 ? temp_ : 1;
        this.state.EndPage = Math.ceil(temp_);
        this.state.preshow_class.fill("list_preshow_default");
        this.make_content_list();

        DataInfo.set_page_value("RENEW", this.make_content_list.bind(this));
      }
      render() {
        return React.createElement(
          "div",
          { id: "preshow_list" },
          React.createElement(
            "div",
            { id: "preshow_list_container" },
            this.state.preshow_ele_
          ),
          React.createElement(
            "div",
            { id: "preshow_list_scrollbar", className: "inline_container" },
            React.createElement(
              "div",
              {
                className: "content_list_button",
                onClick: this.action_move_page.bind(this, "start"),
              },
              "처음으로"
            ),
            this.state.move_left_ele,
            React.createElement(
              "div",
              null,
              `${this.state.ShowingPage} / ${this.state.EndPage}`
            ),
            this.state.move_right_ele,
            this.state.get_more_button
          )
        )
      }
    }
  }