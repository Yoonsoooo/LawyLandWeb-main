var CheckNamespace = {};
CheckNamespace.isEmailForm = function (data_) {
  //정상작동
  if (typeof data_ != "string") return false;
  else if (data_.length > 30) return false;
  else {
    var regExp =
      /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
    return regExp.test(data_); // 형식에 맞는 경우 true 리턴
  }
};
CheckNamespace.isDateTimeForm = function (data_) {
  if (typeof data_ != "string") return false;
  else if (data_.length > 19) return false;
  else {
    var regExp =
      /^(19|20)\d{2}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[0-1]) (0[0-9]|1[0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])$/;
    return regExp.test(data_);
  }
};
CheckNamespace.isPhoneForm = function (data_) {
  if (typeof data_ != "string") return false;
  else if (data_.length > 11) return false;
  else {
    var regExp = /^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/;
    return regExp.test(data_); // 형식에 맞는 경우 true 리턴
  }
};
CheckNamespace.isLawnumForm = function (data_) {
  if (typeof data_ != "string") return false;
  else if (data_.length > 5) return false;
  else {
    var regExp = /^\d{5}$/;
    return regExp.test(data_);
  }
};
CheckNamespace.isNameForm = function (data_) {
  if (typeof data_ != "string") return false;
  else if (data_.length > 6) return false;
  else {
    var regExp = /^[가-힣]{2,6}$/;
    return regExp.test(data_);
  }
};
CheckNamespace.iscAquisitionForm = function (data_) {
  var regExp = /^[0-9]{4}$/;
  return regExp.test(data_);
};
CheckNamespace.isName2Form = function (data_) {
  if (typeof data_ != "string") return false;
  else {
    return data_.length < 11 ? true : false;
  }
};
CheckNamespace.isPwForm = function (data_, min_len_ = 8) {
  if (typeof data_ != "string") return false;
  else if (data_.length >= min_len_ && data_.length < 30) return true;
  else return false;
};
CheckNamespace.isContentNum = function (num_) {
  return typeof num_ == "number" && num_ >= 0 && num_ <= 214748300
    ? true
    : false;
};
CheckNamespace.isNumberRange = function (data_, max_, start_index_ = 0) {
  //place:17, field:60, cate:
  if (typeof data_ != "number") return false;
  else return data_ >= start_index_ && data_ <= max_ ? true : false;
};
CheckNamespace.isPlaceNum = function (data_, start_index_ = 1, max_ = 17) {
  return data_ >= start_index_ && data_ <= max_ && typeof data_ == "number"
    ? true
    : false;
};
CheckNamespace.isFieldNum = function (data_, start_index_ = 0, max_ = 60) {
  if (typeof data_ != "number") return false;
  else return data_ >= start_index_ && data_ <= max_ ? true : false;
};
CheckNamespace.isAgencyLength = function (data_, max_ = 15) {
  if (typeof data_ != "string") return false;
  else
    return data_.length > 0 && data_.length <= max_ && typeof data_ == "string"
      ? true
      : false;
};
CheckNamespace.isStrLenForm = function (data_, max_len_) {
  if (typeof data_ != "string") return false;
  else return data_.length < max_len_ && data_.length > 0 ? true : false;
};

CheckNamespace.CONTENTCONTENTINSERT = function (data_) {
  if (!this.isStrLenForm(data_.title, 50))
    return [false, "제목은 작성해주세요(50자 이내)"];
  else if (!this.isStrLenForm(data_.content, 500))
    return [false, "본문을 작성해주세요(500자 이내)"];
  else if (!this.isNumberRange(data_.category[0], 20, 1))
    return [false, "글 카태고리를 선택해주세요"];
  else return [true];
};
CheckNamespace.CONTENTDOUBLEINSERT = function (data_) {
  if (!this.isStrLenForm(data_.else, 500))
    return [false, "사건개요를 작성해주세요 (500자 이내)"];
  else if (!this.isStrLenForm(data_.place, 19))
    return [false, "장소를 정확히 기입해주세요 (16자 이내)"];
  else if (!this.isNumberRange(data_.category, 17, 1))
    return [false, "옳바른 지역을 골라주세요"];
  else if (!this.isStrLenForm(data_.party_name, 19))
    return [false, "당사자 이름을 정확한 형식으로 적어주세요"];
  else if (!this.isStrLenForm(data_.oponent, 19))
    return [false, "상대방 이름을 정확한 형식으로 적어주세요"];
  else if (!this.isNumberRange(data_.party_position, 4))
    return [false, "옳바른 당사자 입장을 입력하세요"];
  else if (!this.isNumberRange(data_.cost, 99999999))
    return [false, "수임료를 입력해주세요"];
  else if (!this.isStrLenForm(data_.case_num, 19))
    return [false, "사건번호를 정확히 기입해주세요(19자 이내)"];
  else if (!this.isDateTimeForm(data_.du_date))
    return [false, "날짜를 확인해주세요"];
  else return [true];
};
CheckNamespace.CONTENTCOMMENTINSERT = function (data_) {
  if (!this.isStrLenForm(data_.content, 300))
    return [false, "답글은 300자 이내"];
  return [true];
};
CheckNamespace.PRESHOWCONDITION = function (condition_) {
  if (condition_.type == "content") {
    if (!this.isFieldNum(condition_.category, 0))
      return [false, "잘못된 카태고리입니다"];
    if (!this.isNumberRange(condition_.sort, 2))
      return [false, "잘못된 정렬방식입니다"];
    if (!this.isStrLenForm(condition_.input, 40))
      return [false, "너무 길면 검색효율이 떨어집니다"];
  } else if (condition_.type == "double") {
    if (!this.isPlaceNum(condition_.category, 0))
      return [false, "지역 카태고리가 틀립니다"];
    if (!this.isStrLenForm(condition_.input, 40))
      return [false, "너무 길면 검색 효율이 떨어집니다"];
  }
  return [true];
};
CheckNamespace.DETAILSCONDITION = function (type_, data_) {
  if (!this.isContentNum(data_.num))
    return [false, "잘못된 컨탠츠 식별자입니다"];
  return [true];
};
CheckNamespace.APPLYDOUBLE = function (data_) {
  if (!this.isStrLenForm(data_.bank_name, 40))
    return [false, "은행 이름을 기입해주세요"];
  else if (!this.isStrLenForm(data_.bank_user, 40))
    return [false, "예금주를 입력해주세요"];
  else if (!this.isStrLenForm(data_.bank_account, 40))
    return [false, "계좌번호를 입력해주세요"];
  else return [true];
};

module.exports = CheckNamespace;
