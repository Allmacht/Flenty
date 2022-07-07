<template>
    <div>
        <v-list three-line>
            <v-list-item class="px-0">
                <v-list-item-avatar>
                    <v-img :src="`https://ui-avatars.com/api/?rounded=true&background=random&name=${$auth.user.name}`" max-width="45px"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                    <v-form ref="newCommentForm" v-on:submit.prevent="submit">
                        <v-textarea :disabled="loading" v-model="form.comment" :rules="[required]" rows="2" hide-details outlined label="Añadir comentario..." dense></v-textarea>

                        <v-list-item-subtitle class="mt-2">
                            <v-btn type="submit" :loading="loading" :color="$store.state.primary" dark small>Guardar</v-btn>
                            <v-btn text small :disabled="loading" @click="onCancel">cancelar</v-btn>
                        </v-list-item-subtitle>
                    </v-form>
                </v-list-item-content>
            </v-list-item>

            <v-list-item class="px-0" v-for="comment in comments" :key="comment.id">
                <v-list-item-avatar>
                     <v-img :src="`https://ui-avatars.com/api/?rounded=true&background=random&name=${comment.user.name}`" max-width="45px"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>

                    <v-list-item-subtitle>
                        <strong>
                            {{ comment.user.name }}
                        </strong>
                        <span class="ml-1">
                            {{ comment.created_at }}
                        </span>
                        <span class="ml-1" v-if="comment.edited">
                            Editado
                        </span>
                    </v-list-item-subtitle>

                    <template v-if="!comment.edit">

                        <v-list-item-title class="text-no-wrap">
                            <p style="white-space:pre-wrap !important" class="my-3" v-html="comment.comment"></p>
                        </v-list-item-title>

                        <v-list-item-subtitle>
                            <template v-if="comment.user.id === $auth.user.id">
                                <span class="mr-3 span-button" @click="handleEditComment(comment)">Editar</span>
                                <span class="mr-3 span-button" @click="() => { deleteItem = comment; warn = true }">Eliminar</span>
                            </template>

                            <span>
                                <v-icon size="15px">mdi-emoticon-happy-outline</v-icon>
                            </span>
                        </v-list-item-subtitle>

                    </template>

                    <template v-else>

                        <v-form v-on:submit.prevent="editComment($event, comment)">
                            <v-textarea name="comment" class="mt-5" :disabled="loading_edit" :value="comment.comment" :rules="[required]" rows="2" hide-details outlined label="Editar comentario..." dense></v-textarea>

                            <v-list-item-subtitle class="mt-2">
                                <v-btn type="submit" :loading="loading_edit" :color="$store.state.primary" dark small>Editar</v-btn>
                                <v-btn text small :disabled="loading_edit" @click="comment.edit = false">Cancelar</v-btn>
                            </v-list-item-subtitle>
                        </v-form>

                    </template>

                </v-list-item-content>
            </v-list-item>
        </v-list>

        <v-dialog v-model="warn" max-width="400" persistent>
            <v-card>
                <v-card-title>
                    <v-icon color="error" left>mdi-alert</v-icon>
                    ¿Eliminar comentario?
                </v-card-title>

                <v-card-text class="text-center py-4">
                    Una vez borrado, no puede recuperarse.
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text :disabled="loading_delete" @click="() => {deleteItem = null;  warn = false}">Cancelar</v-btn>
                    <v-btn color="error" :loading="loading_delete" @click="deleteComment">Eliminar</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
import { ref, defineComponent, onMounted, useContext, reactive } from '@nuxtjs/composition-api'

export default defineComponent({

    props:{
        projectKey:{
            required:true,
            type:String,
        },

        project: {
            required:true,
            type:String,
        },

        issue: {
            required:true,
            type:String,
        }
    },

    setup(props) {

        const { $axios, $notify, $auth } = useContext()
        
        let comments        = ref([])
        let loading         = ref(false)
        let loading_edit    = ref(false)
        let loading_delete  = ref(false)
        let warn            = ref(false)
        let newCommentForm  = ref(null)
        let deleteItem      = ref(null)
        let form            = reactive({
            "comment"  : "",
            "user_id"  : $auth.user.id,
        })

        onMounted(() => { getComments() })

        const required = value => { return !!value || 'El campo es requerido'  }

        const getComments = async () => {

            try{

                let response   = await $axios.get(`/api/comments/${props.projectKey}/${props.project}/${props.issue}`)
                comments.value = response.data.data

            }catch(err){

                console.error(err)

                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al obtener los mensajes, intente más tarde."
                })

            }
        } 

        const submit = async () => {

            if(!newCommentForm.value.validate()) return

            loading.value = true

            try {

                await $axios.post(`/api/comments/${props.projectKey}/${props.project}/${props.issue}`, form)
                newCommentForm.value.reset()
                getComments()
                
            } catch (error) {
                
                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error, intente más tarde."
                })
                
            } finally {

                loading.value = false

            }
        }

        const onCancel = () => {

            form.comment = ""
            newCommentForm.value.reset()
        }

        const handleEditComment = comment => {

            comments.value.map(comment => { comment.edit = false })

            comment.edit = true

        }

        const editComment = async (event, comment) => {

            if(event.srcElement.comment.value === "") return

            loading_edit.value = true

            try{

                await $axios.put(`/api/comments/update/${comment.id}`, { comment : event.srcElement.comment.value})
                getComments()

            }catch(err){

                $notify.error({
                    title:"Error",
                    message:"Error al procesar su solicitud, intente más tarde."
                })

            }finally{
                loading_edit.value = false
            }
            
        }

        const deleteComment = async () => {
            
            loading_delete.value = true
            
            try{
                await $axios.delete(`/api/comments/delete/${deleteItem.value.id}`);
                getComments()
            }
            catch(err){
                $notify.error({
                    title:"Error",
                    message:"Ha ocurrido un error al procesar su solicitud, intente más tarde."
                })
            }
            finally{
                warn.value = false
                loading_delete.value = false
            }

        }

        return {
            warn,
            form,
            submit,
            loading,
            required,
            onCancel,
            comments,
            deleteItem,
            editComment,
            loading_edit,
            deleteComment,
            loading_delete,
            newCommentForm,
            handleEditComment,
        }
    },
})
</script>
