import React, { Fragment } from "react";

class Attendee extends React.Component {
  constructor(props) {
    super(props);
  }

  onAttendeeChange = (e) => {
    this.props.handleAttendeeChange(e.target.value);
  };

  render() {
    return (
      <Fragment>
        <div id="view_results">
          <div className="inline_container">
            <h3>결과 통지</h3>
          </div>
        </div>
        <div className="view_results_container content_preshow_container">
          <div id="view_results_place"></div>
          <div className="view_results_label">참석자</div>
          <div className="small_text">
            <input
              id="view_results_institute2"
              className="view_results_confirm_data input_style1 place_right"
              type="text"
              onChange={(e) => this.onAttendeeChange(e)}
              value={this.props.attendee}
            ></input>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default Attendee;

