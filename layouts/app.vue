<template>
	<v-app>

		<v-navigation-drawer v-model="navigation" clipped color="#fafbfc" app>
			<v-list nav>
				<v-list-item-group :color="$store.state.primary">
					<template v-for="menu in menus">
						<v-list-item :key="menu.title" :to="menu.url" v-if="menu.policy.some(rol => $auth.user.role_names.includes(rol))">
							<v-list-item-icon>
								<v-icon v-text="menu.icon" :color="$store.state.primary"></v-icon>
							</v-list-item-icon>
							<v-list-item-content>
								<v-list-item-title v-text="menu.title"></v-list-item-title>
							</v-list-item-content>
						</v-list-item>
					</template>
				</v-list-item-group>
			</v-list>
    	</v-navigation-drawer>

		<v-app-bar outlined elevation="1" clipped-left color="white" app>

			<v-app-bar-nav-icon @click="navigation = !navigation"></v-app-bar-nav-icon>
      		<v-toolbar-title class="title-quicksand mr-10" :style="{ 'color' : $store.state.primary }">Flenty</v-toolbar-title>

			<projects-menu></projects-menu>

			<v-spacer></v-spacer>

			<v-menu offset-y>
				<template v-slot:activator="{ attrs, on }">
					<v-img style="cursor:pointer" v-bind="attrs" v-on="on" :src="'https://ui-avatars.com/api/?rounded=true&background=random&name='+$auth.user.name" max-width="40"></v-img>
				</template>

				<v-list>
					<v-list-item>
						<v-list-item-avatar>
							<v-img :src="'https://ui-avatars.com/api/?rounded=true&background=random&name='+$auth.user.name" max-width="40"></v-img>
						</v-list-item-avatar>
						<v-list-item-content>
							<v-list-item-title>{{ name[0]+" "+name[1] }} </v-list-item-title>
							<v-list-item-subtitle v-text="$auth.user.email"></v-list-item-subtitle>
						</v-list-item-content>
					</v-list-item>

					<v-divider></v-divider>

					<v-list-item>
						<v-list-item-title>Perfil</v-list-item-title>
					</v-list-item>
					<v-list-item>
						<v-list-item-title>Configuración personal</v-list-item-title>
					</v-list-item>

					<v-divider></v-divider>

					<v-list-item @click="logoutDialog = true">
						<v-list-item-title>Cerrar sesión</v-list-item-title>
					</v-list-item>

				</v-list>
			</v-menu>
		</v-app-bar>

		<v-main>
			<Nuxt />
    	</v-main>

		<v-dialog v-model="logoutDialog" max-width="400" persistent>
            <v-card>
                <v-card-title>Cerrar sesión</v-card-title>
                <v-card-text class="text-center">
                    ¿Realmente desea cerrar sesión?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="logoutDialog = false" text>cancelar</v-btn>
                    <v-btn :color="$store.state.primary" @click="logout" dark>Salir</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

  	</v-app>
</template>


<script>

	import { reactive, ref, useContext, useRouter, computed } from '@nuxtjs/composition-api'

	export default {

		setup(){

			const { $auth } = useContext()
			const router    = useRouter()

			let navigation   = ref(true)
			let logoutDialog = ref(false)
			let name		 = computed(() => { return $auth.user.name.split(' ') })
			let menus 	     = reactive(
				[
					{ title:"Inicio",    url:"/home",      icon:"mdi-home-outline", 		   policy:['super-admin', 'Administrator', 'Project-administrator', 'Agent', 'Customers', 'Collaborator'] },
					{ title:"Empresas",  url:"/companies", icon:"mdi-domain", 				   policy:['super-admin', 'Administrator'] },
					{ title:"Clientes",  url:"/clients",   icon:"mdi-account-star-outline",    policy:['super-admin', 'Administrator'] },
					{ title:"Proyectos", url:"/projects",  icon:"mdi-account-network-outline", policy:['super-admin', 'Administrator'] },
					{ title:"Usuarios",  url:"/users",     icon:"mdi-account-outline",         policy:['super-admin', 'Administrator'] },
				]
			)

			const logout = async () => {
				await $auth.logout()
				router.push('/login')
			}

			return {
				name,
				menus,
				logout,
				navigation,
				logoutDialog
			}
		}	

	}
</script>

<style scoped>
	.v-toolbar__title{
		font-weight: 700 !important;
		font-size: 27px;
	}
</style>