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
          <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setDropDownVisible">
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
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
      <li>
        <!-- 消息通知待办 -->
        <a-tooltip :content="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="unreadCount">
              <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setPopoverVisible">
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover trigger="click" :arrow-style="{ display: 'none' }" :content-style="{ padding: 0, minWidth: '400px' }"
          content-class="message-popover">
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <message-box :message-list="messageService.messages" @empty-list="handleEmptyList"
              @all-read="handleAllRead" />
          </template>
        </a-popover>
        <!-- 消息通知待办-结束 -->
      </li>
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
import { computed, ref, inject, watch } from 'vue';
import { Notification } from '@arco-design/web-vue';
import { useDark, useToggle, useFullscreen } from '@vueuse/core';
import { useAppStore } from '@/store';
import { LOCALE_OPTIONS } from '@/locale';
import useLocale from '@/hooks/locale';
import Menu from '@/components/menu/index.vue';
import { useMessageService } from '@/services/messageService';
import { useSocket } from '@/hooks/socket';
import MessageBox from '../message-box/index.vue';
import ConnectStatus from './connect-status.vue';

const logoLight = "/logo.svg?t=navbar";
const logoDark = "/logo-dark.svg?t=navbar";

const { state: socketState } = useSocket();
const appStore = useAppStore();
const { changeLocale, currentLocale } = useLocale();
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen();
const locales = [...LOCALE_OPTIONS];

// 使用消息服务
const messageService = useMessageService();

const theme = computed(() => {
  return appStore.theme;
});
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
const handleToggleTheme = () => {
  toggleTheme();
};
const setVisible = () => {
  appStore.updateSettings({ globalSettings: true });
};
const refBtn = ref();
const triggerBtn = ref();
const setPopoverVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  refBtn.value.dispatchEvent(event);
};

const setDropDownVisible = () => {
  const event = new MouseEvent('click', {
    view: window,
    bubbles: true,
    cancelable: true,
  });
  triggerBtn.value.dispatchEvent(event);
};

const toggleDrawerMenu = inject('toggleDrawerMenu') as () => void;

// 计算未读消息数量
const unreadCount = computed(() => {
  return messageService.messages.filter(item => !item.status).length;
});

// 处理清空消息
const handleEmptyList = () => {
  messageService.clearAll();
};

// 处理全部已读
const handleAllRead = () => {
  messageService.messages.forEach(message => {
    messageService.markAsRead(message.id);
  });
};

// 监听新消息并显示通知
watch(() => messageService.messages.length, (newLength, oldLength) => {
  if (newLength > oldLength) {
    const lastMsg = messageService.messages[newLength - 1];
    if (lastMsg.type === "notice") {
      Notification.info({
        id: lastMsg.id.toString(),
        title: lastMsg.title,
        content: lastMsg.vnodeContent ? () => lastMsg.vnodeContent : lastMsg.content,
        duration: 0,
        showIcon: true,
        closable: true,
      });
    }
  }
}, { deep: true });
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
.message-popover {
  .arco-popover-content {
    margin-top: 0;
  }
}

.logo-image {
  transition: transform 0.3s ease;

  &:hover {
    transform: scale(1.2); // 添加悬停缩放效果
  }
}
</style>