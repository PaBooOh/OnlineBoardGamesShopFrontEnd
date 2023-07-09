<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { ref, reactive } from "vue";
import Motion from "../utils/motion";
import { message } from "@/utils/message";
import { updateRules } from "../utils/rule";
import type { FormInstance } from "element-plus";
import { useVerifyCode } from "../utils/verifyCode";
import { $t, transformI18n } from "@/plugins/i18n";
import { useUserStoreHook } from "@/store/modules/user";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";
// import { Icon } from "@iconify/vue";
import EmailIcon from "@iconify-icons/mdi/email";
import { getTopMenu, initRouter } from "@/router/utils";
import { useRouter } from "vue-router";

const { t } = useI18n();
const checked = ref(false);
const loading = ref(false);
const router = useRouter();
const ruleForm = reactive({
  username: "",
  email: "",
  password: "",
  repeatPassword: ""
});
const ruleFormRef = ref<FormInstance>();
// const { isDisabled, text } = useVerifyCode();
const repeatPasswordRule = [
  {
    validator: (rule, value, callback) => {
      if (value === "") {
        callback(new Error(transformI18n($t("login.passwordSureReg"))));
      } else if (ruleForm.password !== value) {
        callback(new Error(transformI18n($t("login.passwordDifferentReg"))));
      } else {
        callback();
      }
    },
    trigger: "blur"
  }
];

const onUpdate = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      // if accept policy
      if (checked.value) {
        useUserStoreHook()
          .register({
            username: ruleForm.username,
            password: ruleForm.password,
            // repeatPassword: ruleForm.repeatPassword,
            email: ruleForm.email
          })
          .then(res => {
            if (res.success) {
              // Get backend router
              initRouter().then(() => {
                router.push(getTopMenu(true).path);
                message("Register Success", { type: "success" });
              });
            } else {
              message(
                "Register Failed: Username or email has already existed",
                {
                  type: "error"
                }
              );
              loading.value = false;
            }
          });
      } else {
        // if no accept policy
        loading.value = false;
        message(transformI18n($t("login.tickPrivacy")), { type: "warning" });
      }
    } else {
      loading.value = false;
      return fields;
    }
  });
};

function onBack() {
  useVerifyCode().end();
  useUserStoreHook().SET_CURRENTPAGE(0);
}
</script>

<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="updateRules"
    size="large"
  >
    <!--        Username input-->
    <Motion>
      <el-form-item
        :rules="[
          {
            required: true,
            message: transformI18n($t('login.usernameReg')),
            trigger: 'blur'
          }
        ]"
        prop="username"
      >
        <el-input
          clearable
          v-model="ruleForm.username"
          :placeholder="t('login.username')"
          :prefix-icon="useRenderIcon(User)"
        />
      </el-form-item>
    </Motion>
    <!--    Email input-->
    <Motion :delay="100">
      <el-form-item prop="email">
        <el-input
          clearable
          v-model="ruleForm.email"
          :placeholder="t('login.email')"
          :prefix-icon="useRenderIcon(EmailIcon)"
        />
      </el-form-item>
    </Motion>
    <!--Password input-->
    <Motion :delay="200">
      <el-form-item prop="password">
        <el-input
          clearable
          show-password
          v-model="ruleForm.password"
          :placeholder="t('login.password')"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
    </Motion>
    <!--Repeat Password input-->
    <Motion :delay="250">
      <el-form-item :rules="repeatPasswordRule" prop="repeatPassword">
        <el-input
          clearable
          show-password
          v-model="ruleForm.repeatPassword"
          :placeholder="t('login.sure')"
          :prefix-icon="useRenderIcon(Lock)"
        />
      </el-form-item>
    </Motion>
    <!--Accept Policy checkbox-->
    <Motion :delay="300">
      <el-form-item>
        <el-checkbox v-model="checked">
          {{ t("login.readAccept") }}
        </el-checkbox>
        <el-button link type="primary">
          {{ t("login.privacyPolicy") }}
        </el-button>
      </el-form-item>
    </Motion>
    <!--Confirm log up-->
    <Motion :delay="350">
      <el-form-item>
        <el-button
          class="w-full"
          size="default"
          type="primary"
          :loading="loading"
          @click="onUpdate(ruleFormRef)"
        >
          {{ t("login.confirm") }}
        </el-button>
      </el-form-item>
    </Motion>
    <!--Confirm back-->
    <Motion :delay="400">
      <el-form-item>
        <el-button class="w-full" size="default" @click="onBack">
          {{ t("login.back") }}
        </el-button>
      </el-form-item>
    </Motion>
  </el-form>
</template>
