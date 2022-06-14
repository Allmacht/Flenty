<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn class="text-capitalize" v-bind="attrs" v-on="on" text>
                Proyectos
                <v-icon :color="$store.state.primary" right>mdi-chevron-down</v-icon>
            </v-btn>
        </template>

        <v-list>
            <v-list-item v-if="loading">
                <v-list-item-avatar>
                    <v-progress-circular indeterminate :color="$store.state.primary"></v-progress-circular>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>Cargando...</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item-group v-else>

                <v-subheader class="mx-auto">Sin proyectos recientes</v-subheader>

                <v-divider></v-divider>

                <v-list-item>
                    <v-list-item-title>Ver todos los proyectos</v-list-item-title>
                </v-list-item>
                
                <v-list-item to="/projects/create">
                    <v-list-item-title>Crear nuevo proyecto</v-list-item-title>
                </v-list-item>
            </v-list-item-group>
        </v-list>
    </v-menu>
</template>

<script>

    import { defineComponent, ref, useAsync, useContext } from '@nuxtjs/composition-api'

    export default defineComponent({
        setup() {
            const { $axios } = useContext()

            let loading = ref(true)


            const projects = useAsync(() => {
                let response = $axios.get('/api/projects')
                loading.value = false
                return response.data
            })

            return {
                loading,
                projects
            }
        },
    })
</script>