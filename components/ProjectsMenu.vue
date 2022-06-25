<template>
    <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
            <v-btn class="text-capitalize" v-bind="attrs" v-on="on" text>
                Proyectos
                <v-icon :color="$store.state.primary" right>mdi-chevron-down</v-icon>
            </v-btn>
        </template>

        <v-list dense>
            <v-list-item v-if="loading">
                <v-list-item-avatar>
                    <v-progress-circular indeterminate :color="$store.state.primary"></v-progress-circular>
                </v-list-item-avatar>
                <v-list-item-content>
                    <v-list-item-title>Cargando...</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list-item-group v-else>

                <v-subheader v-if="projects && projects.length === 0" class="mx-auto">Sin proyectos recientes</v-subheader>

                <v-list-item v-else v-for="project in projects" :key="project.key" @click="$router.push(`/projects/${project.key}/${project.id}`)">
                    <v-list-item-avatar>
                        <v-img :src="project.image"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                        <v-list-item-title>{{ project.name+` (${project.key})` }}</v-list-item-title>
                        <v-list-item-subtitle v-text="project.type.name"></v-list-item-subtitle>
                    </v-list-item-content>

                    <v-list-item-action>
                        <v-icon>mdi-star-outline</v-icon>
                    </v-list-item-action>
                </v-list-item>

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

    import { defineComponent, ref, useContext, onMounted } from '@nuxtjs/composition-api'

    export default defineComponent({

        setup() {
            const { $axios } = useContext()

            let loading  = ref(true)
            let projects = ref([])

            onMounted(() => {
                $nuxt.$on('reload-projects', () => {
                    console.log('updating projects...')
                    getProjects()
                })

                getProjects()
            })

            const getProjects = async () => {

                loading.value = true

                try{
                    let response   = await $axios.get('/api/projects')
                    projects.value = response.data.data
                    loading.value  = false

                }catch(err){
                    console.error(err)
                    loading.value = false
                }
            }

            return {
                loading,
                projects
            }
        },
    })
</script>