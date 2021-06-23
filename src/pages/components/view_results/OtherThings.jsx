import React, { Fragment } from "react";

class OtherThings extends React.Component {
  constructor(props) {
    super(props);
  }

  onOtherThingsChange = (e) => {
    this.props.handleOtherThingsChange(e.target.value);
  };

  render() {
    return (
      <Fragment>
        <div id="view_results">
          <div className="inline_container">
            <h3>기타사항</h3>
          </div>
        </div>
        <div className="view_results_container content_preshow_container">
          <textarea
            id="view_results_else"
            className="view_results_confirm_data textarea_style1"
            placeholder="여기에 작성해주세요"
            onChange={(e) => this.onOtherThingsChange(e)}
            value={this.props.otherThings}
          ></textarea>
        </div>
      </Fragment>
    );
  }
}

export default OtherThings;

