<template>
    <v-card outlined>
        <v-card-text class="text-center">
            <h4>No tiene ningún spring activo.</h4>
            <v-btn class="text-capitalize" text :color="$store.state.primary">
                <v-icon left>mdi-plus</v-icon>
                Crear spring
            </v-btn>
        </v-card-text>
    </v-card>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
    setup() {
        
    },
})
</script>
