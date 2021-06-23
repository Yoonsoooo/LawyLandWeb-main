import React from "react";
import Util_ from "./GlobalFtn";
export default (function () {
  "use strict";
  //var

  //-----------------------
  //public ftn
  
    function Action_cancel_button(){
      Util_.make_element("div","fullscreen_render_place",null)
      DataInfo.handleUpdateFalseClick()
    }
    function Create_fullscreen(content_){
        DataInfo.handleUpdateClick()
        console.log('create full')
        console.log(content_)
        Util_.make_element(content_, "fullscreen_render_place")
        console.log('end')
    }
  //----------------------
  //private ftn

  //-----------------------
  return {
    Create_fullscreen,
    Action_cancel_button,
  };
})();
