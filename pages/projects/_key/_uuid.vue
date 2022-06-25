<template>
    <v-container>
        <v-row justify="center" align="center">
            <v-col v-if="project" cols="12" class="px-10">
                <v-row justify="center" align="center">
                    <v-col cols="12">
                        <v-breadcrumbs class="px-0" :items="items"></v-breadcrumbs>
                    </v-col>
                    <v-col>
                        <h1 :style="{ 'color': $store.state.primary }">{{ `(${project.key}) ${project.name}` }}</h1>
                    </v-col>
                    <v-col class="text-right">
                        <v-icon :color="$store.state.primary" left>mdi-clock-outline</v-icon>

                        <v-tooltip bottom>
                            <template v-slot:activator="{ attrs, on }">
                                <span v-bind="attrs" v-on="on">
                                    {{ project.diff_days }}  {{ project.out_of_date ? 'día(s) retrasado' : 'día(s) restante(s)' }}
                                </span>
                            </template>

                            <span>
                                <span>Fecha de inicio : {{ project.initial_date }}</span><br>
                                <span>Fecha estimada de termino : {{ project.projected_end_date }}</span>
                            </span>
                        </v-tooltip>

                        <v-btn text>
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                    </v-col>
                </v-row>

                <v-row justify="center" align="center">
                    <v-col cols="12">
                        <h3>Spring activo</h3>
                    </v-col>

                    <v-col cols="12">
                        <project-spring></project-spring>
                    </v-col>

                    <v-col cols="12">
                        <h3>Backlog</h3>
                    </v-col>

                    <v-col cols="12">
                        <project-backlog></project-backlog>
                    </v-col>

                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>

import { ref, useAsync, useRoute, useContext } from '@nuxtjs/composition-api'

export default {

    layout:'app',
    middleware:'auth',

    setup() {

        const route      = useRoute()
        const { $axios } = useContext()
        
        let items = ref([])

        const project = useAsync(async() => {
            
            let response = await $axios.get(`/api/projects/${route.value.params.key}/${route.value.params.uuid}`, { params:{ all_data:true } })

            items.value.push(
                {
                    text: response.data.data.key,
                    disabled: true,
                    href: '',
                },

                {
                    text: response.data.data.name,
                    disabled: true,
                    href: '',
                },
            )

            return response.data.data
        })

        return{
            items,
            project,
        }
    }
}
</script>