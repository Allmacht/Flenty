<template>
    <v-container fill-height>
        <v-row justify="center" align="center">
            <v-col cols="12" xl="4" lg="5" md="6" sm="10"> 
                <h1 class="title-quicksand text-center" :style="{ 'color' : $store.state.primary }">Flenty</h1>
                <v-card :disabled="loading" flat>
                    <v-card-text class="px-0">
                        <p class="text-center">¿No tienes una cuenta? Registrate <NuxtLink to="/register">aquí</NuxtLink></p>

                        <v-form ref="loginForm">
                            <v-text-field
                                @keydown.space.prevent
                                v-model.trim="form.email"
                                filled
                                large
                                name="email"
                                append-icon="mdi-at"
                                label="Correo electrónico"
                                :color="$store.state.primary"
                                :rules="[required, validateEmail]"
                            ></v-text-field>
                            
                            <v-text-field
                                v-model="form.password"
                                filled
                                name="password"
                                label="Contraseña"
                                :rules="[required]"
                                @click:append="show = !show"
                                :color="$store.state.primary"
                                :type="show ? 'text' : 'password'"
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                            ></v-text-field>

                            <v-btn class="mb-5" :loading="loading" @click="submit" block x-large :color="$store.state.primary" dark>Iniciar sesión</v-btn>
                            <v-btn class="text-lowercase" :color="$store.state.primary" block text>¿Ha olvidado su contraseña?</v-btn>
                        </v-form>

                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
    import { ref, reactive, useContext, useRouter } from '@nuxtjs/composition-api'

    export default {

        auth:'guest',
        layout:'guest',
        middleware:'auth',
        
        head:{
            title:"Iniciar sesión"
        },

        setup(){

            const { $notify, $auth } = useContext()
            const router             = useRouter()

            let show      = ref(false)
            let loading   = ref(false)
            let loginForm = ref(null)
            let form      = reactive({ email: "", password: "" })


            const required = value => {
                return !!value || 'el campo es requerido'
            }
            
            const validateEmail = value => {
                return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) || 'El correo electrónico no es válido'
            }

            const submit = () => {
                if(!loginForm.value.validate()) return
                loading.value = true
                
                $auth.loginWith('laravelSanctum', { data: { email:form.email, password:form.password } })
                .then(() => {

                    router.push('/home')
                    
                })
                .catch(() => {

                    loading.value = false
                    
                    $notify.error({
                        title:"Error",
                        message:"Parte de su información no es correcta, inténtelo de nuevo."
                    })
                })
            }


            return { 
                show,
                form,
                required,
                validateEmail,
                loginForm,
                submit,
                loading 
            }
        }
    }
</script>


<style scoped>

    .title-quicksand{
        font-size: 65px;
    }

</style>