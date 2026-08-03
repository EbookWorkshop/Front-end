<template>
  <div class="navbar">
    <div class="left-side">
      <a-space>
        <img alt="logo" :src="isDark ? logoDark : logoLight" width="40" class="logo-image" />
        <a-typography-title :style="{ margin: 0, fontSize: '18px' }" :heading="5" v-show="appStore.device !== 'mobile'">
          Ebook Workshop
        </a-typography-title>
        <icon-menu-fold v-if="!topMenu && appStore.device === 'mobile'" style="font-size: 22px; cursor: pointer"
          @click="toggleDrawerMenu" />
      </a-space>
    </div>
    <div class="center-side">
      <Menu v-if="topMenu" />
    </div>
    <ul class="right-side">
      <li>
        <a-tooltip :content="'服务器' + (socketState.connected ? '已连接' : '未连接')">
          <ConnectStatus :connected="socketState.connected" />
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="toggleDropDownVisible">
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown v-model:popup-visible="dropdownVisible" trigger="click" @select="changeLocale as any">
          <div class="trigger-btn"></div>
          <template #content>
            <a-doption v-for="item in locales" :key="item.value" :value="item.value">
              <template #icon>
                <icon-check v-show="item.value === currentLocale" />
              </template>
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li>
      <li>
        <a-tooltip :content="theme === 'light'
          ? $t('settings.navbar.theme.toDark')
          : $t('settings.navbar.theme.toLight')
          ">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="handleToggleTheme">
            <template #icon>
              <icon-moon-fill v-if="theme === 'dark'" />
              <icon-sun-fill v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <!-- 消息通知待办 -->
      <li>
        <a-tooltip :content="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="messageService.unreadCount">
              <a-button class="nav-btn" type="outline" :shape="'circle'" @click="togglePopover">
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-trigger v-model:popup-visible="popoverVisible" trigger="click" auto-fit-position>
          <!-- 默认插槽放一个空元素 不然绑定不了点击 -->
          <span style=""></span>
          <template #content>
            <MessageBox />
          </template>
        </a-trigger>
        <!-- 消息详情模态框 -->
        <MessageDetail />
      </li>
      <!-- 消息通知待办-结束 -->
      <li>
        <a-tooltip :content="isFullscreen
          ? $t('settings.navbar.screen.toExit')
          : $t('settings.navbar.screen.toFull')
          ">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="toggleFullScreen">
            <template #icon>
              <icon-fullscreen-exit v-if="isFullscreen" />
              <icon-fullscreen v-else />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip :content="$t('settings.title')">
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setVisible">
            <template #icon>
              <icon-settings />
            </template>
          </a-button>
        </a-tooltip>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, inject } from 'vue';
import { useDark, useToggle, useFullscreen } from '@vueuse/core';
import { useAppStore } from '@/store';
import { LOCALE_OPTIONS } from '@/locale';
import useLocale from '@/hooks/locale';
import Menu from '@/components/menu/index.vue';
import { messageService } from '@/services/messageService';
import { useSocket } from '@/hooks/socket';
import MessageBox from '@/components/message-box/index.vue';
import MessageDetail from '@/components/message-box/detail.vue';
import ConnectStatus from './connect-status.vue';

const logoLight = "/logo.svg?t=navbar";
const logoDark = "/logo-dark.svg?t=navbar";

const { state: socketState } = useSocket();
const appStore = useAppStore();
const { changeLocale, currentLocale } = useLocale();
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
const locales = [...LOCALE_OPTIONS];

const theme = computed(() => { return appStore.theme; });
const topMenu = computed(() => appStore.topMenu && appStore.menu);
const isDark = useDark({
  selector: 'body',
  attribute: 'arco-theme',
  valueDark: 'dark',
  valueLight: 'light',
  storageKey: 'arco-theme',
  onChanged(dark: boolean) {
    // overridden default behavior
    appStore.toggleTheme(dark);
  },
});
const toggleTheme = useToggle(isDark);
const handleToggleTheme = () => { toggleTheme(); };
const setVisible = () => { appStore.updateSettings({ globalSettings: true }); };
const popoverVisible = ref(false);
const togglePopover = () => { popoverVisible.value = !popoverVisible.value; };
const dropdownVisible = ref(false);
const toggleDropDownVisible = () => { dropdownVisible.value = !dropdownVisible.value };

const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;

</script>
<style scoped lang="less">
.navbar {
  display: flex;
  justify-content: space-between;
  height: 100%;
  background-color: var(--color-bg-2);
  border-bottom: 1px solid var(--color-border);
}

.left-side {
  display: flex;
  align-items: center;
  padding-left: 20px;
}

.center-side {
  flex: 1;
}

.right-side {
  display: flex;
  padding-right: 20px;
  list-style: none;

  :deep(.locale-select) {
    border-radius: 20px;
  }

  li {
    display: flex;
    align-items: center;
    padding: 0 10px;
  }

  a {
    color: var(--color-text-1);
    text-decoration: none;
  }

  .nav-btn {
    border-color: rgb(var(--gray-2));
    color: rgb(var(--gray-8));
    font-size: 16px;
  }

  .trigger-btn,
  .ref-btn {
    position: absolute;
    bottom: 14px;
  }

  .trigger-btn {
    margin-left: 14px;
  }
}
</style>

<style lang="less">
.logo-image {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2); // 添加悬停缩放效果
  }
}
</style>