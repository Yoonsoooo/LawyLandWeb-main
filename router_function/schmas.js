const Joi = require("joi").extend(require("@joi/date"));

const anonymousSchema = {
  //anonymous
  anonymous: Joi.boolean().required(),
};

const userSchema = {
  //User
  user: Joi.number().integer().min(1).required(),
};

const numSchema = {
  //num
  num: Joi.number().integer().allow(null),
};

const idSchema = {
  //id
  id: Joi.string().email().min(1).required(),
};

const pwSchema = {
  //ps
  pw: Joi.string().min(1).required(),
};

const writeSchema = Joi.object({
  ...anonymousSchema,
  ...numSchema,
  category:
    //array의 index가 0~2까지
    Joi.array()
      .items(Joi.number().integer().allow(null))
      .min(0)
      .max(3)
      .required(),
  ...userSchema,
  title: Joi.string().min(1).max(50).required(),
  content: Joi.string().min(1).max(500).required(),
  file: Joi.any().required(),
});

const reqSearchPreshow = Joi.object({
  type: Joi.string().valid("content", "double").required(),
  input: Joi.string().allow("").required(),
  category: Joi.number().integer().min(0).max(60).required(),
  sort: Joi.number().integer().min(0).max(2).required(),
  offset: Joi.number().integer().min(0).required(),
});

const reqSearchDetails = Joi.object({
  type: Joi.string().valid("content", "double").required(),
  ...numSchema,
  ...userSchema,
});
const reqDoubleDetails = Joi.object({
  type: Joi.string().valid("content", "double").required(),
  ...numSchema,
  ...userSchema,
  bank_name: Joi.string().min(1).required(),
  bank_user: Joi.string().min(1).required(),
  bank_account: Joi.string().min(1).required(),
});

const reqWriteComment = Joi.object({
  ...numSchema,
  ...userSchema,
  ...anonymousSchema,
  parent_num: Joi.number().integer().min(0).required(),
  content: Joi.string().min(1).required(),
});

const reqAddScrap = Joi.object({
  type: Joi.string().valid("content", "comment").required(),
  ...numSchema,
  ...userSchema,
});

const reqRepositoryPreshow = Joi.object({
  type: Joi.number().integer().min(0).max(5).required(),
  offset: Joi.number().integer().min(0).required(),
  ...numSchema,
  ...userSchema,
});

const reqRepositoryDetails = Joi.object({
  type: Joi.string().valid("content", "double").required(),
  ...numSchema,
  ...userSchema,
  for_revise: Joi.boolean(),
});

const reqRepositoryDelete = Joi.object({
  type: Joi.number().integer().min(0).max(5),
  ...numSchema,
  ...userSchema,
});

const reqRepositoryUpdate = Joi.object({
  type: Joi.string().valid("content").required(),
  ...numSchema,
  ...userSchema,
  ...anonymousSchema,
  content: Joi.string().min(1).required(),
});

const reqDoubleReport = Joi.object({
  ...numSchema,
  ...userSchema,
});

const logOut = Joi.object({
  ...userSchema,
});

const getData = Joi.object({
  place: Joi.number().integer().min(1).max(17).required(),
});

const checkUserAuthentication = Joi.object({
  ...idSchema,
  ...pwSchema,
  ...userSchema,
  law_num: Joi.string().min(1).required(),
});

const changeUserInfo = Joi.object({
  info_index: Joi.number().integer().min(1).max(10).required(),
  ...idSchema,
  ...pwSchema,
  ...userSchema,
  law_num: Joi.string().min(1).required(),
  data: Joi.any()
    .when("info_index", {
      is: 1,
      then: Joi.string().max(15).required(),
    })
    .when("inf0_index", {
      is: 2,
      then: Joi.string()
        .regex(/^d{3}-d{3,4}-d{4}$/)
        .required(),
    })
    .when("info_index", {
      is: 3,
      then: Joi.array().items(Joi.string().max(15)).min(0).max(3).required(),
    })
    .when("info_index", {
      is: 4,
      then: Joi.number().integer().min(1).max(17).required(),
    })
    .when("info_index", {
      is: 5,
      then: Joi.string().max(50).required(),
    })
    .when("info_index", {
      is: 6,
      then: Joi.number().integer().min(0).max(60).required(),
    })
    .when("info_index", {
      is: 10,
      then: Joi.bool().required(),
    }),
});

const reqAlarmPreshow = Joi.object({
  ...numSchema,
  ...userSchema,
});

const reqSecondPreshow = Joi.object({
  ...numSchema,
  ...userSchema,
});

const applySecondDouble = Joi.object({
  ...numSchema,
  ...userSchema,
  bank_name: Joi.string().min(1).required(),
  bank_user: Joi.string().min(1).required(),
  bank_account: Joi.string().min(1).required(),
});

const requestLogin = Joi.object({
  ...idSchema,
  ...pwSchema,
  is_auto_check: Joi.bool(),
});

const checkId = Joi.object({
  ...idSchema,
});

const requestRegister = Joi.object({
  ...idSchema,
  ...pwSchema,
  pw_check: Joi.string().required(),
  law_num: Joi.string().required(),
  phone: Joi.string()
    .regex(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/)
    .required(),
  certification_num: Joi.string()
    .regex(/^\d{6}$/)
    .required(),
});

const requestAdditional = Joi.object({
  ...idSchema,
  ...pwSchema,
  pw_check: Joi.string().required(),
  law_num: Joi.string().required(),
  phone: Joi.string()
    .regex(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/)
    .required(),
  name1: Joi.string().required(),
  name2: Joi.string().required(),
  acquisition: Joi.string().required(),
  place: Joi.number().integer().min(1).max(17).required(),
  field: Joi.number().integer().min(0).max(60).required(),
  agency: Joi.string().required(),
  certification_num: Joi.string()
    .regex(/^\d{6}$/)
    .required(),
});

const requestFind = Joi.object({
  type: Joi.number().integer().valid(0, 1).required(),
  id: Joi.string().email().min(1),
  law_num: Joi.string().required(),
  phone: Joi.string()
    .regex(/^01(?:0|1|[6-9])(?:\d{3}|\d{4})\d{4}$/)
    .required(),
  name: Joi.string().required(),
});

const reqWrite = Joi.object({
  ...numSchema,
  ...userSchema,
  attendee: Joi.string().required(),
  contentsOfdefense: Joi.string().required(),
  dateOfNextHearing: Joi.string()
    .regex(
      /[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]:[0-5][0-9]/
    )
    .required(),
  otherSide: Joi.string().required(),
  otherThings: Joi.string().required(),
  place: Joi.string().required(),
});

const writePath = Joi.object({
  ...userSchema,
  title: Joi.string().min(1).max(50).required(),
  content: Joi.string().min(1).max(500).required(),
});

//복대리
const writeDoubleAgentWritePath = Joi.object({
  ...numSchema,
  ...userSchema,
  category: Joi.number().integer().min(1).max(17).required(),
  place: Joi.string().required(),
  du_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").raw(),
  cost: Joi.number().integer().min(0).required(),
  case_num: Joi.string().required(),
  party_name: Joi.string().required(),
  party_position: Joi.number().integer().min(0).max(1).required(),
  oponent: Joi.string().required(),
  else: Joi.string().required(),
  memo: Joi.string().required(),
});

const writeDoubleAgentRevisePath = Joi.object({
  category: Joi.number().integer().min(1).max(17).required(),
  place: Joi.string().required(),
  du_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").raw(),
  cost: Joi.number().integer().min(0).required(),
  case_num: Joi.string().required(),
  party_name: Joi.string().required(),
  party_position: Joi.number().integer().min(0).max(1).required(),
  oponent: Joi.string().required(),
  else: Joi.string().required(),
  memo: Joi.string().required(),
  ...numSchema,
  ...userSchema,
});

const writeDoubleAgentSecondPath = Joi.object({
  ...numSchema,
  ...userSchema,
  category: Joi.number().integer().min(1).max(17).required(),
  place: Joi.string().required(),
  du_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").raw(),
  cost: Joi.number().integer().min(0).required(),
  case_num: Joi.string().required(),
  party_name: Joi.string().required(),
  party_position: Joi.number().integer().min(0).max(1).required(),
  oponent: Joi.string().required(),
  else: Joi.string().required(),
  memo: Joi.string().required(),
});

const writeDoubleAgentReviseSecondPath = Joi.object({
  ...numSchema,
  ...userSchema,
  category: Joi.number().integer().min(1).max(17).required(),
  place: Joi.string().required(),
  du_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").raw(),
  cost: Joi.number().integer().min(0).required(),
  case_num: Joi.string().required(),
  party_name: Joi.string().required(),
  party_position: Joi.number().integer().min(0).max(1).required(),
  oponent: Joi.string().required(),
  else: Joi.string().required(),
  memo: Joi.string().required(),
});

const emailAlarmSecond = Joi.object({
  ...userSchema,
  place: Joi.string().required(),
  cost: Joi.number().integer().min(0).required(),
  du_date: Joi.date().format("YYYY-MM-DD HH:mm:ss").raw(),
});

module.exports = {
  writeSchema,
  reqSearchPreshow,
  reqSearchDetails,
  reqWriteComment,
  reqAddScrap,
  reqRepositoryPreshow,
  reqRepositoryDetails,
  reqRepositoryDelete,
  reqRepositoryUpdate,
  reqDoubleDetails,
  reqDoubleReport,
  logOut,
  getData,
  checkUserAuthentication,
  changeUserInfo,
  reqAlarmPreshow,
  reqSecondPreshow,
  applySecondDouble,
  requestLogin,
  checkId,
  requestRegister,
  requestAdditional,
  requestFind,
  reqWrite,
  writePath,
  writeDoubleAgentWritePath,
  writeDoubleAgentRevisePath,
  writeDoubleAgentSecondPath,
  writeDoubleAgentReviseSecondPath,
  emailAlarmSecond,
};
