import EntryCard from './EntryCard.js';

export default {
    name: 'MainPanel',

    components: { EntryCard },

    props: {
        activeList: {
            type: Object,
            required: true,
        },
        entries: {
            type: Array,
            required: true,
        },
        newEntry: {
            type: Object,
            required: true,
        },
        editingId: {
            type: String,
            default: null,
        },
        editForm: {
            type: Object,
            required: true,
        },
        loadingEntries: {
            type: Boolean,
            required: true,
        },
        addingEntry: {
            type: Boolean,
            required: true,
        },
        savingEdit: {
            type: Boolean,
            required: true,
        },
    },

    emits: [
        'create-entry',
        'start-edit',
        'cancel-edit',
        'save-edit',
        'delete-entry',
    ],

    template: `
        <main class="main">
            <div class="main-header">
                <span class="main-title">{{ activeList.name }}</span>
                <span class="entry-count">
                    {{ entries.length }} item{{ entries.length !== 1 ? 's' : '' }}
                </span>
            </div>

            <!-- add entry -->
            <div class="add-entry-form">
                <span class="label">Add entry</span>
                <div class="form-row">
                    <input
                        type="text"
                        v-model="newEntry.name"
                        placeholder="Name…"
                        @keyup.enter="$emit('create-entry')"
                    />
                    <input
                        type="text"
                        v-model="newEntry.description"
                        placeholder="Description…"
                        @keyup.enter="$emit('create-entry')"
                    />
                </div>
                <div>
                    <button
                        class="btn btn-rust"
                        @click="$emit('create-entry')"
                        :disabled="!newEntry.name.trim() || addingEntry"
                    >
                        <span v-if="addingEntry"><span class="spin"></span></span>
                        <span v-else>+ Add</span>
                    </button>
                </div>
            </div>

            <!-- loading -->
            <div v-if="loadingEntries" style="color:var(--muted);font-size:.8rem;">
                <span class="spin"></span> Loading…
            </div>

            <!-- empty -->
            <div v-else-if="entries.length === 0" class="placeholder" style="padding:2rem 0;">
                <div class="placeholder-icon">✏️</div>
                <p>No entries yet. Add one above.</p>
            </div>

            <!-- entries -->
            <div v-else class="entries">
                <entry-card
                    v-for="entry in entries"
                    :key="entry.id"
                    :entry="entry"
                    :is-editing="editingId === entry.id"
                    :edit-form="editForm"
                    :saving-edit="savingEdit"
                    @start-edit="$emit('start-edit', $event)"
                    @cancel-edit="$emit('cancel-edit')"
                    @save-edit="$emit('save-edit', $event)"
                    @delete-entry="$emit('delete-entry', $event)"
                />
            </div>
        </main>
    `,
};
