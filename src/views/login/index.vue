<script setup lang="ts">
import {
  ref,
  toRaw,
  reactive,
  // watch,
  computed,
  onMounted,
  onBeforeUnmount
} from "vue";
import { useI18n } from "vue-i18n";
import Motion from "./utils/motion";
import { useRouter } from "vue-router";
import { message } from "@/utils/message";
import { loginRules } from "./utils/rule";
import regist from "./components/regist.vue";
import update from "./components/update.vue";
import type { FormInstance } from "element-plus";
import { $t, transformI18n } from "@/plugins/i18n";
import { operates } from "./utils/enums";
import { useLayout } from "@/layout/hooks/useLayout";
import { useUserStoreHook } from "@/store/modules/user";
import { initRouter, getTopMenu } from "@/router/utils";
import { bg, illustration } from "./utils/static";
import { useRenderIcon } from "@/components/ReIcon/src/hooks";
import { useDataThemeChange } from "@/layout/hooks/useDataThemeChange";

import Lock from "@iconify-icons/ri/lock-fill";
import User from "@iconify-icons/ri/user-3-fill";

defineOptions({
  name: "Login"
});

const router = useRouter();
const loading = ref(false);
// const checked = ref(false);
const ruleFormRef = ref<FormInstance>();
const currentPage = computed(() => {
  return useUserStoreHook().currentPage;
});

const { t } = useI18n();
const { initStorage } = useLayout();
initStorage();
const { dataThemeChange } = useDataThemeChange();
dataThemeChange();
// const { title, getDropdownItemStyle, getDropdownItemClass } = useNav();
// const { locale, translationCh, translationEn } = useTranslationLang();

const ruleForm = reactive({
  username: "",
  password: ""
});

// Log in reaction function
const onLogin = async (formEl: FormInstance | undefined) => {
  loading.value = true;
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      useUserStoreHook()
        .loginByUsername({
          username: ruleForm.username,
          password: ruleForm.password
        })
        .then(res => {
          console.log(res.success);
          if (res.success) {
            // Get backend router
            initRouter().then(() => {
              router.push(getTopMenu(true).path);
              message("Login Success", { type: "success" });
            });
          } else {
            message(
              "Login Failed: Username does not exist or wrong password.",
              { type: "error" }
            );
            loading.value = false;
          }
        });
    } else {
      loading.value = false;
      return fields;
    }
  });
};

/** 使用公共函数，避免`removeEventListener`失效 */
function onkeypress({ code }: KeyboardEvent) {
  if (code === "Enter") {
    onLogin(ruleFormRef.value);
  }
}

onMounted(() => {
  window.document.addEventListener("keypress", onkeypress);
});

onBeforeUnmount(() => {
  window.document.removeEventListener("keypress", onkeypress);
});

// watch(imgCode, value => {
//   useUserStoreHook().SET_VERIFYCODE(value);
// });
</script>

<template>
  <div class="select-none">
    <img :src="bg" class="wave" />
    <!--    <div class="flex-c absolute right-5 top-3">-->
    <!--      &lt;!&ndash; 主题 &ndash;&gt;-->
    <!--      <el-switch-->
    <!--        v-model="dataTheme"-->
    <!--        inline-prompt-->
    <!--        :active-icon="dayIcon"-->
    <!--        :inactive-icon="darkIcon"-->
    <!--        @change="dataThemeChange"-->
    <!--      />-->
    <!--      &lt;!&ndash; 国际化 &ndash;&gt;-->
    <!--      <el-dropdown trigger="click">-->
    <!--        <globalization-->
    <!--          class="hover:text-primary hover:!bg-[transparent] w-[20px] h-[20px] ml-1.5 cursor-pointer outline-none duration-300"-->
    <!--        />-->
    <!--        <template #dropdown>-->
    <!--          <el-dropdown-menu class="translation">-->
    <!--            <el-dropdown-item-->
    <!--              :style="getDropdownItemStyle(locale, 'zh')"-->
    <!--              :class="['dark:!text-white', getDropdownItemClass(locale, 'zh')]"-->
    <!--              @click="translationCh"-->
    <!--            >-->
    <!--              <IconifyIconOffline-->
    <!--                class="check-zh"-->
    <!--                v-show="locale === 'zh'"-->
    <!--                :icon="Check"-->
    <!--              />-->
    <!--              简体中文-->
    <!--            </el-dropdown-item>-->
    <!--            <el-dropdown-item-->
    <!--              :style="getDropdownItemStyle(locale, 'en')"-->
    <!--              :class="['dark:!text-white', getDropdownItemClass(locale, 'en')]"-->
    <!--              @click="translationEn"-->
    <!--            >-->
    <!--              <span class="check-en" v-show="locale === 'en'">-->
    <!--                <IconifyIconOffline :icon="Check" />-->
    <!--              </span>-->
    <!--              English-->
    <!--            </el-dropdown-item>-->
    <!--          </el-dropdown-menu>-->
    <!--        </template>-->
    <!--      </el-dropdown>-->
    <!--    </div>-->
    <div class="login-container">
      <div class="img">
        <component :is="toRaw(illustration)" />
      </div>
      <div class="login-box">
        <div class="login-form">
          <!--          <avatar class="avatar" />-->
          <!--          <Motion>-->
          <!--            <h2 class="outline-none">-->
          <!--              <TypeIt :values="[title]" :cursor="false" :speed="150" />-->
          <!--            </h2>-->
          <!--          </Motion>-->

          <el-form
            v-if="currentPage === 0"
            ref="ruleFormRef"
            :model="ruleForm"
            :rules="loginRules"
            size="large"
          >
            <!--Enter username component-->
            <Motion :delay="100">
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
            <!--Enter pwd component-->
            <Motion :delay="150">
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
            <!--Remember pwd and forget pwd components-->
            <Motion :delay="250">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <!--Remember pwd component-->
                  <!--                  <el-checkbox v-model="checked">-->
                  <!--                    {{ t("login.remember") }}-->
                  <!--                  </el-checkbox>-->
                  <!--Forget pwd component-->
                  <el-button
                    link
                    type="primary"
                    @click="useUserStoreHook().SET_CURRENTPAGE(4)"
                  >
                    {{ t("login.forget") }}
                  </el-button>
                </div>
                <!--Login button component-->
                <el-button
                  class="w-full mt-4"
                  size="default"
                  type="primary"
                  :loading="loading"
                  @click="onLogin(ruleFormRef)"
                >
                  {{ t("login.login") }}
                </el-button>
              </el-form-item>
            </Motion>
            <!--Register component-->
            <Motion :delay="300">
              <el-form-item>
                <div class="w-full h-[20px] flex justify-between items-center">
                  <el-button
                    v-for="(item, index) in operates"
                    :key="index"
                    class="w-full mt-4"
                    size="default"
                    @click="useUserStoreHook().SET_CURRENTPAGE(index + 1)"
                  >
                    {{ t(item.title) }}
                  </el-button>
                </div>
              </el-form-item>
            </Motion>
          </el-form>
          <!-- Log up -->
          <regist v-if="currentPage === 1" />
          <!-- Forget password -->
          <update v-if="currentPage === 4" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("@/style/login.css");
</style>

<style lang="scss" scoped>
:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}

.translation {
  ::v-deep(.el-dropdown-menu__item) {
    padding: 5px 40px;
  }

  .check-zh {
    position: absolute;
    left: 20px;
  }

  .check-en {
    position: absolute;
    left: 20px;
  }
}
</style>
