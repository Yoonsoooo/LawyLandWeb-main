import ReactDOM from "react-dom";

const ModalPortal = ({ children }) => {
  const el = document.getElementById("popup_render_place");
  return ReactDOM.createPortal(children, el);
};

export default ModalPortal;

