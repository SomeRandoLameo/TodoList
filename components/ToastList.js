export default {
    name: 'ToastList',

    props: {
        toasts: {
            type: Array,
            required: true,
        },
    },

    template: `
        <div class="toast-wrap">
            <div
                v-for="t in toasts"
                :key="t.id"
                class="toast"
                :class="{ err: t.err }"
            >
                {{ t.msg }}
            </div>
        </div>
    `,
};
