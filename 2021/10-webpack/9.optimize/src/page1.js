import module1 from "./module1";
import module2 from "./module2";
import $ from "jquery";
console.log(module1, module2, $);
import(/* webpackChunkName: "asyncModule1" */ "./asyncModule1");
