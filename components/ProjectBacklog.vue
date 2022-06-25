<template>
    <div>
        <v-card outlined>
            <v-card-text class="text-center">
                <h4>No tienes ninguna tarea creada.</h4>
                <v-btn class="text-capitalize" text :color="$store.state.primary" @click="newIssueDialog = true">
                    <v-icon left>mdi-plus</v-icon>
                    Crear tarea
                </v-btn>
            </v-card-text>
        </v-card>

        <new-issue
            :key_app="$route.params.key"
            :project="$route.params.uuid"
            @changeDialog="() => { newIssueDialog = !newIssueDialog }"
            :dialog.sync="newIssueDialog"
        ></new-issue>

    </div>
</template>

<script>
import { ref, defineComponent, useContext, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({
    setup() {

        const { $axios, $notify } = useContext()
        const route               = useRoute()
        
        let newIssueDialog = ref(false)
        

        return{
            newIssueDialog,
        }

    },  
})
</script>
