<template>
    <div>
        <h4 class="mb-2">
            Archivos
            <span v-if="files && files.length > 0">{{ `(${files.length})` }}</span>
            <span style="float:right">
                <v-tooltip v-if="files && files.length > 0" bottom>
                    <template v-slot:activator="{ attrs, on }">
                        <v-icon @click="newFilesDialog = !newFilesDialog" v-bind="attrs" v-on="on" :color="$store.state.primary">mdi-plus</v-icon>
                    </template>

                    <span>Añadir archivos</span>
                </v-tooltip>
            </span>
        </h4>
        <v-card :loading="loading" outlined>

            <v-card-text class="px-0 py-0">
                <v-data-table
                    v-if="files && files.length > 0" 
                    :items="files"
                    :headers="headers"
                    hide-default-footer
                >
                    <template v-slot:item.actions="{ item }">
                        <v-btn :loading="item.loading" icon @click="download(item)">
                            <v-icon>mdi-cloud-download-outline</v-icon>
                        </v-btn>
                        <v-btn
                            @click="() => { remove = item; warn = true }"
                            v-if="issue.assignee.id === $auth.user.id || $auth.user.role_names.includes('Project-administrator')" 
                            icon
                        >
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template>
                </v-data-table>

                <template v-else>
                    <div class="text-center py-5">
                        <v-btn  @click="newFilesDialog = !newFilesDialog" :color="$store.state.primary" class="text-capitalize" text>
                            <v-icon left>mdi-plus</v-icon>
                            Añadir archivos
                        </v-btn>
                    </div>
                </template>
            </v-card-text>
        </v-card>

        <v-dialog v-model="warn" max-width="400" persistent>
            <v-card>
                <v-card-title>
                    <v-icon color="error" left>mdi-alert</v-icon>
                    ¿Eliminar archivo?
                </v-card-title>

                <v-card-text class="text-center py-4">
                    Una vez borrado, no puede recuperarse.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text :disabled="loading_delete" @click="() => {remove = null;  warn = false}">Cancelar</v-btn>
                    <v-btn color="error" :loading="loading_delete" @click="deleteFile">Eliminar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-dialog v-model="newFilesDialog" max-width="500" persistent>
            <v-card :loading="filesLoading">
                <v-card-title>
                    <v-icon left :color="$store.state.primary">mdi-plus</v-icon>
                    Añadir archivos
                </v-card-title>
                <v-form ref="newFilesForm" v-on:submit.prevent="uploadFiles">
                    <v-card-text>
                        <v-file-input v-model="newFiles" multiple chips :rules="[min_files]" filled label="Seleccione los archivos a añadir"></v-file-input>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text @click="newFilesDialog = false" :disabled="filesLoading">Cancelar</v-btn>
                        <v-btn type="submit" :color="$store.state.primary" :loading="filesLoading" dark>Añadir</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { defineComponent, onMounted, ref, useContext, useRoute, watchEffect } from '@nuxtjs/composition-api'

export default defineComponent({

    props:{
        issue:{
            required:true,
            type:Object
        }
    },

    setup(props) {

        const { $axios, $notify } = useContext()
        const route               = useRoute()

        let files          = ref([])
        let remove         = ref(null)
        let loading        = ref(false)
        let loading_delete = ref(false)
        let newFilesDialog = ref(false)
        let filesLoading   = ref(false)
        let newFilesForm   = ref(null)
        let newFiles       = ref([])
        let warn           = ref(false)
        let headers        = [
            { text:"Nombre", value:"name" },
            { text:"Fecha", value:"created_at" },
            { text:"", value:"actions", sortable:false },
        ];

        onMounted(() => { getFIles() })

        const min_files = value => {
            return value.length > 0 || 'Añada al menos 1 archivo'
        }

        const getFIles = async() => {

            loading.value = true

            try{

                let response = await $axios.get(`api/attached-files/${route.value.params.uuid}/${props.issue.key}`);
                files.value = response.data.data

            }
            catch(err){
                
                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al obtener los archivos"
                })

            }
            finally{
                loading.value = false
            }
        } 
        
        const download = async(file) => {

            file.loading = true

            try{

                let response = await $axios.get(`/api/attached-files/${route.value.params.uuid}/${route.value.params.issueKey}/${file.file}`, { responseType:'blob' })

                const link = document.createElement('a')
                link.href  = window.URL.createObjectURL(response.data)
                link.setAttribute('download', file.name);
                document.body.appendChild(link)

                link.click();

            }catch(err){

                console.log(err)

                if(err.response.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No tienes los permisos suficientes para realizar esta acción."
                    })
                }

            }finally{
                file.loading = false
            }

        }

        const deleteFile = async() => {

            loading_delete.value = true

            try{

                await $axios.delete(`api/attached-files/delete/${route.value.params.uuid}/${props.issue.key}/${remove.value.file}`)
                getFIles()

            }
            catch(err){
                
                if(err.response.status === 403){
                    $notify.error({
                        title:"Error",
                        message:"No cuentas con los permisos necesarios para realizar esta acción."
                    })
                }

            }
            finally{
                loading_delete.value = false
                warn.value = false
            }

        }

        const uploadFiles = async() => {

            if(!newFilesForm.value.validate()) return

            let form = new FormData()

            for (let i = 0; i < newFiles.value.length; i++) {
                form.append(i, newFiles.value[i])
            }

            filesLoading.value = true

            try{
                await $axios.post(`/api/attached-files/store/${route.value.params.uuid}/${props.issue.key}`, form)
                getFIles()

            }catch(err){
                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar los archivos. Intente más tarde."
                })
            }
            finally{
                newFilesDialog.value= false
                filesLoading.value = false
            }
        }

        return {
            warn,
            files,
            remove,
            loading,
            headers,
            download,
            newFiles,
            min_files,
            deleteFile,
            uploadFiles,
            newFilesForm,
            filesLoading,
            newFilesDialog,
            loading_delete,
        }

    },
})
</script>
