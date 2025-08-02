import { DirectiveBinding } from 'vue';
import { useUserStore } from '@/store';

function checkPermission(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const userStore = useUserStore();
  const { role } = userStore;//用户角色

  if (Array.isArray(value)) {
    if (value.length > 0) {
      const permissionValues = value;// 允许访问的角色列表，如：['admin','user']

      const hasPermission = permissionValues.includes(role);
      // 无权限时移除元素
      if (!hasPermission && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    }
  } else {
    throw new Error(`权限指令格式错误，要求如： v-permission="['admin','user']"`);
  }
}

/**
 * 权限指令
 * 这个指令可以通过 v-permission="['admin','editor']" 的方式在模板中使用，当用户角色不在指定数组中时，元素会被完全移除。
 * @directive  v-permission="['admin','user']"
 * @example <a-button v-permission="['admin','user']">按钮</a-button>
 */
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
  updated(el: HTMLElement, binding: DirectiveBinding) {
    checkPermission(el, binding);
  },
};
