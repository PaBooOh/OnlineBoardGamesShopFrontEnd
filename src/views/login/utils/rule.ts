import { reactive } from "vue";
// import { isPhone } from "@pureadmin/utils";
import type { FormRules } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
// import { useUserStoreHook } from "@/store/modules/user";

/** 6位数字验证码正则 */
// export const REGEXP_SIX = /^\d{5}$/;
/** 5 digits/characters/symbols */
export const REGEXP_FIVE = /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{5,}$/;

/** 密码正则（密码格式应为8-18位数字、字母、符号的任意两种组合） */
// export const REGEXP_PWD =
//   /^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?!([^(0-9a-zA-Z)]|[()])+$)(?!^.*[\u4E00-\u9FA5].*$)([^(0-9a-zA-Z)]|[()]|[a-z]|[A-Z]|[0-9]){8,18}$/;
export const REGEXP_EMAIL = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

/** 登录校验 */
const loginRules = reactive<FormRules>({
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.passwordReg"))));
        } else if (!REGEXP_FIVE.test(value)) {
          callback(new Error(transformI18n($t("login.passwordRuleReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
  // verifyCode: [
  //   {
  //     validator: (rule, value, callback) => {
  //       if (value === "") {
  //         callback(new Error(transformI18n($t("login.verifyCodeReg"))));
  //       } else if (useUserStoreHook().verifyCode !== value) {
  //         callback(new Error(transformI18n($t("login.verifyCodeCorrectReg"))));
  //       } else {
  //         callback();
  //       }
  //     },
  //     trigger: "blur"
  //   }
  // ]
});

/** Phone */
// const phoneRules = reactive<FormRules>({
//   phone: [
//     {
//       validator: (rule, value, callback) => {
//         if (value === "") {
//           callback(new Error(transformI18n($t("login.phoneReg"))));
//         } else if (!isPhone(value)) {
//           callback(new Error(transformI18n($t("login.phoneCorrectReg"))));
//         } else {
//           callback();
//         }
//       },
//       trigger: "blur"
//     }
//   ],
//   verifyCode: [
//     {
//       validator: (rule, value, callback) => {
//         if (value === "") {
//           callback(new Error(transformI18n($t("login.verifyCodeReg"))));
//         } else if (!REGEXP_SIX.test(value)) {
//           callback(new Error(transformI18n($t("login.verifyCodeSixReg"))));
//         } else {
//           callback();
//         }
//       },
//       trigger: "blur"
//     }
//   ]
// });

/** 忘记密码校验 */
const updateRules = reactive<FormRules>({
  email: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.emailReg"))));
        } else if (!REGEXP_EMAIL.test(value)) {
          callback(new Error(transformI18n($t("login.emailCorrectReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ],
  // phone: [
  //   {
  //     validator: (rule, value, callback) => {
  //       if (value === "") {
  //         callback(new Error(transformI18n($t("login.phoneReg"))));
  //       } else if (!isPhone(value)) {
  //         callback(new Error(transformI18n($t("login.phoneCorrectReg"))));
  //       } else {
  //         callback();
  //       }
  //     },
  //     trigger: "blur"
  //   }
  // ],
  // verifyCode: [
  //   {
  //     validator: (rule, value, callback) => {
  //       if (value === "") {
  //         callback(new Error(transformI18n($t("login.verifyCodeReg"))));
  //       } else if (!REGEXP_FIVE.test(value)) {
  //         callback(new Error(transformI18n($t("login.verifyCodeSixReg"))));
  //       } else {
  //         callback();
  //       }
  //     },
  //     trigger: "blur"
  //   }
  // ],
  password: [
    {
      validator: (rule, value, callback) => {
        if (value === "") {
          callback(new Error(transformI18n($t("login.passwordReg"))));
        } else if (!REGEXP_FIVE.test(value)) {
          callback(new Error(transformI18n($t("login.passwordRuleReg"))));
        } else {
          callback();
        }
      },
      trigger: "blur"
    }
  ]
});

export { loginRules, updateRules };
