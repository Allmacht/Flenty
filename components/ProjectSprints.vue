<template>
    <div>
        <template v-if="sprints && sprints.length === 0 && loading === false">
            <v-col class="px-0" cols="12">
                <h4>Sprints</h4>
            </v-col>

            <v-card outlined>
                <v-card-text class="text-center">
                    <h4>No tiene ningún sprint activo.</h4>
                    <v-btn @click="newSprintDialog = true" class="text-capitalize" text :color="$store.state.primary">
                        <v-icon left>mdi-plus</v-icon>
                        Crear sprint
                    </v-btn>
                </v-card-text>
            </v-card>
        </template>

        <template v-if="loading === true">
            <v-col class="px-0" cols="12">
                <h4>Sprints</h4>
            </v-col>

            <v-card loading outlined>
                <v-card-text class="text-center py-7">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    <span class="ml-3">Cargando, espere...</span>
                </v-card-text>
            </v-card>
        </template>

        <template v-else>
            <sprint-detail v-for="sprint in sprints" :key="sprint.id" :sprint="sprint"></sprint-detail>
        </template>

        <new-sprint
            :dialog="newSprintDialog"
            @close="newSprintDialog = false"
            :projectKey="$route.params.key"
            :project="$route.params.uuid"
        ></new-sprint>
    </div>
</template>

<script>
import { defineComponent, ref, onMounted, useContext, useRoute } from '@nuxtjs/composition-api'

export default defineComponent({
    setup() {

        const { $axios, $notify } = useContext()
        const route               = useRoute()

        let newSprintDialog = ref(false)
        let sprints         = ref([])
        let loading         = ref(true)

        onMounted(() => {
            $nuxt.$on('reload-sprints', () =>  getSprints() )
            getSprints()
        })

        const getSprints = async () => {
            
            try{
                const response = await $axios.get(`/api/sprints/${route.value.params.key}/${route.value.params.uuid}`)
                sprints.value  = response.data.data
            }
            catch(err){
                console.log(err)

                if(err.response.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No tienes los permisos necesarios para realizar esta acción."
                    })

                    return
                }

                $notify.error({
                    title:"Error",
                    message:"Error al obtener los sprints activos, intente más tarde."
                })
            }
            finally{
                loading.value = false
            }
        }

        return {
            loading,
            sprints,
            newSprintDialog
        }

    },
})
</script>
