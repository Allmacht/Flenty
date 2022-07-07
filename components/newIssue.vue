<template>
    <v-dialog v-model="createIssueDialog" scrollable max-width="800" persistent>
        <v-card :loading="loading" :disabled="loading">
            <v-card-title>
                Crear tarea
                <v-spacer></v-spacer>
                <v-icon @click="closeDialog">mdi-close</v-icon>
            </v-card-title>

            <v-card-text class="py-6">
                <v-form ref="createForm">

                    <v-col class="px-0 py-0" cols="12" xl="6">
                        <v-select v-model="form.issue_type_id" label="Tipo de tarea" :rules="[required]" :items="issue_types" item-text="name" item-value="id" filled>
                            <template v-slot:selection="{ item, index }">
                                <v-img class="mr-3" :src="`${apiDomain}${item.image}`" max-width="19px"></v-img>{{ item.name }}
                            </template>
                            <template v-slot:item="{ item }">
                                <v-img class="mr-2" :src="`${apiDomain}${item.image}`" max-width="19px"></v-img>{{ item.name }}
                            </template>
                            <template v-slot:append-outer>
                                <v-icon :color="$store.state.primary">mdi-information</v-icon>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col class="px-0 py-0" cols="12" xl="6">
                        <v-select v-model="form.priority_id" :items="priorities" :rules="[required]" label="Prioridad" item-text="name" item-value="id" filled>
                            <template v-slot:selection="{ item, index }">
                                <v-img class="mr-3" :src="`${apiDomain}${item.image}`" max-width="19px"></v-img>{{ item.name }}
                            </template>
                            <template v-slot:item="{ item }">
                                <v-img class="mr-2" :src="`${apiDomain}${item.image}`" max-width="19px"></v-img>{{ item.name }}
                            </template>
                            <template v-slot:append-outer>
                                <v-icon :color="$store.state.primary">mdi-information</v-icon>
                            </template>
                        </v-select>
                    </v-col>

                    <v-col class="px-0 py-0" cols="12" xl="6">
                        <v-select v-model="form.assignee_id" label="Asignar" :items="members" item-text="user.name" item-value="user.id" filled>
                            <template v-slot:selection="{ item, index }">
                                <v-img class="mr-3" :src="`https://ui-avatars.com/api/?rounded=true&background=random&name=${item.user.name}`" max-width="19px"></v-img>{{ item.user.name }}
                            </template>
                            <template v-slot:item="{ item }">
                                <v-img class="mr-3" :src="`https://ui-avatars.com/api/?rounded=true&background=random&name=${item.user.name}`" max-width="19px"></v-img>{{ item.user.name }}
                            </template>
                        </v-select>
                    </v-col>

                    <v-col class="px-0 py-0" cols="12" xl="6">
                        <v-text-field v-model="form.duration" type="number" hide-spin-buttons label="Duración (hrs)" suffix="hrs" :rules="[required]" filled></v-text-field>
                    </v-col>

                    <v-text-field v-model="form.summary" filled label="Nombre de tarea" :rules="[required]"></v-text-field>

                    <v-file-input v-model="files" filled label="archivos" chips multiple></v-file-input>


                    <v-card-subtitle class="px-0">Descripción</v-card-subtitle>
                    <description-form @setDescription="(n) => { form.description = n }" :description.sync="description"></description-form>

                </v-form>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn text @click="closeDialog">Cancelar</v-btn>
                <v-btn :color="$store.state.primary" :loading="loading" @click="submit" dark>Crear</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
import { ref, defineComponent, reactive, useContext, useRoute, watch } from '@nuxtjs/composition-api'

export default defineComponent({

    emits:['changeDialog'],

    props:{
        dialog:{
            required:true,
            type:Boolean,
            default:false
        },
        project:{
            required:true,
            type:String
        },
        key_app:{
            required:true,
            type:String
        }
    },

    setup(props, { emit }) {

        const { $axios, $notify, $auth } = useContext()
        const route               = useRoute()
        const apiDomain           = process.env.API_DOMAIN

        let createIssueDialog = ref(props.dialog)
        let issue_types       = ref([])
        let loading           = ref(false)
        let createForm        = ref(null)
        let priorities        = ref([])
        let members           = ref([])
        let files             = ref([])
        let description       = ref("")
        let form              = reactive({
            summary            :"",
            duration           :"",
            status             :"CREATED",
            assignee_id        :"",
            reporter_id        :$auth.user.id,
            description        :"",
            priority_id        :"",
            issue_type_id      :""
        })

        const required = v => {
            return !!v || 'El campo es requerido' 
        }

        const getIssueTypes = async () => {
            let response = await $axios.get('/api/issue-types')
            issue_types.value = response.data.data
        }

        const getPriorities = async () => {
            let response = await $axios.get('/api/priorities')
            priorities.value = response.data.data

        }

        const getMembers = async () => {
            let response = await $axios.get(`/api/members/${route.value.params.uuid}`)
            members.value = response.data.data
        }

        watch(() => props.dialog, async (val) => {

            if(!val) return

            try{
                await getIssueTypes()
                await getPriorities()
                await getMembers()
                createIssueDialog.value = true

            }catch(err){
                $notify.error({
                    title:"Error",
                    message:"Error al procesar la solicitud, intente más tarde."
                })
            }
        })

        const closeDialog = () => {
            emit('changeDialog')
            createForm.value.reset()
            createIssueDialog.value = false
        }

        const submit = async () => {
            if(!createForm.value.validate()) return

            if(form.description === ""){
                $notify.error({
                    title:"Error",
                    message:"La descripción no debe estar vacía."
                })

                return
            }

            loading.value = true

            try{

                let issue = await createIssue(form)

                await saveFiles(issue.key)

                description.value = ""

                loading.value = false

                $notify.success({
                    title:"Correcto",
                    message:"Tarea creada correctamente"
                })

                loading.value = false

                $nuxt.$emit('reload-issues')

                closeDialog()

            }catch($err){

                loading.value = false

                $notify.success({
                    title:"Correcto",
                    message:"Ha ocurrido un error al procesar la solicitud, intente más tarde."
                })

            }

        }

        const createIssue = async (data) => {
            try{

                let response = await $axios.post(`/api/issues/${props.key_app}/${props.project}`, data)
                return response.data.data

            }catch(err){
                return false
            }
        }

        const saveFiles = async (key) => {

            if(files.value.length === 0) return

            let form = new FormData()

            for (let i = 0; i < files.value.length; i++) {
                form.append(i, files.value[i])
            }

            try{
                await $axios.post(`/api/attached-files/store/${props.project}/${key}`, form)

            }catch(err){
                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar los archivos. Intente más tarde."
                })
            }
        }


        return{
            form,
            files,
            submit,
            members,
            loading,
            required,
            apiDomain,
            createForm,
            priorities,
            issue_types,
            description,
            closeDialog,
            createIssueDialog
        }
    },
})
</script>
