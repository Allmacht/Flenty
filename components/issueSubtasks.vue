<template>
    <div>
        <h4 class="mb-2">
            Subtareas
            <span v-if="subtasks && subtasks.length > 0">{{ `(${pendingSubtasks})` }}</span>
            <span style="float:right">
                <v-tooltip v-if="subtasks && subtasks.length > 0" bottom>
                    <template v-slot:activator="{ attrs, on }">
                        <v-icon @click="newSubtaskDialog = !newSubtaskDialog" v-bind="attrs" v-on="on" :color="$store.state.primary">mdi-plus</v-icon>
                    </template>

                    <span>Crear subtarea</span>
                </v-tooltip>
            </span>
        </h4>

        <v-card outlined>

            <v-card-text class="px-0 py-0">
                <v-expand-transition>
                    <v-text-field
                        hide-details
                        v-model="newSubtask"
                        v-show="newSubtaskDialog"
                        label="¿Que hay que hacer?" 
                        append-icon="mdi-send"
                        @click:append="addSubtask" 
                        :autofocus="newSubtaskDialog" 
                        filled
                    ></v-text-field>
                </v-expand-transition>

                <template v-if="subtasks && subtasks.length > 0">
                    <v-list class="py-0">
                        <template v-for="(subtask, index) in subtasks">
                            <v-hover v-slot="{ hover }" :key="subtask.id">
                                <v-list-item>
                                    <v-list-item-content>
                                        <v-list-item-title>
                                            <span :class="{ 'text-decoration-line-through':subtask.completed }">
                                                {{ subtask.subtask }}
                                            </span>
                                            <span v-if="hover">
                                                <v-icon 
                                                    @click="() => { editSubtask = subtask; editSubtaskDialog = true  }"
                                                    right
                                                    size="14px"
                                                    :color="$store.state.primary"
                                                >
                                                    mdi-pencil
                                                </v-icon>
                                            </span>
                                        </v-list-item-title>
                                    </v-list-item-content>

                                    <v-list-item-action>
                                        <v-checkbox v-model="subtask.completed" @click="handleSubtaskCompleted(subtask)"></v-checkbox>
                                    </v-list-item-action>
                                </v-list-item>
                            </v-hover>

                            <v-divider v-if="index < subtasks.length -1" :key="`divider-${index}`"></v-divider>
                        </template>
                    </v-list>
                </template>

                <template v-else>
                    <div class="text-center py-5">
                        <v-btn  @click="newSubtaskDialog = !newSubtaskDialog" :color="$store.state.primary" class="text-capitalize" text>
                            <template v-if="!newSubtaskDialog">
                                <v-icon left>mdi-plus</v-icon>
                                Crear subtarea
                            </template>

                            <template v-else>
                                <v-icon left>mdi-close</v-icon>
                                Cerrar
                            </template>
                        </v-btn>
                    </div>
                </template>
                
            </v-card-text>

        </v-card>

        <v-dialog v-model="editSubtaskDialog" max-width="500" persistent>
            <v-card :loading="editSubtaskLoading" v-if="editSubtask">
                <v-card-title>
                    <v-icon :color="$store.state.primary" left>mdi-pencil</v-icon>
                    Editar subtarea
                </v-card-title>
                
                <v-form v-on:submit.prevent="handleEditSubtask($event)">
                    <v-card-text>
                            <v-text-field name="subtask" :value="editSubtask.subtask" filled label="Subtarea"></v-text-field>
                    </v-card-text>

                    <v-card-actions>
                        <v-menu offset-y>
                            <template v-slot:activator="{ attrs, on }">
                                <v-icon color="error" v-bind="attrs" v-on="on">mdi-delete</v-icon>
                            </template>

                            <v-list>
                                <v-list-item>
                                    <v-list-item-content class="text-center">
                                        <v-list-item-title class="mb-4">¿Realmente desea eliminar?</v-list-item-title>
                                        <v-btn color="error" @click="handleDeleteSubtask">Eliminar</v-btn>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                        </v-menu>
                        <v-spacer></v-spacer>
                        <v-btn text @click="editSubtaskDialog = false" :disabled="editSubtaskLoading">cancelar</v-btn>
                        <v-btn type="submit" :loading="editSubtaskLoading" :color="$store.state.primary" dark>Editar</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { computed, defineComponent, onMounted, ref, useContext } from '@nuxtjs/composition-api'

export default defineComponent({

    props:{
        issue:{
            required:true,
            type:Object
        },

        project:{
            required:true,
            type:String
        }
    },

    setup(props) {

        const { $axios, $notify } = useContext()

        let subtasks           = ref([])
        let newSubtaskDialog   = ref(false)
        let editSubtaskDialog  = ref(false)
        let newSubtask         = ref("")
        let editSubtask        = ref(null)
        let editSubtaskLoading = ref(false)

        onMounted(() => getSubtasks())


        const pendingSubtasks = computed( () => {

            let total = 0
            
            if(!subtasks || subtasks.value.length === 0) return total;

            subtasks.value.map(subtask => {
                if(!subtask.completed) total++
            })

            return total;

        })


        const getSubtasks = async () => {
            try{
                let response = await $axios.get(`/api/subtasks/${props.project}/${props.issue.key}`);
                subtasks.value = response.data.data
            }
            catch(err){
                if(err.response.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No cuenta con los permisos necesarios para realizar esta acción"
                    })
                }
            }
        }

        const addSubtask = async () => {

            if(newSubtask.value === "") return

            try{
                await $axios.post(`/api/subtasks/store/${props.project}/${props.issue.key}`, { subtask:newSubtask.value });
                getSubtasks()
                
            }
            catch(err){
                if(err.response.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No cuenta con los permisos necesarios para realizar esta acción"
                    })
                }
            }

            finally{
                newSubtask.value = ""
                newSubtaskDialog.value = false
            }

        }

        const handleSubtaskCompleted = async (subtask) => {
            
        }

        const handleEditSubtask = async(event) => {

            if(event.srcElement.subtask.value === "") return

            let form = {}
            form.subtask    = event.srcElement.subtask.value
            form.subtask_id = editSubtask.value.id

            editSubtaskLoading.value = true

            try{
                await $axios.put(`/api/subtasks/update/${props.project}/${props.issue.key}`, form)
                getSubtasks()
            }
            catch(err){
                if(err.response.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No cuenta con los permisos necesarios para realizar esta acción"
                    })
                }
            }

            finally{
                editSubtaskLoading.value = editSubtaskDialog.value = false
                editSubtask.value = null
            }
        }

        const handleDeleteSubtask = async() => {

            editSubtaskLoading.value = true

            try{
                await $axios.delete(`/api/subtasks/delete/${props.project}/${props.issue.key}/${editSubtask.value.id}`)
                getSubtasks()
            }
            catch(err){
                if(err.response?.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No cuenta con los permisos necesarios para realizar esta acción"
                    })
                }
            }

            finally{
                editSubtaskLoading.value = editSubtaskDialog.value = false
                editSubtask.value = null
            }

        }
        

        return {

            subtasks,
            addSubtask,
            newSubtask,
            editSubtask,
            pendingSubtasks,
            newSubtaskDialog,
            editSubtaskDialog,
            handleEditSubtask,
            editSubtaskLoading,
            handleDeleteSubtask,
            handleSubtaskCompleted,
        }
    },
})
</script>
