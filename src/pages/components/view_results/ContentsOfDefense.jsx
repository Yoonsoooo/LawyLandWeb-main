import React, { Fragment } from "react";

class ContentsOfDefense extends React.Component {
  constructor(props) {
    super(props);
  }

  onContentsOfdefenseChange = (e) => {
    this.props.handleContentsOfDefenseChange(e.target.value);
  };

  onOtherSideChange = (e) => {
    this.props.handleOtherSideChange(e.target.value);
  };

  onDateOfNextHearingChange = (e, index_) => {
    this.props.handleDateOfNextHearingChange(index_, e.target.value);
  };

  render() {
    return (
      <Fragment>
        <div id="view_results">
          <div className="inline_container">
            <h3>변호 내용</h3>
          </div>
        </div>
        <div className="view_results_contain content_preshow_container">
          <div className="view_results_label">재판부</div>
          <textarea
            id="view_results_else"
            className="view_results_confirm_data textarea_style1"
            placeholder="여기에 작성해주세요"
            onChange={(e) => this.onContentsOfdefenseChange(e)}
            value={this.props.contentsOfdefense}
          ></textarea>
          <div className="view_results_label">상대방측</div>
          <textarea
            id="view_results_else"
            className="view_results_confirm_data textarea_style1"
            placeholder="여기에 작성해주세요"
            onChange={(e) => this.onOtherSideChange(e)}
            value={this.props.otherSide}
          ></textarea>
          <div className="view_results_label">차기변론기일</div>
          <div className="small_text">
            <input
              className="view_results_confirm_data input_style1 place_right"
              type="text"
              onChange={(e) => this.onDateOfNextHearingChange(e, 0)}
              placeholder="YYYY"
              value={this.props.dateOfNextHearing[0]}
            ></input>
            <input
              className="view_results_confirm_data input_style1 place_right"
              type="text"
              placeholder="MM"
              onChange={(e) => this.onDateOfNextHearingChange(e, 1)}
              value={this.props.dateOfNextHearing[1]}
            ></input>
            <input
              className="view_results_confirm_data input_style1 place_right"
              type="text"
              placeholder="DD"
              onChange={(e) => this.onDateOfNextHearingChange(e, 2)}
              value={this.props.dateOfNextHearing[2]}
            ></input>
            <input
              className="view_results_confirm_data input_style1 place_right"
              type="text"
              placeholder="HH"
              onChange={(e) => this.onDateOfNextHearingChange(e, 3)}
              value={this.props.dateOfNextHearing[3]}
            ></input>
            <input
              className="view_results_confirm_data input_style1 place_right"
              type="text"
              placeholder="mm"
              onChange={(e) => this.onDateOfNextHearingChange(e, 4)}
              value={this.props.dateOfNextHearing[4]}
            ></input>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default ContentsOfDefense;
