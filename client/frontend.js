import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js';

Vue.component("loader", {
    template: `
        <div style="display: flex; justify-content: center; align-items: center">
            <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        </div>
        
    `
})

new Vue ({
    el: "#app",
    data() {
        return {
            loading: false,
            form: {
                name: "",
                value: ""
            },
            contacts: []
        }
    },
    computed: {
        canCreate() {
            return this.form.name.trim() && this.form.value.trim();
        }
    },
    methods: {
        async createContact() {
            const {...contact} = this.form;
            this.loading = true;

            await request("/api/contacts", "POST", contact);

            this.contacts = await request("/api/contacts");

            this.loading = false;

            this.form.name = this.form.value = "";
        },
        async markContact(id) {
            this.loading = true;
            const contact = this.contacts.find( c => c.id === id);

            await request(`/api/contacts/${id}`, "PUT", { ...contact, marked: true});

            this.contacts = await request("/api/contacts");

            this.loading = false;
        },
        async removeContact(id) {
            this.loading = true;

            await request(`/api/contacts/${id}`, "DELETE");

            this.contacts = await request("/api/contacts");

            this.loading = false;

        }
    },
    async mounted(){
        this.loading = true;

        this.contacts = await request("/api/contacts");

        this.loading = false;
    }
});

async function request(url, method="GET", data=null) {
    try {
        const headers = {};
        let body;

        if (data) {
            headers["Content-Type"] = "application/json";

            body = JSON.stringify(data);
        }

        const response = await fetch(url, {
            method,
            headers,
            body

        });

        return await response.json();
    } catch(e) {
        console.warn("Error", e.message);
    }

}
