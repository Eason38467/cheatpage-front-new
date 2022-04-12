import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';

const routes = [
    {
        path: '/',
        name: 'app',
        component: App,
        children: [
            {
                path: '',
                name: 'dashboard',
                // component: () => import('./components/Dashboard.vue')
                component: () => import('./components/NotFound.vue')

            },



            {
                path: '/platforms',
                name: 'platforms',
                component: () => import('./components/platforms.vue')

            },
            {
                path: '/codename',
                name: 'codename',
                component: () => import('./components/codename.vue')
            },
            {
                path: '/abbreviation',
                name: 'abbreviation',
                component: () => import('./components/abb.vue')
            },
            {
                path: '/oids',
                name: 'oids',
                component: () => import('./components/OIDs.vue')
            },
            {
                path: '/editpage',
                name: 'editpage',
                component: () => import('./components/Common Checklists.vue')
            },



        ]
    },



];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
