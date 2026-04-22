export default {
    name: 'AppSidebar',

    props: {
        lists: {
            type: Array,
            required: true,
        },
        activeListId: {
            type: String,
            default: null,
        },
        creating: {
            type: Boolean,
            required: true,
        },
        newListName: {
            type: String,
            required: true,
        },
    },

    emits: ['update:newListName', 'create-list', 'select-list', 'delete-list'],

    template: `
        <aside class="sidebar">
            <div class="brand">Todo<br/><em>Lists</em></div>

            <div class="new-list-form">
                <span class="label">New list</span>
                <input
                    type="text"
                    :value="newListName"
                    @input="$emit('update:newListName', $event.target.value)"
                    placeholder="List name…"
                    @keyup.enter="$emit('create-list')"
                />
                <button
                    class="btn btn-gold"
                    @click="$emit('create-list')"
                    :disabled="!newListName.trim() || creating"
                >
                    <span v-if="creating"><span class="spin"></span></span>
                    <span v-else>+ Create</span>
                </button>
            </div>

            <div class="list-nav">
                <span class="label">Your lists</span>
                <div v-if="lists.length === 0" class="empty-hint">No lists yet.</div>
                <div
                    v-for="list in lists"
                    :key="list.id"
                    class="list-item"
                    :class="{ active: activeListId === list.id }"
                    @click="$emit('select-list', list.id)"
                >
                    <span class="list-item-name">{{ list.name }}</span>
                    <button
                        class="list-del"
                        @click.stop="$emit('delete-list', list.id)"
                        title="Delete list"
                    >✕</button>
                </div>
            </div>
        </aside>
    `,
};
