export const state = () => ({
    primary:"#006a97",
    project_name:"",
})

export const getters = {
    getProjectName(state) {
        return state.project_name
    }
}

export const mutations =  {
    setProjectName(state, name) {
        state.project_name = name
    }
}

export const actions = {
    setProject(context, project){
        context.commit('setProjectName', project)
    }
}