export default {
    name: 'EntryCard',

    props: {
        entry: {
            type: Object,
            required: true,
        },
        isEditing: {
            type: Boolean,
            default: false,
        },
        editForm: {
            type: Object,
            required: true,
        },
        savingEdit: {
            type: Boolean,
            required: true,
        },
    },

    emits: ['start-edit', 'cancel-edit', 'save-edit', 'delete-entry'],

    template: `
        <div class="entry-card">

            <!-- view mode -->
            <div v-if="!isEditing" class="entry-body">
                <div class="entry-name">{{ entry.name }}</div>
                <div class="entry-desc" v-if="entry.description">{{ entry.description }}</div>
                <div class="entry-id">{{ entry.id }}</div>
            </div>

            <!-- edit mode -->
            <div v-else class="entry-body">
                <div class="edit-row">
                    <input type="text" v-model="editForm.name" placeholder="Name…"/>
                    <textarea rows="2" v-model="editForm.description" placeholder="Description…"></textarea>
                    <div class="edit-actions">
                        <button
                            class="btn btn-gold"
                            @click="$emit('save-edit', entry.id)"
                            :disabled="savingEdit"
                        >
                            <span v-if="savingEdit"><span class="spin"></span></span>
                            <span v-else>Save</span>
                        </button>
                        <button class="btn btn-ghost" @click="$emit('cancel-edit')">Cancel</button>
                    </div>
                </div>
            </div>

            <div class="entry-actions">
                <button
                    class="btn btn-ghost"
                    style="font-size:.7rem;"
                    @click="$emit('start-edit', entry)"
                >Edit</button>
                <button
                    class="btn btn-rust"
                    style="font-size:.7rem;"
                    @click="$emit('delete-entry', entry.id)"
                >Del</button>
            </div>

        </div>
    `,
};
