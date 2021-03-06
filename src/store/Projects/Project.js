// import Project from "./Project.js" dedicir se vai ser usado
/* eslint-disable */
import Vue from 'vue'
const SET_PROJECTS = 'SET_PROJECTS'
const SET_MYPROJECTS = 'SET_MYPROJECTS'
const UPDATE_CURRENT_PROJECT = 'UPDATE_CURRENT_PROJECT'
const UPDATE_CURRENT_PROJECT_FIELDS = 'UPDATE_CURRENT_PROJECT_FIELDS'

const state = {
    projects: [],
    MyProjects: [],
    currentProject: null,
    currentProjectFields: []
}

const getters = {
    getProjects: (state) => (searchArgument) => {
        return state.projects.filter(project => {
            return project.name.toLowerCase().includes(searchArgument.toLowerCase())
        })
    },
    getMyProjects: (state) => (searchArgument) =>{
        return state.MyProjects.filter(project => {
            return project.name.toLowerCase().includes(searchArgument.toLowerCase())
        })
    },
    getProjectById: (state) => (id) =>{
        return state.projects.find( project => project.id === id)
    },
    getProjectsLength: state =>{
        return state.projects.length
    },
    getCurrentProject: state=>{
        return state.currentProject
    },
    getCurrentProjectFields: state=>{
        return state.currentProjectFields.map(function(field){
            return { text: field.name, value: { value: field.id, type: field.base_type} }
        })
    },
    getCurrentProjectFieldsWithoutValue: state=>{
        return state.currentProjectFields.map(function (field) {
            return { text: field.name, value: [field.name] }
        })
    }
}

const mutations = {
    [SET_PROJECTS](state, payload){
        // Vue.set(state, projects, payload) - EVENTO PARA GERAR REATIVIDADE MAYBE
        state.projects = payload
    },
    [SET_MYPROJECTS](state, payload){
        // Vue.set(state, projects, payload) - EVENTO PARA GERAR REATIVIDADE MAYBE
        state.MyProjects = payload
    },
    [UPDATE_CURRENT_PROJECT](state, payload){
        state.currentProject = payload
    },
    [UPDATE_CURRENT_PROJECT_FIELDS](state, payload){
        state.currentProjectFields = payload
    }
}

const actions = {
    loadProjects ({commit}){
        return new Promise((resolve, reject)=>{
            Vue.http.get("projects/", { headers: { "content-type": "application/json" } }).then(response => {
                commit(SET_PROJECTS, response.data)
                resolve()
            },
            error => {
                reject()
            })
        })
    },
    loadMyProjects ({commit}){
        return new Promise((resolve, reject)=>{
            Vue.http.get("projects/user/", { headers: { "Authorization": "JWT " + localStorage.token, "content-type": "application/json"}}).then(response => {
                commit(SET_MYPROJECTS, response.data)
                resolve()
            },
            error => {
                reject()
            })
        })
    },
    loadCurrentProject({commit}, projectId){
        return new Promise((resolve, reject)=>{
            Vue.http.get("projects/" + projectId + "/", { headers: { "Authorization": "JWT " + localStorage.token,"content-type": "application/json"}}).then(response=>{
                resolve(response.data)
            },
            err =>{
                reject(err.status)
            })
        })
    },
    loadCurrentProjectFields({commit}, dashboardId){
        return new Promise((resolve, reject)=>{
            Vue.http.get("metabase/" + dashboardId + "/fields", { headers: { "Authorization": "JWT " + localStorage.token, "content-type": "application/json"}}).then(response=>{
                commit(UPDATE_CURRENT_PROJECT_FIELDS, response.data.fields)
                resolve()
            },
            error=>{
                reject()
            })
        })
    },
    editProject({commit}, project){
        return new Promise((resolve, reject)=>{
            Vue.http.put("projects/" + project.id + "/", project, {
                headers: {
                    "Authorization": "JWT " + localStorage.token,
                    "content-type": "application/json",
                }
            }
            ).then(result => {
                resolve("Projeto editado com sucesso")
            },
            error => {
                reject(error.data)
            })

        })
    },
    createProject({ commit }, project) {
        return new Promise((resolve, reject) => {
            Vue.http.post("projects/", project, {
                headers: {
                    "Authorization": "JWT " + localStorage.token,
                    "content-type": "application/json",
                }
            }
            ).then(result => {
                resolve("Projeto criado com sucesso")
            },
            error => {
                reject(error.data)
            })
        })
    },
    getProjectOwner({commit}, userId){
        return new Promise((resolve, reject) => {
            Vue.http.get("users/" + userId + "/", {
                headers: {
                    "Authorization": "JWT " + localStorage.token,
                    "content-type": "application/json",
                }
            }
            ).then(response => {
                resolve(response.data.username)
            },err => {
                reject(err.data)
            })
        })
    }
}

export default {
    name: 'projects',
    state,
    mutations,
    getters,
    actions
}

