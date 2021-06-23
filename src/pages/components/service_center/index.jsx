import React from "react";

export default class ServiceCenterList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  handleShow = () => {
    this.setState({
      show: !this.state.show,
    });
  };

  render() {
    if (this.props.sort === 1) {
      const board = (
        <>
          <div id="board_ele" onClick={this.handleShow}>
            <div className="board_row_key">{this.props.index}</div>
            <div className="board_row_title">{this.props.item.title}</div>
            <div className="board_row_is_comment">
              {this.props.item.is_comment}
            </div>
          </div>
          <div className="board_row_cont">
            {this.state.show ? <div>{this.props.item.content}</div> : null}
          </div>
        </>
      );

      return board;
    } else if (this.props.sort === 2) {
      const board = (
        <>
          <div id="board_ele" onClick={this.handleShow}>
            <div className="board_row_key">{this.props.index}</div>
            <div className="board_row_title">{this.props.item.title}</div>
            <div className="board_row_is_comment">
              {this.props.item.is_comment}
            </div>
          </div>
          <div className="board_row_cont">
            {this.state.show ? <div>{this.props.item.content}</div> : null}
          </div>
        </>
      );
      return board;
    }
    //문의 내역
    else if (this.props.sort === 3) {
      const date = new Date(this.props.item.date);
      const dateFormat = date.getMonth() + "월 " + date.getDate() + "일";
      const board = (
        <>
          <div id="board_ele" onClick={this.handleShow}>
            <div className="board_row_key">{this.props.index}</div>
            <div className="board_row_title">{this.props.item.title}</div>
            <div className="board_row_is_comment">{dateFormat}</div>
          </div>
          <div className="board_row_cont">
            {this.state.show ? <div>{this.props.item.content}</div> : null}
          </div>
        </>
      );

      return board;
    }
  }
}
