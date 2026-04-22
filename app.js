import AppSidebar from './components/AppSidebar.js';
import MainPanel  from './components/MainPanel.js';
import ToastList  from './components/ToastList.js';

const BASE = '';

const app = Vue.createApp({

    components: { AppSidebar, MainPanel, ToastList },

    data() {
        return {
            lists:          [],
            entries:        [],
            activeListId:   null,
            newListName:    '',
            newEntry:       { name: '', description: '' },
            editingId:      null,
            editForm:       { name: '', description: '' },
            toasts:         [],
            toastSeq:       0,
            creating:       false,
            addingEntry:    false,
            loadingEntries: false,
            savingEdit:     false,
        };
    },

    computed: {
        activeList() {
            return this.lists.find(l => l.id === this.activeListId) || {};
        },
    },

    methods: {

        // ── API helper ────────────────────────────────────────────────────────

        async api(path, opts = {}) {
            const res = await fetch(BASE + path, {
                headers: { 'Content-Type': 'application/json' },
                ...opts,
            });
            if (res.status === 204) return null;
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);
            return json;
        },

        // ── Toast ─────────────────────────────────────────────────────────────

        toast(msg, err = false) {
            const id = ++this.toastSeq;
            this.toasts.push({ id, msg, err });
            setTimeout(() => {
                this.toasts = this.toasts.filter(t => t.id !== id);
            }, 3000);
        },

        // ── Lists ─────────────────────────────────────────────────────────────

        async createList() {
            if (!this.newListName.trim() || this.creating) return;
            this.creating = true;
            try {
                const list = await this.api('/todo-list', {
                    method: 'POST',
                    body: JSON.stringify({ name: this.newListName.trim() }),
                });
                this.lists.push(list);
                this.newListName = '';
                this.toast('List created');
                this.selectList(list.id);
            } catch (e) {
                this.toast(e.message, true);
            } finally {
                this.creating = false;
            }
        },

        async deleteList(id) {
            if (!confirm('Delete this list and all its entries?')) return;
            try {
                await this.api(`/todo-list/${id}`, { method: 'DELETE' });
                this.lists = this.lists.filter(l => l.id !== id);
                if (this.activeListId === id) {
                    this.activeListId = null;
                    this.entries = [];
                }
                this.toast('List deleted');
            } catch (e) {
                this.toast(e.message, true);
            }
        },

        async selectList(id) {
            this.activeListId = id;
            this.editingId = null;
            this.loadingEntries = true;
            try {
                this.entries = await this.api(`/todo-list/${id}`);
            } catch (e) {
                this.toast(e.message, true);
                this.entries = [];
            } finally {
                this.loadingEntries = false;
            }
        },

        // ── Entries ───────────────────────────────────────────────────────────

        async createEntry() {
            if (!this.newEntry.name.trim() || this.addingEntry) return;
            this.addingEntry = true;
            try {
                const entry = await this.api(`/todo-list/${this.activeListId}`, {
                    method: 'POST',
                    body: JSON.stringify({ ...this.newEntry }),
                });
                this.entries.unshift(entry);
                this.newEntry = { name: '', description: '' };
                this.toast('Entry added');
            } catch (e) {
                this.toast(e.message, true);
            } finally {
                this.addingEntry = false;
            }
        },

        async deleteEntry(id) {
            try {
                await this.api(`/entry/${id}`, { method: 'DELETE' });
                this.entries = this.entries.filter(e => e.id !== id);
                this.toast('Entry deleted');
            } catch (e) {
                this.toast(e.message, true);
            }
        },

        // ── Entry editing ─────────────────────────────────────────────────────

        startEdit(entry) {
            this.editingId = entry.id;
            this.editForm = { name: entry.name, description: entry.description || '' };
        },

        cancelEdit() {
            this.editingId = null;
        },

        async saveEdit(id) {
            if (this.savingEdit) return;
            this.savingEdit = true;
            try {
                const updated = await this.api(`/entry/${id}`, {
                    method: 'PATCH',
                    body: JSON.stringify({ ...this.editForm }),
                });
                const idx = this.entries.findIndex(e => e.id === id);
                if (idx !== -1) this.entries.splice(idx, 1, updated);
                this.editingId = null;
                this.toast('Entry updated');
            } catch (e) {
                this.toast(e.message, true);
            } finally {
                this.savingEdit = false;
            }
        },
    },

    template: `
        <div class="shell">
            <app-sidebar
                :lists="lists"
                :active-list-id="activeListId"
                :creating="creating"
                v-model:new-list-name="newListName"
                @create-list="createList"
                @select-list="selectList"
                @delete-list="deleteList"
            />

            <main class="main" v-if="!activeListId">
                <div class="placeholder">
                    <div class="placeholder-icon">📋</div>
                    <p>Select a list on the left<br/>or create a new one to get started.</p>
                </div>
            </main>

            <main-panel
                v-else
                :active-list="activeList"
                :entries="entries"
                :new-entry="newEntry"
                :editing-id="editingId"
                :edit-form="editForm"
                :loading-entries="loadingEntries"
                :adding-entry="addingEntry"
                :saving-edit="savingEdit"
                @create-entry="createEntry"
                @start-edit="startEdit"
                @cancel-edit="cancelEdit"
                @save-edit="saveEdit"
                @delete-entry="deleteEntry"
            />
        </div>

        <toast-list :toasts="toasts" />
    `,
});

app.mount('#app');
