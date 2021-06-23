import asyncRoute from "./class/asyncRoute";

export const Login = asyncRoute(() => import("./login.jsx"));
export const Layout = asyncRoute(() => import("./layout.jsx"));
export const Home = asyncRoute(() => import("./home"));
export const Search = asyncRoute(() => import("./search.jsx"));
export const Repository = asyncRoute(() => import("./repository.jsx"));
export const Write = asyncRoute(() => import("./write.jsx"));
export const Write_double = asyncRoute(() => import("./write_double_agent.js"));
export const Change_userinfo = asyncRoute(() =>import("./change_user_info.jsx"));
export const News = asyncRoute(() => import("./news.jsx"));
export const About = asyncRoute(() => import("./about.js"));
export const ServiceCenter = asyncRoute(() => import("./service_center.jsx"));
export const ViewResults = asyncRoute(() => import("./view_results.jsx"));