import React from "react";
import ReactDOM from "react-dom";

export default (function () {
  "use strict";
  var _libObj = {};
  //var
  let CategoryNamespace = {
    place: {
      0: "전체",
      1: "서울",
      2: "경기",
      3: "인천",
      4: "강원",
      5: "충북",
      6: "충남",
      7: "세종",
      8: "대전",
      9: "경북",
      10: "경남",
      11: "대구",
      12: "전북",
      13: "전남",
      14: "광주",
      15: "울산",
      16: "부산",
      17: "제주",
    },
    category: {
      0: "전체",
      1: "민사/집행",
      2: "형사",
      3: "부동산",
      4: "채권추심",
      5: "손해배상",
      6: "교통사고",
      7: "소년",
      8: "상사/회사",
      9: "가사",
      10: "금융/보험",
      11: "도산",
      12: "조세",
      13: "헌법/행정",
      14: "노동",
      15: "지식재산",
      16: "기타",
    },
    category2: {
      1: "진로",
      2: "개업",
      3: "세무",
      4: "기타",
    },
    category_qa: {
      0: "전체",
      1: "민사/집행",
      2: "형사",
      3: "부동산",
      4: "채권추심",
      5: "손해배상",
      6: "교통사고",
      7: "소년",
      8: "상사/회사",
      9: "가사",
      10: "금융/보험",
      11: "도산",
      12: "조세",
      13: "헌법/행정",
      14: "노동",
      15: "지식재산",
      16: "기타",
      17: "진로",
      18: "개업",
      19: "세무",
      20: "기타",
    },
    field: {
      0: "",
      1: "가사",
      2: "건설",
      3: "교통사고",
      4: "군형법",
      5: "도산",
      6: "등기/경매",
      7: "민사",
      8: "민사집행",
      9: "보험",
      10: "부동산",
      11: "상사",
      12: "소년",
      13: "손해배상",
      14: "이혼",
      15: "임대차",
      16: "재개발",
      17: "채권추심",
      18: "형사",
      19: "공정거래",
      20: "금융",
      21: "수용/보상",
      22: "식품/의약",
      23: "의료",
      24: "증권",
      25: "행정",
      26: "관세",
      27: "국가계약",
      28: "국제거래",
      29: "노동",
      30: "무역",
      31: "법인세",
      32: "산재",
      33: "상속",
      34: "상속증여세",
      35: "엔테인먼트",
      36: "영업비밀",
      37: "인수합병",
      38: "저작권",
      39: "조세법",
      40: "지재",
      41: "특허",
      42: "해외투자",
      43: "회사",
      44: "IT",
      45: "국제관계",
      46: "국제조세",
      47: "국제중재",
      48: "방송통신",
      49: "스포츠",
      50: "에너지",
      51: "이주/비자",
      52: "조선",
      53: "종교",
      54: "중재",
      55: "해상",
      56: "헌법재판",
      57: "환경",
      58: "성년후견",
      59: "스타트업",
      60: "학교폭력",
    },
    position: { 0: "원고", 1: "피고", 2: "피해자", 3: "피의자", 4: "피고인" },
  };

  let DBDINamespace = {
    num: "num",
    num_c: "c_num",
    num_s: "scrap_num",
    title: "title",
    content: "content",
    content_comment: "content_comment",
    cate: "category",
    cate1: "category1",
    cate2: "category2",
    cate3: "category3",
    date: "date",
    case: "case_num",
    party_n: "party_name",
    party_p: "party_position",
    oponent: "oponent",
    else: "content_else",
    date_d: "du_date",
    date_a: "acquisition",
    is_report: "is_report",
    date_c: "comment_date",
    date_m: "match_date",
    user_t: "user_type",
    user_place: "user_place",
    name: "name",
    email: "email",
    phone: "phone",
    place: "place",
    agency: "agency",
    field: "field",
    memo: "memo",
    count_v: "view_count",
    count_c: "comment_count",
    count_s: "sub_count",
    count_sc: "scrap_count",
    is_comment: "is_comment",
    cost: "cost",
    parent: "parent_num",
    anonymous: "anonymous",
  };
  //-----------------------
  //public ftn
  _libObj.text_with_newline = function (text_) {
    if (!text_) return;
    const temp_ = text_.split("\n").map((line, index_) => {
      return React.createElement(
        "span",
        { key: index_ },
        line,
        React.createElement("br")
      );
    });
    return temp_;
  };
  _libObj.make_element = function (
    ele_,
    place_,
    stat_ = null,
    content_ = null,
    content2_ = null
  ) {
    ReactDOM.render(
      React.createElement(ele_, stat_, content_, content2_),
      document.getElementById(place_)
    );
  };
  _libObj.find_data_from_dataSource = function (
    dataSource_,
    dataCondition_,
    dataColum_ = DBDINamespace.num
  ) {
    if (typeof dataSource_ === "string")
      dataSource_ = DataInfo.get_page_memmory(dataSource_);
    return dataSource_.find(function (data_) {
      if (data_[dataColum_] == dataCondition_) return data_;
    });
  };
  _libObj.delete_data_from_dataSource = async function (
    dataSource_,
    dataCondition_,
    dataColum_ = DBDINamespace.num
  ) {
    if (typeof dataSource_ === "string")
      dataSource_ = DataInfo.get_page_memmory(dataSource_);
    var idx_ = await dataSource_.findIndex(
      (data_) => data_[dataColum_] === dataCondition_
    );
    if (idx_ >= 0) {
      await dataSource_.splice(idx_, 1);
      return true;
    } else return false;
  };
  _libObj.update_data_from_dataSource = async function (
    dataSource_,
    dataCondition_,
    newData_,
    dataColum_ = DBDINamespace.num
  ) {
    if (typeof dataSource_ === "string")
      dataSource_ = DataInfo.get_page_memmory(dataSource_);
    var idx_ = await dataSource_.findIndex(
      (data_) => data_[dataColum_] === dataCondition_
    );
    if (idx_ >= 0) {
      var keys_ = Object.keys(newData_);
      await (async function () {
        keys_.forEach(function (key_) {
          dataSource_[idx_][key_] = newData_[key_];
        });
      })();
      return true;
    } else return false;
  };
  _libObj.get_now_date = function (type_ = false) {
    var now_date_ = new Date();
    var month_ = now_date_.getMonth() + 1;
    var day_ = now_date_.getDate();
    if (type_)
      return [
        now_date_.getFullYear(),
        now_date_.getMonth() + 1,
        now_date_.getDate(),
      ];
    return `${now_date_.getFullYear()}.${
      month_ >= 10 ? month_ : "0" + month_
    }.${day_ >= 10 ? day_ : "0" + day_}.`;
  };
 
  _libObj.cli_to_server = async function (path_, data_, type_ = "GET") {
    if(data_.hasOwnProperty('user')){
      var cli_key1=Math.floor(Math.random() * 100)-6
      var cli_key2=Math.floor(Math.random() * 100)-6
      var cli_key3=Math.floor(Math.random() * 100)-6
      var temp_=DataInfo.SECUREINFO.CARD
      temp_=temp_.substr(cli_key1, 6)
        +temp_.substr(cli_key2, 6)
        +temp_.substr(cli_key3, 6)
      Object.assign(data_, {
        cli_key1:cli_key1,
        cli_key2:cli_key2,
        cli_key3:cli_key3,
        cli_card_res:temp_,
        uid:DataInfo.SECUREINFO.UID
      })
    }
    return fetch(path_, {
      method: type_,
      body: JSON.stringify(data_),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cache: "no-cache",
      },
      //credentials: "same-origin"
      credentials: "include",
    })
      .then((res) => res.json())
      .catch((err) => {
        return {
          success: false,
          message: "서버와의 통신 실패 (점검일정을 확인해주세요)",
        };
      });
  };
  _libObj.make_date_format = function (date_str_, type_ = 0) {
    date_str_ = new Date(date_str_);
    var year_ = date_str_.getFullYear();
    var month_ =
      date_str_.getMonth() + 1 >= 10
        ? date_str_.getMonth() + 1
        : "0" + (date_str_.getMonth() + 1);
    var date_ =
      date_str_.getDate() >= 10
        ? date_str_.getDate()
        : "0" + date_str_.getDate();
    var hour_ =
      date_str_.getHours() >= 10
        ? date_str_.getHours()
        : "0" + date_str_.getHours();
    var minute_ =
      date_str_.getMinutes() >= 10
        ? date_str_.getMinutes()
        : "0" + date_str_.getMinutes();
    if (type_ == 1) return `${year_}.${month_}.${date_}. ${hour_}:${minute_}`;
    //all
    else if (type_ == 2) return `${year_}.${month_}.${date_}.`;
    //yyyy.mm.dd
    else {
      var now_ = this.get_now_date();
      return `${year_}.${month_}.${date_}.` == now_
        ? `${hour_}:${minute_}`
        : `${year_}.${month_}.${date_}.`;
    }
  };
  _libObj.category_to_string = function (type_, key_ = null) {
    if (key_ || key_ === 0) return CategoryNamespace[type_][key_];
    else return CategoryNamespace[type_];
  };
  _libObj.dbdi = function (key_) {
    return DBDINamespace[key_];
  };
  //----------------------
  //private ftn

  //-----------------------
  return _libObj;
})();
