<template>
	<div class="layout-topbar">
		<router-link to="/" class="layout-topbar-logo">
			<span>Nexus Cheat Page v1.0</span>
		</router-link>

<!--    顶部栏的三道杠， 隐藏侧边栏-->
		<button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
			<i class="pi pi-bars"></i>
		</button>

		<button class="p-link layout-topbar-menu-button layout-topbar-button"
			v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein', 
			leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
			<i class="pi pi-ellipsis-v"></i>
		</button>

<!--		<ul class="layout-topbar-menu hidden lg:flex origin-top">-->



<!--      <li>-->
<!--        <span class="p-link layout-topbar-button">-->
<!--          <i class="pi pi-bell" ></i>-->
<!--          <span class="p-badge">2</span>-->
<!--        </span>-->
<!--      </li>-->
<!--			<li>-->
<!--				<button class="p-link layout-topbar-button"  @click="settings"   >-->
<!--					<i class="pi pi-cog"></i>-->
<!--					<span>Settings</span>-->
<!--				</button>-->
<!--			</li>-->


<!--			<li>-->
<!--				<button class="p-link layout-topbar-button" @click="profiles">-->
<!--					<i class="pi pi-user"></i>-->
<!--					<span>Profile</span>-->
<!--				</button>-->
<!--			</li>-->
<!--		</ul>-->


	</div>
</template>

<script>

import EventBus from './AppEventBus';

export default {
  props: {
    layoutMode: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      value: null,

      items: [
        {
          label: '更新',
          icon: 'pi pi-refresh',
          command: () => {
            this.$toast.add({severity:'success', summary:'更新', detail:'更新数据', life: 3000});
          }
        },
        {
          label: '删除',
          icon: 'pi pi-times',
          command: () => {
            this.$toast.add({ severity: 'warn', summary: '删除', detail: '删除数据', life: 3000});
          }
        },
        {
          label: 'Vue 网站',
          icon: 'pi pi-external-link',
          url: 'https://vuejs.org/'
        },
        {
          label: '路由',
          icon: 'pi pi-upload',
          to: '/fileupload'
        }
      ]
    }
  },
    methods: {
      onMenuToggle(event) {
        this.$emit('menu-toggle', event);
      },
      toggle(event) {
        this.$refs.menu.toggle(event);
      },

      topbarevents(event) {
        this.$emit('menu-events', event);
      },
      settings(event) {
        this.$emit('menu-settings', event);
      },
      profiles(event) {
        this.$emit('menu-profiles', event);
      },
		// onTopbarMenuToggle(event) {
    //         this.$emit('topbar-menu-toggle', event);
    //     },

    },

	computed: {
		darkTheme() {
			return this.$appState.darkTheme;
		}
	}
}
</script>