import React, { Fragment } from "react";

class ViewResultsFinishedModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isOpen, close, Action_confirm_data, loading } = this.props;
    return isOpen ? (
      <div id="glass_background" className="glass_black">
        <div className="popup_box">
          {loading ? (
            <div className="popup_content normal_text">로딩중</div>
          ) : (
            <Fragment>
              <div className="popup_content normal_text">
                결과통지는 수정 및 삭제가 불가능합니다.
              </div>
              <div className="popup_content normal_text">
                입력하신 내용대로 결과를 통지할까요?
              </div>
              <div className="popup_button_container inline_container">
                <div
                  id="popup_button_confirm"
                  className="popup_button"
                  onClick={() => {
                    close();
                    Action_confirm_data();
                  }}
                >
                  네
                </div>
                <div
                  id="popup_button_cancel"
                  className="popup_button"
                  onClick={close}
                >
                  아니요
                </div>
              </div>
            </Fragment>
          )}
        </div>
      </div>
    ) : null;
  }
}

export default ViewResultsFinishedModal;
