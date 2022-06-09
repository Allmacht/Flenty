<template>
    <v-container fill-height>
        <v-row justify="center" align="center">
            <v-col cols="12" xl="4" lg="5" md="6" sm="10"> 
                <h1 class="title-quicksand text-center" :style="{ 'color' : $store.state.primary }">Flenty</h1>
                <v-card flat>
                    <v-card-text class="px-0">
                        <p class="text-center">¿No tienes una cuenta? Registrate <NuxtLink to="/register">aquí</NuxtLink></p>

                        <v-form>
                            <v-text-field
                                filled
                                large
                                name="email"
                                append-icon="mdi-at"
                                label="Correo electrónico"
                                :color="$store.state.primary"
                            ></v-text-field>
                            
                            <v-text-field 
                                filled
                                name="password"
                                label="Contraseña"
                                :color="$store.state.primary"
                                :type="show ? 'text' : 'password'"
                                :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="show = !show"
                            ></v-text-field>

                            <v-btn class="mb-5" block x-large :color="$store.state.primary" dark>Iniciar sesión</v-btn>
                            <v-btn class="text-lowercase" :color="$store.state.primary" block text>¿Ha olvidado su contraseña?</v-btn>
                        </v-form>

                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    layout:'guest',
    head:{
        title:"Iniciar sesión"
    },
    
    data: () => ({
        show:false,
        form:{
            email:"",
            password:"",
        }
    })
}
</script>

<style scoped>

    .title-quicksand{
        font-size: 65px;
    }

</style>