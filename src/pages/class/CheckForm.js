export default (function () {
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
        return data_.length>0 && data_.length < 17 ? true : false;
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
    CheckNamespace.isAgencyLength = function (data_, max_ = 50) {
      if (typeof data_ != "string") return false;
      else
        return data_.length > 0 &&
          data_.length < max_ &&
          typeof data_ == "string"
          ? true
          : false;
    };
    CheckNamespace.isStrLenForm = function (data_, max_len_) {
      if (typeof data_ != "string") return false;
      else return data_.length < max_len_ && data_.length > 0 ? true : false;
    };
  
    CheckNamespace.isStringMinLength = function (data_, min) {
      if (typeof data_ != "string") {
        return false;
      }
      if (data_.length > min) {
        return true;
      }
  
      return false;
    };
  
    CheckNamespace.isString = function (data_) {
      if (typeof data_ === "string" && data_ !== null) {
        return true;
      }
  
      return false;
    };
  
    CheckNamespace.isCategory = function (data_) {
      let flag = 0;
  
      if (data_.length > 0 && data_.length <= 4) {
        for (let i = 0; i < data_.length; ++i) {
          if (data_[i] > 0 && data_[i] <= 20) {
            ++flag;
          }
        }
      }
  
      if (flag > 0 && flag <= 3) {
        return true;
      }
  
      return false;
    };
  
    CheckNamespace.isBoolean = function (data_) {
      if (data_ === false || data_ === true) {
        return true;
      }
  
      return false;
    };
  
    CheckNamespace.isMinNumberRange = function (data_, min) {
      if (data_ > min) {
        return true;
      }
  
      return false;
    };
  
    CheckNamespace.isContentOrDouble = function (data_) {
      if (data_ === "content" || data_ === "double") {
        return true;
      }
  
      return false;
    };
  
    CheckNamespace.isNumberInteger = function (data_) {
      if (Number.isInteger(data_)) {
        return true;
      }
  
      return false;
    };
    return CheckNamespace;
  })();